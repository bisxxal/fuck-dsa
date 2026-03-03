'use client'
import { createWritterProfile } from '@/actions/user.action'
import { toastError, toastSuccess } from '@/lib/toast'
import { useMutation } from '@tanstack/react-query'
import React from 'react'
import PhotoUploadCom from '../_components/photoUploadCom'
import { useProfileInfoHook } from '@/hooks/useProfileinfo'
import { Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useSingleWriterHook } from '@/hooks/useSIngleWriter'

const EditPage = () => {
    const router = useRouter(); 
    const id = ''
     const type = 'E'
      const { data, isLoading } = useSingleWriterHook({id, type })

    const handleSubmit = (formData: FormData) => {
        try { 
            const pagePrice = formData.get('page') as string;
            const digramsPrice = formData.get('digram') as string;
            if ( !pagePrice || !digramsPrice) {
                toastError('Please fill all the fields');
                return;
            }
            createSellerProfile.mutate(formData);
        } catch (error) {

        }
    }

    const createSellerProfile = useMutation({
        mutationFn: async (formData: FormData) => {
            return await createWritterProfile('writer', formData);
        },
        onSuccess: (data) => {
            if (data.status === 200) {
                toastSuccess('Profile Updated');
                router.push("/dashboard")
            } else {
                toastError(data.message);
            }
        },
        onError: (error) => {
        }
    })

    return (
        <div className=' w-full px-10 max-md:px-4 pb-20'>

            <h1 className=' text-2xl font-bold text-center mb-3'>{data?.writters?.isSellerModeActive === false ? 'Active Writer Profile' : 'Update Profile'}</h1>

            <form action={handleSubmit}>
                <label className=' mt-5 block max-md:text-lg font-medium text-xl'>Description</label>
                <input defaultValue={data?.writters?.description as string} name='description' className='w-full bordercolor mt-2 p-2 rounded-lg' type="text" />
                <label className=' mt-5 block max-md:text-lg font-medium text-xl'>Showcase</label>

                <PhotoUploadCom data={data?.writters} isLoading={isLoading} />

                <label className=' mt-5 block max-md:text-lg font-medium text-xl'>Prices</label>

                <div className='mt-4 w-full between'>Fixed minimum rate per page <div className=' gap-2 center '>
                    <input type="number" defaultValue={data?.writters?.pagePrice as number} required className=' w-[60px] rounded-2xl pl-3 bordercolor center gap-2' name='page' placeholder='5' /> </div>
                </div>

                <div className='mt-4 w-full between'>Fixed minimum rate per diagram  <div className=' gap-2 center '>
                    <input type='number' defaultValue={data?.writters?.digramsPrice as number} required className='w-[60px] rounded-2xl pl-3 bordercolor center gap-2' name='digram' placeholder='5' /> </div>
                </div>

                <div className=' w-full center'>
                    <button type='submit' className='w-full buttonbg mx-auto center rounded-full px-10 mt-5 py-3'>
                        {createSellerProfile.isPending ?  <Loader className='text-xl animate-spin ' /> :  data?.writters?.isSellerModeActive === false ? 'Active Profile' : 'Update Profile' }
                    </button>
                </div>

            </form>


        </div>
    )
}

export default EditPage