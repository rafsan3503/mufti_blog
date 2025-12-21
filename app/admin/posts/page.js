'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../admin.module.css';
import Modal from '@/components/Modal';
import { createClient } from '@/lib/supabase-browser';

export default function PostsListPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: '' });

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('posts')
            .select('*, categories(name)')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setPosts(data);
        }
        setLoading(false);
    };

    const handleDeleteClick = (id, title) => {
        setDeleteModal({ open: true, id, title });
    };

    const handleDeleteConfirm = async () => {
        const supabase = createClient();
        const { error } = await supabase.from('posts').delete().eq('id', deleteModal.id);

        if (!error) {
            setPosts(posts.filter(p => p.id !== deleteModal.id));
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

    const getStatusBadge = (status) => {
        if (status === 'published') {
            return <span className={styles.statusPublished}>প্রকাশিত</span>;
        }
        return <span className={styles.statusDraft}>ড্রাফট</span>;
    };

    return (
        <div className={styles.listPage}>
            <div className={styles.listHeader}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>প্রবন্ধ</h1>
                    <p className={styles.pageSubtitle}>সব প্রবন্ধ পরিচালনা করুন</p>
                </div>
                <Link href="/admin/posts/new" className={styles.addBtn}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    নতুন প্রবন্ধ
                </Link>
            </div>

            <div className={styles.listTable}>
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>লোড হচ্ছে...</div>
                ) : posts.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                        <p>কোন প্রবন্ধ নেই।</p>
                        <Link href="/admin/posts/new" style={{ color: '#0d4a4a', marginTop: '0.5rem', display: 'inline-block' }}>
                            প্রথম প্রবন্ধ তৈরি করুন →
                        </Link>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>শিরোনাম</th>
                                <th>বিভাগ</th>
                                <th>স্ট্যাটাস</th>
                                <th>তারিখ</th>
                                <th>অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post) => (
                                <tr key={post.id}>
                                    <td><strong>{post.title}</strong></td>
                                    <td>{post.categories?.name || '-'}</td>
                                    <td>{getStatusBadge(post.status)}</td>
                                    <td>{formatDate(post.created_at)}</td>
                                    <td>
                                        <div className={styles.actions}>
                                            <Link href={`/admin/posts/${post.id}`} className={styles.editBtn}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                </svg>
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteClick(post.id, post.title)}
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

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, id: null, title: '' })}
                onConfirm={handleDeleteConfirm}
                type="danger"
                title="প্রবন্ধ মুছে ফেলুন"
                message={`আপনি কি "${deleteModal.title}" প্রবন্ধটি মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।`}
                confirmText="মুছে ফেলুন"
                cancelText="বাতিল"
            />
        </div>
    );
}
