import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getBooks } from '@/lib/data';
import styles from './books.module.css';

export const metadata = {
    title: 'বইসমূহ | মুফতি আনিছুর রহমান',
    description: 'মুফতি আনিছুর রহমানের সকল বই পড়ুন।'
};

export const revalidate = 60;

export default async function BooksPage() {
    const books = await getBooks();

    return (
        <>
            <Header />
            <main className={styles.booksPage}>
                <div className="container">
                    <div className={styles.pageHeader}>
                        <h1 className={styles.pageTitle}>বইসমূহ</h1>
                        <p className={styles.pageSubtitle}>
                            কুরআন ও সুন্নাহর আলোকে লেখা বইসমূহ
                        </p>
                    </div>

                    {books.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>এখনো কোন বই প্রকাশিত হয়নি।</p>
                        </div>
                    ) : (
                        <div className={styles.booksGrid}>
                            {books.map((book) => (
                                <Link href={`/books/${book.slug}`} key={book.id} className={styles.bookCard}>
                                    <div className={styles.bookCover}>
                                        {book.coverImage ? (
                                            <img src={book.coverImage} alt={book.title} />
                                        ) : (
                                            <div className={styles.placeholderCover}>
                                                <span>📖</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.bookInfo}>
                                        <h3 className={styles.bookTitle}>{book.title}</h3>
                                        <p className={styles.bookAuthor}>{book.author}</p>
                                        {book.description && (
                                            <p className={styles.bookDescription}>{book.description}</p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
