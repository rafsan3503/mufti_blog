import styles from './Sidebar.module.css';
import Link from 'next/link';

export default function Sidebar({ categories, recentPosts }) {
    return (
        <aside className={styles.sidebar}>
            {/* Categories Section */}
            <div className={styles.widget}>
                <h3 className={styles.widgetTitle}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                    বিভাগসমূহ
                </h3>
                <ul className={styles.categoryList}>
                    {categories.map((category, index) => (
                        <li key={index}>
                            <Link href={`/category/${category.slug}`} className={styles.categoryLink}>
                                <span className={styles.categoryName}>{category.name}</span>
                                <span className={styles.categoryCount}>{category.count}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Recent Posts Section */}
            <div className={styles.widget}>
                <h3 className={styles.widgetTitle}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    সাম্প্রতিক ব্লগ
                </h3>
                <div className={styles.recentPosts}>
                    {recentPosts.map((post, index) => (
                        <Link key={index} href={`/posts/${post.slug}`} className={styles.recentPost}>
                            <div className={styles.recentPostIcon}>
                                {post.hasAudio ? (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                                    </svg>
                                ) : (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                    </svg>
                                )}
                            </div>
                            <div className={styles.recentPostInfo}>
                                <h4 className={styles.recentPostTitle}>{post.title}</h4>
                                <span className={styles.recentPostDate}>{post.date}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </aside>
    );
}
