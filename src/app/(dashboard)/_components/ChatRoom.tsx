'use client';
import React, { useEffect, useState, useRef } from 'react';
import Back from '@/components/ui/back';
import { useRouter } from 'next/navigation';
import { demoMessages, dummyMessages, dummyUserId, formatDateLabel } from '@/lib/utils';
import LoadingCom from '@/components/ui/loading';
import { Ban, EllipsisVertical, Loader, Send, Trash } from 'lucide-react'
import { useInfiniteQuery } from '@tanstack/react-query';
import moment from 'moment';
import { useSocket } from '@/hooks/useSocket';
import { deleteSelectMessages } from '@/actions/chat.action';
import { toastSuccess } from '@/lib/toast';
import CreateTask from '@/components/createTask';
import Image from 'next/image';

type Message = {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  chatId: string;
  sender?: {
    name: string | null;
    id: string
  };
};

type Props = {
  chatId: string;
  currentUserId: string;
};

const ChatRoom: React.FC<Props> = ({ chatId, currentUserId }) => {
  const router = useRouter();
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const { socket, ready, onlineUser }: { socket: any, ready: boolean, onlineUser: string[] } = useSocket({ userId: currentUserId });
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showPopUp, setShowPopUp] = useState(false);
  const [megSending, setMsgSending] = useState(false);
  const [showAssignPopup , setShowAssignPopup] = useState(false);

  const url = process.env.NEXT_PUBLIC_BACKEND_URL

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch, } = useInfiniteQuery({
      queryKey: ['chatMessages', chatId],
      queryFn: async ({ pageParam = null }) => {
        const res = await fetch(`${url}/api/chart/getmessages/?chatId=${chatId}&userId=${currentUserId}${pageParam ? `&cursor=${pageParam}` : ''}`);
        const data = await res.json();
        if (data.status === 403) {
          router.push('/chat');
        }
        return data;
      },
      staleTime: Infinity,
      getNextPageParam: (lastPage) => {
        if (lastPage.hasMore && lastPage.messages.length > 0) {
          return lastPage.messages[lastPage.messages.length - 1].id;
        }
        return undefined;
      },
      initialPageParam: null,
      enabled: !!chatId && !!currentUserId,
    });

  useEffect(() => {
    const messagessss = [...(data?.pages ?? [])]
      .flatMap(p => p.messages)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    setMessages(messagessss);
  }, [data, refetch]);


  const user = data?.pages[0].user;
  // Join socket room & listen when socket is ready
  useEffect(() => {
    if (!ready || !socket) return;
    socket.emit('join', chatId);
    const onNewMessage = (msg: Message) => {
      if (msg.chatId === chatId) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    ///new
    const onMessageDeleted = (data: { chatId: string; messageIds: string[] }) => {
      if (data.chatId !== chatId) return;
      setMessages((prev) => prev.filter(msg => !data.messageIds.includes(msg.id)));
    };
    socket.on('new_message', onNewMessage);
    socket.on('message_deleted', onMessageDeleted);
    return () => {
      socket.off('new_message', onNewMessage);
      socket.off('message_deleted', onMessageDeleted);
    };
  }, [socket, ready, chatId, refetch]);

  const sendMessage = async () => {
    setMsgSending(true);
    if (!newMessage.trim()) return;

    await fetch(`${url}/api/chart/sendmessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: currentUserId,
        chatId,
        content: newMessage,
      }),
    });
    setNewMessage('');
    setMsgSending(false);
  };

  const groupedMessages = messages?.reduce<Record<string, Message[]>>((acc, message) => {
    const dateKey = moment(message?.createdAt).format('YYYY-MM-DD');
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(message);
    return acc;
  }, {});


  const handleLongPressStart = (id: string) => {
    setIsLongPressing(false);
    longPressTimeout.current = setTimeout(() => {
      setIsLongPressing(true); // flag to prevent click
      setSelectedMessages((prev) => new Set(prev).add(id));
    }, 800); // 800ms press to trigger
  };

  const handleLongPressEnd = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
    }
  };

  const handleMessageClick = (id: string) => {
    // If a long-press just happened, ignore the click
    if (isLongPressing) return;

    if (selectedMessages.size > 0) {
      toggleSelectMessage(id);
    }
  };

  const toggleSelectMessage = (id: string) => {
    setSelectedMessages((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };

  const deleteSelectedMessages = async () => {
    if (selectedMessages.size === 0) return;

    const idsToDelete = Array.from(selectedMessages);

    const res = await deleteSelectMessages(idsToDelete)

    if (res.status) {
      toastSuccess('Messages deleted successfully');
    }

    setMessages((prev) => prev.filter((msg) => !selectedMessages.has(msg.id)));
    setSelectedMessages(new Set());

    if (socket) {
      socket.emit('message_deleted', {
        chatId,
        messageIds: idsToDelete,
      });
    }
  };

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scrollEl = scrollContainerRef.current;
    if (!scrollEl) return;

    const handleScroll = () => {
      const { scrollTop } = scrollEl;
      // Only trigger fetch when user scrolls to top
      if (scrollTop <= 100 && hasNextPage && !isFetchingNextPage) {
        const oldHeight = scrollEl.scrollHeight;

        fetchNextPage().then(() => {

          const newHeight = scrollEl.scrollHeight;
          scrollEl.scrollTop = newHeight - oldHeight;
        });
      }
    };

    scrollEl.addEventListener('scroll', handleScroll);
    return () => scrollEl.removeEventListener('scroll', handleScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);


  useEffect(() => {
    if (!isLoading && data?.pages.length === 1) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'auto' });
      }, 50);
    }
  }, [isLoading, data]);

  return (
    <div className="flex relative top-1 -mt-6 flex-col h-fit   w-full  mx-auto px-">
      <div className='fixed w-full h-[60px] z-[30] pr-4 bg-[#c2c2c240] backdrop-blur-[18px] top-0 left-0  !justify-between center shadow-xl '>
        <div className='   center gap-2'>
          <Back className='ml-0' />
          {user && <>
            <div className=' flex gap-3 items-center pr-3 '>
              <Image height={50} width={50} className=' w-10 h-10 rounded-full ' src={user?.image} alt="" />

              <div className=' flex flex-col '>
              <h1 className=' text-lg textbase font-semibold'>{user.name}</h1>
              {
              onlineUser && onlineUser.includes(user?.id) && (
                <span className=' text-sm  '> online </span>
              )}
              </div>
            </div>
            
          </>

          }
        </div>

        {selectedMessages.size <= 0 &&

          <div className='relative group'>
            <label htmlFor='is'>
              <p><EllipsisVertical className=' textbase ' size={20} /></p>
            </label>
            <input type="checkbox" hidden id="is" />
            <div className='group-has-checked:flex hidden absolute  py-4 w-52 flex flex-col gap-2 border  text-white p-2 border-black/10 rounded-2xl bg-black/50 !backdrop-blur-[10px] -left-[180px] '>
              <h1 className=' pl-5 cursor-pointer border-b pb-2 border-black/10 ' onClick={() => setShowPopUp(!showPopUp)}>Clear all chat</h1>
              <p className=' pl-5 cursor-pointer border-b pb-2 border-black/10 ' onClick={() => setShowAssignPopup(!showAssignPopup)}>Create assigenment</p>
            </div>
          </div>
        }
        {selectedMessages.size > 0 && (
          <div className="flex justify-end rounded-2xl gap-1 ">
            <button className=' px-4 py-2 border-r border-white/50' onClick={() => setSelectedMessages(new Set())}>
              <Ban />
            </button>

            <button
              onClick={deleteSelectedMessages}
              className="text-sm center  px-4 py-1   gap-2 rounded" >
              <Trash className=' text-red-500' size={23} />
              {selectedMessages.size}
            </button>
          </div>
        )}
      </div>{
      }
      <div className='relative bg-[url(/bg.png)] bg-contain flex flex-col mt-[85px] flex justify-between pb-7 mx-auto max-w-2xl rounded-2xl max-md:border-none max-md:shadow-none border border-black/10 shadow-xl px-2  w-full max-md:h-[93vh] h-[80vh]'>

        {isFetchingNextPage && (
          <div className="loading-animation center text-center text-sm text-gray-400">
            <Loader className='text-xl animate-spin ' />
          </div>
        )}

        <div ref={scrollContainerRef} className=" w-full scrollbar overflow-y-auto space-y-3 rounded-2xl h-[70vh] max-md:h-[76vh] ">
          {Object.entries(groupedMessages).length !== 0 ? Object.entries(groupedMessages).map(([dateKey, msgs]) => (
            <div key={dateKey}>
              <div className="text-center w-fit bg-[#ffffff5c] border border-white/30 mx-auto rounded-full px-3  backdrop-blur-[10px] my-4 text-sm text-gray-200 font-medium">
                {formatDateLabel(dateKey)}
              </div>

              {msgs.map((msg) => {
                const isSelected = selectedMessages.has(msg?.id);
                console.log(msg)
                return (
                  <div
                    key={msg?.id}
                    onMouseDown={() => handleLongPressStart(msg?.id)}
                    onMouseUp={handleLongPressEnd}
                    onTouchStart={() => handleLongPressStart(msg?.id)}
                    onTouchEnd={handleLongPressEnd}
                    onClick={() => handleMessageClick(msg?.id)}
                    className={`relative w-full mt-3 cursor-pointer flex flex-col text-base font-normal cursor-pointer`}>

                    {isSelected && <div className=' w-full rounded-lg bas buttonbg opacity-[0.4] z-[10] h-full top-0 left-0 absolute'></div>}
                    <pre className={` max-w-[80%] w-fit font-sa px-5 py-1.5 ${msg?.senderId === currentUserId
                      ? ' buttonbg text-white rounded-b-2xl rounded-l-2xl ml-auto'
                      : ' backdrop-blur-[5px] bg-white/10 bordercolor  rounded-b-2xl rounded-r-2xl'}`}>
                      <p className='max-w-[99%]'>{msg?.content}</p>
                      <p className="text-xs opacity-70 text-right">
                        {moment(msg?.createdAt).format('LT')}
                      </p>
                    </pre>

                  </div>
                );
              })}

            </div>
          ))
            : (isLoading ?
              dummyMessages.map((msg, idx) => {
                return (
                  <div
                    key={idx}
                    className={`max-w-[80%] mt-3 w-fit h-20  flex flex-col   ${msg.senderId === dummyUserId ? '  ml-auto ' : ' '}`}
                  >
                    <LoadingCom child={` rounded-xl max-md:h-10 border border-white/20 w-60 max-md:w-52`} boxes={1} parent=' w-10 h-full' />
                  </div>
                );
              }
              ) : <p className='text-white px-4 py-3 bg-white/20 rounded-3xl  border w-fit mt-[30vh] mx-auto border-white/30 font-medium  backdrop-blur-[3px] '>say hii 👋🏻  to start message </p>
            )
          }
          <div ref={bottomRef} />
          {isFetchingNextPage && (
            <p className="text-center text-xs text-gray-400">Loading more...</p>
          )}
        </div>

        {Object.entries(groupedMessages).length === 0 && !isLoading &&
          <div className='flex gap-2 w-full mb-4 py-2 scrollbar overflow-x-scroll '>
            {
              demoMessages.map((msg, index) => (
                <p key={index} onClick={() => setNewMessage(msg)} className="w-full bordercolor bg-white/20 backdrop-blur-[3px]  cursor-pointer whitespace-nowrap h-fit px-2 py-1 rounded-2xl ">
                  {msg}
                </p>
              ))
            }
          </div>}

     {showAssignPopup && <CreateTask buyerId={user?.id} setShowAssignPopup={setShowAssignPopup} />}

        <div className=" flex justify-between items-end gap-3  max-md:pr-[2px]  ">

          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            rows={1}
            className="flex-1 px-4 py-2 flex-1 scrollbar backdrop-blur-[5px] rounded-3xl bordercolor  resize-none overflow-auto text-white bg-transparent focus:outline-none leading-relaxed max-h-[200px]"
            placeholder="Type a message..."
            onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
              const target = e.currentTarget;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
          />

          <button
            onClick={sendMessage}
            disabled={!newMessage}
            className={` ${!newMessage && " opacity-[0.5] "}  text-white center w-12 h-12 rounded-full center  bg-[#9955D4] disabled:opacity-[0.6] disabled:cursor-not-allowed`}>
            {megSending ? <Loader className='text-xl animate-spin ' /> : <Send size={23} strokeWidth={1.25} />}
          </button>
        </div>
      </div>

    </div>
  );
};

export default ChatRoom;
