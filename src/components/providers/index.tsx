"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import React, { PropsWithChildren, useState } from "react";
import { trpc } from "@/lib/trpc";

export function TrpcProvider({ children }: PropsWithChildren) {
   const [queryClient] = useState(() => new QueryClient());
   const [trpcClient] = useState(() =>
      trpc.createClient({
         links: [
            httpBatchLink({
               url: `${process.env.NEXT_PUBLIC_ROUTE}/api/trpc`,
            }),
         ],
      })
   );

   return (
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
         <QueryClientProvider client={queryClient}>
            {children}
         </QueryClientProvider>
      </trpc.Provider>
   );
}
