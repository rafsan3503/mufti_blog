import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { categories } from '@/data/posts';
import styles from './page.module.css';
import Link from 'next/link';

export const metadata = {
    title: 'বিভাগসমূহ | মুফতি আনিসুর রহমান',
    description: 'বিষয়ভিত্তিক ইসলামী জ্ঞান অন্বেষণ করুন।',
};

export default function CategoriesPage() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                <div className="container">
                    {/* Page Header */}
                    <div className={styles.pageHeader}>
                        <h1 className={styles.pageTitle}>বিভাগসমূহ</h1>
                        <p className={styles.pageSubtitle}>
                            বিষয়ভিত্তিক ইসলামী জ্ঞান অন্বেষণ করুন
                        </p>
                    </div>

                    {/* Categories Grid */}
                    <div className={styles.categoriesGrid}>
                        {categories.map((category, index) => (
                            <Link
                                key={index}
                                href={`/category/${category.slug}`}
                                className={styles.categoryCard}
                            >
                                <div className={styles.categoryIcon}>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                                    </svg>
                                </div>
                                <h3 className={styles.categoryName}>{category.name}</h3>
                                <span className={styles.categoryCount}>{category.count} প্রবন্ধ</span>
                                <p className={styles.categoryDesc}>{category.description}</p>
                                <span className={styles.viewMore}>
                                    দেখুন
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
