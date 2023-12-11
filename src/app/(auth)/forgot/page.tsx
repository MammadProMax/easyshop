import React from "react";
import Link from "next/link";

import ForgotPass from "@/components/auth/ForgotPass";

export default function ForgotPasswordPage() {
   return (
      <main className="w-full h-full text-center flex flex-col items-center gap-y-7">
         <Link href={"/"} className="pt-20 font-sans font-semibold text-3xl">
            <span className="text-muted-foreground">Easy</span>Shop
         </Link>
         <div className="sm:w-[509px] h-fit w-full border border-border rounded-xl px-12">
            <h4 className="font-medium mt-7 text-xl">تغییر رمز عبور</h4>
            <ForgotPass />
         </div>
      </main>
   );
}
