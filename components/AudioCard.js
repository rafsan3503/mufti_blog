'use client';

import { useState } from 'react';
import styles from './AudioCard.module.css';
import { useAudioPlayer } from './AudioPlayer';

export default function AudioCard({ audio }) {
    const { currentAudio, isPlaying, play, pause } = useAudioPlayer();
    const isCurrentPlaying = currentAudio?.src === audio.src && isPlaying;

    const togglePlay = () => {
        if (isCurrentPlaying) {
            pause();
        } else {
            play(audio);
        }
    };

    return (
        <div className={styles.card}>
            <div className={styles.cardContent}>
                <button
                    className={`${styles.playButton} ${isCurrentPlaying ? styles.playing : ''}`}
                    onClick={togglePlay}
                    aria-label={isCurrentPlaying ? 'বিরতি' : 'চালান'}
                >
                    {isCurrentPlaying ? (
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
                <div
                    className={styles.progress}
                    style={{ width: currentAudio?.src === audio.src ? '100%' : '0' }}
                ></div>
            </div>
        </div>
    );
}

