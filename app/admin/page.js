'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './admin.module.css';
import { createClient } from '@/lib/supabase-browser';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        posts: 0,
        audio: 0,
        categories: 0,
        drafts: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const supabase = createClient();

            try {
                const [postsRes, audioRes, categoriesRes, draftsRes] = await Promise.all([
                    supabase.from('posts').select('id', { count: 'exact' }),
                    supabase.from('audio').select('id', { count: 'exact' }),
                    supabase.from('categories').select('id', { count: 'exact' }),
                    supabase.from('posts').select('id', { count: 'exact' }).eq('status', 'draft')
                ]);

                setStats({
                    posts: postsRes.count || 0,
                    audio: audioRes.count || 0,
                    categories: categoriesRes.count || 0,
                    drafts: draftsRes.count || 0
                });
            } catch (error) {
                console.log('Stats fetch error - tables may not exist yet');
            }
            setLoading(false);
        };

        fetchStats();
    }, []);

    return (
        <div className={styles.dashboard}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>ড্যাশবোর্ড</h1>
                <p className={styles.pageSubtitle}>স্বাগতম, অ্যাডমিন প্যানেলে</p>
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <h3>{loading ? '...' : stats.posts}</h3>
                    <p>মোট প্রবন্ধ</p>
                </div>
                <div className={styles.statCard}>
                    <h3>{loading ? '...' : stats.audio}</h3>
                    <p>মোট অডিও</p>
                </div>
                <div className={styles.statCard}>
                    <h3>{loading ? '...' : stats.categories}</h3>
                    <p>বিভাগসমূহ</p>
                </div>
                <div className={styles.statCard}>
                    <h3>{loading ? '...' : stats.drafts}</h3>
                    <p>ড্রাফট</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.quickActions}>
                <h2>দ্রুত কার্যক্রম</h2>
                <div className={styles.actionButtons}>
                    <Link href="/admin/posts/new" className={styles.actionBtn}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        নতুন প্রবন্ধ
                    </Link>
                    <Link href="/admin/audio/new" className={styles.actionBtn}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        নতুন অডিও
                    </Link>
                    <Link href="/admin/categories" className={`${styles.actionBtn} ${styles.secondary}`}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                        </svg>
                        বিভাগ ব্যবস্থাপনা
                    </Link>
                </div>
            </div>
        </div>
    );
}
