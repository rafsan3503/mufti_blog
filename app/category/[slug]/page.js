import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import Sidebar from '@/components/Sidebar';
import { posts, categories, getPostsByCategory, getRecentPosts } from '@/data/posts';
import { notFound } from 'next/navigation';
import styles from './page.module.css';

export async function generateStaticParams() {
    return categories.map((category) => ({
        slug: category.slug,
    }));
}

export async function generateMetadata({ params }) {
    const category = categories.find(c => c.slug === params.slug);
    if (!category) return { title: 'Category Not Found' };

    return {
        title: `${category.name} | মুফতি আনিসুর রহমান`,
        description: category.description,
    };
}

export default function CategoryPage({ params }) {
    const category = categories.find(c => c.slug === params.slug);

    if (!category) {
        notFound();
    }

    const categoryPosts = getPostsByCategory(params.slug);
    const sidebarCategories = categories.slice(0, 6);
    const recentPosts = getRecentPosts(4).map(p => ({
        title: p.title,
        slug: p.slug,
        date: p.date,
        hasAudio: p.hasAudio
    }));

    return (
        <>
            <Header />
            <main className={styles.main}>
                <div className="container">
                    {/* Page Header */}
                    <div className={styles.pageHeader}>
                        <div className={styles.breadcrumb}>
                            <a href="/">হোম</a>
                            <span>/</span>
                            <a href="/categories">বিভাগসমূহ</a>
                            <span>/</span>
                            <span>{category.name}</span>
                        </div>
                        <h1 className={styles.pageTitle}>{category.name}</h1>
                        <p className={styles.pageSubtitle}>{category.description}</p>
                        <span className={styles.postCount}>{categoryPosts.length} টি প্রবন্ধ</span>
                    </div>

                    <div className={styles.contentGrid}>
                        {/* Posts Grid */}
                        <div className={styles.postsContainer}>
                            {categoryPosts.length > 0 ? (
                                <div className={styles.postsGrid}>
                                    {categoryPosts.map((post) => (
                                        <PostCard key={post.id} post={post} />
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.emptyState}>
                                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                    </svg>
                                    <h3>কোন প্রবন্ধ পাওয়া যায়নি</h3>
                                    <p>এই বিভাগে শীঘ্রই নতুন প্রবন্ধ যোগ করা হবে।</p>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <Sidebar categories={sidebarCategories} recentPosts={recentPosts} />
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
