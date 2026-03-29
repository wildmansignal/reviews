import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, SkipForward, X, Upload, Trash2 } from 'lucide-react';
import './ReviewShower.css';

const ReviewShowerApp: React.FC = () => {
    const [images, setImages] = useState<string[]>([]);
    const [isPresenting, setIsPresenting] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [phase, setPhase] = useState<'fade-in' | 'zoom' | 'fade-out'>('fade-in');
    const [speed, setSpeed] = useState(6); // seconds per image
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newImages = Array.from(e.target.files).map(f => URL.createObjectURL(f));
            setImages(prev => [...prev, ...newImages]);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeImage = (idx: number) => {
        setImages(prev => {
            URL.revokeObjectURL(prev[idx]);
            return prev.filter((_, i) => i !== idx);
        });
    };

    const clearAll = () => {
        images.forEach(url => URL.revokeObjectURL(url));
        setImages([]);
    };

    const startPresentation = () => {
        if (images.length === 0) return;
        setCurrentIndex(0);
        setPhase('fade-in');
        setIsPresenting(true);
        setIsPaused(false);
    };

    const stopPresentation = useCallback(() => {
        setIsPresenting(false);
        setIsPaused(false);
        if (timerRef.current) clearTimeout(timerRef.current);
    }, []);

    const skipToNext = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (currentIndex < images.length - 1) {
            setPhase('fade-out');
            setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
                setPhase('fade-in');
            }, 800);
        } else {
            stopPresentation();
        }
    }, [currentIndex, images.length, stopPresentation]);

    // Animation timeline
    useEffect(() => {
        if (!isPresenting || isPaused) return;
        if (timerRef.current) clearTimeout(timerRef.current);

        const zoomDuration = speed * 1000;

        if (phase === 'fade-in') {
            timerRef.current = setTimeout(() => setPhase('zoom'), 1000);
        } else if (phase === 'zoom') {
            timerRef.current = setTimeout(() => setPhase('fade-out'), zoomDuration);
        } else if (phase === 'fade-out') {
            timerRef.current = setTimeout(() => {
                if (currentIndex < images.length - 1) {
                    setCurrentIndex(prev => prev + 1);
                    setPhase('fade-in');
                } else {
                    stopPresentation();
                }
            }, 800);
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isPresenting, isPaused, phase, currentIndex, speed, images.length, stopPresentation]);

    // Keyboard
    useEffect(() => {
        if (!isPresenting) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') stopPresentation();
            if (e.key === ' ') { e.preventDefault(); setIsPaused(p => !p); }
            if (e.key === 'ArrowRight') skipToNext();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isPresenting, skipToNext, stopPresentation]);

    // Cleanup URLs
    useEffect(() => {
        return () => { images.forEach(url => URL.revokeObjectURL(url)); };
    }, []);

    // ── Fullscreen Presentation ──────────────────────────────────
    if (isPresenting && images.length > 0) {
        const animClass = phase === 'fade-in' ? 'shower-img-fadein' : phase === 'zoom' ? 'shower-img-zoom' : 'shower-img-fadeout';

        return (
            <div className="shower-presentation">
                <div className="shower-progress-bar" style={{ width: `${((currentIndex + 1) / images.length) * 100}%` }} />

                <div className="shower-img-container">
                    <img
                        key={currentIndex}
                        src={images[currentIndex]}
                        alt={`Review ${currentIndex + 1}`}
                        className={`shower-img ${animClass}`}
                        style={{ animationDuration: phase === 'zoom' ? `${speed}s` : undefined }}
                    />
                </div>

                <div className="shower-pres-controls">
                    <button className="shower-pres-btn" onClick={() => setIsPaused(p => !p)} title={isPaused ? 'Resume' : 'Pause'}>
                        {isPaused ? <Play size={20} /> : <Pause size={20} />}
                    </button>
                    <span className="shower-progress-text">{currentIndex + 1} / {images.length}</span>
                    <button className="shower-pres-btn" onClick={skipToNext} title="Next">
                        <SkipForward size={20} />
                    </button>
                    <button className="shower-pres-btn" onClick={stopPresentation} title="Exit">
                        <X size={20} />
                    </button>
                </div>
            </div>
        );
    }

    // ── Setup View ───────────────────────────────────────────────
    return (
        <div className="review-shower-page">
            <div className="shower-setup">
                <Link to="/" className="shower-back-btn">
                    <ArrowLeft size={16} /> Back to Home
                </Link>

                <div className="shower-setup-header">
                    <h1>🔥 Review Shower</h1>
                    <p>Upload review screenshots. Each will be shown fullscreen with a cinematic zoom effect.</p>
                </div>

                <div className="shower-upload-area">
                    <label className="shower-upload-btn">
                        <Upload size={18} />
                        Upload Screenshots
                        <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
                    </label>

                    {images.length > 0 && (
                        <button className="shower-clear-btn" onClick={clearAll}>
                            <Trash2 size={16} /> Clear All ({images.length})
                        </button>
                    )}
                </div>

                {images.length > 0 && (
                    <div className="shower-thumbs-grid">
                        {images.map((img, i) => (
                            <div key={i} className="shower-thumb-wrap">
                                <img src={img} alt={`Review ${i + 1}`} className="shower-thumb" />
                                <div className="shower-thumb-number">{i + 1}</div>
                                <button className="shower-thumb-remove" onClick={() => removeImage(i)} title="Remove">
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="shower-controls">
                    <button className="shower-play-btn" onClick={startPresentation} disabled={images.length === 0}>
                        <Play size={18} /> Start Shower ({images.length} reviews)
                    </button>

                    <div className="shower-speed-control">
                        <span>Speed:</span>
                        <input type="range" min="3" max="12" step="1" value={speed} onChange={e => setSpeed(parseInt(e.target.value))} />
                        <span>{speed}s</span>
                    </div>
                </div>

                <div className="shower-hint">
                    Keyboard: <strong>Space</strong> = pause/resume, <strong>→</strong> = skip, <strong>Esc</strong> = exit
                </div>
            </div>
        </div>
    );
};

export default ReviewShowerApp;
