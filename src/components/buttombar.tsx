'use client'
import { ArrowLeftRight, Calendar, ChartLine, Home, MessageCircle, NotebookPen, User, Wallet } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const BottomBar = () => {

    const path = usePathname()
    return (
        <div className='fixed bottom-[20px] z-[100] w-full center h-[60px] '>
            <div className='w-fit  backdrop-blur-[10px] p-2 rounded-2xl bg border border-[#d3d3d346] flex !justify-evenly items-center gap-5 h-full '>
                <Link className={`${path === `/dashboard` ? 'buttonbg' : " bg-[#66677575] " } hover:-translate-y-3 hover:scale-[1.3] max-md:hover:scale-[none] hover:transition-all duration-300 ease-in-out px-3 py-3 center rounded-xl  `} href={'/dashboard'}> <Home /> </Link>
                <Link className={`${path === `/chat` ? 'buttonbg' : "bg-[#66677575]" } hover:-translate-y-3 hover:scale-[1.3] max-md:hover:scale-[none] hover:transition-all duration-300 ease-in-out px-3 py-3 center rounded-xl  `} href={'/chat'}>  <MessageCircle /> </Link>
                <Link className={`${path === `/task` ? 'buttonbg' : "bg-[#66677575]" } hover:-translate-y-3 hover:scale-[1.3] max-md:hover:scale-[none] hover:transition-all duration-300 ease-in-out px-3 py-3 center rounded-xl  `} href={'/task'}> <NotebookPen /> </Link>
                <Link className={`${path === `/profile` ? 'buttonbg' : "bg-[#66677575]" } hover:-translate-y-3 hover:scale-[1.3] max-md:hover:scale-[none] hover:transition-all duration-300 ease-in-out px-3 py-3 center rounded-xl  `} href={'/profile'}> <User /> </Link>
            </div>
        </div>
    )
}

export default BottomBar