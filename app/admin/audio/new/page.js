'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../admin.module.css';
import { createClient } from '@/lib/supabase-browser';

export default function NewAudioPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);
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

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/x-m4a'];
        if (!validTypes.includes(file.type)) {
            alert('অনুগ্রহ করে একটি অডিও ফাইল নির্বাচন করুন (MP3, WAV, M4A)');
            return;
        }

        // Validate file size (max 50MB)
        if (file.size > 50 * 1024 * 1024) {
            alert('ফাইলের আকার ৫০ MB এর বেশি হতে পারবে না');
            return;
        }

        setUploading(true);
        setUploadProgress(10);

        const supabase = createClient();
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${formData.slug || 'audio'}.${fileExt}`;

        setUploadProgress(30);

        const { data, error } = await supabase.storage
            .from('audio')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        setUploadProgress(80);

        if (error) {
            console.error('Upload error:', error);
            alert('আপলোড ত্রুটি: ' + error.message);
            setUploading(false);
            setUploadProgress(0);
            return;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('audio')
            .getPublicUrl(fileName);

        setFormData({
            ...formData,
            file_url: urlData.publicUrl
        });

        setUploadProgress(100);
        setTimeout(() => {
            setUploading(false);
            setUploadProgress(0);
        }, 500);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.file_url) {
            alert('অনুগ্রহ করে একটি অডিও ফাইল আপলোড করুন বা URL দিন');
            return;
        }

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

                    {/* File Upload */}
                    <div className={styles.formGroup}>
                        <label>অডিও ফাইল আপলোড করুন *</label>
                        <div className={styles.uploadArea}>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="audio/*"
                                onChange={handleFileUpload}
                                style={{ display: 'none' }}
                            />
                            <button
                                type="button"
                                className={styles.uploadBtn}
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                            >
                                {uploading ? (
                                    <>আপলোড হচ্ছে... {uploadProgress}%</>
                                ) : (
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="17 8 12 3 7 8"></polyline>
                                            <line x1="12" y1="3" x2="12" y2="15"></line>
                                        </svg>
                                        ফাইল নির্বাচন করুন
                                    </>
                                )}
                            </button>
                            {uploading && (
                                <div className={styles.progressBar}>
                                    <div className={styles.progressFill} style={{ width: `${uploadProgress}%` }}></div>
                                </div>
                            )}
                        </div>
                        {formData.file_url && (
                            <div className={styles.uploadedFile}>
                                ✓ আপলোড সম্পন্ন: <a href={formData.file_url} target="_blank" rel="noopener">ফাইল দেখুন</a>
                            </div>
                        )}
                    </div>

                    {/* Or enter URL manually */}
                    <div className={styles.formGroup}>
                        <label>অথবা সরাসরি URL দিন</label>
                        <input
                            type="url"
                            value={formData.file_url}
                            onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                            placeholder="https://example.com/audio.mp3"
                        />
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
                    <button type="submit" className={styles.submitBtn} disabled={loading || uploading}>
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
