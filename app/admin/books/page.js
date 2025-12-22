'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../admin.module.css';
import Modal from '@/components/Modal';
import { PageLoader } from '@/components/Loader';
import { createClient } from '@/lib/supabase-browser';

export default function BooksListPage() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: '' });

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('books')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setBooks(data);
        }
        setLoading(false);
    };

    const handleDeleteClick = (id, title) => {
        setDeleteModal({ open: true, id, title });
    };

    const handleDeleteConfirm = async () => {
        const supabase = createClient();
        const { error } = await supabase.from('books').delete().eq('id', deleteModal.id);

        if (!error) {
            setBooks(books.filter(b => b.id !== deleteModal.id));
        }
        setDeleteModal({ open: false, id: null, title: '' });
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('bn-BD', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusBadge = (isPublished) => {
        if (isPublished) {
            return <span className={styles.statusPublished}>প্রকাশিত</span>;
        }
        return <span className={styles.statusDraft}>ড্রাফট</span>;
    };

    if (loading) {
        return <PageLoader message="বইসমূহ লোড হচ্ছে..." />;
    }

    return (
        <div className={styles.listPage}>
            <div className={styles.listHeader}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>বইসমূহ</h1>
                    <p className={styles.pageSubtitle}>সব বই পরিচালনা করুন</p>
                </div>
                <Link href="/admin/books/new" className={styles.addBtn}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    নতুন বই
                </Link>
            </div>

            <div className={styles.listTable}>
                {books.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                        <p>কোন বই নেই।</p>
                        <Link href="/admin/books/new" style={{ color: '#0d4a4a', marginTop: '0.5rem', display: 'inline-block' }}>
                            প্রথম বই তৈরি করুন →
                        </Link>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>শিরোনাম</th>
                                <th>লেখক</th>
                                <th>স্ট্যাটাস</th>
                                <th>তারিখ</th>
                                <th>অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book) => (
                                <tr key={book.id}>
                                    <td><strong>{book.title}</strong></td>
                                    <td>{book.author || 'মুফতি আনিছুর রহমান'}</td>
                                    <td>{getStatusBadge(book.is_published)}</td>
                                    <td>{formatDate(book.created_at)}</td>
                                    <td>
                                        <div className={styles.actions}>
                                            <Link href={`/admin/books/${book.id}/chapters`} className={styles.editBtn} title="অধ্যায়সমূহ">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                                                </svg>
                                            </Link>
                                            <Link href={`/admin/books/${book.id}`} className={styles.editBtn} title="সম্পাদনা">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                </svg>
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteClick(book.id, book.title)}
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
                title="বই মুছে ফেলুন"
                message={`আপনি কি "${deleteModal.title}" বইটি মুছে ফেলতে চান? সব অধ্যায়ও মুছে যাবে।`}
                confirmText="মুছে ফেলুন"
                cancelText="বাতিল"
            />
        </div>
    );
}
