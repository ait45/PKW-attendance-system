"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Nav from "@/app/components/Navbar/page";
import Footer from "@/app/components/Footer/page";
import StudentDashboard from "@/app/components/StudentDashboard/page";


function admin() {
  const { data: session, status } = useSession();
  if (!session?.user?.role === "studentAdmin" && status === "unauthenticated")
    redirect("/login");
  if (session?.user?.role === "teacher" && session?.user?.isAdmin === false)
    return redirect(`/teacher/${session.id}`);
  if (session?.user?.role === "teacher" && session?.user?.isAdmin === true)
    return redirect(`/teacher/admin/${session?.id}`);
  if (session?.user?.role === "student" && session?.user?.isAdmin === false)
    return redirect(`/student/${session.id}`);
  if (!session && status === "unauthenticated") return redirect("/login");
  if (status === "loading") return null;
  return (
    <main>
      <Nav session={session} />
      <StudentDashboard session={session}/>
      <Footer />
    </main>
  );
}

export default admin;
