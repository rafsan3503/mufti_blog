'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../admin.module.css';
import { createClient } from '@/lib/supabase-browser';

export default function NewBookPage() {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        author: 'মুফতি আনিছুর রহমান',
        description: '',
        cover_image: '',
        is_published: false
    });
    const router = useRouter();

    const generateSlug = (title) => {
        // First try to extract English characters
        const englishOnly = title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '')
            .trim();

        // If we have some English characters, use them with timestamp
        if (englishOnly.length >= 3) {
            return `${englishOnly}-${Date.now().toString(36)}`;
        }

        // For Bangla/non-English titles, generate a unique slug with prefix
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 6);
        return `book-${timestamp}-${random}`;
    };

    const handleTitleChange = (e) => {
        const title = e.target.value;
        setFormData({
            ...formData,
            title,
            slug: generateSlug(title)
        });
        setError('');
    };

    const handleCoverUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) return;

        setUploading(true);
        const supabase = createClient();
        const fileExt = file.name.split('.').pop();
        const fileName = `book-covers/${Date.now()}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from('media')
            .upload(fileName, file, { upsert: true });

        if (!error) {
            const { data: urlData } = supabase.storage.from('media').getPublicUrl(fileName);
            setFormData({ ...formData, cover_image: urlData.publicUrl });
        }
        setUploading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const supabase = createClient();
        const { data, error } = await supabase.from('books').insert([formData]).select();

        if (error) {
            setLoading(false);
            if (error.code === '23505') {
                setError('এই স্লাগ দিয়ে আগে থেকেই একটি বই আছে। অন্য স্লাগ ব্যবহার করুন।');
            } else {
                setError('সেভ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
            }
            return;
        }

        // Redirect to edit page to add more details
        if (data && data[0]) {
            router.push(`/admin/books/${data[0].id}`);
        } else {
            router.push('/admin/books');
        }
    };

    return (
        <div className={styles.formPage}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>নতুন বই</h1>
                <p className={styles.pageSubtitle}>নতুন বই তৈরি করুন</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.formCard}>
                {error && (
                    <div style={{
                        background: '#fee2e2',
                        color: '#dc2626',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        fontSize: '0.9rem'
                    }}>
                        ⚠️ {error}
                    </div>
                )}
                <div className={styles.formGrid}>
                    {/* Title */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            শিরোনাম <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={handleTitleChange}
                            onPaste={(e) => {
                                setTimeout(() => {
                                    const title = e.target.value;
                                    setFormData(prev => ({
                                        ...prev,
                                        title,
                                        slug: generateSlug(title)
                                    }));
                                    setError('');
                                }, 0);
                            }}
                            placeholder="বইয়ের শিরোনাম"
                            className={styles.input}
                            required
                        />
                    </div>

                    {/* Author & Status */}
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>লেখক</label>
                            <input
                                type="text"
                                value={formData.author}
                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>স্ট্যাটাস</label>
                            <select
                                value={formData.is_published}
                                onChange={(e) => setFormData({ ...formData, is_published: e.target.value === 'true' })}
                                className={styles.select}
                            >
                                <option value="false">📝 ড্রাফট</option>
                                <option value="true">✅ প্রকাশিত</option>
                            </select>
                        </div>
                    </div>

                    {/* Cover Image */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>কভার ছবি</label>
                        <div className={styles.uploadArea}>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleCoverUpload}
                                style={{ display: 'none' }}
                            />
                            <button
                                type="button"
                                className={styles.uploadBtn}
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                            >
                                {uploading ? 'আপলোড হচ্ছে...' : '📷 কভার ছবি নির্বাচন করুন'}
                            </button>
                        </div>
                        {formData.cover_image && (
                            <div className={styles.uploadedFile}>
                                <img
                                    src={formData.cover_image}
                                    alt="Cover"
                                    style={{ width: '120px', height: 'auto', borderRadius: '8px', marginTop: '0.5rem' }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>বিবরণ</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="বইয়ের বিবরণ"
                            className={styles.textarea}
                            rows={4}
                        />
                    </div>
                </div>

                <div className={styles.formActions}>
                    <button type="submit" className={styles.submitBtn} disabled={loading || uploading}>
                        {loading ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
                    </button>
                    <button
                        type="button"
                        className={styles.cancelBtn}
                        onClick={() => router.push('/admin/books')}
                    >
                        বাতিল
                    </button>
                </div>
            </form>
        </div>
    );
}
