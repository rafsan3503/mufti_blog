import styles from './Hero.module.css';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.heroBg}>
                <div className={styles.pattern}></div>
                <div className={styles.overlay}></div>
            </div>
            <div className={`container ${styles.heroContent}`}>
                <div className={styles.arabicVerse}>
                    <span>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
                </div>
                <p className={styles.authorLabel}>মুফতি আনিসুর রহমান</p>
                <h1 className={styles.title}>
                    ইসলামী জ্ঞান ও দাওয়াহ
                </h1>
                <p className={styles.subtitle}>
                    কুরআন ও সুন্নাহর আলোকে জীবন গঠনের পথনির্দেশ
                </p>
                <div className={styles.actions}>
                    <Link href="/posts" className="btn btn-accent">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        </svg>
                        প্রবন্ধ পড়ুন
                    </Link>
                    <Link href="/audio" className="btn btn-outline" style={{ borderColor: 'white', color: 'white' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                        অডিও শুনুন
                    </Link>
                </div>
                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>১২০+</span>
                        <span className={styles.statLabel}>প্রবন্ধ</span>
                    </div>
                    <div className={styles.statDivider}></div>
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>৫০+</span>
                        <span className={styles.statLabel}>অডিও</span>
                    </div>
                    <div className={styles.statDivider}></div>
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>১০</span>
                        <span className={styles.statLabel}>বিভাগ</span>
                    </div>
                </div>
            </div>
            <div className={styles.scrollIndicator}>
                <span>নিচে স্ক্রল করুন</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M19 12l-7 7-7-7"></path>
                </svg>
            </div>
        </section>
    );
}
