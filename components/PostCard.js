import styles from './PostCard.module.css';
import Link from 'next/link';

export default function PostCard({ post }) {
    return (
        <article className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={styles.category}>
                    <Link href={`/category/${post.categorySlug}`} className="tag">
                        {post.category}
                    </Link>
                </div>
                {post.hasAudio && (
                    <div className={styles.audioIndicator}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                        </svg>
                        <span>অডিও সহ</span>
                    </div>
                )}
            </div>
            <Link href={`/posts/${post.slug}`} className={styles.cardBody}>
                <h3 className={styles.title}>{post.title}</h3>
                <p className={styles.excerpt}>{post.excerpt}</p>
            </Link>
            <div className={styles.cardFooter}>
                <div className={styles.meta}>
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
                <div className={styles.tags}>
                    {post.tags && post.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className={`tag tag-gold ${styles.smallTag}`}>
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </article>
    );
}
