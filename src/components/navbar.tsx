'use client'
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const Navbar = () => {
    const { data, status } = useSession();
    return (
        <div className=' w-full z-[30] fixed flex justify-between items-center backdrop-blur-2xl bg-[#ffffff09] border-[#ffffff2c] top-0 left-0 h-[60px] border-b '>
            <Link href={`/dashboard`} className='flex text-xl items-center  font-bold ml-4 '>
            <img src="/logo.png"  className =" hover:scale-[1.09] drop-shadow-2xl drop-shadow-[#a860e3] transition-all w-14 h-14 " alt="" />
           <p className=' bg-gradient-to-r from-[#a860e3] to-[#5A189A] bg-clip-text text-transparent'>Write For Me</p>
            </Link>

            <div className=' mr-4 '>

                {status !== 'loading' && data && <div className='center gap-2 max-md:gap-1'>
                    <Link href={`/profile`}>
                        <Image loading='lazy' src={data.user.image!} alt="User Avatar" width={40} height={40} className=' max-md:w-8  rounded-full' />
                    </Link>
                </div>
                }
            </div>
        </div>
    )
}

export default Navbar