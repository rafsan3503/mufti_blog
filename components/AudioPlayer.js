'use client';

import { createContext, useContext, useState, useRef, useEffect } from 'react';

const AudioPlayerContext = createContext();

export function useAudioPlayer() {
    return useContext(AudioPlayerContext);
}

export function AudioPlayerProvider({ children }) {
    const [currentAudio, setCurrentAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);

    const play = (audio) => {
        if (currentAudio?.src === audio.src && audioRef.current) {
            audioRef.current.play();
            setIsPlaying(true);
            return;
        }
        setCurrentAudio(audio);
        setIsPlaying(true);
    };

    const pause = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        setIsPlaying(false);
    };

    const togglePlay = () => {
        if (isPlaying) {
            pause();
        } else if (audioRef.current) {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    const seek = (percent) => {
        if (audioRef.current && duration) {
            audioRef.current.currentTime = (percent / 100) * duration;
        }
    };

    const close = () => {
        pause();
        setCurrentAudio(null);
        setProgress(0);
    };

    useEffect(() => {
        if (currentAudio?.src && audioRef.current) {
            audioRef.current.src = currentAudio.src;
            audioRef.current.play();
        }
    }, [currentAudio?.src]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const prog = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            setProgress(prog);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
    };

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <AudioPlayerContext.Provider value={{ currentAudio, isPlaying, play, pause, togglePlay, progress, seek, close }}>
            {children}
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
                preload="metadata"
            />
            {currentAudio && (
                <div style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(135deg, #0d4a4a 0%, #1a6b6b 100%)',
                    color: 'white',
                    padding: '0.75rem 1rem',
                    zIndex: 9999,
                    boxShadow: '0 -4px 20px rgba(0,0,0,0.2)'
                }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                            onClick={togglePlay}
                            style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '50%',
                                background: '#d4a853',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                flexShrink: 0
                            }}
                        >
                            {isPlaying ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1a1a1a">
                                    <rect x="6" y="4" width="4" height="16" rx="1" />
                                    <rect x="14" y="4" width="4" height="16" rx="1" />
                                </svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1a1a1a">
                                    <polygon points="5 3 19 12 5 21 5 3" />
                                </svg>
                            )}
                        </button>

                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {currentAudio.title}
                            </div>
                            <div style={{
                                height: '4px',
                                background: 'rgba(255,255,255,0.2)',
                                borderRadius: '2px',
                                marginTop: '0.5rem',
                                cursor: 'pointer'
                            }}
                                onClick={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const percent = ((e.clientX - rect.left) / rect.width) * 100;
                                    seek(percent);
                                }}
                            >
                                <div style={{
                                    width: `${progress}%`,
                                    height: '100%',
                                    background: '#d4a853',
                                    borderRadius: '2px',
                                    transition: 'width 0.1s'
                                }} />
                            </div>
                        </div>

                        <div style={{ fontSize: '0.8rem', opacity: 0.8, flexShrink: 0 }}>
                            {formatTime(audioRef.current?.currentTime)} / {formatTime(duration)}
                        </div>

                        <button
                            onClick={close}
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </AudioPlayerContext.Provider>
    );
}
