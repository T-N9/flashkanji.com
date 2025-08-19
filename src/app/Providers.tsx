'use client'
import { HeroUIProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools'
import { ThemeProvider } from 'next-themes'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true, // important
      refetchOnReconnect: true,
      retry: 1,
    },
  },
});

const Providers = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <HeroUIProvider>
          {children}
        </HeroUIProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ThemeProvider>

  )
}

export default Providers