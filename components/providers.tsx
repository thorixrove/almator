"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React, { useState } from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"


export function Providers({ children}: {children: React.ReactNode}) {
    const [queryClient]  = useState(
        () => new QueryClient({ defaultOptions: {queries: { staleTime: 30_000, retry: 1}}})
    )

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
                <TooltipProvider>{children}</TooltipProvider>
                <Toaster position="top-center" richColors/>
            </ThemeProvider>
        </QueryClientProvider>
    )
}