"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { setAuth } from "@/lib/features/auth/authSlice";

import VerificationInput from "react-verification-input";
import { Loader } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Page() {
   const { toast } = useToast();
   const router = useRouter();

   const { token, password } = useAppSelector((state) => state.authReducer);
   const dispatch = useAppDispatch();
   useEffect(() => {
      if (!token) {
         router.push("/sign-up");
      }
   }, [token, router]);

   const { mutate: verify, isPending } = trpc.verifyUser.useMutation({
      async onSuccess(data) {
         await signIn("credentials", {
            email: data?.email,
            password,
            callbackUrl: "/dashboard",
         });
         dispatch(setAuth({ password: "", token: "" }));
      },
      onError(error) {
         if (error.data?.code === "UNAUTHORIZED") {
            toast({
               title: "وارد شوید",
               variant: "destructive",
            });
            router.push("/sign-up");
         } else {
            toast({
               title: error.message,
               variant: "destructive",
            });
         }
      },
   });

   return (
      <div className="flex flex-col justify-center items-center w-fit h-[650px] mx-auto">
         <Link href={"/"} className="font-sans font-semibold text-3xl pb-16">
            <span className="text-muted-foreground">Easy</span>Shop
         </Link>
         <div className="text-right pb-4 w-fit self-end space-y-2">
            <h3 className="text-2xl font-semibold">رمز ورود دو مرحله ای</h3>
            <p className="text-sm text-muted-foreground">
               لطفا ایمیل خود را چک کنید و رمز ورود را وارد کنید
            </p>
         </div>
         <VerificationInput
            length={6}
            placeholder=""
            validChars="0-9"
            classNames={{
               character:
                  "rounded-md flex items-center justify-center font-light border-border text-2xl sm:text-4xl",
               container: "h-[43px] w-[250px] sm:h-[59px] sm:w-[371px]",
               characterInactive: "bg-background",
               characterSelected: "bg-background",
            }}
            onComplete={(ev) => verify({ token, verifyPass: ev })}
         />
         {isPending && (
            <Loader
               className="animate-spin text-muted-foreground mt-5"
               size={20}
            />
         )}
      </div>
   );
}
