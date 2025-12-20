'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import styles from './RichTextEditor.module.css';

export default function RichTextEditor({ content, onChange }) {
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

    const addImage = () => {
        const url = prompt('ছবির URL দিন:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const addLink = () => {
        const url = prompt('লিংক URL দিন:');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    return (
        <div className={styles.editorWrapper}>
            <div className={styles.editorToolbar}>
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
                <button
                    type="button"
                    onClick={addLink}
                    className={`${styles.toolbarBtn} ${editor.isActive('link') ? styles.active : ''}`}
                    title="লিংক"
                >
                    🔗
                </button>
                <button
                    type="button"
                    onClick={addImage}
                    className={styles.toolbarBtn}
                    title="ছবি"
                >
                    🖼
                </button>
            </div>
            <EditorContent editor={editor} className={styles.editorContent} />
        </div>
    );
}
