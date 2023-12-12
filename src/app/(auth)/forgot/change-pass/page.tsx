"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";

import { useAppDispatch } from "@/hooks/redux";
import { useAppSelector } from "@/hooks/redux";
import { selectForgotPassToken } from "@/lib/features/auth/changePass";
import { setForgotToken } from "@/lib/features/auth/changePass";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Loader } from "lucide-react";
import VerificationInput from "react-verification-input";
import { Input } from "@/components/ui/input";
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
   password: z.string().min(6).max(32),
   confirmPass: z.string().min(6).max(32),
});
type FormSchema = z.infer<typeof formSchema>;

export default function ChangePassPage() {
   const [verfiyValue, setVerifyValue] = useState("");
   const [verfiyError, setVerifyError] = useState("");

   const token = useAppSelector(selectForgotPassToken);
   const dispatch = useAppDispatch();
   const { toast } = useToast();
   const router = useRouter();

   const { isPending, mutate: changePass } = trpc.verifyChangePass.useMutation({
      onError(err) {
         if (err.data?.code === "FORBIDDEN") {
            toast({
               title: "کد احراز دو مرحله ای اشتباه است",
               variant: "destructive",
            });
         }
         if (err.data?.code === "UNAUTHORIZED") {
            toast({
               title: "زمان شما برای تغییر رمز به پایان رسید دوباره امتحان کنید",
               variant: "destructive",
            });
            dispatch(setForgotToken(""));
            router.push("/login");
         }
      },
      onSuccess() {
         dispatch(setForgotToken(""));
         toast({
            title: "رمز عبور تغییر یافت لطفا وارد شوید",
         });
         router.push("/login");
      },
   });

   const form = useForm<FormSchema>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         confirmPass: "",
         password: "",
      },
   });

   const handleSubmit = (values: FormSchema) => {
      if (values.confirmPass === values.password && verfiyValue.length === 6) {
         setVerifyError("");
         changePass({
            newPass: values.confirmPass,
            token,
            verifyPass: verfiyValue,
         });
      } else if (values.confirmPass !== values.password) {
         form.setError("confirmPass", {
            message:
               "رمز عبور جدید وارد شده با قسمت تایید رمز عبور یکی نمی باشد",
         });
      } else {
         setVerifyError("لطفا رمز احراز دو مرحله ای را وارد کنید");
      }
   };

   useEffect(() => {
      if (!token) {
         router.push("/login");
      }
   }, [token, router]);

   return (
      <main className="w-full h-full text-center flex flex-col items-center gap-y-7">
         <Link href={"/"} className="pt-20 font-sans font-semibold text-3xl">
            <span className="text-muted-foreground">Easy</span>Shop
         </Link>
         <div className="sm:w-[509px] h-fit w-full border border-border rounded-xl px-5 sm:px-12">
            <div className="flex flex-col justify-center items-center h-fit py-9 mx-auto">
               <div className="text-right pb-4 self-end space-y-2">
                  <h3 className="text-2xl font-semibold">
                     تغییر رمز ورود با احراز دو مرحله ای
                  </h3>
                  <p className="text-sm text-muted-foreground">
                     لطفا ایمیل خود را چک کنید و رمز ورود را وارد کنید
                  </p>
               </div>
               <div className="py-4">
                  <VerificationInput
                     length={6}
                     placeholder=""
                     validChars="0-9"
                     classNames={{
                        character:
                           "rounded-md flex items-center justify-center font-light border-border text-2xl sm:text-4xl",
                        container:
                           "h-[43px] w-[250px] sm:h-[59px] sm:w-[371px]",
                        characterInactive: "bg-background",
                        characterSelected: "bg-background",
                     }}
                     onChange={(ev) => setVerifyValue(ev)}
                  />
                  {verfiyError ? (
                     <p className="text-destructive mt-2">{verfiyError}</p>
                  ) : null}
               </div>
               <Form {...form}>
                  <form
                     onSubmit={form.handleSubmit(handleSubmit)}
                     className="w-full text-right space-y-4"
                  >
                     <FormField
                        control={form.control}
                        name="password"
                        render={({ field, fieldState }) => (
                           <FormItem>
                              <FormLabel>رمز جدید</FormLabel>
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
                     <FormField
                        control={form.control}
                        name="confirmPass"
                        render={({ field, fieldState }) => (
                           <FormItem>
                              <FormLabel>تایید رمز جدید</FormLabel>
                              <FormControl>
                                 <Input type="password" {...field} />
                              </FormControl>
                              {fieldState.error ? (
                                 <FormDescription className="text-destructive">
                                    {fieldState.error.message}
                                 </FormDescription>
                              ) : null}
                           </FormItem>
                        )}
                     />
                     <Button className="w-full">ثبت تغییرات</Button>
                  </form>
               </Form>
               {isPending && (
                  <Loader
                     className="animate-spin text-muted-foreground mt-5"
                     size={20}
                  />
               )}
            </div>
         </div>
      </main>
   );
}
