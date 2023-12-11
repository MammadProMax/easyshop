"use client";

import React from "react";

import { trpc } from "@/lib/trpc";
import { useAppDispatch } from "@/hooks/redux";
import { setForgotToken } from "@/lib/features/auth/changePass";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

const signInformSchema = z.object({
   email: z.string().email("باید ایمیل وارد کنید"),
});
type FormSchema = z.infer<typeof signInformSchema>;

export default function ForgotPass() {
   const dispatch = useAppDispatch();
   const { toast } = useToast();
   const router = useRouter();

   const { mutate: submitForgotPassword, isPending } =
      trpc.submitForgotPassword.useMutation({
         onError: (err) => {
            if (err.data?.httpStatus === 404) {
               toast({
                  title: "ایمیل مورد نظر وجود ندارد",
                  variant: "destructive",
               });
            } else {
               console.log(err);
            }
         },
         onSuccess(data) {
            dispatch(setForgotToken(data.token));
            router.push("/forgot/change-pass");
         },
      });

   const form = useForm<FormSchema>({
      resolver: zodResolver(signInformSchema),
      defaultValues: {
         email: "",
      },
   });

   const handleSubmit = (values: FormSchema) => {
      submitForgotPassword(values);
   };

   return (
      <Form {...form}>
         <form dir="rtl" onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
               control={form.control}
               name="email"
               render={({ field, fieldState }) => (
                  <FormItem className="flex flex-col items-start mt-3 gap-2">
                     <FormLabel className="pr-2">ایمیل</FormLabel>

                     <FormControl>
                        <Input placeholder="example@gmail.com" {...field} />
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
               className="mt-8 w-full mb-8"
            >
               ارسال درخواست
               {isPending && <Loader className="animate-spin w-5 h-5 mr-2" />}
            </Button>
         </form>
      </Form>
   );
}
