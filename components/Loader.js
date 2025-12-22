'use client';

import styles from './Loader.module.css';

// Full page loader
export function PageLoader({ message = 'লোড হচ্ছে...' }) {
    return (
        <div className={styles.pageLoader}>
            <div className={styles.spinner}></div>
            <p>{message}</p>
        </div>
    );
}

// Inline spinner for buttons and small areas
export function InlineLoader({ size = 'medium' }) {
    return (
        <span className={`${styles.inlineLoader} ${styles[size]}`}></span>
    );
}

// Card skeleton for grids
export function CardSkeleton({ count = 1 }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className={styles.cardSkeleton}>
                    <div className={styles.skeletonImage}></div>
                    <div className={styles.skeletonContent}>
                        <div className={styles.skeletonTitle}></div>
                        <div className={styles.skeletonText}></div>
                        <div className={styles.skeletonText} style={{ width: '60%' }}></div>
                    </div>
                </div>
            ))}
        </>
    );
}

// Book card skeleton
export function BookSkeleton({ count = 1 }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className={styles.bookSkeleton}>
                    <div className={styles.bookCover}></div>
                    <div className={styles.bookInfo}>
                        <div className={styles.skeletonTitle}></div>
                        <div className={styles.skeletonText} style={{ width: '50%' }}></div>
                    </div>
                </div>
            ))}
        </>
    );
}

// Content loader for reading pages
export function ContentLoader() {
    return (
        <div className={styles.contentLoader}>
            <div className={styles.skeletonTitle} style={{ width: '60%', margin: '0 auto 2rem' }}></div>
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={styles.skeletonParagraph}>
                    <div className={styles.skeletonText}></div>
                    <div className={styles.skeletonText}></div>
                    <div className={styles.skeletonText} style={{ width: '80%' }}></div>
                </div>
            ))}
        </div>
    );
}

export default PageLoader;
