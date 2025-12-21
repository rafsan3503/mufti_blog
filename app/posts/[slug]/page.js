import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { getPostBySlug, getCategories, getRecentPosts, getAllPostSlugs } from '@/lib/data';
import { getPostBySlug as getStaticPost, categories as staticCategories, posts as staticPosts } from '@/data/posts';
import styles from './page.module.css';

export const revalidate = 60;

export async function generateMetadata({ params }) {
    const { slug } = await params;
    let post = await getPostBySlug(slug);
    if (!post) post = getStaticPost(slug);

    return {
        title: post ? `${post.title} | মুফতি আনিছুর রহমান` : 'প্রবন্ধ পাওয়া যায়নি',
        description: post?.excerpt || ''
    };
}

export default async function PostPage({ params }) {
    const { slug } = await params;

    let post = await getPostBySlug(slug);
    let categories = await getCategories();
    let recentPosts = await getRecentPosts(4);

    // Fallback to static data
    if (!post) post = getStaticPost(slug);
    if (categories.length === 0) categories = staticCategories;
    if (recentPosts.length === 0) recentPosts = staticPosts.slice(0, 4);

    if (!post) {
        return (
            <>
                <Header />
                <main className={styles.main}>
                    <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
                        <h1>প্রবন্ধ পাওয়া যায়নি</h1>
                        <p>দুঃখিত, এই প্রবন্ধটি খুঁজে পাওয়া যায়নি।</p>
                        <Link href="/posts" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                            সব প্রবন্ধ দেখুন
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
                        <Link href="/posts">প্রবন্ধ</Link>
                        <span>/</span>
                        <span>{post.title}</span>
                    </nav>

                    <div className={styles.contentGrid}>
                        <article className={styles.postContent}>
                            <header className={styles.postHeader}>
                                <div className={styles.postMeta}>
                                    {post.category && (
                                        <Link href={`/category/${post.categorySlug}`} className="tag">
                                            {post.category}
                                        </Link>
                                    )}
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
                                        {post.readTime} মিনিট
                                    </span>
                                </div>
                                <h1 className={styles.postTitle}>{post.title}</h1>
                                {post.excerpt && <p className={styles.postExcerpt}>{post.excerpt}</p>}
                            </header>

                            <div
                                className={styles.postBody}
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />

                            <footer className={styles.postFooter}>
                                {post.tags && post.tags.length > 0 && (
                                    <div className={styles.tags}>
                                        <span className={styles.tagsLabel}>ট্যাগ:</span>
                                        {post.tags.map((tag, i) => (
                                            <span key={i} className="tag tag-outline">{tag}</span>
                                        ))}
                                    </div>
                                )}
                                <div className={styles.share}>
                                    <span className={styles.shareLabel}>শেয়ার:</span>
                                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} target="_blank" rel="noopener" className={styles.shareBtn}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                        </svg>
                                    </a>
                                    <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener" className={styles.shareBtn}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                                        </svg>
                                    </a>
                                </div>
                            </footer>
                        </article>

                        <Sidebar
                            categories={categories.slice(0, 6)}
                            recentPosts={recentPosts.map(p => ({
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
