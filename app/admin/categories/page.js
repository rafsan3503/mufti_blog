'use client';

import { useEffect, useState } from 'react';
import styles from '../admin.module.css';
import Modal from '@/components/Modal';
import { createClient } from '@/lib/supabase-browser';

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', slug: '', description: '' });
    const [saving, setSaving] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name');

        if (!error && data) {
            setCategories(data);
        }
        setLoading(false);
    };

    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        setFormData({
            ...formData,
            name,
            slug: generateSlug(name)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const supabase = createClient();
        const { error } = await supabase.from('categories').insert([formData]);

        if (error) {
            setSaving(false);
            return;
        }

        setFormData({ name: '', slug: '', description: '' });
        setShowForm(false);
        fetchCategories();
        setSaving(false);
    };

    const handleDeleteClick = (id, name) => {
        setDeleteModal({ open: true, id, name });
    };

    const handleDeleteConfirm = async () => {
        const supabase = createClient();
        const { error } = await supabase.from('categories').delete().eq('id', deleteModal.id);

        if (!error) {
            setCategories(categories.filter(c => c.id !== deleteModal.id));
        }
        setDeleteModal({ open: false, id: null, name: '' });
    };

    return (
        <div className={styles.listPage}>
            <div className={styles.listHeader}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>বিভাগসমূহ</h1>
                    <p className={styles.pageSubtitle}>বিভাগ পরিচালনা করুন</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className={styles.addBtn}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    নতুন বিভাগ
                </button>
            </div>

            {/* Add Form */}
            {showForm && (
                <div className={styles.formCard} style={{ marginBottom: '1.5rem' }}>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>বিভাগের নাম <span className={styles.required}>*</span></label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={handleNameChange}
                                    placeholder="যেমন: তাফসীর"
                                    className={styles.input}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>স্লাগ</label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="tafsir"
                                    className={styles.input}
                                />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>বিবরণ</label>
                            <input
                                type="text"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="বিভাগের সংক্ষিপ্ত বিবরণ"
                                className={styles.input}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                            <button type="submit" className={styles.submitBtn} disabled={saving}>
                                {saving ? 'সেভ হচ্ছে...' : 'সেভ'}
                            </button>
                            <button type="button" className={styles.cancelBtn} onClick={() => setShowForm(false)}>
                                বাতিল
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className={styles.listTable}>
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>লোড হচ্ছে...</div>
                ) : categories.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                        <p>কোন বিভাগ নেই।</p>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>নাম</th>
                                <th>স্লাগ</th>
                                <th>বিবরণ</th>
                                <th>অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <tr key={category.id}>
                                    <td><strong>{category.name}</strong></td>
                                    <td>{category.slug}</td>
                                    <td>{category.description || '-'}</td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button
                                                onClick={() => handleDeleteClick(category.id, category.name)}
                                                className={styles.deleteBtn}
                                            >
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

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, id: null, name: '' })}
                onConfirm={handleDeleteConfirm}
                type="danger"
                title="বিভাগ মুছে ফেলুন"
                message={`আপনি কি "${deleteModal.name}" বিভাগটি মুছে ফেলতে চান? এই বিভাগের সব প্রবন্ধ বিভাগহীন হয়ে যাবে।`}
                confirmText="মুছে ফেলুন"
                cancelText="বাতিল"
            />
        </div>
    );
}
