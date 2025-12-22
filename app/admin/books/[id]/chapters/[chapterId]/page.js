'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import styles from '../../../../admin.module.css';
import pageStyles from '../new/pageEditor.module.css';
import { PageLoader } from '@/components/Loader';
import { createClient } from '@/lib/supabase-browser';

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
    ssr: false,
    loading: () => <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>এডিটর লোড হচ্ছে...</div>
});

export default function EditChapterPage({ params }) {
    const [book, setBook] = useState(null);
    const [bookId, setBookId] = useState(null);
    const [chapterId, setChapterId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [pages, setPages] = useState([{ id: 1, content: '' }]);
    const [formData, setFormData] = useState({
        title: '',
        chapter_number: 1
    });
    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            const { id, chapterId: cId } = await params;
            setBookId(id);
            setChapterId(cId);
            await fetchData(id, cId);
        };
        init();
    }, [params]);

    const fetchData = async (bookIdParam, chapterIdParam) => {
        const supabase = createClient();

        const { data: bookData } = await supabase
            .from('books')
            .select('*')
            .eq('id', bookIdParam)
            .single();

        if (!bookData) {
            router.push('/admin/books');
            return;
        }
        setBook(bookData);

        const { data: chapterData } = await supabase
            .from('chapters')
            .select('*')
            .eq('id', chapterIdParam)
            .single();

        if (!chapterData) {
            router.push(`/admin/books/${bookIdParam}/chapters`);
            return;
        }

        setFormData({
            title: chapterData.title || '',
            chapter_number: chapterData.chapter_number || 1
        });

        // Parse pages from content with unique IDs
        let parsedPages = [{ id: 1, content: '' }];
        if (chapterData.content) {
            const contentParts = chapterData.content.split('<!-- pagebreak -->').map(p => p.trim()).filter(p => p);
            if (contentParts.length > 0) {
                parsedPages = contentParts.map((content, i) => ({ id: Date.now() + i, content }));
            }
        }
        setPages(parsedPages);
        setLoading(false);
    };

    const addPage = () => {
        const newPage = { id: Date.now(), content: '' };
        setPages([...pages, newPage]);
        setCurrentPageIndex(pages.length);
    };

    const deletePage = () => {
        if (pages.length <= 1) return;
        const newPages = pages.filter((_, i) => i !== currentPageIndex);
        setPages(newPages);
        setCurrentPageIndex(Math.min(currentPageIndex, newPages.length - 1));
    };

    const updatePageContent = (content) => {
        const newPages = [...pages];
        newPages[currentPageIndex] = { ...newPages[currentPageIndex], content };
        setPages(newPages);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const supabase = createClient();
        const content = pages.map(p => p.content).join('\n<!-- pagebreak -->\n');

        const { error } = await supabase
            .from('chapters')
            .update({ ...formData, content })
            .eq('id', chapterId);

        if (error) {
            setSaving(false);
            return;
        }

        router.push(`/admin/books/${bookId}/chapters`);
    };

    if (loading) {
        return <PageLoader message="অধ্যায় লোড হচ্ছে..." />;
    }

    return (
        <div className={styles.formPage}>
            <div className={styles.pageHeader}>
                <Link href={`/admin/books/${bookId}/chapters`} style={{ color: '#666', fontSize: '0.85rem', marginBottom: '0.25rem', display: 'block' }}>
                    ← {book?.title} - অধ্যায়সমূহ
                </Link>
                <h1 className={styles.pageTitle}>অধ্যায় সম্পাদনা</h1>
            </div>

            <form onSubmit={handleSubmit} className={styles.formCard}>
                <div className={styles.formGrid}>
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
                            <span className={pageStyles.pageLabel}>পৃষ্ঠা ({pages.length}টি)</span>
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
                        💡 মোট {pages.length}টি পৃষ্ঠা আছে। প্রতিটি পৃষ্ঠা আলাদাভাবে দেখানো হবে।
                    </div>
                </div>

                <div className={styles.formActions}>
                    <button type="submit" className={styles.submitBtn} disabled={saving}>
                        {saving ? 'আপডেট হচ্ছে...' : 'আপডেট করুন'}
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
