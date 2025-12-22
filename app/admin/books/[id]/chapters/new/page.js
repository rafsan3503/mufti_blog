'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import styles from '../../../../admin.module.css';
import pageStyles from './pageEditor.module.css';
import { PageLoader } from '@/components/Loader';
import { createClient } from '@/lib/supabase-browser';

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
    ssr: false,
    loading: () => <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>এডিটর লোড হচ্ছে...</div>
});

export default function NewChapterPage({ params }) {
    const [book, setBook] = useState(null);
    const [bookId, setBookId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [nextChapterNum, setNextChapterNum] = useState(1);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [pages, setPages] = useState([{ id: 1, content: '' }]); // Array of page objects with unique IDs
    const [formData, setFormData] = useState({
        title: '',
        chapter_number: 1
    });
    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            const { id } = await params;
            setBookId(id);
            await fetchBook(id);
        };
        init();
    }, [params]);

    const fetchBook = async (id) => {
        const supabase = createClient();

        const { data: bookData } = await supabase
            .from('books')
            .select('*')
            .eq('id', id)
            .single();

        if (!bookData) {
            router.push('/admin/books');
            return;
        }
        setBook(bookData);

        const { data: chapters } = await supabase
            .from('chapters')
            .select('chapter_number')
            .eq('book_id', id)
            .order('chapter_number', { ascending: false })
            .limit(1);

        const nextNum = chapters && chapters.length > 0 ? chapters[0].chapter_number + 1 : 1;
        setNextChapterNum(nextNum);
        setFormData(prev => ({ ...prev, chapter_number: nextNum }));
        setLoading(false);
    };

    // Add new page with unique ID
    const addPage = () => {
        const newPage = { id: Date.now(), content: '' };
        setPages([...pages, newPage]);
        setCurrentPageIndex(pages.length);
    };

    // Delete current page
    const deletePage = () => {
        if (pages.length <= 1) return;
        const newPages = pages.filter((_, i) => i !== currentPageIndex);
        setPages(newPages);
        setCurrentPageIndex(Math.min(currentPageIndex, newPages.length - 1));
    };

    // Update page content
    const updatePageContent = (content) => {
        const newPages = [...pages];
        newPages[currentPageIndex] = { ...newPages[currentPageIndex], content };
        setPages(newPages);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const supabase = createClient();

        // Join pages with pagebreak marker
        const content = pages.map(p => p.content).join('\n<!-- pagebreak -->\n');

        const { error } = await supabase.from('chapters').insert([{
            ...formData,
            content,
            book_id: bookId
        }]);

        if (error) {
            setSaving(false);
            return;
        }

        router.push(`/admin/books/${bookId}/chapters`);
    };

    if (loading) {
        return <PageLoader message="লোড হচ্ছে..." />;
    }

    return (
        <div className={styles.formPage}>
            <div className={styles.pageHeader}>
                <Link href={`/admin/books/${bookId}/chapters`} style={{ color: '#666', fontSize: '0.85rem', marginBottom: '0.25rem', display: 'block' }}>
                    ← {book?.title} - অধ্যায়সমূহ
                </Link>
                <h1 className={styles.pageTitle}>নতুন অধ্যায়</h1>
                <p className={styles.pageSubtitle}>অধ্যায় #{nextChapterNum}</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.formCard}>
                <div className={styles.formGrid}>
                    {/* Chapter Number & Title */}
                    <div className={styles.formRow}>
                        <div className={styles.formGroup} style={{ maxWidth: '120px' }}>
                            <label className={styles.label}>অধ্যায় #</label>
                            <input
                                type="number"
                                value={formData.chapter_number}
                                onChange={(e) => setFormData({ ...formData, chapter_number: parseInt(e.target.value) })}
                                className={styles.input}
                                min="1"
                                required
                            />
                        </div>
                        <div className={styles.formGroup} style={{ flex: 1 }}>
                            <label className={styles.label}>
                                শিরোনাম <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="অধ্যায়ের শিরোনাম"
                                className={styles.input}
                                required
                            />
                        </div>
                    </div>

                    {/* Page Navigation */}
                    <div className={pageStyles.pageNav}>
                        <div className={pageStyles.pageInfo}>
                            <span className={pageStyles.pageLabel}>পৃষ্ঠা</span>
                            <div className={pageStyles.pageTabs}>
                                {pages.map((_, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className={`${pageStyles.pageTab} ${currentPageIndex === index ? pageStyles.active : ''}`}
                                        onClick={() => setCurrentPageIndex(index)}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className={pageStyles.pageActions}>
                            <button type="button" onClick={addPage} className={pageStyles.addPageBtn}>
                                + নতুন পৃষ্ঠা
                            </button>
                            {pages.length > 1 && (
                                <button type="button" onClick={deletePage} className={pageStyles.deletePageBtn}>
                                    এই পৃষ্ঠা মুছুন
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Content Editor for Current Page */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            পৃষ্ঠা {currentPageIndex + 1} এর বিষয়বস্তু
                        </label>
                        <RichTextEditor
                            key={`page-${pages[currentPageIndex]?.id}`}
                            content={pages[currentPageIndex]?.content || ''}
                            onChange={updatePageContent}
                        />
                    </div>

                    <div className={pageStyles.pageHint}>
                        💡 প্রতিটি পৃষ্ঠা আলাদাভাবে দেখানো হবে। পাঠক একটি পৃষ্ঠা পড়ে পরের পৃষ্ঠায় যাবে।
                    </div>
                </div>

                <div className={styles.formActions}>
                    <button type="submit" className={styles.submitBtn} disabled={saving}>
                        {saving ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
                    </button>
                    <button
                        type="button"
                        className={styles.cancelBtn}
                        onClick={() => router.push(`/admin/books/${bookId}/chapters`)}
                    >
                        বাতিল
                    </button>
                </div>
            </form>
        </div>
    );
}
