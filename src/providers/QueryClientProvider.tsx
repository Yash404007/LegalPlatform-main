"use client"
import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

type Props = {
    children: React.ReactNode
}

const QueryProvider = ({ children }: Props) => {
    const [queryClient] = useState(() => new QueryClient());
    return (
        <QueryClientProvider client={queryClient}>
            { children }
            <ReactQueryDevtools />
        </QueryClientProvider>
    )
}

export default QueryProvider