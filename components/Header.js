'use client';

import { useState } from 'react';
import styles from './Header.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    const isActive = (path) => {
        if (path === '/') return pathname === '/';
        return pathname.startsWith(path);
    };

    return (
        <header className={styles.header}>
            <div className={styles.headerBg}>
                <div className={styles.mosqueSilhouette}></div>
                <div className={styles.pattern}></div>
            </div>
            <div className={`container ${styles.headerContent}`}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoArabic}>مفتی انیس الرحمٰن</span>
                    <span className={styles.logoBangla}>মুফতি আনিছুর রহমান</span>
                </Link>
                <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
                    <Link
                        href="/"
                        className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
                        onClick={() => setMenuOpen(false)}
                    >
                        হোম
                    </Link>
                    <Link
                        href="/posts"
                        className={`${styles.navLink} ${isActive('/posts') ? styles.active : ''}`}
                        onClick={() => setMenuOpen(false)}
                    >
                        প্রবন্ধ
                    </Link>
                    <Link
                        href="/books"
                        className={`${styles.navLink} ${isActive('/books') ? styles.active : ''}`}
                        onClick={() => setMenuOpen(false)}
                    >
                        বইসমূহ
                    </Link>
                    <Link
                        href="/audio"
                        className={`${styles.navLink} ${isActive('/audio') ? styles.active : ''}`}
                        onClick={() => setMenuOpen(false)}
                    >
                        অডিও
                    </Link>
                    <Link
                        href="/categories"
                        className={`${styles.navLink} ${isActive('/categories') ? styles.active : ''}`}
                        onClick={() => setMenuOpen(false)}
                    >
                        বিভাগসমূহ
                    </Link>
                </nav>
                <button
                    className={`${styles.menuBtn} ${menuOpen ? styles.menuOpen : ''}`}
                    aria-label="Menu"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </header>
    );
}
