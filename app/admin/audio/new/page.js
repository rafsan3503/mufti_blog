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
    const [showNewCategory, setShowNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [savingCategory, setSavingCategory] = useState(false);
    const fileInputRef = useRef(null);
    const audioRef = useRef(null);

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

    // Format duration from seconds to MM:SS
    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Get audio duration from file
    const getAudioDuration = (file) => {
        return new Promise((resolve) => {
            const audio = new Audio();
            audio.onloadedmetadata = () => {
                resolve(audio.duration);
                URL.revokeObjectURL(audio.src);
            };
            audio.onerror = () => {
                resolve(0);
                URL.revokeObjectURL(audio.src);
            };
            audio.src = URL.createObjectURL(file);
        });
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/x-m4a', 'audio/ogg'];
        if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|m4a|ogg)$/i)) {
            return;
        }

        // Validate file size (max 100MB)
        if (file.size > 100 * 1024 * 1024) {
            return;
        }

        setUploading(true);
        setUploadProgress(10);

        // Get duration before upload
        const durationSeconds = await getAudioDuration(file);
        const formattedDuration = formatDuration(durationSeconds);

        setUploadProgress(30);

        const supabase = createClient();
        const fileExt = file.name.split('.').pop();
        // More unique filename with random string
        const uniqueId = Math.random().toString(36).substring(2, 10);
        const fileName = `${Date.now()}-${uniqueId}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from('audio')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: true // Allow overwrite if exists
            });

        setUploadProgress(80);

        if (error) {
            console.error('Upload error:', error);
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
            file_url: urlData.publicUrl,
            duration: formattedDuration
        });

        setUploadProgress(100);
        setTimeout(() => {
            setUploading(false);
            setUploadProgress(0);
        }, 500);
    };

    // Add new category inline
    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;

        setSavingCategory(true);
        const supabase = createClient();

        const slug = newCategoryName
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .trim();

        const { data, error } = await supabase
            .from('categories')
            .insert([{ name: newCategoryName, slug }])
            .select()
            .single();

        if (!error && data) {
            setCategories([...categories, data]);
            setFormData({ ...formData, category_id: data.id });
            setNewCategoryName('');
            setShowNewCategory(false);
        }
        setSavingCategory(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.file_url) {
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
                        <label className={styles.label}>
                            শিরোনাম <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={handleTitleChange}
                            placeholder="অডিওর শিরোনাম"
                            className={styles.input}
                            required
                        />
                    </div>

                    {/* Slug */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>স্লাগ (URL)</label>
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            placeholder="url-slug"
                            className={styles.input}
                        />
                    </div>

                    {/* Category */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>বিভাগ</label>
                        {showNewCategory ? (
                            <div className={styles.inlineAdd}>
                                <input
                                    type="text"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="নতুন বিভাগের নাম"
                                    className={styles.input}
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={handleAddCategory}
                                    disabled={savingCategory}
                                    className={styles.inlineAddBtn}
                                >
                                    {savingCategory ? '...' : '✓'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowNewCategory(false)}
                                    className={styles.inlineCancelBtn}
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <div className={styles.selectWithAdd}>
                                <select
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                    className={styles.select}
                                >
                                    <option value="">বিভাগ নির্বাচন করুন</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setShowNewCategory(true)}
                                    className={styles.addNewBtn}
                                    title="নতুন বিভাগ যোগ করুন"
                                >
                                    +
                                </button>
                            </div>
                        )}
                    </div>

                    {/* File Upload */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            অডিও ফাইল <span className={styles.required}>*</span>
                        </label>
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
                                ✓ আপলোড সম্পন্ন
                                <audio
                                    controls
                                    src={formData.file_url}
                                    style={{ marginTop: '0.5rem', width: '100%' }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Duration - Auto-detected */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            সময়কাল
                            {formData.duration && <span className={styles.autoTag}>স্বয়ংক্রিয়</span>}
                        </label>
                        <div className={styles.readTimeDisplay}>
                            <span className={styles.readTimeValue}>{formData.duration || '--:--'}</span>
                            <span className={styles.readTimeUnit}>মিনিট</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>বিবরণ</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="অডিওর বিবরণ"
                            className={styles.textarea}
                            rows={4}
                        />
                    </div>
                </div>

                <div className={styles.formActions}>
                    <button type="submit" className={styles.submitBtn} disabled={loading || uploading || !formData.file_url}>
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
