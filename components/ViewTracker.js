'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';

export default function ViewTracker({ type, id }) {
    useEffect(() => {
        const trackView = async () => {
            const supabase = createClient();
            const table = type === 'book' ? 'books' : 'posts';

            // Get current count
            const { data } = await supabase
                .from(table)
                .select('view_count')
                .eq('id', id)
                .single();

            const currentCount = data?.view_count || 0;

            // Increment
            await supabase
                .from(table)
                .update({ view_count: currentCount + 1 })
                .eq('id', id);
        };

        if (id) {
            trackView();
        }
    }, [type, id]);

    return null; // This component doesn't render anything
}
