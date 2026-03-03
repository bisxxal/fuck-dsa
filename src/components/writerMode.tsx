'use client'
import { Star } from 'lucide-react';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const WriterMode = ({ data, isLoading }) => {


  const [ratings, setRatings] = useState(0);
  const [assignments, setAssignments] = useState({ pending: 0, completed: 0, earning: 0 });

  useEffect(() => {
    if (data && data.ratingsReceived?.length > 0) {
      const total = data.ratingsReceived.reduce((acc: { stars: number }, curr: { stars: number }) => Number(acc) + Number(curr.stars), 0);
      const average = total / data.ratingsReceived.length;

      const assignments = data.assignmentsWritten.reduce((acc: { pending: number, completed: number, earning: number }, curr: { status: string, price: string | number }) => {
        if (curr.status.toLowerCase() === 'completed') {
          acc.completed += 1;
          acc.earning += Number(curr.price);
        } else if (curr.status.toLowerCase() === 'pending') {
          acc.pending += 1;
        }
        return acc;
      }, { pending: 0, completed: 0, earning: 0 })

      setAssignments(assignments);
      setRatings(average);
    }

  }, [data]);

  console.log(data)

  return (
    <div className=' w-full px-10  max-md:px-4 pb-20 pt-10 mt-20'>

      {data?.isWriterModeActive === false && <div className='  flex-col card bordercolor p-3 rounded-lg flex gap-5 '>
        <p>Complete your writter profile to start receving assignment</p>
        <Link className='buttonbg bg-blue-600 w-fit p-1 px-4 rounded-full' href='edit'>Active Now</Link>
      </div>}
      <div>
        <h1 className=' text-xl font-medium '>Hi {data?.name},</h1>
        <h2 className=' text-2xl font-bold '>Welcome Back</h2>

      </div>
      <div className=' flex flex-col gap-5 mt-5 '>

        <div className=" card bordercolor rounded-2xl p-5   gap-3 ">


          <div className=" flex flex-col gap-2 ">
            <div>
              <p className=' text-lg  '>My Ratings</p>
              <p className='text-3xl textbase font-bold'>{ratings.toFixed(1)}</p>

              <div className=' flex gap-1 mt-1 '>
                {Array.from({ length: 5 }).map((_, index) => {
                  const roundedRating = ratings - index;
                  if (roundedRating >= 1) return <span key={index}> <Star color='#facc15' fill='#facc15' /> </span>;
                  if (roundedRating >= 0.5) return <span key={index}><Star /></span>; // change to ⯪ for half-star if you use icons
                  return <span key={index}><Star /></span>;
                })}
              </div>

            </div>
            <h2 className=' between'>Earning <span className='textbase text-xl font-bold'>₹{assignments.earning}</span></h2>
            <h2 className=' between'>Completed Assignment <span className='textbase text-xl font-bold'>{assignments.completed}</span></h2>
          </div>
        </div>

        <p className=' font-medium text-xl'>Assignments</p>
        <div className="between p-2 px-4 rounded-2xl  card bordercolor">
          <div>
            <p>Pending Assignments</p>
            <p className=' text-3xl textbase'>{assignments.pending}</p>
          </div>
          <Link href={`/task`} className=' buttonbg p-2 rounded-4xl px-5'>View Details</Link>
        </div>

        <p className=' font-medium text-xl'>Earnings</p>
        <div className="between p-2 px-4 rounded-2xl  card bordercolor">
          <div>
            <p>Total Earnings</p>
            <p className=' text-3xl font-extrabold mt-2 textbase'>₹{assignments.earning}</p>
          </div>
          <Link href={`/earnings`} className=' buttonbg p-2 rounded-4xl px-5'>View Details</Link>
        </div>

      </div>
    </div>
  )
}

export default WriterMode