'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../admin.module.css';
import { createClient } from '@/lib/supabase-browser';

export default function NewAudioPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        file_url: '',
        duration: '',
        category_id: ''
    });
    const router = useRouter();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const supabase = createClient();
        const { data } = await supabase.from('categories').select('*').order('name');
        if (data) setCategories(data);
    };

    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const handleTitleChange = (e) => {
        const title = e.target.value;
        setFormData({
            ...formData,
            title,
            slug: generateSlug(title)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const supabase = createClient();

        const audioData = {
            ...formData,
            category_id: formData.category_id || null
        };

        const { error } = await supabase.from('audio').insert([audioData]);

        if (error) {
            alert('ত্রুটি: ' + error.message);
            setLoading(false);
            return;
        }

        router.push('/admin/audio');
    };

    return (
        <div className={styles.formPage}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>নতুন অডিও</h1>
                <p className={styles.pageSubtitle}>নতুন অডিও যোগ করুন</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.formCard}>
                <div className={styles.formGrid}>
                    {/* Title */}
                    <div className={styles.formGroup}>
                        <label>শিরোনাম *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={handleTitleChange}
                            placeholder="অডিওর শিরোনাম"
                            required
                        />
                    </div>

                    {/* Slug */}
                    <div className={styles.formGroup}>
                        <label>স্লাগ (URL)</label>
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            placeholder="url-slug"
                        />
                    </div>

                    {/* Category & Duration */}
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>বিভাগ</label>
                            <select
                                value={formData.category_id}
                                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                            >
                                <option value="">বিভাগ নির্বাচন করুন</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>সময়কাল</label>
                            <input
                                type="text"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                placeholder="১৫:৩০"
                            />
                        </div>
                    </div>

                    {/* File URL */}
                    <div className={styles.formGroup}>
                        <label>অডিও ফাইল URL *</label>
                        <input
                            type="url"
                            value={formData.file_url}
                            onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                            placeholder="https://example.com/audio.mp3"
                            required
                        />
                        <small style={{ color: '#666', marginTop: '0.25rem', display: 'block' }}>
                            অডিও ফাইলের সরাসরি লিংক দিন (MP3/M4A)
                        </small>
                    </div>

                    {/* Description */}
                    <div className={styles.formGroup}>
                        <label>বিবরণ</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="অডিওর বিবরণ"
                            rows={4}
                        />
                    </div>
                </div>

                <div className={styles.formActions}>
                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
                    </button>
                    <button
                        type="button"
                        className={styles.cancelBtn}
                        onClick={() => router.push('/admin/audio')}
                    >
                        বাতিল
                    </button>
                </div>
            </form>
        </div>
    );
}
