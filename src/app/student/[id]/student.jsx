"use client";
import { useEffect, useRef, useState } from "react";

import Nav from "@/app/components/Navbar/page";
import Footer from "@/app/components/Footer/page";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import StudentDashboard from "@/app/components/StudentDashboard/page";


function student() {
  const { data: session, status } = useSession();
  const lastRequestTime = useRef(0);
  if (!session?.user?.role === "student" && status === "unauthenticated")
    redirect("/login");
  if (session?.user?.role === "teacher")
    return redirect(`/teacher/${session?.id}`);
  if (session?.user?.role === "teacher" && session?.user?.isAdmin)
    return redirect(`/teacher/admin/${session?.id}`);
  if (session?.user?.role === "student" && session?.user?.isAdmin)
    return redirect(`/student/admin/${session?.id}`);
  if (!session && status === "unauthenticated") return redirect("/login");
  if (status === "loading") return null;
  Swal.close();

  return (
    <main>
      <Nav session={session} />
      <StudentDashboard session={session} />
      <Footer />
    </main>
  );
}

export default student;
