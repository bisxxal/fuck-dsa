'use client'
import { createChatParticipant } from '@/actions/chat.action';
import Back from '@/components/ui/back';
import KitImage from '@/components/ui/KitImage';
import Loading from '@/components/ui/loading';
import { useSingleWriterHook } from '@/hooks/useSIngleWriter';
import { useMutation } from '@tanstack/react-query';
import { Loader, Star } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'

const WritterPersonalPage = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id || '';
  const router = useRouter()
  const type = 'W'
  const { data, isLoading } = useSingleWriterHook({ id, type })
  
  const [showModal, setShowModal] = useState(false);
  const createChatMutation = useMutation({

    mutationFn: async (receiverId: string) => {
      return await createChatParticipant(receiverId);
    },
    onSuccess: (data) => {
      router.push(`/chat/${data?.chatId}`);
    },
    onError: (error) => {
      console.error('Error creating chat:', error);
    },
  })

  const total = data?.writters?.ratingsReceived?.reduce((acc: { stars: number }, curr: { stars: number }) => Number(acc) + Number(curr.stars), 0) || 0;
  const average = data?.writters?.ratingsReceived?.length ? (total / data?.writters.ratingsReceived.length) : 0;


  // console.log(show)
  return (
    <div className='relative w-full min-h-screen px-10 max-md:px-5'>
      <Back className='mt-5 !ml-0' />
      <div className=' flex gap-5 items-center mt-10'>
        {!isLoading ? <Image width={50} height={50} src={data?.writters?.image || '/user.jpg'} className='rounded-full object-cover   h-[70px] w-[70px]   ' alt="" /> :
          <Loading boxes={1} parent=' w-[70px] h-[70px]  !items-start' child='  w-[70px] h-[70px] rounded-full' />
        }

        <div>
          <p className='capitalize text-xl font-bold'>{data?.writters?.name}</p>
          <p className=' text-xs'>{data?.writters?.collegeName}</p>
        </div>
      </div>

      {!isLoading ? <div className='px-2 my-1 flex flex-col justify-center  items-end'>
        <p className=' textbase text-4xl max-md:text-3xl font-bold'>  {Number(Number(average).toFixed(1)) !== 0 && average.toFixed(1)}</p>
        <p className=' flex gap-0.5'>
          {Number(Number(average).toFixed(1)) !== 0 ? Array.from({ length: 5 }).map((_, index) => {
            const roundedRating = average - index;
            if (roundedRating >= 1) return <span key={index}> <Star color='#facc15' fill='#facc15' /> </span>;
            if (roundedRating >= 0.5) return <span key={index}><Star /></span>;
            return <span key={index}><Star /></span>;
          }) : <span className=' text-gray-500 pl-2'>No ratings yet</span>}
        </p>

      </div> :
        <Loading boxes={1} parent='border w-full  mt-2' child=' w-full h-[55px] rounded-lg' />
      }


      <div>
        <label className=' mt-5 block font-semibold text-xl'>Description</label>
        {!isLoading ? <p className=' text-sm'>{data?.writters?.description}</p> :
          <Loading boxes={1} parent='border w-full !flex-row  ' child=' w-full h-[40px] rounded-lg' />}


        <label className=' mt-5 block font-semibold text-xl'>Showcase</label>

        <div className=' flex gap-3 overflow-x-auto py-3'>
          {data?.writters?.showsCasePhotos && data?.writters?.showsCasePhotos?.map((item: string, index: number) => (
            <KitImage onClick={() => {setShowModal(true); console.log('clicked' , showModal)} } loading='lazy' className=' cursor-pointer  w-[120px] h-[120px] object-cover rounded-lg ' src={item} alt='' width={100} height={100}
            />
          ))}
          {isLoading && <Loading boxes={3} parent='border !flex-row  !justify-start' child=' w-[120px] h-[120px] rounded-lg' />}
        </div>

        <label className=' mt-5 block font-semibold text-xl'>Prices</label>

        <div className=' card p-4 mt-4 rounded-xl'>
          <div className='  w-full between'>Fixed minimum rate per page <div className=' gap-2 center '>
            <span className=' w-[32px] rounded-2xl px-1 card center gap-2'>₹{data?.writters?.pagePrice}</span>
          </div>
          </div>
          <div className='mt-4 w-full between border-t pt-2 border-[#ffffff2c] '>Fixed minimum rate per digram <div className=' gap-2 center '>
            <span className=' w-[32px] rounded-2xl px-1 card center gap-2'>₹{data?.writters?.digramsPrice}</span>
          </div>
          </div>

        </div>

        <div className=' w-full center my-5'>
          <button onClick={() => createChatMutation.mutate(data?.writters?.id)} className='center buttonbg w-full rounded-2xl mt-5 py-2'>{createChatMutation.isPending ? <Loader className=' animate-spin ' /> : 'Message Writter'}</button>
        </div>

      </div>

      <ImageModal images={ data?.writters?.showsCasePhotos} isOpen={showModal} onClose={() => setShowModal(false)} />

    </div>
  )
}

export default WritterPersonalPage


const ImageModal = ({ images, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen || !images || images.length === 0) return null;

  const goPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className='fixed top-0 left-0 w-full h-full bg-black/10 backdrop-blur-[20px] z-50 flex justify-center items-center p-5'>
      <button onClick={onClose} className='absolute top-5 right-5 text-white text-3xl'>&times;</button>

      <button
        onClick={goPrev}
        className='absolute left-5 text-white text-4xl  cursor-pointer  font-bold z-50 px-3 py-2 '
      >
        &#8249;
      </button>

      <div className='relative max-w-full max-h-full rounded-lg overflow-hidden'>
        <KitImage
          loading='lazy'
          alt={`Image ${currentIndex + 1}`}
          width={800}
          height={600}
          src={images[currentIndex]}
          className='w-full h-auto object-contain'
        />
      </div>

      <button
        onClick={goNext}
        className='absolute right-5 text-white text-4xl  cursor-pointer  font-bold z-50 px-3 py-2'
      >
        &#8250;
      </button>
    </div>
  );
}; 