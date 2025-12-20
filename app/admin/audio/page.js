'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../admin.module.css';
import { createClient } from '@/lib/supabase-browser';

export default function AudioListPage() {
    const [audioList, setAudioList] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const handleDelete = async (id) => {
        if (!confirm('আপনি কি নিশ্চিত এই অডিও মুছে ফেলতে চান?')) return;

        const supabase = createClient();
        const { error } = await supabase.from('audio').delete().eq('id', id);

        if (!error) {
            setAudioList(audioList.filter(a => a.id !== id));
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('bn-BD', {
            year: 'numeric',
            month: 'long',
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
                                            <button onClick={() => handleDelete(audio.id)} className={styles.deleteBtn}>
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
        </div>
    );
}
