'use client';

import { useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import styles from './RichTextEditor.module.css';
import { createClient } from '@/lib/supabase-browser';

export default function RichTextEditor({ content, onChange }) {
    const [uploading, setUploading] = useState(false);
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const fileInputRef = useRef(null);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Link.configure({
                openOnClick: false,
            }),
        ],
        content: content || '',
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) {
        return <div className={styles.editorWrapper} style={{ padding: '1rem', color: '#666' }}>এডিটর লোড হচ্ছে...</div>;
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return;
        }

        // Validate size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return;
        }

        setUploading(true);

        const supabase = createClient();
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from('media')
            .upload(`images/${fileName}`, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Upload error:', error);
            setUploading(false);
            return;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('media')
            .getPublicUrl(`images/${fileName}`);

        // Insert image into editor
        editor.chain().focus().setImage({ src: urlData.publicUrl }).run();

        setUploading(false);
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const addLink = () => {
        if (linkUrl) {
            editor.chain().focus().setLink({ href: linkUrl }).run();
            setLinkUrl('');
            setShowLinkInput(false);
        }
    };

    const removeLink = () => {
        editor.chain().focus().unsetLink().run();
    };

    return (
        <div className={styles.editorWrapper}>
            <div className={styles.editorToolbar}>
                <div className={styles.toolbarGroup}>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`${styles.toolbarBtn} ${editor.isActive('bold') ? styles.active : ''}`}
                        title="বোল্ড"
                    >
                        <strong>B</strong>
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`${styles.toolbarBtn} ${editor.isActive('italic') ? styles.active : ''}`}
                        title="ইটালিক"
                    >
                        <em>I</em>
                    </button>
                </div>

                <div className={styles.toolbarDivider}></div>

                <div className={styles.toolbarGroup}>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={`${styles.toolbarBtn} ${editor.isActive('heading', { level: 2 }) ? styles.active : ''}`}
                        title="হেডিং ২"
                    >
                        H2
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        className={`${styles.toolbarBtn} ${editor.isActive('heading', { level: 3 }) ? styles.active : ''}`}
                        title="হেডিং ৩"
                    >
                        H3
                    </button>
                </div>

                <div className={styles.toolbarDivider}></div>

                <div className={styles.toolbarGroup}>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`${styles.toolbarBtn} ${editor.isActive('bulletList') ? styles.active : ''}`}
                        title="বুলেট লিস্ট"
                    >
                        •
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={`${styles.toolbarBtn} ${editor.isActive('orderedList') ? styles.active : ''}`}
                        title="নম্বর লিস্ট"
                    >
                        1.
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={`${styles.toolbarBtn} ${editor.isActive('blockquote') ? styles.active : ''}`}
                        title="উদ্ধৃতি"
                    >
                        "
                    </button>
                </div>

                <div className={styles.toolbarDivider}></div>

                <div className={styles.toolbarGroup}>
                    {/* Link */}
                    {showLinkInput ? (
                        <div className={styles.linkInput}>
                            <input
                                type="url"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                placeholder="https://..."
                                onKeyDown={(e) => e.key === 'Enter' && addLink()}
                            />
                            <button type="button" onClick={addLink} className={styles.linkConfirm}>✓</button>
                            <button type="button" onClick={() => setShowLinkInput(false)} className={styles.linkCancel}>✕</button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => editor.isActive('link') ? removeLink() : setShowLinkInput(true)}
                            className={`${styles.toolbarBtn} ${editor.isActive('link') ? styles.active : ''}`}
                            title="লিংক"
                        >
                            🔗
                        </button>
                    )}

                    {/* Image Upload */}
                    <label className={`${styles.toolbarBtn} ${uploading ? styles.uploading : ''}`} title="ছবি আপলোড">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                            style={{ display: 'none' }}
                        />
                        {uploading ? '⏳' : '🖼'}
                    </label>
                </div>
            </div>
            <EditorContent editor={editor} className={styles.editorContent} />
        </div>
    );
}
