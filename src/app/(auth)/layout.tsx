import React, { PropsWithChildren } from "react";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({ children }: PropsWithChildren) {
   const session = await auth();
   if (session && session.user.id) {
      redirect("/dashboard");
   }
   return <>{children}</>;
}
