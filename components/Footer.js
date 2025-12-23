import styles from './Footer.module.css';
import Link from 'next/link';
import SocialLinks from './SocialLinks';

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
                                <span className={styles.logoBangla}>মুফতি আনিছুর রহমান</span>
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
                                <li><Link href="/posts">ব্লগসমূহ</Link></li>
                                <li><Link href="/books">বইসমূহ</Link></li>
                                <li><Link href="/audio">অডিও</Link></li>
                                <li><Link href="/categories">বিভাগসমূহ</Link></li>
                            </ul>
                        </div>

                        {/* Resources - removed static categories */}
                        <div className={styles.footerSection}>
                            <h4 className={styles.footerTitle}>রিসোর্স</h4>
                            <ul className={styles.footerLinks}>
                                <li><Link href="/books">বইসমূহ</Link></li>
                                <li><Link href="/audio">অডিও লেকচার</Link></li>
                                <li><Link href="/categories">সব বিভাগ</Link></li>
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
                                    <span>contact@muftianisurrahman.site</span>
                                </div>
                                <div className={styles.contactItem}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                    <span>বাংলাদেশ</span>
                                </div>
                            </div>
                            <SocialLinks />
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.footerBottom}>
                <div className="container">
                    <p>© ২০২৫-২০২৬ মুফতি আনিছুর রহমান। সর্বস্বত্ব সংরক্ষিত।</p>
                </div>
            </div>
        </footer>
    );
}
