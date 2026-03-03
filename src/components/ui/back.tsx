'use client'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const Back = ({className}:{className:string}) => {
    const router = useRouter()
  return (
    <button onClick={()=>router.back()} className={`${className} hover:backdrop-blur-xl hover:bg-[#0000002f] bg-transparent  w-fit rounded-full   ml-5 p-2 `}>
        <ArrowLeft color='white' />
    </button>
  )
}

export default Back