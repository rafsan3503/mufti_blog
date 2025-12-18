import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import Sidebar from '@/components/Sidebar';
import { posts, categories, getRecentPosts } from '@/data/posts';
import styles from './page.module.css';

export const metadata = {
    title: 'সকল প্রবন্ধ | মুফতি আনিসুর রহমান',
    description: 'ইসলামী জ্ঞান ও দাওয়াহ সম্পর্কিত প্রবন্ধসমূহ পড়ুন।',
};

export default function PostsPage() {
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
                        <h1 className={styles.pageTitle}>প্রবন্ধসমূহ</h1>
                        <p className={styles.pageSubtitle}>
                            ইসলামী জ্ঞান ও জীবনের পথনির্দেশ
                        </p>
                    </div>

                    <div className={styles.contentGrid}>
                        {/* Posts Grid */}
                        <div className={styles.postsGrid}>
                            {posts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
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
