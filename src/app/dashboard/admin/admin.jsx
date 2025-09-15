"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Nav from "@/app/components/Navbar/page";

function admin() {
  const { data: session, status } = useSession();
  if (!session?.user?.role === "studentAdmin" && status === "unauthenticated")
    redirect("/login");
  if (session?.user?.role === "teacher") return redirect("/teacher");
  if (session?.user?.role === "student") return redirect("/dashbord");
  if (!session && status === "unauthenticated") return redirect("/login");
  if (status === "loading") return null;
  return (
    <main>
      <Nav session={session}/>
      
    </main>
  );
}

export default admin;
