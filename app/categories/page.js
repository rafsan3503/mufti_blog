import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getCategories } from '@/lib/data';
import { categories as staticCategories } from '@/data/posts';
import styles from './page.module.css';

export const revalidate = 60;

export const metadata = {
    title: 'বিভাগসমূহ | মুফতি আনিছুর রহমান',
    description: 'ইসলামী বিষয়ভিত্তিক বিভাগসমূহ'
};

export default async function CategoriesPage() {
    let categories = await getCategories();

    if (categories.length === 0) {
        categories = staticCategories;
    }

    return (
        <>
            <Header />
            <main className={styles.main}>
                <div className="container">
                    <div className={styles.pageHeader}>
                        <h1 className={styles.pageTitle}>বিভাগসমূহ</h1>
                        <p className={styles.pageSubtitle}>বিষয়ভিত্তিক ইসলামী জ্ঞান অন্বেষণ করুন</p>
                    </div>

                    <div className={styles.categoriesGrid}>
                        {categories.map((category, index) => (
                            <Link
                                key={category.id || index}
                                href={`/category/${category.slug}`}
                                className={styles.categoryCard}
                            >
                                <h2 className={styles.categoryName}>{category.name}</h2>
                                <span className={styles.categoryCount}>{category.count} ব্লগ</span>
                                {category.description && (
                                    <p className={styles.categoryDesc}>{category.description}</p>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
