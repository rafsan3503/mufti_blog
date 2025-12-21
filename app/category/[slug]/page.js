import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import { getCategoryBySlug, getPostsByCategory, getCategories, getRecentPosts } from '@/lib/data';
import { categories as staticCategories, getPostsByCategory as getStaticPosts } from '@/data/posts';
import styles from './page.module.css';

export const revalidate = 60;

export async function generateMetadata({ params }) {
    const { slug } = await params;
    let category = await getCategoryBySlug(slug);
    if (!category) {
        category = staticCategories.find(c => c.slug === slug);
    }

    return {
        title: category ? `${category.name} | মুফতি আনিছুর রহমান` : 'বিভাগ পাওয়া যায়নি',
        description: category?.description || ''
    };
}

export default async function CategoryPage({ params }) {
    const { slug } = await params;

    let category = await getCategoryBySlug(slug);
    let posts = await getPostsByCategory(slug);
    let categories = await getCategories();
    let recentPosts = await getRecentPosts(4);

    // Fallback to static data
    if (!category) {
        category = staticCategories.find(c => c.slug === slug);
    }
    if (posts.length === 0) {
        posts = getStaticPosts(slug) || [];
    }
    if (categories.length === 0) {
        categories = staticCategories;
    }

    if (!category) {
        return (
            <>
                <Header />
                <main className={styles.main}>
                    <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
                        <h1>বিভাগ পাওয়া যায়নি</h1>
                        <Link href="/categories" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                            সব বিভাগ দেখুন
                        </Link>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className={styles.main}>
                <div className="container">
                    <nav className={styles.breadcrumb}>
                        <Link href="/">হোম</Link>
                        <span>/</span>
                        <Link href="/categories">বিভাগ</Link>
                        <span>/</span>
                        <span>{category.name}</span>
                    </nav>

                    <div className={styles.pageHeader}>
                        <h1 className={styles.pageTitle}>{category.name}</h1>
                        {category.description && (
                            <p className={styles.pageSubtitle}>{category.description}</p>
                        )}
                    </div>

                    <div className={styles.contentGrid}>
                        <div className={styles.postsGrid}>
                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <PostCard key={post.id} post={post} />
                                ))
                            ) : (
                                <p>এই বিভাগে কোন প্রবন্ধ নেই।</p>
                            )}
                        </div>

                        <Sidebar
                            categories={categories.slice(0, 6)}
                            recentPosts={recentPosts.slice(0, 4).map(p => ({
                                title: p.title,
                                slug: p.slug,
                                date: p.date,
                                hasAudio: p.hasAudio
                            }))}
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
