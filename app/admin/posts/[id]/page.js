'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import styles from '../../admin.module.css';
import { createClient } from '@/lib/supabase-browser';

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
    ssr: false,
    loading: () => <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>এডিটর লোড হচ্ছে...</div>
});

// Calculate read time based on word count (~150 words per minute for Bangla)
function calculateReadTime(text) {
    if (!text) return 1;
    const plainText = text.replace(/<[^>]*>/g, '');
    const wordCount = plainText.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / 150);
    return Math.max(1, minutes);
}

export default function EditPostPage({ params }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [postId, setPostId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category_id: '',
        tags: '',
        status: 'draft',
        read_time: 5,
        cover_image: ''
    });
    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            const { id } = await params;
            setPostId(id);
            await fetchCategories();
            await fetchPost(id);
        };
        init();
    }, [params]);

    // Auto-calculate read time when content changes
    useEffect(() => {
        if (!loading) {
            const readTime = calculateReadTime(formData.content);
            setFormData(prev => ({ ...prev, read_time: readTime }));
        }
    }, [formData.content, loading]);

    const fetchCategories = async () => {
        const supabase = createClient();
        const { data } = await supabase.from('categories').select('*').order('name');
        if (data) setCategories(data);
    };

    const fetchPost = async (id) => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            alert('ব্লগ পাওয়া যায়নি');
            router.push('/admin/posts');
            return;
        }

        setFormData({
            title: data.title || '',
            slug: data.slug || '',
            excerpt: data.excerpt || '',
            content: data.content || '',
            category_id: data.category_id || '',
            tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
            status: data.status || 'draft',
            read_time: data.read_time || 5,
            cover_image: data.cover_image || ''
        });
        setLoading(false);
    };

    const generateSlug = (title) => {
        // First try to extract English characters
        const englishOnly = title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '')
            .trim();

        // If we have some English characters, use them
        if (englishOnly.length >= 3) {
            return englishOnly;
        }

        // For Bangla/non-English titles, generate a unique slug with prefix
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 6);
        return `post-${timestamp}-${random}`;
    };

    const handleTitleChange = (e) => {
        const title = e.target.value;
        setFormData({
            ...formData,
            title,
            slug: generateSlug(title)
        });
    };

    const handleCoverUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) return;

        setUploading(true);
        const supabase = createClient();
        const fileExt = file.name.split('.').pop();
        const fileName = `post-covers/${Date.now()}.${fileExt}`;

        const { error } = await supabase.storage
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
        setSaving(true);

        const supabase = createClient();

        const postData = {
            title: formData.title,
            slug: formData.slug,
            excerpt: formData.excerpt,
            content: formData.content,
            category_id: formData.category_id || null,
            tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
            status: formData.status,
            read_time: parseInt(formData.read_time) || 5,
            cover_image: formData.cover_image || null,
            updated_at: new Date().toISOString()
        };

        const { error } = await supabase
            .from('posts')
            .update(postData)
            .eq('id', postId);

        if (error) {
            alert('ত্রুটি: ' + error.message);
            setSaving(false);
            return;
        }

        router.refresh(); // Refresh server data
        router.push('/admin/posts');
    };

    if (loading) {
        return (
            <div className={styles.formPage}>
                <div style={{ padding: '2rem', textAlign: 'center' }}>লোড হচ্ছে...</div>
            </div>
        );
    }

    return (
        <div className={styles.formPage}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>ব্লগ সম্পাদনা</h1>
                <p className={styles.pageSubtitle}>ব্লগ আপডেট করুন</p>
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
                            onPaste={(e) => {
                                setTimeout(() => {
                                    const title = e.target.value;
                                    setFormData(prev => ({
                                        ...prev,
                                        title,
                                        slug: generateSlug(title)
                                    }));
                                }, 0);
                            }}
                            placeholder="ব্লগের শিরোনাম"
                            className={styles.input}
                            required
                        />
                    </div>

                    {/* Slug */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>স্লাগ (URL)</label>
                        <div className={styles.inputWithInfo}>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                placeholder="url-slug"
                                className={styles.input}
                            />
                            <span className={styles.inputInfo}>/posts/{formData.slug || 'your-slug'}</span>
                        </div>
                    </div>

                    {/* Cover Image */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>কভার ইমেজ</label>
                        <div className={styles.coverUpload}>
                            {formData.cover_image ? (
                                <div className={styles.coverPreview}>
                                    <img src={formData.cover_image} alt="Cover" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, cover_image: '' })}
                                        className={styles.removeCover}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <label className={styles.uploadBtn}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleCoverUpload}
                                        style={{ display: 'none' }}
                                    />
                                    {uploading ? 'আপলোড হচ্ছে...' : '📷 কভার আপলোড করুন'}
                                </label>
                            )}
                        </div>
                        <span className={styles.inputHint}>কভার না দিলে ডিফল্ট ব্যবহার হবে</span>
                    </div>

                    {/* Category & Status */}
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>বিভাগ</label>
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
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>স্ট্যাটাস</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className={styles.select}
                            >
                                <option value="draft">📝 ড্রাফট</option>
                                <option value="published">✅ প্রকাশিত</option>
                            </select>
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>সংক্ষেপ</label>
                        <textarea
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            placeholder="ব্লগের সংক্ষিপ্ত বিবরণ"
                            className={styles.textarea}
                            rows={3}
                        />
                    </div>

                    {/* Content */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            বিষয়বস্তু <span className={styles.required}>*</span>
                        </label>
                        <RichTextEditor
                            content={formData.content}
                            onChange={(content) => setFormData({ ...formData, content })}
                        />
                    </div>

                    {/* Tags & Read Time */}
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>ট্যাগসমূহ</label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                placeholder="তাকওয়া, ইসলাম, আখলাক"
                                className={styles.input}
                            />
                            <span className={styles.inputHint}>কমা দিয়ে আলাদা করুন</span>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>পড়ার সময়</label>
                            <div className={styles.readTimeDisplay}>
                                <span className={styles.readTimeValue}>{formData.read_time}</span>
                                <span className={styles.readTimeUnit}>মিনিট</span>
                                <span className={styles.autoLabel}>স্বয়ংক্রিয়</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.formActions}>
                    <button type="submit" className={styles.submitBtn} disabled={saving}>
                        {saving ? 'আপডেট হচ্ছে...' : 'আপডেট করুন'}
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
