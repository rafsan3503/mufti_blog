import styles from './Footer.module.css';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerTop}>
                <div className="container">
                    <div className={styles.footerGrid}>
                        {/* About Section */}
                        <div className={styles.footerSection}>
                            <div className={styles.footerLogo}>
                                <span className={styles.logoArabic}>مفتی انیس الرحمٰن</span>
                                <span className={styles.logoBangla}>মুফতি আনিসুর রহমান</span>
                            </div>
                            <p className={styles.footerAbout}>
                                কুরআন ও সুন্নাহর আলোকে ইসলামী জ্ঞান ও দাওয়াহ প্রচারে নিবেদিত। বাংলাদেশে ইসলামী শিক্ষার প্রসারে কাজ করছি।
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div className={styles.footerSection}>
                            <h4 className={styles.footerTitle}>দ্রুত লিংক</h4>
                            <ul className={styles.footerLinks}>
                                <li><Link href="/">হোম</Link></li>
                                <li><Link href="/posts">প্রবন্ধসমূহ</Link></li>
                                <li><Link href="/audio">অডিও</Link></li>
                                <li><Link href="/categories">বিভাগসমূহ</Link></li>
                            </ul>
                        </div>

                        {/* Categories */}
                        <div className={styles.footerSection}>
                            <h4 className={styles.footerTitle}>জনপ্রিয় বিভাগ</h4>
                            <ul className={styles.footerLinks}>
                                <li><Link href="/category/tafsir">তাফসীর</Link></li>
                                <li><Link href="/category/hadith">হাদীস</Link></li>
                                <li><Link href="/category/fiqh">ফিকহ</Link></li>
                                <li><Link href="/category/aqeedah">আকীদাহ</Link></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className={styles.footerSection}>
                            <h4 className={styles.footerTitle}>যোগাযোগ</h4>
                            <div className={styles.contactInfo}>
                                <div className={styles.contactItem}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                        <polyline points="22,6 12,13 2,6"></polyline>
                                    </svg>
                                    <span>contact@mufti-anis.com</span>
                                </div>
                                <div className={styles.contactItem}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                    <span>বাংলাদেশ</span>
                                </div>
                            </div>
                            <div className={styles.socialLinks}>
                                <a href="#" className={styles.socialLink} aria-label="Facebook">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                    </svg>
                                </a>
                                <a href="#" className={styles.socialLink} aria-label="YouTube">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                                        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.footerBottom}>
                <div className="container">
                    <p>© ২০২৪ মুফতি আনিসুর রহমান। সর্বস্বত্ব সংরক্ষিত।</p>
                </div>
            </div>
        </footer>
    );
}
