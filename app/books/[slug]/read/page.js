'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { ContentLoader } from '@/components/Loader';
import styles from '../chapter/[num]/reader.module.css';
import { createClient } from '@/lib/supabase-browser';

// Themes
const themes = [
    { id: 'light', name: 'লাইট', bg: '#ffffff', text: '#222222' },
    { id: 'sepia', name: 'সেপিয়া', bg: '#f4ecd8', text: '#5b4636' },
    { id: 'dark', name: 'ডার্ক', bg: '#1a1a2e', text: '#e8e8e8' }
];

const fonts = [
    { id: 'default', name: 'ডিফল্ট', family: 'inherit' },
    { id: 'noto', name: 'Noto Serif', family: '"Noto Serif Bengali", serif' },
    { id: 'hind', name: 'Hind Siliguri', family: '"Hind Siliguri", sans-serif' }
];

export default function BookReadPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [fontSize, setFontSize] = useState('medium');
    const [fontFamily, setFontFamily] = useState('default');
    const [theme, setTheme] = useState('light');

    const section = searchParams.get('section') || 'title';

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setFontSize(localStorage.getItem('reader-font-size') || 'medium');
            setFontFamily(localStorage.getItem('reader-font-family') || 'default');
            setTheme(localStorage.getItem('reader-theme') || 'light');
        }
    }, []);

    useEffect(() => {
        const fetchBook = async () => {
            const supabase = createClient();
            const { data } = await supabase
                .from('books')
                .select('*')
                .eq('slug', params.slug)
                .single();

            if (data) setBook(data);
            setLoading(false);
        };
        fetchBook();
    }, [params.slug]);

    const updateFontSize = (size) => {
        setFontSize(size);
        localStorage.setItem('reader-font-size', size);
    };

    const updateTheme = (t) => {
        setTheme(t);
        localStorage.setItem('reader-theme', t);
    };

    const currentTheme = themes.find(t => t.id === theme) || themes[0];
    const currentFont = fonts.find(f => f.id === fontFamily) || fonts[0];

    // Define sections in order
    const sections = [
        { id: 'title', label: 'শিরোনাম', hasContent: true },
        { id: 'dedication', label: 'উৎসর্গ', hasContent: !!book?.dedication },
        { id: 'publisher-note', label: 'প্রকাশকের কথা', hasContent: !!book?.publisher_note },
        { id: 'preface', label: 'লেখকের ভূমিকা', hasContent: !!book?.author_preface },
        { id: 'toc', label: 'সূচিপত্র', hasContent: true },
        { id: 'chapter1', label: 'অধ্যায় ১', isChapter: true }
    ];

    const currentIndex = sections.findIndex(s => s.id === section);
    const prevSection = sections.slice(0, currentIndex).reverse().find(s => s.hasContent);
    const nextSection = sections.slice(currentIndex + 1).find(s => s.hasContent || s.isChapter);

    if (loading) {
        return (
            <div className={styles.readerPage} style={{ background: currentTheme.bg }}>
                <ContentLoader />
            </div>
        );
    }

    if (!book) {
        return (
            <div className={styles.readerPage}>
                <div className={styles.notFound}>
                    <p>বই পাওয়া যায়নি</p>
                    <Link href="/books">বইসমূহে ফিরুন</Link>
                </div>
            </div>
        );
    }

    // Render content based on section
    const renderContent = () => {
        switch (section) {
            case 'title':
                return (
                    <div className={styles.titlePage}>
                        <h1 className={styles.bookTitle}>{book.title}</h1>
                        {book.subtitle && <p className={styles.bookSubtitle}>{book.subtitle}</p>}
                        <p className={styles.bookAuthor}>{book.author || 'মুফতি আনিছুর রহমান'}</p>
                        {book.publisher && <p className={styles.bookPublisher}>{book.publisher}</p>}
                    </div>
                );

            case 'dedication':
                return (
                    <div className={styles.dedicationPage}>
                        <h2>উৎসর্গ</h2>
                        <div className={styles.dedicationContent}>{book.dedication}</div>
                    </div>
                );

            case 'publisher-note':
                return (
                    <div className={styles.sectionPage}>
                        <h2>প্রকাশকের কথা</h2>
                        <div dangerouslySetInnerHTML={{ __html: book.publisher_note }} />
                    </div>
                );

            case 'preface':
                return (
                    <div className={styles.sectionPage}>
                        <h2>লেখকের ভূমিকা</h2>
                        <div dangerouslySetInnerHTML={{ __html: book.author_preface }} />
                    </div>
                );

            case 'toc':
                return (
                    <div className={styles.tocPage}>
                        <h2>সূচিপত্র</h2>
                        <p style={{ opacity: 0.7, marginBottom: '1.5rem' }}>
                            এই বইয়ের অধ্যায়সমূহ পড়তে নিচের লিংকে ক্লিক করুন।
                        </p>
                        <Link href={`/books/${book.slug}`} className={styles.tocLink}>
                            → সূচিপত্র দেখুন
                        </Link>
                    </div>
                );

            case 'conclusion':
                return (
                    <div className={styles.sectionPage}>
                        <h2>উপসংহার</h2>
                        <div dangerouslySetInnerHTML={{ __html: book.conclusion }} />
                    </div>
                );

            case 'qa':
                return (
                    <div className={styles.sectionPage}>
                        <h2>প্রশ্ন-উত্তর</h2>
                        <div dangerouslySetInnerHTML={{ __html: book.qa_content }} />
                    </div>
                );

            default:
                return <p>এই সেকশন পাওয়া যায়নি।</p>;
        }
    };

    return (
        <div className={styles.readerPage} style={{ background: currentTheme.bg, color: currentTheme.text }}>
            {/* Header */}
            <header className={styles.header}>
                <Link href={`/books/${book.slug}`} className={styles.iconBtn} title="বইয়ে ফিরুন">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"></path>
                    </svg>
                </Link>

                <div className={styles.headerCenter}>
                    <span className={styles.bookTitle}>{book.title}</span>
                    <span className={styles.chapterInfo}>{sections.find(s => s.id === section)?.label}</span>
                </div>

                <button className={styles.iconBtn} onClick={() => setShowSettings(!showSettings)} title="সেটিংস">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                </button>
            </header>

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
                                    <button key={size} className={fontSize === size ? styles.active : ''} onClick={() => updateFontSize(size)}>
                                        {size === 'small' ? 'ছোট' : size === 'medium' ? 'মাঝারি' : 'বড়'}
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
            <article className={`${styles.content} ${styles[fontSize]} ${styles.frontMatter}`} style={{ fontFamily: currentFont.family }}>
                {renderContent()}
            </article>

            {/* Navigation */}
            <nav className={styles.navigation}>
                {prevSection ? (
                    <Link href={`/books/${book.slug}/read?section=${prevSection.id}`} className={styles.navBtn}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 18l-6-6 6-6"></path>
                        </svg>
                        {prevSection.label}
                    </Link>
                ) : <div></div>}

                <div className={styles.pageIndicator}>
                    <span className={styles.pageNum}>{sections.find(s => s.id === section)?.label}</span>
                </div>

                {nextSection?.isChapter ? (
                    <Link href={`/books/${book.slug}/chapter/1`} className={styles.navBtn}>
                        অধ্যায় ১ শুরু
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 18l6-6-6-6"></path>
                        </svg>
                    </Link>
                ) : nextSection ? (
                    <Link href={`/books/${book.slug}/read?section=${nextSection.id}`} className={styles.navBtn}>
                        {nextSection.label}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 18l6-6-6-6"></path>
                        </svg>
                    </Link>
                ) : <div></div>}
            </nav>
        </div>
    );
}
