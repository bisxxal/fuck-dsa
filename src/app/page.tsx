'use client'

import { Search, Star } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AssignmentMarketplace() {
  const { data, status } = useSession();
  
    const router = useRouter()
    if (data?.user && status === 'authenticated') {
      router.push('/profile');
    }

  const writers = [
    {
      id: 1,
      name: "Sarah Mitchell",
      rating: 4.9,
      completed: 156,
      rate: 5,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
    },
    {
      id: 2,
      name: "James Rodriguez",
      rating: 4.8,
      completed: 203,
      rate: 10,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
    },
    {
      id: 3,
      name: "Emily Chen",
      rating: 5.0,
      completed: 89,
      rate: 22,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen  ">
      {/* Hero Section */}
      <div className="relative overflow-  bg-gradient-to-br from-zinc-900 via-zinc-950 to-black">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?q=80&w=2146&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <div className="center gap-3 max-md:gap-0">
              <p className='text-6xl max-md:text-4xl font-extrabold mb-4 bg-gradient-to-r from-[#a860e3] to-[#5A189A] bg-clip-text text-transparent'>       Write For Me</p>
              <img src="/logo.png" className="animate-logo duration-700 hover:scale-[1.3] transition-all w-28 h-28 " alt="" />
            </div>
            <p className="text-xl max-md:text-lg text-zinc-400">Connect writers with those who need quality work</p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
              <input
                type="text"
                placeholder="Search by writer, college name , or district..."
                className="w-full !border-none bg-zinc-900/20 backdrop-blur-[20px]  rounded-2xl pl-12 max-md:pl-5 pr-4 py-4 text-zinc-100 placeholder-zinc-500 outline-none"
              />
            </div>
          </div>

          <div className=' w-full center'>
            <Link href="/sign-in" className="duration-500 hover:scale-[1.1] transition-all items-center gap-2 buttonbg text-white py-3 px-6 rounded-xl font-medium ">
             Find Writer
            </Link>
          </div>

        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">

        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Available Writers Nearby You</h2>
            <p className="text-zinc-400">{writers.length} writers online</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {writers.map((writer) => (
              <div
                key={writer.id}
                className="card backdrop-blur border border-zinc-800 rounded-2xl p-6 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={writer.avatar}
                    alt={writer.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{writer.name}</h3>
                    <div className="flex items-center gap-2 text-yellow-400 text-sm">
                      <Star size={16} fill="currentColor" />
                      <span>{writer.rating}</span>
                      <span className="text-zinc-500">({writer.completed} completed)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <span>₹ {writer.rate} / page</span>
                </div>

                <button className="w-full buttonbg hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors">
                  Hire Writer
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}