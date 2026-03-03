'use client';
import { deleteAllMessages } from '@/actions/chart';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';

const PopUpCom = ({ showPopUp, setShowPopUp, chatId }: { showPopUp: boolean, setShowPopUp: Dispatch<SetStateAction<boolean>>, chatId: string }) => {
  const router = useRouter();
  const deleteCharts = async () => {
    const res = await deleteAllMessages(chatId)
    if (res.res) {
      toast.success("deleted all messages")
      router.refresh()
    }
    else {
      toast.error("Something went wrong")
    }
  }
  return (
    <div key="details-panel"
      // initial={{ scale: 0, y: -500, x: 500, opacity: 0 }} animate={{ scale: 1, y: 0, x: 0, opacity: 1 }} exit={{ y: 500, opacity: 0 }}
      // transition={{ type: "spring", stiffness: 100, damping: 15 }}

      className=' absolute top-0 left-0 w-full h-full flex items-center justify-center bg-[#6c6c6c40] backdrop-blur-[10px] z-50'>

      <div className='bg- bg-[#ffffffa8] glass text-white backdrop-blur-[10px] p-6 rounded-lg shadow-lg max-md:w[80%] mx-auto max-w-sm w-full'>
        <h2 className='text-xl font-semibold mb-4'>Delete all Message</h2>
        <p className='text-gray-100 mb-1'>Are you want to delete all the messages ?</p>
        <p className='text-gray-100 mb-4'>Also it delete for everyone ?</p>

        <div className=' flex w-full justify-between rounded-full overflow-hiddden  items-center'>
          <button onClick={() => setShowPopUp(!showPopUp)} className='buttonbg2 text-white px-4 py-2 w-1/2 rounded-l-full hover:bg-gray-600'>Close</button>
          <button onClick={() => deleteCharts()} className='bg-blue-500 text-white px-4 py-2 w-1/2 !rounded-r-full buttonred'>Delete</button>
        </div>

      </div>

    </div>
  )
}

export default PopUpCom