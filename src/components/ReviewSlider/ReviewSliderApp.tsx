import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Upload, Trash2, Battery, Wifi, Signal, Download, Loader } from 'lucide-react';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import './ReviewSlider.css';

// ── Review card renderer (hidden, for html2canvas) ──────────────────────
const STAR = '★';
const PLATFORMS = ['Google', 'Trustpilot', 'Facebook', 'Yelp', 'Amazon'];
const STAR_COLORS: Record<string, string> = {
    Google: '#fbbc04',
    Trustpilot: '#00b67a',
    Facebook: '#1877f2',
    Yelp: '#d32323',
    Amazon: '#ff9900',
};
const PLATFORM_COLORS: Record<string, string> = {
    Google: '#4285f4',
    Trustpilot: '#00b67a',
    Facebook: '#1877f2',
    Yelp: '#d32323',
    Amazon: '#ff9900',
};

const NAMES = [
    'James Mitchell', 'Sarah Johnson', 'Robert Chen', 'Emily Davis', 'Michael Brown',
    'Jennifer Wilson', 'David Anderson', 'Amanda Taylor', 'Christopher Martinez', 'Melissa Thomas',
    'William Garcia', 'Jessica Robinson', 'Daniel White', 'Ashley Harris', 'Mark Thompson',
];

interface GeneratedReview {
    name: string;
    platform: string;
    rating: number;
    text: string;
    date: string;
}

interface ReviewCardProps {
    review: GeneratedReview;
}

const ReviewCard = React.forwardRef<HTMLDivElement, ReviewCardProps>(({ review }, ref) => {
    const starColor = STAR_COLORS[review.platform];
    const platformColor = PLATFORM_COLORS[review.platform];
    return (
        <div
            ref={ref}
            style={{
                width: 380,
                background: '#ffffff',
                borderRadius: 16,
                padding: '20px 24px',
                fontFamily: 'Arial, sans-serif',
                boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
                border: '1px solid #e8eaed',
                position: 'absolute',
                left: -9999,
                top: 0,
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${platformColor}, ${platformColor}88)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: 18, marginRight: 12,
                }}>
                    {review.name.charAt(0)}
                </div>
                <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a' }}>{review.name}</div>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{review.date}</div>
                </div>
                <div style={{ marginLeft: 'auto', background: platformColor, color: 'white', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>
                    {review.platform}
                </div>
            </div>
            <div style={{ fontSize: 22, color: starColor, letterSpacing: 2, marginBottom: 10 }}>
                {STAR.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
            </div>
            <div style={{ fontSize: 14, color: '#333', lineHeight: 1.6 }}>
                {review.text}
            </div>
            <div style={{ marginTop: 14, fontSize: 12, color: '#888', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>👍 Helpful</span>
                <span style={{ marginLeft: 'auto' }}>Verified purchase</span>
            </div>
        </div>
    );
});
ReviewCard.displayName = 'ReviewCard';

// ── Main App ─────────────────────────────────────────────────────────────
const ReviewSliderApp = () => {
    const [images, setImages] = useState<string[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(2);
    const scrollRef = useRef<HTMLDivElement>(null);
    const animationFrameRef = useRef<number | null>(null);
    const hiddenContainerRef = useRef<HTMLDivElement>(null);

    const [isGenerating, setIsGenerating] = useState(false);
    const [generateStatus, setGenerateStatus] = useState('');
    const [generatedReviews, setGeneratedReviews] = useState<GeneratedReview[]>([]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newImages = Array.from(event.target.files).map(file => URL.createObjectURL(file));
            setImages(prev => [...prev, ...newImages]);
        }
    };

    const handleClear = () => {
        setImages([]);
        setIsPlaying(false);
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
    };

    const animateScroll = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop += speed;
            if (scrollRef.current.scrollTop + scrollRef.current.clientHeight >= scrollRef.current.scrollHeight) {
                setIsPlaying(false);
                return;
            }
        }
        animationFrameRef.current = requestAnimationFrame(animateScroll);
    };

    useEffect(() => {
        if (isPlaying) {
            animationFrameRef.current = requestAnimationFrame(animateScroll);
        } else {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        }
        return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
    }, [isPlaying, speed]);

    useEffect(() => {
        return () => { images.forEach(url => URL.revokeObjectURL(url)); };
    }, []);

    const getCurrentTime = () => {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false });
    };

    // ── AI Generate Reviews ──────────────────────────────────────────────
    const generateAndDownload = async () => {
        setIsGenerating(true);
        setGenerateStatus('Generating review text with AI…');

        try {
            const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
            const reviews: GeneratedReview[] = [];
            const count = 10;

            for (let i = 0; i < count; i++) {
                const name = NAMES[i % NAMES.length];
                const platform = PLATFORMS[i % PLATFORMS.length];
                const rating = Math.random() > 0.15 ? 5 : 4;
                const now = new Date();
                now.setDate(now.getDate() - Math.floor(Math.random() * 30));
                const date = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

                let text = '';
                if (apiKey) {
                    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
                        body: JSON.stringify({
                            model: 'gpt-3.5-turbo',
                            max_tokens: 120,
                            messages: [{
                                role: 'user',
                                content: `Write a short, genuine-sounding ${rating}-star customer review (2-4 sentences) for an online business/coaching service that helps people make money. Write in first person. Don't use generic filler. Sound real and enthusiastic.`,
                            }],
                        }),
                    });
                    const json = await resp.json();
                    text = json.choices?.[0]?.message?.content?.trim() || fallbackReview(rating);
                } else {
                    text = fallbackReview(rating);
                }
                reviews.push({ name, platform, rating, text, date });
                setGenerateStatus(`Generated ${i + 1}/${count} reviews…`);
            }

            setGeneratedReviews(reviews);
            setGenerateStatus('Capturing screenshots…');

            // Wait a frame for React to render the hidden cards
            await new Promise(r => setTimeout(r, 400));

            const zip = new JSZip();
            const folder = zip.folder('review-screenshots')!;
            const container = hiddenContainerRef.current;
            if (!container) throw new Error('Container not found');

            const cards = container.querySelectorAll('[data-review-card]');
            for (let i = 0; i < cards.length; i++) {
                setGenerateStatus(`Screenshotting ${i + 1}/${cards.length}…`);
                const canvas = await html2canvas(cards[i] as HTMLElement, {
                    scale: 2,
                    backgroundColor: '#ffffff',
                    logging: false,
                });
                const blob = await new Promise<Blob>(resolve =>
                    canvas.toBlob(b => resolve(b!), 'image/png')
                );
                folder.file(`review-${i + 1}-${reviews[i].platform}.png`, blob);
            }

            setGenerateStatus('Building zip…');
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(zipBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'review-screenshots.zip';
            a.click();
            URL.revokeObjectURL(url);
            setGenerateStatus('✅ Downloaded! Extract into your "review screenshots" folder.');
        } catch (err) {
            console.error(err);
            setGenerateStatus('❌ Error — check console.');
        } finally {
            setIsGenerating(false);
        }
    };

    const fallbackReview = (rating: number) => {
        const fives = [
            "I've been using this program for 3 months and my income has completely changed. Went from $2k/month to over $12k. I can't recommend it enough!",
            "This is genuinely the best investment I've made. The strategies are practical and the results speak for themselves. I hit $8,500 in my first full month.",
            "I was skeptical at first but the results have been incredible. Clear, actionable steps that actually work. Already made back 10x what I paid.",
            "Blown away by how quickly things changed once I applied the system. $6,200 in my second month. This is the real deal.",
        ];
        const fours = [
            "Really solid program overall. Took a little time to see results but by month two I was seeing consistent income. Would recommend to anyone serious.",
            "Great value and very thorough. I'd like a bit more 1-on-1 support, but the content itself is excellent and the strategies definitely work.",
        ];
        const pool = rating === 5 ? fives : fours;
        return pool[Math.floor(Math.random() * pool.length)];
    };

    return (
        <div className="review-slider-workspace">
            {/* Control Panel */}
            <div className="controls-panel">
                <div className="control-group">
                    <span className="control-label">Upload Reviews</span>
                    <label className="btn-primary">
                        <Upload size={18} />
                        Add Screenshots
                        <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="file-input" />
                    </label>
                </div>

                <div className="control-group">
                    <span className="control-label">Playback</span>
                    <div className="flex gap-2">
                        <button
                            className="btn-primary"
                            onClick={() => setIsPlaying(!isPlaying)}
                            disabled={images.length === 0}
                            style={{ backgroundColor: isPlaying ? '#ef4444' : '#3b82f6', width: '120px', justifyContent: 'center' }}
                        >
                            {isPlaying ? <><Pause size={18} /> Stop</> : <><Play size={18} /> Play</>}
                        </button>
                        <button className="btn-secondary" onClick={handleClear} title="Clear All">
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>

                <div className="control-group">
                    <span className="control-label">Speed</span>
                    <div className="slider-container">
                        <span className="text-xs">Slower</span>
                        <input type="range" min="0.5" max="10" step="0.5" value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} className="speed-slider" />
                        <span className="text-xs">Faster</span>
                    </div>
                </div>

                {/* AI Generator */}
                <div className="control-group">
                    <span className="control-label">🤖 AI Review Generator</span>
                    <button
                        className="btn-primary"
                        onClick={generateAndDownload}
                        disabled={isGenerating}
                        style={{ backgroundColor: isGenerating ? '#475569' : '#7c3aed' }}
                    >
                        {isGenerating ? <><Loader size={18} className="spin" /> Generating…</> : <><Download size={18} /> Generate & Download</>}
                    </button>
                    {generateStatus && (
                        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, lineHeight: 1.5 }}>
                            {generateStatus}
                        </div>
                    )}
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                        Generates 10 AI reviews across 5 platforms, screenshots each, and downloads as a zip.
                    </div>
                </div>
            </div>

            {/* iPhone Frame */}
            <div className={`iphone-frame ${isPlaying ? 'is-playing' : ''}`}>
                <div className="status-bar-time">{getCurrentTime()}</div>
                <div className="dynamic-island"></div>
                <div className="status-bar-icons">
                    <Signal size={14} fill="currentColor" />
                    <Wifi size={14} />
                    <Battery size={14} fill="currentColor" />
                </div>

                <div className="screen-content" ref={scrollRef}>
                    {images.length === 0 ? (
                        <div className="empty-state">
                            <Upload size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                            <p>Upload screenshot images to begin.</p>
                        </div>
                    ) : (
                        <div className="reviews-feed">
                            {images.map((img, index) => (
                                <img key={index} src={img} alt={`Review ${index + 1}`} className="review-image" />
                            ))}
                            <div style={{ height: '100px' }}></div>
                        </div>
                    )}
                </div>
            </div>

            {/* Hidden review cards for html2canvas capture */}
            <div ref={hiddenContainerRef} style={{ position: 'fixed', left: -9999, top: 0, pointerEvents: 'none' }}>
                {generatedReviews.map((review, i) => (
                    <div key={i} data-review-card style={{ marginBottom: 20 }}>
                        <ReviewCard review={review} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewSliderApp;
