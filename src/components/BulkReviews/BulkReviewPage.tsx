import React, { useState } from 'react';
import { generateAIBatchReviews, type GeneratedReview } from '../../services/openai';
import './BulkReviews.css';
import { Link } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, MessageCircle, Share2, Heart, MoreHorizontal, X, Zap } from 'lucide-react';


const BulkReviewPage: React.FC = () => {
    const [reviews, setReviews] = useState<GeneratedReview[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [total, setTotal] = useState(0);
    const [count, setCount] = useState(25);
    const [error, setError] = useState('');
    const [incomeMin, setIncomeMin] = useState('10000');
    const [incomeMax, setIncomeMax] = useState('150000');

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
            }, min, max);
            setReviews(results);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Generation failed');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="bulk-reviews-page">
            {/* Header */}
            <div className="bulk-header">
                <Link to="/" className="bulk-back-btn">
                    <ArrowLeft size={18} /> Back
                </Link>
                <div className="bulk-header-center">
                    <h1 className="bulk-title">🔥 AI Review Generator</h1>
                    <p className="bulk-subtitle">Generate realistic Facebook testimonials about Code On Fire</p>
                </div>
                <div style={{ width: 80 }} />
            </div>

            {/* Controls */}
            <div className="bulk-controls-bar">
                <div className="bulk-controls-inner">
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

                    {/* Income Range */}
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
                                Generate {count} Reviews with AI
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
                    <div className="empty-icon">🔥</div>
                    <h2>Ready to Generate</h2>
                    <p>Click the button above to generate {count} AI-powered Facebook review screenshots about Code On Fire.</p>
                    <p className="empty-hint">Each post will have a unique name, avatar, review text, and engagement numbers — all mentioning Dan and Code On Fire profits.</p>
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
                        <span className="fbc-globe">🌐</span>
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
