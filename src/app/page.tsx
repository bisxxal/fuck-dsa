'use client';
 
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const [platform, setPlatform] = useState<string>('web');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      setPlatform(window.electronAPI.platform);
    }
  }, []);

  const stack = [
    { name: 'Electron', version: '40+', color: 'from-sky-400 to-blue-600' },
    { name: 'Next.js', version: '16', color: 'from-zinc-400 to-zinc-700' },
    { name: 'Tailwind', version: '4', color: 'from-cyan-400 to-teal-600' },
    { name: 'TypeScript', version: '5', color: 'from-blue-400 to-indigo-600' },
  ];

  const router = useRouter()

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center px-6 py-20">
      {/* Glow background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600 opacity-20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500 opacity-20 rounded-full blur-3xl" />
      </div>

      <Link href="/dashboard">Dashboard</Link>

      <div className="relative z-10 flex flex-col items-center gap-10 max-w-2xl w-full">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 text-sm text-zinc-300 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Running on <span className="text-white font-semibold ml-1">{platform}</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent leading-tight">
            Electron + Next.js
          </h1>
          <p className="mt-3 text-zinc-400 text-lg">
            Your boilerplate is ready. Start building something amazing.
          </p>
        </div>

        {/* Stack badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
          {stack.map((item) => (
            <div
              key={item.name}
              className="flex flex-col items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors cursor-default"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} shadow-lg`} />
              <span className="font-semibold text-white text-sm">{item.name}</span>
              <span className="text-xs text-zinc-500">v{item.version}</span>
            </div>
          ))}
        </div>

        {/* Quick start guide */}
        <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs text-zinc-500 ml-2 font-mono">terminal</span>
          </div>
          <div className="p-5 font-mono text-sm space-y-2">
            <div className="text-zinc-500"># Start dev (Next.js + Electron)</div>
            <div><span className="text-emerald-400">$</span> <span className="text-white">npm run dev</span></div>
            <div className="mt-4 text-zinc-500"># Build production app</div>
            <div><span className="text-emerald-400">$</span> <span className="text-white">npm run build</span></div>
            <div className="mt-4 text-zinc-500"># Package distributable</div>
            <div><span className="text-emerald-400">$</span> <span className="text-white">npm run dist</span></div>
          </div>
        </div>

        <p className="text-zinc-600 text-sm text-center">
          Edit <code className="text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">src/app/page.tsx</code> to get started.
          Main process lives in <code className="text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">electron/main.ts</code>.
        </p>
      </div>
    </main>
  );
}
