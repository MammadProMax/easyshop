"use client";

import React, { useState } from "react";
import Link from "next/link";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { ChevronLeft, Loader } from "lucide-react";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";

const signInformSchema = z.object({
   email: z.string().email("باید ایمیل وارد کنید"),
   password: z.string().min(6, "حداقل ۶ کارکتر"),
});
type FormSchema = z.infer<typeof signInformSchema>;

export default function Login() {
   const [isPending, setIsPending] = useState(false);
   const { toast } = useToast();
   const searchParams = useSearchParams();

   const hasWrongPassword = searchParams.get("error") === "CredentialsSignin";

   const form = useForm<FormSchema>({
      resolver: zodResolver(signInformSchema),
      defaultValues: {
         email: "",
         password: "",
      },
   });

   const handleSubmit = async (values: FormSchema) => {
      try {
         setIsPending(true);
         await signIn("credentials", {
            callbackUrl: "/dashboard",
            ...values,
         });
      } catch (error) {
         console.log(error);

         toast({
            title: "مشکلی به وجود آمد",
            variant: "destructive",
         });
      } finally {
         setIsPending(false);
      }
   };

   return (
      <>
         <div className="flex w-full mt-9 justify-between border-b border-border pb-6">
            <Button
               variant="secondary"
               className="sm:px-12"
               onClick={() => signIn("google", { callbackUrl: "/" })}
            >
               <FcGoogle size={"24px"} />
            </Button>
            <Button
               variant="secondary"
               className="sm:px-12"
               onClick={() => signIn("github", { callbackUrl: "/" })}
            >
               <FaGithub size={"24px"} />
            </Button>
         </div>

         {hasWrongPassword ? (
            <div className="mt-4 text-sm text-destructive font-semibold">
               رمز ورود یا ایمیل وارد شده اشتباه است
            </div>
         ) : null}
         <Form {...form}>
            <form dir="rtl" onSubmit={form.handleSubmit(handleSubmit)}>
               <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                     <FormItem className="flex flex-col items-start mt-3 gap-2">
                        <FormLabel className="pr-2">ایمیل</FormLabel>

                        <FormControl>
                           <Input
                              placeholder="مثال:eample@gmail.com"
                              {...field}
                           />
                        </FormControl>

                        {fieldState.error ? (
                           <FormDescription>
                              {fieldState.error.message}
                           </FormDescription>
                        ) : null}
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                     <FormItem className="flex flex-col items-start mt-6 gap-2">
                        <FormLabel className="pr-2">رمز عبور</FormLabel>

                        <FormControl>
                           <Input type="password" {...field} />
                        </FormControl>

                        {fieldState.error ? (
                           <FormDescription>
                              {fieldState.error.message}
                           </FormDescription>
                        ) : null}
                     </FormItem>
                  )}
               />
               <Button
                  type="submit"
                  disabled={isPending}
                  className="mt-8 w-full mb-5"
               >
                  ورود
                  {isPending && (
                     <Loader className="animate-spin w-3 h-3 mr-2" />
                  )}
               </Button>
               <div className="text-sm mb-3 text-sky-600 flex items-center justify-center gap-x-1">
                  <Link href="/forgot">فراموشی رمز عبور</Link>
                  <ChevronLeft className="w-4 h-4" />
               </div>

               <div className="mb-5 flex justify-center items-center gap-1">
                  <p className="text-xs text-muted-foreground">حسابی نداری؟</p>
                  <Link className="text-sm" href="/sign-up">
                     ایجاد حساب کاربری
                  </Link>
               </div>
            </form>
         </Form>
      </>
   );
}
