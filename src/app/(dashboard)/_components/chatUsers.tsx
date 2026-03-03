'use client'
import Link from 'next/link';
import React from 'react'

interface Chat {
    chatId: string;
    name: string;
    image: string;
    chat: {
        participants: {
            user: {
                id: string;
                name: string;
                image: string;
            }
        }[];
        messages: {
            content: string;
            createdAt: string;
        }[];
    }
}
const ChatUsers = ({data , isLoading}:{data:Chat[], isLoading:boolean}) => {
  return (
    <div className=' '>
        
        <div className=' flex flex-col gap-4 '>
          {
            isLoading ? <p>Loading...</p> :
            data?.length === 0 ? <p>No chat users found.</p> :
            data?.map((chatUser: any) => (
              <Link  href={`/chat/${chatUser?.chatId}`} key={chatUser.id} className='flex gap-3 items-center p-4 card bordercolor rounded-3xl cursor-pointer '>
                <img className=' rounded-full h-10 w-10' src={chatUser.chat?.participants[0].user?.image} alt="" />
                <div>
               <p className=' font-medium '>{chatUser.chat?.participants[0].user?.name}</p>
                </div>
              </Link>
            ))
          }
        </div>
    </div>
  )
}

export default ChatUsers