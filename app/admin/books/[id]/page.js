'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import styles from '../../admin.module.css';
import bookStyles from './bookEditor.module.css';
import { PageLoader } from '@/components/Loader';
import { createClient } from '@/lib/supabase-browser';

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
    ssr: false,
    loading: () => <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>এডিটর লোড হচ্ছে...</div>
});

export default function EditBookPage({ params }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [bookId, setBookId] = useState(null);
    const [activeTab, setActiveTab] = useState('basic');
    const [chaptersCount, setChaptersCount] = useState(0);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        // Basic Info
        title: '',
        subtitle: '',
        slug: '',
        author: 'মুফতি আনিছুর রহমান',
        description: '',
        cover_image: '',
        is_published: false,
        // Front Matter
        publisher: '',
        publish_date: '',
        price: '',
        dedication: '',
        publisher_note: '',
        author_preface: '',
        // Back Matter
        conclusion: '',
        qa_content: ''
    });

    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            const { id } = await params;
            setBookId(id);
            await fetchBook(id);
        };
        init();
    }, [params]);

    const fetchBook = async (id) => {
        const supabase = createClient();

        const { data, error } = await supabase
            .from('books')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            router.push('/admin/books');
            return;
        }

        // Get chapters count
        const { count } = await supabase
            .from('chapters')
            .select('id', { count: 'exact', head: true })
            .eq('book_id', id);

        setChaptersCount(count || 0);

        setFormData({
            title: data.title || '',
            subtitle: data.subtitle || '',
            slug: data.slug || '',
            author: data.author || 'মুফতি আনিছুর রহমান',
            description: data.description || '',
            cover_image: data.cover_image || '',
            is_published: data.is_published || false,
            publisher: data.publisher || '',
            publish_date: data.publish_date || '',
            price: data.price || '',
            dedication: data.dedication || '',
            publisher_note: data.publisher_note || '',
            author_preface: data.author_preface || '',
            conclusion: data.conclusion || '',
            qa_content: data.qa_content || ''
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
        return `book-${timestamp}-${random}`;
    };

    const handleTitleChange = (e) => {
        const title = e.target.value;
        setFormData({ ...formData, title, slug: generateSlug(title) });
    };

    const handleCoverUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);

        const supabase = createClient();
        const fileName = `book-covers/${Date.now()}.${file.name.split('.').pop()}`;
        const { error } = await supabase.storage.from('media').upload(fileName, file, { upsert: true });

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

        // Try to save all fields first
        let { error } = await supabase
            .from('books')
            .update({ ...formData, updated_at: new Date().toISOString() })
            .eq('id', bookId);

        // If error (columns don't exist), try saving only basic fields
        if (error) {
            const basicData = {
                title: formData.title,
                slug: formData.slug,
                author: formData.author,
                description: formData.description,
                cover_image: formData.cover_image,
                is_published: formData.is_published,
                updated_at: new Date().toISOString()
            };

            const result = await supabase
                .from('books')
                .update(basicData)
                .eq('id', bookId);

            if (result.error) {
                console.error('Save error:', result.error);
                setSaving(false);
                alert('সেভ করতে সমস্যা হয়েছে। SQL কোড রান করেছেন কিনা দেখুন।');
                return;
            }
        }

        router.push('/admin/books');
    };

    const tabs = [
        { id: 'basic', label: 'প্রাথমিক তথ্য', icon: '📋' },
        { id: 'front', label: 'শুরুর অংশ', icon: '📖' },
        { id: 'chapters', label: `অধ্যায়সমূহ (${chaptersCount})`, icon: '📑' },
        { id: 'back', label: 'শেষের অংশ', icon: '📝' }
    ];

    if (loading) {
        return <PageLoader message="বই লোড হচ্ছে..." />;
    }

    return (
        <div className={styles.formPage}>
            <div className={styles.pageHeader}>
                <Link href="/admin/books" className={bookStyles.backLink}>← বইসমূহে ফিরুন</Link>
                <h1 className={styles.pageTitle}>বই সম্পাদনা</h1>
                <p className={styles.pageSubtitle}>{formData.title || 'নতুন বই'}</p>
            </div>

            {/* Tabs */}
            <div className={bookStyles.tabs}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        className={`${bookStyles.tab} ${activeTab === tab.id ? bookStyles.active : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span className={bookStyles.tabIcon}>{tab.icon}</span>
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className={styles.formCard}>
                {/* Tab 1: Basic Info */}
                {activeTab === 'basic' && (
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>শিরোনাম <span className={styles.required}>*</span></label>
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
                                className={styles.input}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>সাবটাইটেল</label>
                            <input
                                type="text"
                                value={formData.subtitle}
                                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                className={styles.input}
                                placeholder="বইয়ের সাবটাইটেল (ঐচ্ছিক)"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>স্লাগ (URL)</label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className={styles.input}
                            />
                        </div>

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

                        <div className={styles.formGroup}>
                            <label className={styles.label}>কভার ছবি</label>
                            <div className={styles.uploadArea}>
                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleCoverUpload} style={{ display: 'none' }} />
                                <button type="button" className={styles.uploadBtn} onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                                    {uploading ? 'আপলোড হচ্ছে...' : '📷 কভার ছবি নির্বাচন করুন'}
                                </button>
                            </div>
                            {formData.cover_image && (
                                <img src={formData.cover_image} alt="Cover" style={{ width: '120px', marginTop: '0.5rem', borderRadius: '8px' }} />
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>বর্ণনা</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className={styles.textarea}
                                rows={4}
                                placeholder="বইয়ের সংক্ষিপ্ত বর্ণনা"
                            />
                        </div>
                    </div>
                )}

                {/* Tab 2: Front Matter */}
                {activeTab === 'front' && (
                    <div className={styles.formGrid}>
                        <div className={bookStyles.sectionTitle}>
                            <h3>📄 কপিরাইট তথ্য</h3>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>প্রকাশনী</label>
                                <input
                                    type="text"
                                    value={formData.publisher}
                                    onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                                    className={styles.input}
                                    placeholder="প্রকাশনীর নাম"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>প্রকাশকাল</label>
                                <input
                                    type="date"
                                    value={formData.publish_date}
                                    onChange={(e) => setFormData({ ...formData, publish_date: e.target.value })}
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>মূল্য</label>
                                <input
                                    type="text"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className={styles.input}
                                    placeholder="৳০০০"
                                />
                            </div>
                        </div>

                        <div className={bookStyles.sectionTitle}>
                            <h3>💝 উৎসর্গ</h3>
                        </div>
                        <div className={styles.formGroup}>
                            <textarea
                                value={formData.dedication}
                                onChange={(e) => setFormData({ ...formData, dedication: e.target.value })}
                                className={styles.textarea}
                                rows={3}
                                placeholder="যাদের উদ্দেশ্যে বইটি উৎসর্গ করা হচ্ছে..."
                            />
                        </div>

                        <div className={bookStyles.sectionTitle}>
                            <h3>🏢 প্রকাশকের কথা</h3>
                        </div>
                        <div className={styles.formGroup}>
                            <RichTextEditor
                                content={formData.publisher_note}
                                onChange={(content) => setFormData({ ...formData, publisher_note: content })}
                            />
                        </div>

                        <div className={bookStyles.sectionTitle}>
                            <h3>✍️ লেখকের ভূমিকা</h3>
                        </div>
                        <div className={styles.formGroup}>
                            <RichTextEditor
                                content={formData.author_preface}
                                onChange={(content) => setFormData({ ...formData, author_preface: content })}
                            />
                        </div>
                    </div>
                )}

                {/* Tab 3: Chapters */}
                {activeTab === 'chapters' && (
                    <div className={bookStyles.chaptersTab}>
                        <div className={bookStyles.chaptersInfo}>
                            <div className={bookStyles.chaptersCount}>
                                <span className={bookStyles.countNumber}>{chaptersCount}</span>
                                <span className={bookStyles.countLabel}>টি অধ্যায়</span>
                            </div>
                            <p>অধ্যায় যোগ, সম্পাদনা এবং পৃষ্ঠা পরিচালনা করতে নিচের বাটনে ক্লিক করুন।</p>
                        </div>
                        <Link href={`/admin/books/${bookId}/chapters`} className={bookStyles.manageChaptersBtn}>
                            📑 অধ্যায়সমূহ পরিচালনা করুন
                        </Link>
                    </div>
                )}

                {/* Tab 4: Back Matter */}
                {activeTab === 'back' && (
                    <div className={styles.formGrid}>
                        <div className={bookStyles.sectionTitle}>
                            <h3>📝 উপসংহার</h3>
                        </div>
                        <div className={styles.formGroup}>
                            <RichTextEditor
                                content={formData.conclusion}
                                onChange={(content) => setFormData({ ...formData, conclusion: content })}
                            />
                        </div>

                        <div className={bookStyles.sectionTitle}>
                            <h3>❓ প্রশ্ন-উত্তর পর্ব</h3>
                        </div>
                        <div className={styles.formGroup}>
                            <RichTextEditor
                                content={formData.qa_content}
                                onChange={(content) => setFormData({ ...formData, qa_content: content })}
                            />
                        </div>
                    </div>
                )}

                {/* Save Button */}
                {activeTab !== 'chapters' && (
                    <div className={styles.formActions}>
                        <button type="submit" className={styles.submitBtn} disabled={saving || uploading}>
                            {saving ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
                        </button>
                        <button type="button" className={styles.cancelBtn} onClick={() => router.push('/admin/books')}>
                            বাতিল
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}
