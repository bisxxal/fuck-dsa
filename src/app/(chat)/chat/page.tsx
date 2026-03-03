'use client'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getChatUsers } from '@/actions/chat.action'
import Charts from '@/app/(dashboard)/_components/chartsList'
import BottomBar from '@/components/buttombar'

const ChatPage = () => {

  const { data, isLoading } = useQuery({
    queryKey: ['chatUsers'],
    queryFn: async () => {
      return await getChatUsers();
    },
  });

  return (
    <>
    <div className=' relative w-full px-10 max-md:px-4'>
      
      <Charts userId={data?.userId} chats={data?.chats} isLoading={isLoading} />

    </div>
      <BottomBar />
    </>
  )
}

export default ChatPage