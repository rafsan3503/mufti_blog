'use client';

import { useEffect } from 'react';
import styles from './Modal.module.css';

export default function Modal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'নিশ্চিত করুন',
    cancelText = 'বাতিল',
    type = 'confirm' // 'confirm', 'alert', 'danger'
}) {
    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={`${styles.modalHeader} ${styles[type]}`}>
                    {type === 'danger' && (
                        <div className={styles.iconDanger}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                <line x1="12" y1="9" x2="12" y2="13"></line>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                        </div>
                    )}
                    {type === 'confirm' && (
                        <div className={styles.iconConfirm}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 16v-4"></path>
                                <path d="M12 8h.01"></path>
                            </svg>
                        </div>
                    )}
                    {type === 'alert' && (
                        <div className={styles.iconAlert}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="16 12 12 8 8 12"></polyline>
                                <line x1="12" y1="16" x2="12" y2="12"></line>
                            </svg>
                        </div>
                    )}
                    <h3 className={styles.title}>{title}</h3>
                </div>

                <div className={styles.modalBody}>
                    <p className={styles.message}>{message}</p>
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.cancelBtn} onClick={onClose}>
                        {cancelText}
                    </button>
                    <button
                        className={`${styles.confirmBtn} ${styles[type]}`}
                        onClick={() => { onConfirm(); onClose(); }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Alert Modal for simple messages
export function AlertModal({ isOpen, onClose, title, message }) {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={`${styles.modalHeader} ${styles.alert}`}>
                    <div className={styles.iconAlert}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 16v-4"></path>
                            <path d="M12 8h.01"></path>
                        </svg>
                    </div>
                    <h3 className={styles.title}>{title}</h3>
                </div>
                <div className={styles.modalBody}>
                    <p className={styles.message}>{message}</p>
                </div>
                <div className={styles.modalFooter}>
                    <button className={styles.confirmBtn} onClick={onClose}>
                        ঠিক আছে
                    </button>
                </div>
            </div>
        </div>
    );
}

// Image Upload Modal
export function ImageUploadModal({ isOpen, onClose, onUpload }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            onUpload(file);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3 className={styles.title}>ছবি যোগ করুন</h3>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.uploadArea}>
                        <label className={styles.uploadLabel}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                            <div className={styles.uploadBox}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                    <polyline points="21 15 16 10 5 21"></polyline>
                                </svg>
                                <span>ছবি নির্বাচন করুন</span>
                                <small>JPG, PNG, WebP সমর্থিত</small>
                            </div>
                        </label>
                    </div>
                </div>
                <div className={styles.modalFooter}>
                    <button className={styles.cancelBtn} onClick={onClose}>
                        বাতিল
                    </button>
                </div>
            </div>
        </div>
    );
}
