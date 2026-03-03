'use client'
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

import { BookOpen } from 'lucide-react';
import Back from '@/components/ui/back';

export default function SignIn() {

  const { data, status } = useSession();

  const router = useRouter()
  if (data?.user && status === 'authenticated') {
    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen relative text-zinc-100 flex items-center justify-center px-6">

      <Back className=' absolute top-10 left-10 z-[20] text-white' />
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=1920')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-950/95 to-zinc-900/90"></div>
      </div>

      {/* Sign In Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="center rounded-2xl">
              <img src="/logo.png" className=" hover:scale-[1.011] w-28 h-28 " alt="" />
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-zinc-400">Sign in to continue to Write For Me</p>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={() => signIn('google')}
            className="w-full bg-white hover:bg-zinc-100 cursor-pointer text-zinc-900 font-medium py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
          >

            <>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.9895 10.1871C19.9895 9.36767 19.9214 8.76973 19.7742 8.14966H10.1992V11.848H15.8195C15.7062 12.7671 15.0943 14.1512 13.7346 15.0813L13.7155 15.2051L16.7429 17.4969L16.9527 17.5174C18.8789 15.7789 19.9895 13.221 19.9895 10.1871Z" fill="#4285F4" />
                <path d="M10.1993 19.9313C12.9527 19.9313 15.2643 19.0454 16.9527 17.5174L13.7346 15.0813C12.8734 15.6682 11.7176 16.0779 10.1993 16.0779C7.50243 16.0779 5.21352 14.3395 4.39759 11.9366L4.27799 11.9465L1.13003 14.3273L1.08887 14.4391C2.76588 17.6945 6.21061 19.9313 10.1993 19.9313Z" fill="#34A853" />
                <path d="M4.39748 11.9366C4.18219 11.3166 4.05759 10.6521 4.05759 9.96565C4.05759 9.27909 4.18219 8.61473 4.38615 7.99466L4.38045 7.8626L1.19304 5.44366L1.08875 5.49214C0.397576 6.84305 0.000976562 8.36008 0.000976562 9.96565C0.000976562 11.5712 0.397576 13.0882 1.08875 14.4391L4.39748 11.9366Z" fill="#FBBC05" />
                <path d="M10.1993 3.85336C12.1142 3.85336 13.406 4.66168 14.1425 5.33717L17.0207 2.59107C15.253 0.985496 12.9527 0 10.1993 0C6.2106 0 2.76588 2.23672 1.08887 5.49214L4.38626 7.99466C5.21352 5.59183 7.50242 3.85336 10.1993 3.85336Z" fill="#EB4335" />
              </svg>
              <span>Continue with Google</span>
            </>
          </button>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-zinc-800"></div>
            <span className="text-sm text-zinc-500">Secure sign in</span>
            <div className="flex-1 h-px bg-zinc-800"></div>
          </div>

          {/* Info Text */}
          <div className="text-center">
            <p className="text-sm text-zinc-400">
              By continuing, you agree to our{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>

        {/* Features Below Card */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-zinc-900/30 backdrop-blur border border-zinc-800/50 rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-400 mb-1">500+</div>
            <div className="text-xs text-zinc-400">Expert Writers</div>
          </div>
          <div className="bg-zinc-900/30 backdrop-blur border border-zinc-800/50 rounded-xl p-4">
            <div className="text-2xl font-bold text-purple-400 mb-1">10k+</div>
            <div className="text-xs text-zinc-400">Completed</div>
          </div>
          <div className="bg-zinc-900/30 backdrop-blur border border-zinc-800/50 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-400 mb-1">4.9★</div>
            <div className="text-xs text-zinc-400">Avg Rating</div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
    </div>
  );
}