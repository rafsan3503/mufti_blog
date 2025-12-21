'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../admin.module.css';

// Simple password for admin - in production, use Supabase Auth
const ADMIN_PASSWORD = 'admin123';

export default function LoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simple password check - you can change this password
        if (password === ADMIN_PASSWORD) {
            localStorage.setItem('admin_authenticated', 'true');
            router.push('/admin');
        } else {
            setError('পাসওয়ার্ড সঠিক নয়');
        }
        setLoading(false);
    };

    return (
        <div className={styles.loginPage}>
            <div className={styles.loginCard}>
                <div className={styles.loginLogo}>
                    <h1>অ্যাডমিন প্যানেল</h1>
                    <p>মুফতি আনিছুর রহমান</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.loginForm}>
                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.formGroup}>
                        <label>পাসওয়ার্ড</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="পাসওয়ার্ড দিন"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.loginBtn}
                        disabled={loading}
                    >
                        {loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
                    </button>
                </form>
            </div>
        </div>
    );
}
