"use client";

import type { Route } from "next";
import Nav from "@/app/components/Navbar";
import Footer from "@/app/components/Footer/page";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import StudentDashboard from "@/app/components/StudentDashboard";

function Student() {
  const { data: session, status } = useSession();

  if (session?.user?.role === "student" && status === "unauthenticated")
    redirect("/login" as Route);
  if (session?.user?.role === "teacher")
    return redirect(`/teacher/${session?.id}` as Route);
  if (session?.user?.role === "teacher" && session?.user?.isAdmin)
    return redirect(`/teacher/admin/${session?.id}` as Route);
  if (session?.user?.role === "student" && session?.user?.isAdmin)
    return redirect(`/student/admin/${session?.id}` as Route);
  if (!session && status === "unauthenticated") return redirect("/login" as Route);
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

export default Student;
