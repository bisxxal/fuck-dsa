'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
type Props = {
  children: React.ReactNode,
}
const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false, 
      refetchInterval: false,
      staleTime: Infinity
    }
  }
})

const ReactQueryProvider = ({ children, ...props }: Props) => {
  return (<QueryClientProvider client={client}>
    <SessionProvider>
        {children}
    </SessionProvider>
  </QueryClientProvider>)
}

export default ReactQueryProvider
