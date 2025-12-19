"use client";

import NextTopLoader from 'nextjs-toploader';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';

export default function ProgressBar() {

    const { status } = useSession();
    const { theme } = useTheme();

    const color = status === "loading" ? "#f59e0b" : theme === "dark" ? "#22c55e" : "#3b82f6";
    return (
    <NextTopLoader 
        showSpinner={false} 
        color={color}
        speed={400}
    
    />);
}