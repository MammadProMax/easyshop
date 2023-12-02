import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// provider
import { TrpcProvider } from "@/components/providers/index";

export const metadata: Metadata = {
   title: "Create Next App",
   description: "Generated by create next app",
};

export default function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <TrpcProvider>
         <html lang="en">
            <body>{children}</body>
         </html>
      </TrpcProvider>
   );
}
