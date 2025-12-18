import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import { posts, categories, getPostBySlug, getRecentPosts } from '@/data/posts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

export async function generateStaticParams() {
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) return { title: 'Post Not Found' };

    return {
        title: `${post.title} | মুফতি আনিসুর রহমান`,
        description: post.excerpt,
    };
}

export default async function PostPage({ params }) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

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
                <article className={styles.article}>
                    <div className="container">
                        <div className={styles.breadcrumb}>
                            <Link href="/">হোম</Link>
                            <span>/</span>
                            <Link href="/posts">প্রবন্ধ</Link>
                            <span>/</span>
                            <span>{post.category}</span>
                        </div>

                        <div className={styles.contentGrid}>
                            <div className={styles.postContent}>
                                <header className={styles.postHeader}>
                                    <div className={styles.postMeta}>
                                        <Link href={`/category/${post.categorySlug}`} className="tag">
                                            {post.category}
                                        </Link>
                                        <span className={styles.date}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                                <line x1="3" y1="10" x2="21" y2="10"></line>
                                            </svg>
                                            {post.date}
                                        </span>
                                        <span className={styles.readTime}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <polyline points="12 6 12 12 16 14"></polyline>
                                            </svg>
                                            {post.readTime} মিনিট পড়ার সময়
                                        </span>
                                    </div>
                                    <h1 className={styles.postTitle}>{post.title}</h1>
                                    <p className={styles.postExcerpt}>{post.excerpt}</p>
                                </header>

                                {post.hasAudio && (
                                    <div className={styles.audioPlayer}>
                                        <div className={styles.audioIcon}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                                            </svg>
                                        </div>
                                        <div className={styles.audioInfo}>
                                            <span className={styles.audioLabel}>এই প্রবন্ধের অডিও সংস্করণ</span>
                                            <span className={styles.audioNote}>শুনতে প্লে বাটনে ক্লিক করুন</span>
                                        </div>
                                    </div>
                                )}

                                <div
                                    className={styles.postBody}
                                    dangerouslySetInnerHTML={{ __html: post.content }}
                                />

                                <footer className={styles.postFooter}>
                                    <div className={styles.tags}>
                                        <span className={styles.tagsLabel}>ট্যাগসমূহ:</span>
                                        {post.tags.map((tag, index) => (
                                            <span key={index} className="tag tag-gold">{tag}</span>
                                        ))}
                                    </div>
                                    <div className={styles.share}>
                                        <span className={styles.shareLabel}>শেয়ার করুন:</span>
                                        <button className={styles.shareBtn} aria-label="Share on Facebook">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                            </svg>
                                        </button>
                                        <button className={styles.shareBtn} aria-label="Share on Twitter">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                                            </svg>
                                        </button>
                                        <button className={styles.shareBtn} aria-label="Copy Link">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                            </svg>
                                        </button>
                                    </div>
                                </footer>
                            </div>

                            <Sidebar categories={sidebarCategories} recentPosts={recentPosts} />
                        </div>
                    </div>
                </article>
            </main>
            <Footer />
        </>
    );
}
