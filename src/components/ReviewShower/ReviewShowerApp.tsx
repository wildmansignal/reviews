import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, SkipForward, X } from 'lucide-react';
import './ReviewShower.css';

// ── Sales phrases to highlight & zoom into ──────────────────────────────────
const SALES_PHRASES = [
    'free', 'FREE', 'Free',
    'AI chat', 'ai chat', 'AI Chat', 'tinnitus chat', 'Tinnitus Chat', "Dan's chat", 'dans chat',
    'saved my life', 'changed my life', 'life-changing', 'game changer', 'game plan',
    'reduction', 'reduced', 'went down', 'decreased', 'improvement',
    'hopeful', 'hope', 'anxiety', 'fear', 'panic', 'relief',
    'habituation', 'habituated', 'results', 'working', 'it works', 'actually works',
    'sleep better', 'sleeping again', 'quality of life',
];

const buildPattern = () => {
    const sorted = [...SALES_PHRASES].sort((a, b) => b.length - a.length);
    const escaped = sorted.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    return new RegExp(`(\\$[\\d,]+(?:\\.\\d+)?|\\d+%\\s*[Rr]eduction[\\w\\s]*|${escaped.join('|')})`, 'gi');
};

interface SalesPart {
    text: string;
    isSales: boolean;
}

const splitIntoSalesParts = (text: string): SalesPart[] => {
    const pattern = buildPattern();
    const parts = text.split(pattern);
    return parts.filter(p => p.length > 0).map(part => {
        pattern.lastIndex = 0;
        const isSales = pattern.test(part);
        pattern.lastIndex = 0;
        return { text: part, isSales };
    });
};

// ── Component ────────────────────────────────────────────────────────────────
const ReviewShowerApp: React.FC = () => {
    const [rawText, setRawText] = useState('');
    const [reviews, setReviews] = useState<string[]>([]);
    const [isPresenting, setIsPresenting] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [phase, setPhase] = useState<'fade-in' | 'zoom' | 'fade-out'>('fade-in');
    const [activeUnderlines, setActiveUnderlines] = useState<Set<number>>(new Set());
    const [speed, setSpeed] = useState(5); // seconds per review
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Parse reviews from raw text (split by double newline or numbered lines)
    const parseReviews = useCallback(() => {
        const lines = rawText
            .split(/\n{2,}|\n(?=\d+[\.\)]\s)/)
            .map(r => r.replace(/^\d+[\.\)]\s*/, '').trim())
            .filter(r => r.length > 10);
        return lines;
    }, [rawText]);

    const startPresentation = () => {
        const parsed = parseReviews();
        if (parsed.length === 0) return;
        setReviews(parsed);
        setCurrentIndex(0);
        setPhase('fade-in');
        setActiveUnderlines(new Set());
        setIsPresenting(true);
        setIsPaused(false);
    };

    const stopPresentation = () => {
        setIsPresenting(false);
        setIsPaused(false);
        if (timerRef.current) clearTimeout(timerRef.current);
    };

    const skipToNext = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (currentIndex < reviews.length - 1) {
            setPhase('fade-out');
            setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
                setPhase('fade-in');
                setActiveUnderlines(new Set());
            }, 800);
        } else {
            stopPresentation();
        }
    }, [currentIndex, reviews.length]);

    // Animation timeline for each review
    useEffect(() => {
        if (!isPresenting || isPaused) return;
        if (timerRef.current) clearTimeout(timerRef.current);

        const totalMs = speed * 1000;
        const parts = splitIntoSalesParts(reviews[currentIndex] || '');
        const salesIndices = parts.reduce<number[]>((acc, p, i) => p.isSales ? [...acc, i] : acc, []);

        if (phase === 'fade-in') {
            // After fade-in (1s), start zoom
            timerRef.current = setTimeout(() => setPhase('zoom'), 1000);
        } else if (phase === 'zoom') {
            // Stagger underline reveals across the zoom duration
            const underlineDelay = salesIndices.length > 0
                ? Math.min((totalMs - 2000) / salesIndices.length, 1200)
                : totalMs - 2000;

            salesIndices.forEach((sIdx, order) => {
                const delay = 500 + order * underlineDelay;
                const t = setTimeout(() => {
                    setActiveUnderlines(prev => new Set(prev).add(sIdx));
                }, delay);
                // Store cleanup in a separate effect
                timerRef.current = t;
            });

            // After zoom duration, fade out
            timerRef.current = setTimeout(() => {
                setPhase('fade-out');
            }, totalMs - 1000);
        } else if (phase === 'fade-out') {
            // After fade-out, go to next
            timerRef.current = setTimeout(() => {
                if (currentIndex < reviews.length - 1) {
                    setCurrentIndex(prev => prev + 1);
                    setPhase('fade-in');
                    setActiveUnderlines(new Set());
                } else {
                    stopPresentation();
                }
            }, 800);
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isPresenting, isPaused, phase, currentIndex, speed, reviews]);

    // Keyboard shortcuts
    useEffect(() => {
        if (!isPresenting) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') stopPresentation();
            if (e.key === ' ') { e.preventDefault(); setIsPaused(p => !p); }
            if (e.key === 'ArrowRight') skipToNext();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isPresenting, skipToNext]);

    // ── Render current review with sales highlights ──────────────
    const renderCurrentReview = () => {
        const text = reviews[currentIndex] || '';
        const parts = splitIntoSalesParts(text);

        const animClass = phase === 'fade-in' ? '' : phase === 'zoom' ? 'zooming' : 'fading-out';

        return (
            <div className={`shower-review-text ${animClass}`}>
                {parts.map((part, i) => {
                    if (part.isSales) {
                        const isActive = activeUnderlines.has(i);
                        return (
                            <span key={i} className={`shower-sale-word ${isActive ? 'underline-active' : ''}`}>
                                {part.text}
                            </span>
                        );
                    }
                    return <span key={i}>{part.text}</span>;
                })}
            </div>
        );
    };

    // ── Fullscreen Presentation ──────────────────────────────────
    if (isPresenting && reviews.length > 0) {
        return (
            <div className="shower-presentation">
                <div className="shower-progress-bar" style={{ width: `${((currentIndex + 1) / reviews.length) * 100}%` }} />

                <div className="shower-review-container">
                    {renderCurrentReview()}
                </div>

                <div className="shower-pres-controls">
                    <button className="shower-pres-btn" onClick={() => setIsPaused(p => !p)} title={isPaused ? 'Resume' : 'Pause'}>
                        {isPaused ? <Play size={20} /> : <Pause size={20} />}
                    </button>
                    <span className="shower-progress-text">{currentIndex + 1} / {reviews.length}</span>
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
                    <p>Paste your reviews below. Each one will be presented cinematically with zoom + highlighted sales phrases.</p>
                </div>

                <textarea
                    className="shower-textarea"
                    value={rawText}
                    onChange={e => setRawText(e.target.value)}
                    placeholder={`Paste your reviews here, separated by blank lines...\n\nAfter talking to Dan's chat, my tinnitus has reduced by like 20%. I feel hopeful, like I have a game plan.\n\nThis FREE AI chat saved my life. I was in a panic and it calmed me down in 5 minutes. The results speak for themselves.\n\nI can't believe this is free. Dan's tinnitus chat gave me more hope than any doctor. My anxiety is way down and I'm sleeping again.`}
                />

                <div className="shower-controls">
                    <button className="shower-play-btn" onClick={startPresentation} disabled={rawText.trim().length < 20}>
                        <Play size={18} /> Start Shower
                    </button>

                    <div className="shower-speed-control">
                        <span>Speed:</span>
                        <input type="range" min="3" max="12" step="1" value={speed} onChange={e => setSpeed(parseInt(e.target.value))} />
                        <span>{speed}s</span>
                    </div>
                </div>

                <div className="shower-hint">
                    Tip: Separate reviews with blank lines. Key phrases like <strong style={{ color: '#ef4444' }}>FREE</strong>, <strong style={{ color: '#ef4444' }}>AI chat</strong>, <strong style={{ color: '#ef4444' }}>reduction</strong>, and <strong style={{ color: '#ef4444' }}>results</strong> will be auto-highlighted and underlined during presentation.
                    <br />Keyboard: <strong>Space</strong> = pause/resume, <strong>→</strong> = skip, <strong>Esc</strong> = exit.
                </div>
            </div>
        </div>
    );
};

export default ReviewShowerApp;
