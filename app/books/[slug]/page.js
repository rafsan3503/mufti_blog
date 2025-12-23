import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ViewTracker from '@/components/ViewTracker';
import { getBookBySlug } from '@/lib/data';
import { notFound } from 'next/navigation';
import styles from './book.module.css';

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const book = await getBookBySlug(slug);

    return {
        title: book ? `${book.title} | মুফতি আনিছুর রহমান` : 'বই পাওয়া যায়নি',
        description: book?.description || ''
    };
}

export const revalidate = 60;

export default async function BookDetailPage({ params }) {
    const { slug } = await params;
    const book = await getBookBySlug(slug);

    if (!book) {
        notFound();
    }

    // Check if front matter exists
    const hasFrontMatter = book.dedication || book.publisherNote || book.authorPreface;
    const hasBackMatter = book.conclusion || book.qaContent;

    return (
        <>
            <Header />
            <ViewTracker type="book" id={book.id} />
            <main className={styles.bookPage}>
                <div className="container">
                    <div className={styles.bookDetail}>
                        {/* Cover */}
                        <div className={styles.coverSection}>
                            <div className={styles.cover}>
                                {book.coverImage ? (
                                    <img src={book.coverImage} alt={book.title} />
                                ) : (
                                    <div className={styles.placeholderCover}>
                                        <span>📖</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Info */}
                        <div className={styles.infoSection}>
                            <h1 className={styles.title}>{book.title}</h1>
                            {book.subtitle && <p className={styles.subtitle}>{book.subtitle}</p>}
                            <p className={styles.author}>লেখক: {book.author}</p>

                            {book.publisher && (
                                <p className={styles.publisher}>প্রকাশনী: {book.publisher}</p>
                            )}

                            {book.description && (
                                <p className={styles.description}>{book.description}</p>
                            )}

                            <div className={styles.meta}>
                                <span>{book.totalChapters} টি অধ্যায়</span>
                                {book.price && <span>মূল্য: {book.price}</span>}
                                {book.viewCount > 0 && (
                                    <span className={styles.viewCount}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                        {book.viewCount} বার দেখা হয়েছে
                                    </span>
                                )}
                            </div>

                            {book.chapters.length > 0 && (
                                <Link
                                    href={`/books/${book.slug}/chapter/1`}
                                    className={styles.readBtn}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                    </svg>
                                    পড়া শুরু করুন
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Table of Contents */}
                    <div className={styles.tocSection}>
                        <h2 className={styles.tocTitle}>📑 সূচিপত্র</h2>
                        <div className={styles.tocList}>
                            {/* Front Matter */}
                            {hasFrontMatter && (
                                <div className={styles.tocGroup}>
                                    <h4 className={styles.tocGroupTitle}>শুরুর অংশ</h4>
                                    {book.dedication && (
                                        <Link href={`/books/${book.slug}/read?section=dedication`} className={styles.tocItem}>
                                            <span className={styles.chapterTitle}>উৎসর্গ</span>
                                        </Link>
                                    )}
                                    {book.publisherNote && (
                                        <Link href={`/books/${book.slug}/read?section=publisher-note`} className={styles.tocItem}>
                                            <span className={styles.chapterTitle}>প্রকাশকের কথা</span>
                                        </Link>
                                    )}
                                    {book.authorPreface && (
                                        <Link href={`/books/${book.slug}/read?section=preface`} className={styles.tocItem}>
                                            <span className={styles.chapterTitle}>লেখকের ভূমিকা</span>
                                        </Link>
                                    )}
                                </div>
                            )}

                            {/* Chapters */}
                            <div className={styles.tocGroup}>
                                <h4 className={styles.tocGroupTitle}>মূল অংশ</h4>
                                {book.chapters.map((chapter) => (
                                    <Link
                                        key={chapter.id}
                                        href={`/books/${book.slug}/chapter/${chapter.chapter_number}`}
                                        className={styles.tocItem}
                                    >
                                        <span className={styles.chapterNum}>{chapter.chapter_number}</span>
                                        <span className={styles.chapterTitle}>{chapter.title}</span>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M9 18l6-6-6-6"></path>
                                        </svg>
                                    </Link>
                                ))}
                            </div>

                            {/* Back Matter */}
                            {hasBackMatter && (
                                <div className={styles.tocGroup}>
                                    <h4 className={styles.tocGroupTitle}>শেষের অংশ</h4>
                                    {book.conclusion && (
                                        <Link href={`/books/${book.slug}/read?section=conclusion`} className={styles.tocItem}>
                                            <span className={styles.chapterTitle}>উপসংহার</span>
                                        </Link>
                                    )}
                                    {book.qaContent && (
                                        <Link href={`/books/${book.slug}/read?section=qa`} className={styles.tocItem}>
                                            <span className={styles.chapterTitle}>প্রশ্ন-উত্তর</span>
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
