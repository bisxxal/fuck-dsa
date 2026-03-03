import { createAssignment } from '@/actions/assignment.action'
import { toastSuccess } from '@/lib/toast'
import { useMutation } from '@tanstack/react-query'
import { Loader, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { Dispatch, SetStateAction } from 'react'

const CreateTask = ({buyerId , setShowAssignPopup}:{buyerId:string , setShowAssignPopup:Dispatch<SetStateAction<boolean>>}) => {
    const router = useRouter()
    const createMutation = useMutation({
        mutationFn: async (data:FormData) => {
            return await createAssignment(data)
        },
        onSuccess: (data) => {
            if(data?.status ===200){
                toastSuccess("created ")
                setShowAssignPopup(false)
                router.push('/task')
            }
        },
        onError: (error) => {

        }
    })

    const handleSubmit = (formData:FormData) => {
        formData.append('buyerId', buyerId)

        if(buyerId){
            createMutation.mutate(formData)
        }

    }
    return (
        <div className='assignpopupOpen absolute w-full left-0 bottom-0 z-20  backdrop-blur-[10px] bg-white/20 mt-10 bordercolor p-4 rounded-xl'>
            <p  onClick={ ()=>setShowAssignPopup(false)}className=' absolute top-2 right-2 '> <X /> </p>
            <form className=' flex flex-col gap-2' action={handleSubmit}>
                <label htmlFor="">Amount</label>
                <input className='py-2 rounded-xl px-2  border color ' type="number" name="amount" required id="" />
                <label htmlFor="">Expected date</label>
                <input className='py-2 rounded-xl px-2 border color' type="datetime-local" name="expectedDate" required id="" />
                <button className='center buttonbg mt-5 py-2 rounded-xl' type='submit'>{ createMutation.isPending ? <Loader className=' animate-spin ' /> : 'Sumbit'}</button>
            </form>
        </div>
    )
}

export default CreateTask