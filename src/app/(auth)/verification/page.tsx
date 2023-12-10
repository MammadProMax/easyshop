"use client";

import React from "react";
import { useAppSelector } from "@/hooks/redux";
import { selectToken } from "@/lib/features/auth/authSlice";
export default function Page() {
   const token = useAppSelector(selectToken);
   return <div>{token}</div>;
}
