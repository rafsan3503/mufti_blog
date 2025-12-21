'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../admin.module.css';
import Modal from '@/components/Modal';
import { createClient } from '@/lib/supabase-browser';

export default function AudioListPage() {
    const [audioList, setAudioList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: '' });

    useEffect(() => {
        fetchAudio();
    }, []);

    const fetchAudio = async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('audio')
            .select('*, categories(name)')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setAudioList(data);
        }
        setLoading(false);
    };

    const handleDeleteClick = (id, title) => {
        setDeleteModal({ open: true, id, title });
    };

    const handleDeleteConfirm = async () => {
        const supabase = createClient();
        const { error } = await supabase.from('audio').delete().eq('id', deleteModal.id);

        if (!error) {
            setAudioList(audioList.filter(a => a.id !== deleteModal.id));
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

    return (
        <div className={styles.listPage}>
            <div className={styles.listHeader}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>অডিও</h1>
                    <p className={styles.pageSubtitle}>সব অডিও পরিচালনা করুন</p>
                </div>
                <Link href="/admin/audio/new" className={styles.addBtn}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    নতুন অডিও
                </Link>
            </div>

            <div className={styles.listTable}>
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>লোড হচ্ছে...</div>
                ) : audioList.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                        <p>কোন অডিও নেই।</p>
                        <Link href="/admin/audio/new" style={{ color: '#0d4a4a', marginTop: '0.5rem', display: 'inline-block' }}>
                            প্রথম অডিও যোগ করুন →
                        </Link>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>শিরোনাম</th>
                                <th>বিভাগ</th>
                                <th>সময়কাল</th>
                                <th>তারিখ</th>
                                <th>অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody>
                            {audioList.map((audio) => (
                                <tr key={audio.id}>
                                    <td><strong>{audio.title}</strong></td>
                                    <td>{audio.categories?.name || '-'}</td>
                                    <td>{audio.duration || '-'}</td>
                                    <td>{formatDate(audio.created_at)}</td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button
                                                onClick={() => handleDeleteClick(audio.id, audio.title)}
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
                title="অডিও মুছে ফেলুন"
                message={`আপনি কি "${deleteModal.title}" অডিওটি মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।`}
                confirmText="মুছে ফেলুন"
                cancelText="বাতিল"
            />
        </div>
    );
}
