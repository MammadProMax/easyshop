"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { signIn } from "next-auth/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/hooks/redux";
import { trpc } from "@/lib/trpc";
import { setAuth } from "@/lib/features/auth/authSlice";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

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
import Link from "next/link";

const signInformSchema = z.object({
   email: z.string().email("باید ایمیل وارد کنید"),
   password: z.string().min(6, "حداقل ۶ کارکتر"),
   name: z.string().min(8, "حداقل ۸ کارکتر"),
});
type FormSchema = z.infer<typeof signInformSchema>;

export default function SignUp() {
   const { toast } = useToast();
   const dispatch = useAppDispatch();
   const router = useRouter();

   const { mutate: createUser, isPending } = trpc.signUp.useMutation({
      onSuccess: (data, variables) => {
         dispatch(setAuth({ password: variables.password, token: data.token }));
         router.push("/verification");
      },
      onError(error) {
         if (error.data?.code === "FORBIDDEN") {
            toast({
               title: "کاربر مورد نظر وجود دارد لطفا وارد شوید",
               variant: "destructive",
               onClick: () => router.push("/login"),
            });
         } else {
            console.log(error);
         }
      },
   });

   const form = useForm<FormSchema>({
      resolver: zodResolver(signInformSchema),
      defaultValues: {
         email: "",
         password: "",
         name: "",
      },
   });

   const handleSubmit = (values: z.infer<typeof signInformSchema>) => {
      createUser(values);
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

         <Form {...form}>
            <form dir="rtl" onSubmit={form.handleSubmit(handleSubmit)}>
               <FormField
                  control={form.control}
                  name="name"
                  render={({ field, fieldState }) => (
                     <FormItem className="flex flex-col items-start mt-6 gap-2">
                        <FormLabel className="pr-2">
                           نام و نام خانوادگی
                        </FormLabel>

                        <FormControl>
                           <Input placeholder="مثال: علی موسوی" {...field} />
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
                  name="email"
                  render={({ field, fieldState }) => (
                     <FormItem className="flex flex-col items-start mt-6 gap-2">
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
               <Button disabled={isPending} className="mt-8 w-full mb-4">
                  ثبت نام
               </Button>
               <div className="mb-5 flex justify-center items-center gap-1">
                  <Link className="text-xs" href="/login">
                     ورود به حساب
                  </Link>
               </div>
            </form>
         </Form>
      </>
   );
}
