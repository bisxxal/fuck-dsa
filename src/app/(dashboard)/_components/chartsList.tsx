'use client'
import KitImage from '@/components/ui/KitImage';
import LoadingCom from '@/components/ui/loading';
import { useSocket } from '@/hooks/useSocket';
import { CornerDownLeft } from 'lucide-react';
import moment from 'moment';
import Link from 'next/link'
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
                image: string
            }
        }[];
        messages: {
            content: string;
            createdAt: string;
        }[];
    }
}

type ChartsProps = Chat[];
const Charts = ({ chats, userId , isLoading }: { chats: ChartsProps, userId: string, isLoading:boolean }) => {
    const { onlineUser } = useSocket({ userId: userId }) as { socket: any; ready: boolean; onlineUser: string[] };

    return (
        <div className='flex flex-col w-full '>
            <p className='my-3 mt-10 pl-10 max-md:pl-2 textbase text-2xl font-semibold'>Chats</p>
            {  !isLoading && chats?.length !== 0 ?
                [...chats]
                    .sort((a, b) => {
                        const dateA = a?.chat?.messages[0]?.createdAt
                            ? new Date(a.chat.messages[0].createdAt).getTime()
                            : 0;
                        const dateB = b?.chat?.messages[0]?.createdAt
                            ? new Date(b.chat.messages[0].createdAt).getTime()
                            : 0;
                        return dateB - dateA;
                    })
                    .map((item, i) => {
                        return (
                            <Link
                                href={`/chat/${item.chatId}`}
                                key={i}
                                className='w-[95%]  max-md:w-[98%] mx-auto rounded-3xl  card bordercolor center mb-3 shadow p-2 !justify-start '
                            >
                                {item.chat.participants
                                    .filter((participant) => participant.user.id !== userId)
                                    .map((participant, index) => (
                                        <div key={index} className='flex w-full items-center pr-6 max-md:pr-2 justify-between gap-2'>
                                            <div className=' flex items-center gap-2'>
                                                <KitImage
                                                    loading='lazy'
                                                    className='!w-[80px] !h-[80px] rounded-3xl border border-black/20 object-cover'
                                                    src={participant?.user?.image}
                                                    alt={participant.user.name}
                                                    width={300}
                                                    height={300}
                                                />
                                                <div className=' flex flex-col'>
                                                    <h1 className='pl-1 pt-1 text-sm text-gray-200'>
                                                        {participant.user.name}
                                                    </h1>
                                                    {item?.chat?.messages[0]?.content && (
                                                        <p className=' pl-3 text-xs text-blue-400 center gap-2'>
                                                            <CornerDownLeft size={21} />
                                                          <pre>
                                                              {item?.chat?.messages[0]?.content.split(' ').slice(0, 10).join(' ')}
                                                          </pre>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className=' flex flex-col items-end '>
                                                 <span className='text-xs whitespace-nowrap text-gray-400 mt-1'>
                                                    {moment(item?.chat?.messages[0]?.createdAt).format('LT  ')}</span>
                                                {
                                                    onlineUser && participant.user.id && onlineUser.includes(participant?.user?.id) && (
                                                        <span className='text-xs text-green-500'>Online</span>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    ))}
                            </Link>
                        );
                    })
                :
                (
                  isLoading  ? <>
                  <LoadingCom boxes={5} child=" !rounded-3xl w-full h-[100px] " parent=" !items-start !justify-between  gap-2 flex-col " />
                  </> :  <p className='text-center text-gray-500'>No Messages found</p>
                )
            }
        </div>
    )
}

export default Charts