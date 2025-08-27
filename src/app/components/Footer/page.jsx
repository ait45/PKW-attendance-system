import Link from 'next/link';
import React from 'react';

function Footer() {
    return (
        <footer className="bg-transparen text-center text-[10px] sm:text-xs text-gray-500">
            <p><span className='text-amber-300'>&copy;</span> 2025 PKW SERVICE TH. All rights reserved.</p>
            <Link 
            href='/report'
            className='text-[#00CAD1]'
            >
                แจ้งปัญหา ?
            </Link>
        </footer>
    )
}

export default Footer