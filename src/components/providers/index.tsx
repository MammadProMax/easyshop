"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import React, { PropsWithChildren, useState } from "react";
import { trpc } from "@/lib/trpc";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { Provider as RTKProvider } from "react-redux";
import { store } from "@/lib/store";

export function TrpcProvider({
   children,
   session,
}: PropsWithChildren<{ session: Session | null }>) {
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
            <SessionProvider session={session}>
               <RTKProvider store={store}>{children}</RTKProvider>
            </SessionProvider>
         </QueryClientProvider>
      </trpc.Provider>
   );
}
