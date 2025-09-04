'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { ToasterProvider } from '@/components/ToastProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Cursor from "@/components/Cursor";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 'm') {
                router.push('/dashboard');
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    const hideLayout = pathname.startsWith('/dashboard') || pathname === '/otp';

    return (
        <ToasterProvider>
            <Cursor />
            {!hideLayout && <Navbar />}
            {children}
            {!hideLayout && <Footer />}
        </ToasterProvider>
    );
}
