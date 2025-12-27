import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import PostCard from '@/components/PostCard';
import RefreshOnMount from '@/components/RefreshOnMount';
import Link from 'next/link';
import { getPosts, getCategories } from '@/lib/data';
import { posts as staticPosts, categories as staticCategories } from '@/data/posts';
import styles from './page.module.css';

export const revalidate = 0; // No cache - always fetch fresh data

export const metadata = {
    title: 'সব ব্লগ | মুফতি আনিছুর রহমান',
    description: 'ইসলামী জ্ঞান ও দাওয়াহ বিষয়ক ব্লগসমূহ'
};

export default async function PostsPage() {
    let posts = await getPosts();
    let categories = await getCategories();

    // Fallback to static data
    if (posts.length === 0) {
        posts = staticPosts;
    }
    if (categories.length === 0) {
        categories = staticCategories;
    }

    return (
        <>
            <RefreshOnMount />
            <Header />
            <main className={styles.main}>
                <div className="container">
                    <div className={styles.pageHeader}>
                        <h1 className={styles.pageTitle}>সব ব্লগ</h1>
                        <p className={styles.pageSubtitle}>ইসলামী জ্ঞান ও জীবনের পথনির্দেশ</p>
                    </div>

                    <div className={styles.contentGrid}>
                        <div className={styles.postsGrid}>
                            {posts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>

                        <Sidebar
                            categories={categories.slice(0, 6)}
                            recentPosts={posts.slice(0, 4).map(p => ({
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
