'use client';
import LoadingCom from '@/components/ui/loading';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { Loader, Minus, X } from 'lucide-react';
import { resizeFile } from '@/lib/helper/imageCompress';
import KitImage from '@/components/ui/KitImage';
import { toastError, toastSuccess } from '@/lib/toast';
import { deletePhotos, savePhotoUrlsToDB } from '@/actions/user.action';

const PhotoUploadCom = ({ data, isLoading }: { data: { showsCasePhotos: string[] }[], isLoading: boolean }) => {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string[]>([]);

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await savePhotoUrlsToDB(formData);
    },
    onSuccess: () => {
      setFiles([]);
      setPreviews([]);
      queryClient.invalidateQueries({ queryKey: ['fetchUserProfile'] });
    },

    onError: (error) => {
    },
  });

  const isUploading = uploadMutation?.isPending;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const limit = 3 - (data?.length || 0);
    if (limit <= 0) {
      toastError('Maximum 3 images allowed');
      return;
    }
    const newFiles = selectedFiles.slice(0, limit);
    const resizedFiles = await Promise.all(
      newFiles.map((file) => resizeFile(file))
    );


    setFiles((prev) => [...prev, ...resizedFiles]);
    setPreviews((prev) => [
      ...prev,
      ...resizedFiles.map((file) => URL.createObjectURL(file)),
    ]);
  };
  const handleRemovePreview = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };


  const handleUpload = () => {
    const formData = new FormData();
    files.forEach(file => formData.append('photos', file));
    uploadMutation.mutate(formData);
  };


  const existingImages = data?.showsCasePhotos || [];
  const totalImagesCount = existingImages?.length + previews?.length;
  const len = Math.max(0, 3 - totalImagesCount);


  const deletPhotoMutation = useMutation({
    mutationFn: async (id: string[]) => {
      return await deletePhotos(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fetchUserProfile'] });
    },

    onError: (error) => {
    },
  });
  const handelDelete = async () => {
    if (deleteId.length === 0) {
      toastError('Please select photos to delete');
      return;
    }
    deletPhotoMutation.mutate(deleteId);
    setDeleteId([]);
    toastSuccess('deleted successfuly')
    router.refresh()
  }
  const handelChangeDelete = (id: string) => {
    setDeleteId(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  return (
    <div className='w-full px-5 pb-20 max-md:px-0   '>
      <h1 className='my-9 ml-4'>
        {!existingImages && !isLoading && <div className='max-md:text-xs border border-yellow-500 center rounded-2xl p-3 bg-yellow-500/20 text-yellow-300 mt-3'> Add atleast 1 photo !! To visible user ⚠️</div>}
      </h1>

      <div className="w-full flex max-sm:gap-2.5 flex-wrap   px-5 gap-3 max-md:px-0 mt-4">

        {!isLoading ? <>
          {existingImages && existingImages?.map((u: string, idx: number) => {
            return (
              <div key={`existing-${idx}`} onClick={() => handelChangeDelete(u)} className='relative max-md:w-[47%] max-md:h-[230px]  w-[200px] h-[300px] rounded-2xl border border-black/20'>
                {deleteId.includes(u) ? <div className=' absolute -top-2 -right-2 buttongreen rounded-full text-lg !p-1 !py-1  '> <Minus /> </div>
                  : <div className=' absolute -top-2 -right-2 buttonred rounded-full !p-1 !py-1  '><X /></div>}
                <KitImage src={u} alt="Uploaded" height={1000} width={1000} className="  w-full h-full rounded-2xl  object-cover" />
              </div>
            )
          })}
          {previews && previews?.map((src, idx) => (
            <div key={idx} className=' relative  max-md:w-[47%] max-md:h-[230px]  w-[200px] h-[300px] rounded-2xl border border-black/20'>
              {isUploading && <div className=' absolute top-[40%] left-[20%] border border-white/20 text-white text-xs bg-[#ffffff2e] backdrop-blur-sm rounded-full px-3 py-1 z-10'>
                Processing...
              </div>}
              <div onClick={() => handleRemovePreview(idx)} className=' absolute -top-2 -right-2 border-2 border-red-500/50 text-red-500 backdrop-blur-[10px] rounded-full !p-1 !py-1  '><X /></div>
              <Image height={1800} width={1500} key={`preview-${idx}`} src={src} alt="Preview" className=" h-full w-full rounded-2xl  object-cover" />
            </div>
          ))}

          {[...Array(len)].map((_, i) => (
            <div key={i} className=' max-md:w-[47%] max-md:h-[230px]  w-[200px] h-[300px] flex items-center justify-center bg-[#ffffff21] rounded-2xl border-dashed border border-black/20'>
              <button className='buttonbg h-10 w-10 flex text-2xl rounded-full items-center justify-center' onClick={() => fileInputRef.current?.click()}>+</button>
            </div>
          ))}
        </> :
          <LoadingCom boxes={3} child=" max-md:w-[47%] max-md:h-[230px] !rounded-2xl w-[200px] h-[300px] " parent=" !items-start !justify-start  py-0 max-md:px-0 !gap-3 w-full flex-wrap  flex-row " />
        }
      </div>

      <input
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <button
        hidden={previews.length === 0}
        onClick={handleUpload}
        disabled={isUploading || files.length === 0}
        className="my-10 px-3 py-3 rounded-full w-[300px]  center disabled:opacity-[0.6] disabled:cursor-not-allowed  mx-auto block buttonbg text-white"
      >
        {isUploading ? <Loader className='text-xl animate-spin ' /> : 'Upload'}

      </button>

      <button
        onClick={() => handelDelete()}
        hidden={deleteId.length === 0}
        disabled={deletPhotoMutation.isPending || deleteId.length === 0}
        className="my-10 px-3 py-3 rounded-full w-[300px]   mx-auto block buttonred text-white"
      >
        {deletPhotoMutation.isPending ? <Loader className='text-xl animate-spin ml-2' /> : ' Delete Selected Photos'}
      </button>
    </div>
  );
};

export default PhotoUploadCom;
