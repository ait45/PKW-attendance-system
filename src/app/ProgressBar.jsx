"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css"

NProgress.configure({ showSpinner: false, speed: 400 });

export default function ProgressBar() {
    const pathName = usePathname();

    useEffect(() => {
        NProgress.start();
        NProgress.done();
    }, [pathName]);

    return null;
}