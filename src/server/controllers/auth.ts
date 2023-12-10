import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createTransport } from "nodemailer";

import { publicProcedure } from "../trpc";

import { db } from "@/lib/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

type JwtDecode = {
   email: string;
   name: string;
   password: string;
   verifyPass: string;
};

const htmlCode = (options: { code: string; name: string; link: string }) => `
<!DOCTYPE html>
<html lang="en">
   <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
      <link
         href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css"
         rel="stylesheet"
         type="text/css"
      />
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
         .font-vazir {
            font-family: Vazirmatn, sans-serif;
         }
      </style>
   </head>
   <body dir="rtl" class="font-vazir px-10 py-10">
      <a href="${options.link}" class="text-2xl font-semibold">
         <span class="text-gray-600">Easy</span>Shop
      </a>
      <div class="pr-5 space-y-3 mt-7">
         <h2 class="text-xl font-semibold">سلام ${options.name} عزیز</h2>
         <h4 class="text-base">کد ورود شما به سایت</h4>
         <div class="border border-gray-300 p-2 w-fit">
            <h1 class="text-4xl">${options.code}</h1>
         </div>
      </div>
   </body>
</html>

`;

const transporter = createTransport({
   service: "gmail",
   auth: {
      user: process.env.EMAIL_SPECIFIED,
      pass: process.env.EMAIL_PASSWORD,
   },
});

export const signUp = publicProcedure
   .input(
      z.object({
         name: z.string(),
         email: z.string(),
         password: z.string(),
      })
   )
   .mutation(async ({ input }) => {
      const userExist = await db.user.findFirst({
         where: {
            email: input.email,
         },
      });

      if (userExist)
         throw new TRPCError({ code: "FORBIDDEN", message: "email exists" });

      const hashedPassword = await bcrypt.hash(input.password, 10);

      const verifyPass = [];
      for (let index = 0; index <= 5; index++) {
         const randomNum = Math.round(Math.random() * 10);
         verifyPass.push(randomNum);
      }

      const token = jwt.sign(
         {
            email: input.email,
            name: input.name,
            password: hashedPassword,
            verifyPass: bcrypt.hashSync(verifyPass.join(""), 10),
         },
         process.env.JWT_SECRET_TOKEN!,
         {
            expiresIn: "2m",
         }
      );
      // email logic
      const transportOption = {
         from: process.env.EMAIL_SPECIFIED,
         to: input.email,
         subject: "کد احراز هویت وب سایت ایزی شاپ",
         html: htmlCode({
            code: verifyPass.join(""),
            link: process.env.NEXT_PUBLIC_ROUTE!,
            name: input.name,
         }),
      };
      transporter.sendMail(transportOption, (error) => {
         if (error) {
            console.log(error);
         }
      });

      return { token };
   });

export const verifyUser = publicProcedure
   .input(
      z.object({
         verifyPass: z.string().min(6).max(6),
         token: z.string(),
      })
   )
   .mutation(({ input }) => {
      let res:
         | {
              status: 400;
              email: undefined;
              password: undefined;
           }
         | {
              status: 200;
              email: string;
              password: string;
           } = {
         status: 400,
         email: undefined,
         password: undefined,
      };
      jwt.verify(
         input.token,
         process.env.JWT_SECRET_TOKEN!,
         async (err, decoded) => {
            if (err) {
               throw new TRPCError({
                  message: err.message,
                  code: "UNAUTHORIZED",
               });
            }
            const decode = <JwtDecode | undefined>decoded;
            console.log(decoded);

            if (decode?.verifyPass) {
               const isVerified = await bcrypt.compare(
                  input.verifyPass,
                  decode.verifyPass
               );

               if (isVerified) {
                  const user = await db.user.create({
                     data: {
                        email: decode.email,
                        name: decode.name,
                        password: decode.password,
                     },
                  });

                  res = {
                     status: 200,
                     email: user.email!,
                     password: user.password!,
                  };
               }
            }
         }
      );
      if (res.status === 400) {
         throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return res;
   });
