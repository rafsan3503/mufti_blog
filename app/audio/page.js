import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AudioCard from '@/components/AudioCard';
import { audioContent } from '@/data/audio';
import { categories } from '@/data/posts';
import styles from './page.module.css';

export const metadata = {
    title: 'অডিও লাইব্রেরি | মারকাযুল ইমান',
    description: 'ইসলামী বয়ান, তিলাওয়াত এবং লেকচার শুনুন।',
};

export default function AudioPage() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                <div className="container">
                    {/* Page Header */}
                    <div className={styles.pageHeader}>
                        <h1 className={styles.pageTitle}>অডিও লাইব্রেরি</h1>
                        <p className={styles.pageSubtitle}>
                            ইসলামী বয়ান, কুরআন তিলাওয়াত এবং শিক্ষামূলক লেকচার শুনুন
                        </p>
                    </div>

                    {/* Category Filter */}
                    <div className={styles.filters}>
                        <button className={`${styles.filterBtn} ${styles.active}`}>সব</button>
                        {categories.slice(0, 6).map((cat, index) => (
                            <button key={index} className={styles.filterBtn}>
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Audio Grid */}
                    <div className={styles.audioGrid}>
                        {audioContent.map((audio) => (
                            <AudioCard key={audio.id} audio={audio} />
                        ))}
                    </div>

                    {/* Empty State for Future */}
                    {audioContent.length === 0 && (
                        <div className={styles.emptyState}>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                            </svg>
                            <h3>কোন অডিও পাওয়া যায়নি</h3>
                            <p>শীঘ্রই নতুন অডিও যোগ করা হবে।</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
