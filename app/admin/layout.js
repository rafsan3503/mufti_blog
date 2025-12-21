'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './admin.module.css';
import { createClient } from '@/lib/supabase-browser';

export default function AdminLayout({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkAuth = () => {
            const auth = localStorage.getItem('admin_authenticated');
            if (auth === 'true') {
                setIsAuthenticated(true);
            } else if (pathname !== '/admin/login') {
                router.push('/admin/login');
            }
            setLoading(false);
        };
        checkAuth();
    }, [pathname, router]);

    // Close menu on route change
    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem('admin_authenticated');
        router.push('/admin/login');
    };

    // Show login page without layout
    if (pathname === '/admin/login') {
        return children;
    }

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>লোড হচ্ছে...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className={styles.adminLayout}>
            {/* Mobile Header */}
            <header className={styles.mobileHeader}>
                <button
                    className={styles.menuToggle}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <h1 className={styles.mobileTitle}>অ্যাডমিন</h1>
            </header>

            {/* Overlay */}
            {menuOpen && (
                <div
                    className={styles.overlay}
                    onClick={() => setMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.sidebarHeader}>
                    <h2 className={styles.sidebarLogo}>অ্যাডমিন</h2>
                    <button
                        className={styles.closeSidebar}
                        onClick={() => setMenuOpen(false)}
                    >
                        ✕
                    </button>
                </div>
                <nav className={styles.sidebarNav}>
                    <Link
                        href="/admin"
                        className={`${styles.navItem} ${pathname === '/admin' ? styles.active : ''}`}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="9"></rect>
                            <rect x="14" y="3" width="7" height="5"></rect>
                            <rect x="14" y="12" width="7" height="9"></rect>
                            <rect x="3" y="16" width="7" height="5"></rect>
                        </svg>
                        ড্যাশবোর্ড
                    </Link>
                    <Link
                        href="/admin/posts"
                        className={`${styles.navItem} ${pathname.startsWith('/admin/posts') ? styles.active : ''}`}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                        </svg>
                        প্রবন্ধ
                    </Link>
                    <Link
                        href="/admin/audio"
                        className={`${styles.navItem} ${pathname.startsWith('/admin/audio') ? styles.active : ''}`}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 18V5l12-2v13"></path>
                            <circle cx="6" cy="18" r="3"></circle>
                            <circle cx="18" cy="16" r="3"></circle>
                        </svg>
                        অডিও
                    </Link>
                    <Link
                        href="/admin/categories"
                        className={`${styles.navItem} ${pathname === '/admin/categories' ? styles.active : ''}`}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                        </svg>
                        বিভাগসমূহ
                    </Link>
                </nav>
                <div className={styles.sidebarFooter}>
                    <Link href="/" className={styles.viewSite}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                        সাইট দেখুন
                    </Link>
                    <button onClick={handleLogout} className={styles.logout}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        লগআউট
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
}
