'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import styles from '../../admin.module.css';
import { createClient } from '@/lib/supabase-browser';

// Dynamic import to prevent SSR issues
const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
    ssr: false,
    loading: () => <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>এডিটর লোড হচ্ছে...</div>
});

export default function NewPostPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category_id: '',
        tags: '',
        status: 'draft',
        read_time: 5
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

        const postData = {
            ...formData,
            tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
            category_id: formData.category_id || null
        };

        const { error } = await supabase.from('posts').insert([postData]);

        if (error) {
            alert('ত্রুটি: ' + error.message);
            setLoading(false);
            return;
        }

        router.push('/admin/posts');
    };

    return (
        <div className={styles.formPage}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>নতুন প্রবন্ধ</h1>
                <p className={styles.pageSubtitle}>নতুন প্রবন্ধ তৈরি করুন</p>
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
                            placeholder="প্রবন্ধের শিরোনাম"
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

                    {/* Category & Status */}
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
                            <label>স্ট্যাটাস</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="draft">ড্রাফট</option>
                                <option value="published">প্রকাশিত</option>
                            </select>
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div className={styles.formGroup}>
                        <label>সংক্ষেপ</label>
                        <textarea
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            placeholder="প্রবন্ধের সংক্ষিপ্ত বিবরণ"
                            rows={3}
                        />
                    </div>

                    {/* Content */}
                    <div className={styles.formGroup}>
                        <label>বিষয়বস্তু *</label>
                        <RichTextEditor
                            content={formData.content}
                            onChange={(content) => setFormData({ ...formData, content })}
                        />
                    </div>

                    {/* Tags & Read Time */}
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>ট্যাগসমূহ (কমা দিয়ে আলাদা করুন)</label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                placeholder="তাকওয়া, ইসলাম, আখলাক"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>পড়ার সময় (মিনিট)</label>
                            <input
                                type="number"
                                value={formData.read_time}
                                onChange={(e) => setFormData({ ...formData, read_time: parseInt(e.target.value) })}
                                min="1"
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.formActions}>
                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
                    </button>
                    <button
                        type="button"
                        className={styles.cancelBtn}
                        onClick={() => router.push('/admin/posts')}
                    >
                        বাতিল
                    </button>
                </div>
            </form>
        </div>
    );
}
