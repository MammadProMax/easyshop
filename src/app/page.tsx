import { buttonVariants } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function Home() {
   const session = await auth();

   return (
      <div>
         {!session?.user.email ? (
            <div className="space-x-3">
               <Link
                  className={cn(buttonVariants({ variant: "default" }))}
                  href={"/sign-up"}
               >
                  ثبت نام
               </Link>
               <Link
                  className={cn(buttonVariants({ variant: "default" }))}
                  href={"/login"}
               >
                  ورود
               </Link>
            </div>
         ) : (
            <div>
               <div>{session?.user.email}</div>
               <Link
                  className={cn(buttonVariants({ variant: "default" }))}
                  href={"/api/auth/signout"}
               >
                  خروج
               </Link>
            </div>
         )}
      </div>
   );
}
