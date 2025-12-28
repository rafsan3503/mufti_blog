'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';

export default function ViewTracker({ type, id }) {
    useEffect(() => {
        const trackView = async () => {
            // Check if user has already viewed this item
            const storageKey = `viewed_${type}_${id}`;
            const hasViewed = localStorage.getItem(storageKey);

            if (hasViewed) {
                // User already viewed this, don't count again
                return;
            }

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
            const { error } = await supabase
                .from(table)
                .update({ view_count: currentCount + 1 })
                .eq('id', id);

            if (!error) {
                // Mark as viewed in localStorage (expires concept not needed for simple tracking)
                localStorage.setItem(storageKey, 'true');
            }
        };

        if (id) {
            trackView();
        }
    }, [type, id]);

    return null; // This component doesn't render anything
}
