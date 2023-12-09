"use client";

import { trpc } from "@/lib/trpc";

export default function Home() {
   const { data } = trpc.hello.useQuery();

   return <div>{data?.greeting}</div>;
}
