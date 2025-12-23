'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { ContentLoader } from '@/components/Loader';
import styles from './reader.module.css';
import { createClient } from '@/lib/supabase-browser';

// Available fonts
const fonts = [
    { id: 'default', name: 'ডিফল্ট', family: 'inherit' },
    { id: 'noto', name: 'Noto Serif', family: '"Noto Serif Bengali", serif' },
    { id: 'hind', name: 'Hind Siliguri', family: '"Hind Siliguri", sans-serif' }
];

// Themes with better contrast
const themes = [
    { id: 'light', name: 'লাইট', bg: '#ffffff', text: '#222222', secondary: '#666666' },
    { id: 'sepia', name: 'সেপিয়া', bg: '#f4ecd8', text: '#5b4636', secondary: '#7a6451' },
    { id: 'dark', name: 'ডার্ক', bg: '#1a1a2e', text: '#f0f0f0', secondary: '#b0b0b0' }
];

export default function ChapterReaderPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const [chapter, setChapter] = useState(null);
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showToc, setShowToc] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [chapters, setChapters] = useState([]);

    // Pages within chapter
    const [pages, setPages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    // User preferences
    const [fontSize, setFontSize] = useState('medium');
    const [fontFamily, setFontFamily] = useState('default');
    const [theme, setTheme] = useState('light');

    // Load preferences
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setFontSize(localStorage.getItem('reader-font-size') || 'medium');
            setFontFamily(localStorage.getItem('reader-font-family') || 'default');
            setTheme(localStorage.getItem('reader-theme') || 'light');
        }
    }, []);

    const updateFontSize = (size) => {
        setFontSize(size);
        localStorage.setItem('reader-font-size', size);
    };

    const updateFontFamily = (family) => {
        setFontFamily(family);
        localStorage.setItem('reader-font-family', family);
    };

    const updateTheme = (t) => {
        setTheme(t);
        localStorage.setItem('reader-theme', t);
    };

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient();

            const { data: bookData } = await supabase
                .from('books')
                .select('*')
                .eq('slug', params.slug)
                .single();

            if (!bookData) {
                setLoading(false);
                return;
            }
            setBook(bookData);

            const { data: chaptersData } = await supabase
                .from('chapters')
                .select('id, title, chapter_number')
                .eq('book_id', bookData.id)
                .order('chapter_number', { ascending: true });

            setChapters(chaptersData || []);

            const { data: chapterData } = await supabase
                .from('chapters')
                .select('*')
                .eq('book_id', bookData.id)
                .eq('chapter_number', parseInt(params.num))
                .single();

            if (chapterData) {
                setChapter(chapterData);

                // Parse pages
                let parsedPages = [''];
                if (chapterData.content) {
                    parsedPages = chapterData.content.split('<!-- pagebreak -->').map(p => p.trim()).filter(p => p);
                    if (parsedPages.length === 0) parsedPages = [chapterData.content];
                }
                setPages(parsedPages);

                // Set initial page from URL or localStorage
                const pageParam = searchParams.get('page');
                if (pageParam) {
                    setCurrentPage(Math.min(parseInt(pageParam), parsedPages.length));
                } else {
                    const savedPage = localStorage.getItem(`book-${bookData.id}-ch${params.num}-page`);
                    if (savedPage) {
                        setCurrentPage(Math.min(parseInt(savedPage), parsedPages.length));
                    }
                }

                localStorage.setItem(`book-${bookData.id}-progress`, JSON.stringify({
                    chapter: parseInt(params.num),
                    page: currentPage
                }));
            }

            setLoading(false);
        };

        fetchData();
    }, [params.slug, params.num, searchParams]);

    // Save page progress
    useEffect(() => {
        if (book && chapter) {
            localStorage.setItem(`book-${book.id}-ch${params.num}-page`, currentPage.toString());
        }
    }, [currentPage, book, chapter, params.num]);

    // Navigation functions
    const goToNextPage = () => {
        if (currentPage < pages.length) {
            setCurrentPage(currentPage + 1);
        } else if (chapter && chapter.chapter_number < chapters.length) {
            window.location.href = `/books/${params.slug}/chapter/${chapter.chapter_number + 1}`;
        }
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (chapter && chapter.chapter_number > 1) {
            window.location.href = `/books/${params.slug}/chapter/${chapter.chapter_number - 1}`;
        }
    };

    // Scroll to top on page change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') goToPrevPage();
            if (e.key === 'ArrowRight') goToNextPage();
            if (e.key === 'Escape') {
                setShowToc(false);
                setShowSettings(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentPage, pages.length, chapter, chapters.length]);

    const currentTheme = themes.find(t => t.id === theme) || themes[0];
    const currentFont = fonts.find(f => f.id === fontFamily) || fonts[0];

    // Calculate overall progress
    const totalPagesInBook = chapters.reduce((acc, ch) => acc + 1, 0); // Simple: each chapter = 1 unit
    const currentChapterIndex = chapter ? chapter.chapter_number - 1 : 0;
    const chapterProgress = pages.length > 0 ? (currentPage - 1) / pages.length : 0;
    const overallProgress = ((currentChapterIndex + chapterProgress) / chapters.length) * 100;

    if (loading) {
        return (
            <div className={styles.readerPage} style={{ background: currentTheme.bg }}>
                <ContentLoader />
            </div>
        );
    }

    if (!chapter || !book) {
        return (
            <div className={styles.readerPage}>
                <div className={styles.notFound}>
                    <p>অধ্যায় পাওয়া যায়নি</p>
                    <Link href="/books">বইসমূহে ফিরুন</Link>
                </div>
            </div>
        );
    }

    return (
        <div
            className={styles.readerPage}
            style={{ background: currentTheme.bg, color: currentTheme.text }}
        >
            {/* Header */}
            <header className={styles.header}>
                <Link href="/" className={styles.iconBtn} title="হোমপেজ">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                </Link>

                <button className={styles.iconBtn} onClick={() => setShowToc(!showToc)} title="সূচিপত্র">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>

                <div className={styles.headerCenter}>
                    <Link href={`/books/${book.slug}`} className={styles.bookTitle}>
                        {book.title}
                    </Link>
                    <span className={styles.chapterInfo}>
                        অধ্যায় {chapter.chapter_number} • পৃষ্ঠা {currentPage}/{pages.length}
                    </span>
                </div>

                <button className={styles.iconBtn} onClick={() => setShowSettings(!showSettings)} title="সেটিংস">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                </button>
            </header>

            {/* Progress Bar */}
            <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${overallProgress}%` }}></div>
            </div>

            {/* TOC Sidebar */}
            {showToc && (
                <>
                    <div className={styles.overlay} onClick={() => setShowToc(false)}></div>
                    <aside className={styles.tocSidebar}>
                        <div className={styles.tocHeader}>
                            <h3>সূচিপত্র</h3>
                            <button onClick={() => setShowToc(false)}>✕</button>
                        </div>
                        <div className={styles.tocList}>
                            {chapters.map((ch) => (
                                <Link
                                    key={ch.id}
                                    href={`/books/${book.slug}/chapter/${ch.chapter_number}`}
                                    className={`${styles.tocItem} ${ch.chapter_number === chapter.chapter_number ? styles.active : ''}`}
                                    onClick={() => setShowToc(false)}
                                >
                                    <span className={styles.tocNum}>{ch.chapter_number}</span>
                                    <span>{ch.title}</span>
                                </Link>
                            ))}
                        </div>
                    </aside>
                </>
            )}

            {/* Settings Panel */}
            {showSettings && (
                <>
                    <div className={styles.overlay} onClick={() => setShowSettings(false)}></div>
                    <div className={styles.settingsPanel}>
                        <div className={styles.settingsHeader}>
                            <h3>পড়ার সেটিংস</h3>
                            <button onClick={() => setShowSettings(false)}>✕</button>
                        </div>

                        <div className={styles.settingGroup}>
                            <label>ফন্ট সাইজ</label>
                            <div className={styles.buttonGroup}>
                                {['small', 'medium', 'large'].map((size) => (
                                    <button
                                        key={size}
                                        className={fontSize === size ? styles.active : ''}
                                        onClick={() => updateFontSize(size)}
                                    >
                                        {size === 'small' ? 'ছোট' : size === 'medium' ? 'মাঝারি' : 'বড়'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.settingGroup}>
                            <label>ফন্ট</label>
                            <div className={styles.fontList}>
                                {fonts.map((f) => (
                                    <button
                                        key={f.id}
                                        className={fontFamily === f.id ? styles.active : ''}
                                        onClick={() => updateFontFamily(f.id)}
                                        style={{ fontFamily: f.family }}
                                    >
                                        {f.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.settingGroup}>
                            <label>থিম</label>
                            <div className={styles.themeList}>
                                {themes.map((t) => (
                                    <button
                                        key={t.id}
                                        className={`${styles.themeBtn} ${theme === t.id ? styles.active : ''}`}
                                        onClick={() => updateTheme(t.id)}
                                        style={{ background: t.bg, color: t.text }}
                                    >
                                        {t.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Content */}
            <article
                className={`${styles.content} ${styles[fontSize]}`}
                style={{
                    fontFamily: currentFont.family,
                    color: currentTheme.text
                }}
            >
                {currentPage === 1 && (
                    <h1 className={styles.chapterTitle} style={{ color: currentTheme.text }}>{chapter.title}</h1>
                )}
                <div
                    className={styles.chapterContent}
                    style={{ color: currentTheme.text }}
                    dangerouslySetInnerHTML={{ __html: pages[currentPage - 1] || '' }}
                />
            </article>

            {/* Navigation */}
            <nav className={styles.navigation}>
                <button
                    onClick={goToPrevPage}
                    className={styles.navBtn}
                    disabled={currentPage === 1 && chapter.chapter_number === 1}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6"></path>
                    </svg>
                    পূর্ববর্তী
                </button>

                <div className={styles.pageIndicator}>
                    <span className={styles.pageNum}>{currentPage} / {pages.length}</span>
                    <span className={styles.chapterNum}>অধ্যায় {chapter.chapter_number}/{chapters.length}</span>
                </div>

                <button
                    onClick={goToNextPage}
                    className={styles.navBtn}
                >
                    {currentPage < pages.length ? 'পরবর্তী' : chapter.chapter_number < chapters.length ? 'পরের অধ্যায়' : 'সমাপ্ত'}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6"></path>
                    </svg>
                </button>
            </nav>
        </div>
    );
}
