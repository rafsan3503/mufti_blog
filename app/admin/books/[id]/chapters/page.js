'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../../admin.module.css';
import Modal from '@/components/Modal';
import { PageLoader } from '@/components/Loader';
import { createClient } from '@/lib/supabase-browser';

export default function ChaptersPage({ params }) {
    const [book, setBook] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookId, setBookId] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: '' });
    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            const { id } = await params;
            setBookId(id);
            await fetchData(id);
        };
        init();
    }, [params]);

    const fetchData = async (id) => {
        const supabase = createClient();

        // Fetch book
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

        // Fetch chapters
        const { data: chaptersData } = await supabase
            .from('chapters')
            .select('*')
            .eq('book_id', id)
            .order('chapter_number', { ascending: true });

        setChapters(chaptersData || []);
        setLoading(false);
    };

    const handleDeleteClick = (id, title) => {
        setDeleteModal({ open: true, id, title });
    };

    const handleDeleteConfirm = async () => {
        const supabase = createClient();
        const { error } = await supabase.from('chapters').delete().eq('id', deleteModal.id);

        if (!error) {
            setChapters(chapters.filter(c => c.id !== deleteModal.id));
        }
        setDeleteModal({ open: false, id: null, title: '' });
    };

    if (loading) {
        return <PageLoader message="অধ্যায়সমূহ লোড হচ্ছে..." />;
    }

    return (
        <div className={styles.listPage}>
            <div className={styles.listHeader}>
                <div className={styles.pageHeader}>
                    <Link href="/admin/books" style={{ color: '#666', fontSize: '0.85rem', marginBottom: '0.25rem', display: 'block' }}>
                        ← বইসমূহে ফিরুন
                    </Link>
                    <h1 className={styles.pageTitle}>{book?.title}</h1>
                    <p className={styles.pageSubtitle}>অধ্যায় পরিচালনা করুন</p>
                </div>
                <Link href={`/admin/books/${bookId}/chapters/new`} className={styles.addBtn}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    নতুন অধ্যায়
                </Link>
            </div>

            <div className={styles.listTable}>
                {chapters.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                        <p>কোন অধ্যায় নেই।</p>
                        <Link href={`/admin/books/${bookId}/chapters/new`} style={{ color: '#0d4a4a', marginTop: '0.5rem', display: 'inline-block' }}>
                            প্রথম অধ্যায় যোগ করুন →
                        </Link>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '60px' }}>#</th>
                                <th>অধ্যায়ের শিরোনাম</th>
                                <th>অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chapters.map((chapter) => (
                                <tr key={chapter.id}>
                                    <td><strong>{chapter.chapter_number}</strong></td>
                                    <td>{chapter.title}</td>
                                    <td>
                                        <div className={styles.actions}>
                                            <Link href={`/admin/books/${bookId}/chapters/${chapter.id}`} className={styles.editBtn}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                </svg>
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteClick(chapter.id, chapter.title)}
                                                className={styles.deleteBtn}
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <Modal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, id: null, title: '' })}
                onConfirm={handleDeleteConfirm}
                type="danger"
                title="অধ্যায় মুছে ফেলুন"
                message={`আপনি কি "${deleteModal.title}" অধ্যায়টি মুছে ফেলতে চান?`}
                confirmText="মুছে ফেলুন"
                cancelText="বাতিল"
            />
        </div>
    );
}
