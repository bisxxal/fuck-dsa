'use client'
import { getAssignments, rateAssignment, updateAssignmentStatus } from '@/actions/assignment.action';
import Loading from '@/components/ui/loading';
import { useProfileInfoHook } from '@/hooks/useProfileinfo';
import { toastSuccess } from '@/lib/toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import React, { useState } from 'react'

interface TaskPageProps {
  buyer: { name: string, image: string, id: string },
  createdAt: string,
  expectedDate: string,
  id: string,
  price: number,
  status: string,
  rating: {
    stars: number
  }
  writer: { name: string, image: string, id: string }
}
const TaskPage = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed'>('all');
  const { data: user } = useProfileInfoHook()
  const { data, isLoading } = useQuery({
    queryKey: ['assignments'],
    queryFn: async () => {
      return await getAssignments()

    }
  })

  return (
    <div className=' w-full px-10 max-md:px-4 pb-20 mt-2'>

      <p className='my-3 mt-10 mt-4 pl-10 max-md:pl-2 textbase text-2xl font-semibold'>My orders</p>


      <div className=' between '>
        <div onClick={() => setActiveTab('all')} className={`${activeTab === 'all' ? ' border-[#a860e3]  textbase font-medium ' : " text-gray-400 border-gray-400 transition-all "} cursor-pointer  border-b-2 p-2 px-5  `}>All</div>
        <div onClick={() => setActiveTab('pending')} className={`${activeTab === 'pending' ? ' border-[#a860e3]  textbase font-medium' : " text-gray-400 border-gray-400 transition-all "} cursor-pointer  border-b-2 p-2 px-5  `}>Pending</div>
        <div onClick={() => setActiveTab('completed')} className={`${activeTab === 'completed' ? ' border-[#a860e3]  textbase font-medium' : " text-gray-400 border-gray-400 transition-all "} cursor-pointer  border-b-2 p-2 px-5  `}>Completed</div>
      </div>
      {
        activeTab === 'all' ? <AllTask data={data?.data} user={user?.user} /> : activeTab === 'pending' ? <PendingTask data={data?.data} user={user?.user} /> : <CompletedTask data={data?.data} user={user?.user} />
      }
      {
        isLoading && <Loading boxes={3} child='w-full h-full rounded-2xl' parent=' h-[650px] ' />
      }
      {data?.data?.length === 0 && <p className=' text-center text-sm mt-20 opacity-[0.5] '>No Order found</p>}
    </div>
  )
}

export default TaskPage

const AllTask = ({ data, user }: { data: TaskPageProps[], user: { id: string } }) => {

  const queryClient = useQueryClient();
  const [showPopUp, setShowPopUp] = useState<null | string>(null)

  const updateStatus = useMutation({
    mutationFn: async (assignmentId: string) => {
      return await updateAssignmentStatus(assignmentId, 'COMPLETED')
    },
    onSuccess: (data) => {
      if (data.status === 200) {
        toastSuccess('Assignment marked as completed');
        setShowPopUp(null)
        queryClient.invalidateQueries({ queryKey: ['assignments'] })
      }
      else {
        toastSuccess('Something went wrong');
        setShowPopUp(null)
      }
    }
  })

  const sumbitRattings = useMutation({
    mutationFn: async ({ assignmentId, ratings, buyerId, writerId }: { assignmentId: string, ratings: number, buyerId: string, writerId: string }) => {
      return await rateAssignment(assignmentId, ratings, buyerId, writerId)
    },
    onSuccess: (data) => {
      if (data.status === 200) {
        toastSuccess('Thank you for giving Rating!');
        queryClient.invalidateQueries({ queryKey: ['assignments'] })
      }
      else {
        toastSuccess('Something went wrong');
      }
    }
  })
  return (
    <div className=' mt-10 flex flex-col gap-2 '>

      {showPopUp && <div className=' w-full h-full fixed bg-black/30 backdrop-blur-[50px] px-6 top-0 left-0 z-50 flex justify-center items-center '>
        <div className=' bordercolor p-5 rounded-lg '>
          <h1 className=' text-lg font-semibold '>Are you sure you want to mark this assignment as completed?</h1>
          <p className=' text-[10px]  text-gray-300'>Make sure you can't reverse the process. </p>
          <div className=' flex gap-3 justify-end mt-5 '>
            <button onClick={() => setShowPopUp(null)} className=' px-3 py-1 rounded-lg bg-gray-500 '>Cancel</button>
            <button onClick={() => updateStatus.mutate(showPopUp)} className=' px-3 py-1 rounded-lg bg-blue-500 text-white '>Confirm</button>
          </div>
        </div>
      </div>
      }

      {
        data && data.map((i, idx) => {
          return (
            <div key={idx} className=' justify-between items-center pr-5 min-h-[150px] py-2 card bordercolor w-full flex  rounded-2xl px-3'>

              <div>
                <div className='p-2 flex gap-2  '>
                  <Image src={i.buyer.id === user?.id ? `${i?.writer?.image}` : `${i?.buyer?.image}`} className='rounded-full w-16' height={90} width={90} alt="" />
                  <div className='   ml-3'>
                    <p className=' mt-2 font-semibold '>{i.buyer.id === user?.id ? `${i?.writer?.name}` : `${i?.buyer?.name}`}</p>
                  </div>
                </div>

                <div>
                  <p>Order on: {moment(i?.createdAt).format('DD-MM-YYYY')}</p>
                  <p>{i.status.toLowerCase() === 'pending' ? 'expected' : 'Completed on'}: {moment(i?.expectedDate).format('DD-MM-YYYY')}  </p>
                  <p className={`${i.status.toLowerCase() === 'pending' ? 'border-yellow-600 bg-yellow-500/50  text-yellow-200 ' : 'text-green-200 bg-green-500/60 border-green-600 '} border rounded-full w-fit px-3 py- text-sm mt-1`}>{i.status}</p>
                </div>

                {i.status.toLowerCase() === 'completed' && <div className=' flex gap-1 mt-2'>
                  {[...Array(5)].map((_, idx) => {
                    const currentRating = i.rating?.stars || 0;
                    const isFilled = idx < currentRating;
                    return (
                      <button
                        key={idx}
                        hidden={i.writer.id === user?.id && !i.rating}
                        disabled={i.writer.id === user?.id || i.rating?.stars > 0}
                        onClick={() => sumbitRattings.mutate({
                          assignmentId: i.id,
                          ratings: idx + 1,
                          buyerId: i.buyer.id,
                          writerId: i.writer.id,
                        })}
                      >
                        <Star
                          fill={isFilled ? ' #facc15 ' : ''}
                          className={`${isFilled ? 'text-yellow-400' : 'text-gray-400'} cursor-pointer w-5 h-5`}
                        />
                      </button>
                    );
                  })}
                </div>}

              </div>

              <div className=' flex flex-col gap-3 items-end '>
                <p className=' text-3xl max-md:text-2xl h-fit font-bold'>
                  ₹{i.price}
                </p>
                {i.writer.id === user?.id && i.status.toLowerCase() !== 'completed' &&
                  <button onClick={() => setShowPopUp(i?.id)} className='px-3 py-1  cursor-pointer bg-green-500 rounded-xl whitespace-nowrap'>Mark as Completed</button>}
              </div>
            </div>
          )
        })
      }
    </div>
  )
}
const PendingTask = ({ data, user }: { data: TaskPageProps[], user: { id: string } }) => {

  const queryClient = useQueryClient();
  const [showPopUp, setShowPopUp] = useState<null | string>(null)

  const updateStatus = useMutation({
    mutationFn: async (assignmentId: string) => {
      return await updateAssignmentStatus(assignmentId, 'COMPLETED')
    },
    onSuccess: (data) => {
      if (data.status === 200) {
        toastSuccess('Assignment marked as completed')
      }
      else {
        toastSuccess('Something went wrong')
      }
    }
  })

  return (
    <div className=' mt-10 flex flex-col gap-2 '>
      {showPopUp && <div className=' w-full h-full fixed bg-black/30 backdrop-blur-[50px] px-6 top-0 left-0 z-50 flex justify-center items-center '>
        <div className=' bordercolor p-5 rounded-lg '>
          <h1 className=' text-lg font-semibold '>Are you sure you want to mark this assignment as completed?</h1>
          <p className=' text-[10px]  text-gray-300'>Make sure you can't reverse the process. </p>
          <div className=' flex gap-3 justify-end mt-5 '>
            <button onClick={() => setShowPopUp(null)} className=' px-3 py-1 rounded-lg bg-gray-500 '>Cancel</button>
            <button onClick={() => updateStatus.mutate(showPopUp)} className=' px-3 py-1 rounded-lg bg-blue-500 text-white '>Confirm</button>
          </div>
        </div>
      </div>
      }
      {
        data && data.map((i, idx) => {
          if (i.status.toLowerCase() !== 'pending') return null;
          return (
            <div key={idx} className=' justify-between items-center pr-5 min-h-[150px] py-2 card bordercolor w-full flex  rounded-2xl px-3'>
              <div>
                <div className='p-2 flex gap-2  '>
                  <Image src={i.buyer.id === user?.id ? `${i?.writer?.image}` : `${i?.buyer?.image}`} className='rounded-full w-16' height={90} width={90} alt="" />
                  <div className='   ml-3'>
                    <p className=' mt-2 font-semibold '>{i.buyer.id === user?.id ? `${i?.writer?.name}` : `${i?.buyer?.name}`}</p>
                  </div>
                </div>

                <div>
                  <p>Order on: {moment(i?.createdAt).format('DD-MM-YYYY')}</p>
                  <p>{i.status.toLowerCase() === 'pending' ? 'expected' : 'Completed on'}: {moment(i?.expectedDate).format('DD-MM-YYYY')}  </p>
                  <p className={`${i.status.toLowerCase() === 'pending' ? 'border-yellow-600 bg-yellow-500/50  text-yellow-200 ' : 'text-green-200 bg-green-500/60 border-green-600 '} border rounded-full w-fit px-3 py- text-sm mt-1`}>{i.status}</p>
                </div>
              </div>

              <div className=' flex flex-col gap-3 items-end '>
                <p className=' text-3xl h-fit font-bold'>
                  ₹{i.price}
                </p>
                {i.writer.id === user?.id && i.status.toLowerCase() !== 'completed' &&
                  <button onClick={() => setShowPopUp(i?.id)} className='px-3 py-1  cursor-pointer bg-green-500 rounded-xl whitespace-nowrap'>Mark as Completed</button>}              </div>
            </div>
          )
        })
      }
    </div>
  )
}
const CompletedTask = ({ data, user }: { data: TaskPageProps[], user: { id: string } }) => {

  const queryClient = useQueryClient();
  const sumbitRattings = useMutation({
    mutationFn: async ({ assignmentId, ratings, buyerId, writerId }: { assignmentId: string, ratings: number, buyerId: string, writerId: string }) => {
      return await rateAssignment(assignmentId, ratings, buyerId, writerId)
    },
    onSuccess: (data) => {
      if (data.status === 200) {
        toastSuccess('Thank you for giving Rating!');
        queryClient.invalidateQueries({ queryKey: ['assignments'] })
      }
      else {
        toastSuccess('Something went wrong');
      }
    }
  })

  return (
    <div className=' mt-10 flex flex-col gap-2 '>
      {
        data ? data.map((i, idx) => {
          if (i.status.toLowerCase() !== 'completed') return null;
          return (
            <div key={idx} className=' justify-between items-center pr-5 min-h-[150px] py-2 card bordercolor w-full flex  rounded-2xl px-3'>

              <div>
                <div className='p-2 flex gap-2  '>
                  <Image src={i.buyer.id === user?.id ? `${i?.writer?.image}` : `${i?.buyer?.image}`} className='rounded-full w-16' height={90} width={90} alt="" />
                  <div className='   ml-3'>
                    <p className=' mt-2 font-semibold '>{i.buyer.id === user?.id ? `${i?.writer?.name}` : `${i?.buyer?.name}`}</p>
                  </div>
                </div>

                <div>
                  <p>Order on: {moment(i?.createdAt).format('DD-MM-YYYY')}</p>
                  <p>{i.status.toLowerCase() === 'pending' ? 'expected' : 'Completed on'}: {moment(i?.expectedDate).format('DD-MM-YYYY')}  </p>
                  <p className={`${i.status.toLowerCase() === 'pending' ? 'border-yellow-600 bg-yellow-500/50  text-yellow-200 ' : 'text-green-200 bg-green-500/60 border-green-600 '} border rounded-full w-fit px-3 py- text-sm mt-1`}>{i.status}</p>
                </div>

                {i.status.toLowerCase() === 'completed' && <div className=' flex gap-1 mt-2'>
                  {[...Array(5)].map((_, idx) => {
                    const currentRating = i.rating?.stars || 0;
                    const isFilled = idx < currentRating;
                    return (
                      <button
                        key={idx}
                        hidden={i.writer.id === user?.id && !i.rating}
                        disabled={i.writer.id === user?.id || i.rating?.stars > 0}
                        onClick={() => sumbitRattings.mutate({
                          assignmentId: i.id,
                          ratings: idx + 1,
                          buyerId: i.buyer.id,
                          writerId: i.writer.id,
                        })}
                      >
                        <Star
                          fill={isFilled ? ' #facc15 ' : ''}
                          className={`${isFilled ? 'text-yellow-400' : 'text-gray-400'} cursor-pointer w-5 h-5`}
                        />
                      </button>
                    );
                  })}
                </div>}

              </div>

              <div className=' flex flex-col gap-3 items-end '>
                <p className=' text-3xl h-fit font-bold'>
                  ₹{i.price}
                </p>
              </div>
            </div>
          )
        }) :
          data && data?.length === 0 && <p className=' text-center mt-10 '>No completed task found</p>
      }
    </div>
  )
}
