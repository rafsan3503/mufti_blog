'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RefreshOnMount() {
    const router = useRouter();

    useEffect(() => {
        // Refresh on initial mount
        router.refresh();

        // Refresh when navigating back (popstate event)
        const handlePopState = () => {
            router.refresh();
        };

        // Refresh when window regains focus (returning from another tab/page)
        const handleFocus = () => {
            router.refresh();
        };

        window.addEventListener('popstate', handlePopState);
        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('popstate', handlePopState);
            window.removeEventListener('focus', handleFocus);
        };
    }, [router]);

    return null;
}
