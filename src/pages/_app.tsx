import type { AppProps } from 'next/app'
import ReactQueryProvider from '../provider/QuaryClient'
import '../app/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ReactQueryProvider>
      <Component {...pageProps} />
    </ReactQueryProvider>
  )
}
