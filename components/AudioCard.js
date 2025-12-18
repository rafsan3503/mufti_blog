'use client';

import { useState, useRef } from 'react';
import styles from './AudioCard.module.css';

export default function AudioCard({ audio }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef(null);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            setProgress(progress);
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
    };

    return (
        <div className={styles.card}>
            <div className={styles.cardContent}>
                <button
                    className={`${styles.playButton} ${isPlaying ? styles.playing : ''}`}
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'বিরতি' : 'চালান'}
                >
                    {isPlaying ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="6" y="4" width="4" height="16" rx="1" />
                            <rect x="14" y="4" width="4" height="16" rx="1" />
                        </svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                    )}
                </button>
                <div className={styles.info}>
                    <h4 className={styles.title}>{audio.title}</h4>
                    <p className={styles.description}>{audio.description}</p>
                    <div className={styles.meta}>
                        <span className={styles.duration}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            {audio.duration}
                        </span>
                        <span className={`tag ${styles.categoryTag}`}>{audio.category}</span>
                    </div>
                </div>
            </div>
            <div className={styles.progressBar}>
                <div className={styles.progress} style={{ width: `${progress}%` }}></div>
            </div>
            {audio.src && (
                <audio
                    ref={audioRef}
                    src={audio.src}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleEnded}
                    preload="metadata"
                />
            )}
        </div>
    );
}
