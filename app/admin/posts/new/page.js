'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import styles from '../../admin.module.css';
import Modal from '@/components/Modal';
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

// Auto-generate excerpt from content
function generateExcerpt(text, maxLength = 150) {
    if (!text) return '';
    const plainText = text.replace(/<[^>]*>/g, '');
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

export default function NewPostPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showNewCategory, setShowNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [savingCategory, setSavingCategory] = useState(false);
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

    const handleContentChange = (content) => {
        const readTime = calculateReadTime(content);
        // Always regenerate excerpt from content
        const excerpt = generateExcerpt(content);
        setFormData({
            ...formData,
            content,
            read_time: readTime,
            excerpt
        });
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
        setLoading(true);

        const supabase = createClient();

        const postData = {
            ...formData,
            tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [],
            category_id: formData.category_id || null,
            read_time: parseInt(formData.read_time) || 5
        };

        const { error } = await supabase.from('posts').insert([postData]);

        if (error) {
            setLoading(false);
            return;
        }

        router.push('/admin/posts');
    };

    return (
        <div className={styles.formPage}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>নতুন ব্লগ</h1>
                <p className={styles.pageSubtitle}>নতুন ব্লগ তৈরি করুন</p>
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
                            placeholder="ব্লগের শিরোনাম লিখুন"
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

                    {/* Category & Status */}
                    <div className={styles.formRow}>
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

                    {/* Content */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            বিষয়বস্তু <span className={styles.required}>*</span>
                        </label>
                        <RichTextEditor
                            content={formData.content}
                            onChange={handleContentChange}
                        />
                    </div>

                    {/* Excerpt - Auto-generated */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            সংক্ষেপ
                            <span className={styles.autoTag}>স্বয়ংক্রিয়</span>
                        </label>
                        <textarea
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            placeholder="বিষয়বস্তু থেকে স্বয়ংক্রিয়ভাবে তৈরি হয়"
                            className={styles.textarea}
                            rows={3}
                        />
                        <span className={styles.inputHint}>প্রতিটি পরিবর্তনে আপডেট হবে। চাইলে নিজে লিখতে পারেন।</span>
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
                            <span className={styles.inputHint}>কমা দিয়ে আলাদা করুন। সার্চ ও ফিল্টারে ব্যবহৃত হয়।</span>
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
