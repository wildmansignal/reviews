import React, { useState } from 'react';
import { generateAIBatchReviews, type GeneratedReview } from '../../services/openai';
import './BulkReviews.css';
import { Link } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, MessageCircle, Share2, Heart, MoreHorizontal, X, Zap } from 'lucide-react';

type ReviewMode = 'default' | 'tinnitus' | 'tinnitus-chat';

const MODE_CONFIG: Record<ReviewMode, { icon: string; title: string; subtitle: string; emptyDesc: string; emptyHint: string; btnLabel: string }> = {
    default: {
        icon: '🔥',
        title: '🔥 AI Review Generator',
        subtitle: 'Generate realistic Facebook testimonials about Code On Fire',
        emptyDesc: 'AI-powered Facebook review screenshots about Code On Fire.',
        emptyHint: 'Each post will have a unique name, avatar, review text, and engagement numbers — all mentioning Dan and Code On Fire profits.',
        btnLabel: '',
    },
    tinnitus: {
        icon: '👂',
        title: '👂 Tinnitus Habituation Reviews',
        subtitle: 'Generate tinnitus habituation success stories for Dan Plants\' program',
        emptyDesc: 'AI-powered Facebook success stories about Dan Plants\' tinnitus habituation program.',
        emptyHint: 'Each post will have a unique name, avatar, and authentic habituation success story — mentioning Dan Plants and his program by name.',
        btnLabel: 'Tinnitus',
    },
    'tinnitus-chat': {
        icon: '💬',
        title: '💬 Tinnitus Chat Reviews',
        subtitle: 'Generate positive reviews about Dan\'s free tinnitus AI chat',
        emptyDesc: 'AI-powered Facebook reviews about Dan\'s free tinnitus chat.',
        emptyHint: 'Each post will share a positive experience with Dan\'s free tinnitus AI chat — how it gave them hope, a game plan, and reduced their anxiety.',
        btnLabel: 'Chat',
    },
};

const BulkReviewPage: React.FC = () => {
    const [reviews, setReviews] = useState<GeneratedReview[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [total, setTotal] = useState(0);
    const [count, setCount] = useState(25);
    const [error, setError] = useState('');
    const [incomeMin, setIncomeMin] = useState('10000');
    const [incomeMax, setIncomeMax] = useState('150000');
    const [mode, setMode] = useState<ReviewMode>('default');

    const cfg = MODE_CONFIG[mode];

    const handleGenerate = async () => {
        setIsGenerating(true);
        setError('');
        setProgress(0);
        setReviews([]);
        setTotal(count);

        try {
            const min = parseInt(incomeMin.replace(/[^0-9]/g, '')) || 10000;
            const max = parseInt(incomeMax.replace(/[^0-9]/g, '')) || 150000;
            const results = await generateAIBatchReviews(count, (done, total) => {
                setProgress(done);
                setTotal(total);
            }, min, max, mode);
            setReviews(results);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Generation failed');
        } finally {
            setIsGenerating(false);
        }
    };

    const switchMode = (newMode: ReviewMode) => {
        setMode(newMode);
        setReviews([]);
    };

    return (
        <div className="bulk-reviews-page">
            {/* Header */}
            <div className="bulk-header">
                <Link to="/" className="bulk-back-btn">
                    <ArrowLeft size={18} /> Back
                </Link>
                <div className="bulk-header-center">
                    <h1 className="bulk-title">{cfg.title}</h1>
                    <p className="bulk-subtitle">{cfg.subtitle}</p>
                </div>
                <div style={{ width: 80 }} />
            </div>

            {/* Controls */}
            <div className="bulk-controls-bar">
                <div className="bulk-controls-inner">
                    {/* 3-Way Mode Selector */}
                    <div className="mode-selector-wrap">
                        <button
                            className={`mode-btn ${mode === 'default' ? 'active mode-fire' : ''}`}
                            onClick={() => switchMode('default')}
                        >
                            🔥 Code On Fire
                        </button>
                        <button
                            className={`mode-btn ${mode === 'tinnitus' ? 'active mode-tinnitus' : ''}`}
                            onClick={() => switchMode('tinnitus')}
                        >
                            👂 Tinnitus
                        </button>
                        <button
                            className={`mode-btn ${mode === 'tinnitus-chat' ? 'active mode-chat' : ''}`}
                            onClick={() => switchMode('tinnitus-chat')}
                        >
                            💬 Tinnitus Chat
                        </button>
                    </div>

                    <div className="bulk-count-control">
                        <label>Number of reviews to generate:</label>
                        <div className="count-selector">
                            {[10, 15, 20, 25, 30].map(n => (
                                <button
                                    key={n}
                                    className={`count-btn ${count === n ? 'active' : ''}`}
                                    onClick={() => setCount(n)}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Income Range — only shown in default mode */}
                    {mode === 'default' && (
                        <div className="bulk-income-range">
                            <label>Income range in reviews:</label>
                            <div className="income-range-inputs">
                                <span>$</span>
                                <input
                                    type="number"
                                    className="income-input"
                                    value={incomeMin}
                                    onChange={e => setIncomeMin(e.target.value)}
                                    placeholder="10000"
                                    min="1000"
                                />
                                <span className="income-dash">→</span>
                                <span>$</span>
                                <input
                                    type="number"
                                    className="income-input"
                                    value={incomeMax}
                                    onChange={e => setIncomeMax(e.target.value)}
                                    placeholder="150000"
                                    min="1000"
                                />
                                <span className="income-label">/ month</span>
                            </div>
                        </div>
                    )}

                    <button
                        className="bulk-generate-btn"
                        onClick={handleGenerate}
                        disabled={isGenerating}
                    >
                        {isGenerating ? (
                            <>
                                <div className="spin-ring" />
                                Generating... ({progress}/{total})
                            </>
                        ) : (
                            <>
                                <Zap size={18} />
                                Generate {count} {cfg.btnLabel ? cfg.btnLabel + ' ' : ''}Reviews with AI
                            </>
                        )}
                    </button>
                </div>

                {isGenerating && (
                    <div className="progress-bar-track">
                        <div
                            className="progress-bar-fill"
                            style={{ width: total > 0 ? `${(progress / total) * 100}%` : '0%' }}
                        />
                    </div>
                )}
                {error && <div className="bulk-error">{error}</div>}
            </div>

            {/* Grid of Facebook Posts */}
            {reviews.length > 0 && (
                <div className="bulk-reviews-grid">
                    {reviews.map((review, idx) => (
                        <div key={idx} className="bulk-review-wrapper">
                            <div className="bulk-review-number">#{idx + 1}</div>
                            <div className="fb-post-card">
                                <FBPostCard review={review} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!isGenerating && reviews.length === 0 && (
                <div className="bulk-empty-state">
                    <div className="empty-icon">{cfg.icon}</div>
                    <h2>Ready to Generate</h2>
                    <p>Click the button above to generate {count} {cfg.emptyDesc}</p>
                    <p className="empty-hint">{cfg.emptyHint}</p>
                </div>
            )}
        </div>
    );
};

// Individual Facebook Post Card
const FBPostCard: React.FC<{ review: GeneratedReview }> = ({ review }) => {
    const [expanded, setExpanded] = useState(false);
    const shouldTruncate = review.review.length > 220;
    const displayText = expanded || !shouldTruncate ? review.review : review.review.slice(0, 220) + '...';

    return (
        <div className="fb-card-frame">
            {/* Header */}
            <div className="fbc-header">
                <img
                    src={review.avatarUrl}
                    alt={review.name}
                    className="fbc-avatar"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=random&size=80`;
                    }}
                />
                <div className="fbc-header-info">
                    <div className="fbc-author-row">
                        <span className="fbc-name">{review.name}</span>
                        <span className="fbc-dot">·</span>
                        <span className="fbc-follow">Follow</span>
                    </div>
                    <div className="fbc-meta-row">
                        <span className="fbc-time">{review.timestamp}</span>
                        <span className="fbc-dot">·</span>
                        <img src="/my-avatar/profile.jpg" alt="Dan" style={{ width: 14, height: 14, borderRadius: '50%', objectFit: 'cover', border: '1px solid #ccc', verticalAlign: 'middle' }} />
                    </div>
                </div>
                <div className="fbc-header-actions">
                    <MoreHorizontal size={20} color="#65676b" />
                    <X size={20} color="#65676b" />
                </div>
            </div>

            {/* Content */}
            <div className="fbc-content">
                {displayText}
                {shouldTruncate && !expanded && (
                    <span className="fbc-see-more" onClick={() => setExpanded(true)}> See more</span>
                )}
            </div>

            {/* Stats Bar */}
            <div className="fbc-stats-bar">
                <div className="fbc-like-group">
                    <div className="fbc-like-circle">
                        <ThumbsUp size={9} fill="white" strokeWidth={0} />
                    </div>
                    <div className="fbc-heart-circle">
                        <Heart size={9} fill="white" strokeWidth={0} />
                    </div>
                    <span className="fbc-stats-text">{review.likes.toLocaleString()}</span>
                </div>
                <div className="fbc-stats-text">
                    {review.comments} comments · {review.shares} shares
                </div>
            </div>

            {/* Action Bar */}
            <div className="fbc-action-bar">
                <button className="fbc-action-btn">
                    <ThumbsUp size={16} /> Like
                </button>
                <button className="fbc-action-btn">
                    <MessageCircle size={16} /> Comment
                </button>
                <button className="fbc-action-btn">
                    <Share2 size={16} /> Share
                </button>
            </div>
        </div>
    );
};

export { FBPostCard };
export default BulkReviewPage;
