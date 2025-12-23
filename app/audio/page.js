'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AudioCard from '@/components/AudioCard';
import { ContentLoader } from '@/components/Loader';
import styles from './page.module.css';
import { createClient } from '@/lib/supabase-browser';
import { audioContent as staticAudio } from '@/data/audio';

export default function AudioPage() {
    const [audioList, setAudioList] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAudio();
    }, []);

    const fetchAudio = async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('audio')
            .select('*, categories(name, slug)')
            .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
            const formatted = data.map(audio => ({
                id: audio.id,
                slug: audio.slug,
                title: audio.title,
                description: audio.description,
                src: audio.file_url,
                duration: audio.duration || '',
                category: audio.categories?.name || '',
                categorySlug: audio.categories?.slug || ''
            }));
            setAudioList(formatted);
        } else {
            // Fallback to static data
            setAudioList(staticAudio || []);
        }
        setLoading(false);
    };

    const filteredAudio = filter === 'all'
        ? audioList
        : audioList.filter(a => a.categorySlug === filter);

    const uniqueCategories = [...new Set(audioList.map(a => a.category).filter(Boolean))];

    if (loading) {
        return (
            <>
                <Header />
                <main className={styles.main}>
                    <ContentLoader />
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className={styles.main}>
                <div className="container">
                    <div className={styles.pageHeader}>
                        <h1 className={styles.pageTitle}>🎧 অডিও লাইব্রেরি</h1>
                        <p className={styles.pageSubtitle}>ইসলামী বয়ান ও তিলাওয়াত শুনুন</p>
                    </div>

                    {audioList.length > 0 && (
                        <div className={styles.filters}>
                            <button
                                className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
                                onClick={() => setFilter('all')}
                            >
                                সব ({audioList.length})
                            </button>
                            {uniqueCategories.map((cat, i) => (
                                <button
                                    key={i}
                                    className={`${styles.filterBtn} ${filter === audioList.find(a => a.category === cat)?.categorySlug ? styles.active : ''}`}
                                    onClick={() => setFilter(audioList.find(a => a.category === cat)?.categorySlug || 'all')}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}

                    {filteredAudio.length > 0 ? (
                        <div className={styles.audioGrid}>
                            {filteredAudio.map((audio) => (
                                <AudioCard key={audio.id} audio={audio} />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>🎵</div>
                            <h3>অডিও শীঘ্রই আসছে</h3>
                            <p>আমরা নতুন অডিও কনটেন্ট যোগ করছি। অনুগ্রহ করে পরে আবার আসুন।</p>
                            <div className={styles.emptyAction}>
                                <a href="/" className="btn btn-primary">হোমপেজে যান</a>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}

