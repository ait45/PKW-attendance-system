import Link from 'next/link';
import React from 'react';
import type { Route } from 'next';
function Footer() {
    return (
        <footer className="bg-transparen text-center text-[10px] sm:text-xs text-gray-500">
            <p><span className='text-amber-300'>&copy;</span> 2025 PKW SERVICE TH. All rights reserved.</p>
            <Link 
            href={'/issue-report' as Route}
            className='text-[#00CAD1] hover:underline'
            >
                แจ้งปัญหา ?
            </Link>
        </footer>
    )
}

export default Footer