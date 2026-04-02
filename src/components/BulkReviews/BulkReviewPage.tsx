import React, { useState } from 'react';
import { generateMixedBulkContent, type MixedContentItem } from '../../services/openai';
import './BulkReviews.css';
import { Link } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, MessageCircle, Share2, Heart, MoreHorizontal, X, Zap, ThumbsDown, Mail, Star, Eye, EyeOff } from 'lucide-react';

type ReviewMode = 'default' | 'tinnitus' | 'tinnitus-chat' | 'tinnitus-coaching';

// ─── Sales Phrase Highlighter ─────────────────────────────────────────────────
const SALES_PHRASES = [
    'free', 'FREE', 'Free',
    'AI chat', 'ai chat', 'AI Chat', 'tinnitus chat', 'Tinnitus Chat', 'Dan\'s chat', 'dans chat',
    'saved my life', 'changed my life', 'life-changing', 'game changer', 'game plan',
    'reduction', 'reduced', 'went down', 'decreased', 'improvement',
    'hopeful', 'hope', 'anxiety', 'fear', 'panic', 'relief',
    'habituation', 'habituated', 'results', 'working', 'it works', 'actually works',
    'sleep better', 'sleeping again', 'quality of life',
];

const highlightSalesLines = (text: string): React.ReactNode => {
    if (!text) return text;
    // Build regex from phrases, longest first to avoid partial matches
    const sorted = [...SALES_PHRASES].sort((a, b) => b.length - a.length);
    const escaped = sorted.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    // Also match dollar amounts like $4,997 or $397
    const pattern = new RegExp(`(\\$[\\d,]+(?:\\.\\d+)?|\\d+%\\s*[Rr]eduction[\\w\\s]*|${escaped.join('|')})`, 'gi');
    const parts = text.split(pattern);
    return parts.map((part, i) => {
        if (pattern.test(part)) {
            pattern.lastIndex = 0; // reset regex state
            return <span key={i} className="sales-highlight">{part}</span>;
        }
        // Reset lastIndex for next test too
        pattern.lastIndex = 0;
        return part;
    });
};

const MODE_CONFIG: Record<ReviewMode, { icon: string; title: string; subtitle: string; emptyDesc: string; emptyHint: string; btnLabel: string }> = {
    default: {
        icon: '🔥',
        title: '🔥 AI Review Generator',
        subtitle: 'Generate a mix of Facebook, Gmail, Messenger, TikTok & YouTube content about Code On Fire',
        emptyDesc: 'AI-powered mixed social proof about Code On Fire.',
        emptyHint: 'Each item will be a random mix of Facebook posts, Gmail threads, Messenger conversations, TikTok comments, and YouTube comments.',
        btnLabel: '',
    },
    tinnitus: {
        icon: '👂',
        title: '👂 Tinnitus Habituation Reviews',
        subtitle: 'Generate mixed content about Dan Plants\' tinnitus habituation program',
        emptyDesc: 'AI-powered mixed social proof about Dan Plants\' tinnitus habituation program.',
        emptyHint: 'Each item will be a random mix of Facebook posts, Gmail threads, Messenger conversations, TikTok comments, and YouTube comments.',
        btnLabel: 'Tinnitus',
    },
    'tinnitus-chat': {
        icon: '💬',
        title: '💬 Tinnitus Chat Reviews',
        subtitle: 'Generate mixed content about Dan\'s free tinnitus AI chat',
        emptyDesc: 'AI-powered mixed social proof about Dan\'s free tinnitus chat.',
        emptyHint: 'Each item will be a random mix of Facebook posts, Gmail threads, Messenger conversations, TikTok comments, and YouTube comments.',
        btnLabel: 'Chat',
    },
    'tinnitus-coaching': {
        icon: '🎧',
        title: '🎧 Coaching Session Reviews',
        subtitle: 'Generate mixed content about Dan\'s 1-on-1 tinnitus coaching sessions',
        emptyDesc: 'AI-powered mixed social proof about Dan\'s personalized tinnitus coaching sessions.',
        emptyHint: 'Each item will be a random mix of Facebook posts, Gmail threads, Messenger conversations, TikTok comments, and YouTube comments.',
        btnLabel: 'Coaching',
    },
};

const TYPE_BADGE: Record<string, { label: string; color: string }> = {
    facebook: { label: '📱 Facebook', color: '#1877f2' },
    gmail: { label: '📧 Gmail', color: '#ea4335' },
    messenger: { label: '💬 Messenger', color: '#0084ff' },
    tiktok: { label: '🎵 TikTok', color: '#fe2c55' },
    youtube: { label: '▶️ YouTube', color: '#ff0000' },
};

const BulkReviewPage: React.FC = () => {
    const [items, setItems] = useState<MixedContentItem[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [total, setTotal] = useState(0);
    const [count, setCount] = useState(25);
    const [error, setError] = useState('');
    const [incomeMin, setIncomeMin] = useState('10000');
    const [incomeMax, setIncomeMax] = useState('150000');
    const [mode, setMode] = useState<ReviewMode>('default');
    const [blurNames, setBlurNames] = useState(false);

    const cfg = MODE_CONFIG[mode];

    const handleGenerate = async () => {
        setIsGenerating(true);
        setError('');
        setProgress(0);
        setItems([]);
        setTotal(count);

        try {
            const min = parseInt(incomeMin.replace(/[^0-9]/g, '')) || 10000;
            const max = parseInt(incomeMax.replace(/[^0-9]/g, '')) || 150000;
            const results = await generateMixedBulkContent(count, mode, min, max, (done, total) => {
                setProgress(done);
                setTotal(total);
            });
            setItems(results);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Generation failed');
        } finally {
            setIsGenerating(false);
        }
    };

    const switchMode = (newMode: ReviewMode) => {
        setMode(newMode);
        setItems([]);
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
                    {/* 4-Way Mode Selector */}
                    <div className="mode-selector-wrap">
                        <button className={`mode-btn ${mode === 'default' ? 'active mode-fire' : ''}`} onClick={() => switchMode('default')}>🔥 Code On Fire</button>
                        <button className={`mode-btn ${mode === 'tinnitus' ? 'active mode-tinnitus' : ''}`} onClick={() => switchMode('tinnitus')}>👂 Tinnitus</button>
                        <button className={`mode-btn ${mode === 'tinnitus-chat' ? 'active mode-chat' : ''}`} onClick={() => switchMode('tinnitus-chat')}>💬 Tinnitus Chat</button>
                        <button className={`mode-btn ${mode === 'tinnitus-coaching' ? 'active mode-coaching' : ''}`} onClick={() => switchMode('tinnitus-coaching')}>🎧 1-on-1 Coaching</button>
                    </div>

                    {/* Blur Names Toggle */}
                    <div className="blur-toggle-wrap">
                        <label className="blur-toggle">
                            <input type="checkbox" checked={blurNames} onChange={e => setBlurNames(e.target.checked)} />
                            <span className="blur-toggle-slider" />
                        </label>
                        <span className="blur-toggle-label">
                            {blurNames ? <EyeOff size={14} /> : <Eye size={14} />}
                            {blurNames ? 'Names Blurred' : 'Blur Names'}
                        </span>
                    </div>

                    <div className="bulk-count-control">
                        <label>Number of items to generate:</label>
                        <div className="count-selector">
                            {[10, 15, 20, 25, 30].map(n => (
                                <button key={n} className={`count-btn ${count === n ? 'active' : ''}`} onClick={() => setCount(n)}>{n}</button>
                            ))}
                        </div>
                    </div>

                    {mode === 'default' && (
                        <div className="bulk-income-range">
                            <label>Income range:</label>
                            <div className="income-range-inputs">
                                <span>$</span>
                                <input type="number" className="income-input" value={incomeMin} onChange={e => setIncomeMin(e.target.value)} placeholder="10000" min="1000" />
                                <span className="income-dash">→</span>
                                <span>$</span>
                                <input type="number" className="income-input" value={incomeMax} onChange={e => setIncomeMax(e.target.value)} placeholder="150000" min="1000" />
                                <span className="income-label">/ month</span>
                            </div>
                        </div>
                    )}

                    <button className="bulk-generate-btn" onClick={handleGenerate} disabled={isGenerating}>
                        {isGenerating ? (
                            <><div className="spin-ring" /> Generating... ({progress}/{total})</>
                        ) : (
                            <><Zap size={18} /> Generate {count} {cfg.btnLabel ? cfg.btnLabel + ' ' : ''}Mixed Reviews</>
                        )}
                    </button>
                </div>

                {isGenerating && (
                    <div className="progress-bar-track">
                        <div className="progress-bar-fill" style={{ width: total > 0 ? `${(progress / total) * 100}%` : '0%' }} />
                    </div>
                )}
                {error && <div className="bulk-error">{error}</div>}
            </div>

            {/* Mixed Content Grid */}
            {items.length > 0 && (
                <div className="bulk-reviews-grid">
                    {items.map((item, idx) => (
                        <div key={idx} className="bulk-review-wrapper">
                            <div className="bulk-review-number">#{idx + 1}</div>
                            <div className="bulk-type-badge" style={{ borderColor: TYPE_BADGE[item.type].color, color: TYPE_BADGE[item.type].color }}>
                                {TYPE_BADGE[item.type].label}
                            </div>
                            <MixedCard item={item} blurNames={blurNames} />
                        </div>
                    ))}
                </div>
            )}

            {!isGenerating && items.length === 0 && (
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


// ─── Mixed Card Renderer ──────────────────────────────────────────────────────
const MixedCard: React.FC<{ item: MixedContentItem; blurNames: boolean }> = ({ item, blurNames }) => {
    switch (item.type) {
        case 'facebook':
            return item.fbReview ? <FBPostCard review={item.fbReview} blurNames={blurNames} /> : null;
        case 'gmail':
            return item.gmailThread ? <GmailCard thread={item.gmailThread} blurNames={blurNames} /> : null;
        case 'messenger':
            return item.messengerThread ? <MessengerCard thread={item.messengerThread} blurNames={blurNames} /> : null;
        case 'tiktok':
            return item.tiktokComment ? <TikTokCard comment={item.tiktokComment} blurNames={blurNames} /> : null;
        case 'youtube':
            return item.youtubeComment ? <YouTubeCard comment={item.youtubeComment} blurNames={blurNames} /> : null;
        default:
            return null;
    }
};


// ─── Facebook Post Card ───────────────────────────────────────────────────────
const FBPostCard: React.FC<{ review: { name: string; avatarUrl: string; review: string; likes: number; comments: number; shares: number; timestamp: string }; blurNames?: boolean }> = ({ review, blurNames }) => {
    const [expanded, setExpanded] = useState(false);
    const shouldTruncate = review.review.length > 220;
    const displayText = expanded || !shouldTruncate ? review.review : review.review.slice(0, 220) + '...';
    const nc = blurNames ? 'blur-name' : '';

    return (
        <div className="fb-card-frame">
            <div className="fbc-header">
                <img src={review.avatarUrl} alt={review.name} className="fbc-avatar" onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=random&size=80`; }} />
                <div className="fbc-header-info">
                    <div className="fbc-author-row">
                        <span className={`fbc-name ${nc}`}>{review.name}</span>
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
            <div className="fbc-content">
                {highlightSalesLines(displayText)}
                {shouldTruncate && !expanded && <span className="fbc-see-more" onClick={() => setExpanded(true)}> See more</span>}
            </div>
            <div className="fbc-stats-bar">
                <div className="fbc-like-group">
                    <div className="fbc-like-circle"><ThumbsUp size={9} fill="white" strokeWidth={0} /></div>
                    <div className="fbc-heart-circle"><Heart size={9} fill="white" strokeWidth={0} /></div>
                    <span className="fbc-stats-text">{review.likes.toLocaleString()}</span>
                </div>
                <div className="fbc-stats-text">{review.comments} comments · {review.shares} shares</div>
            </div>
            <div className="fbc-action-bar">
                <button className="fbc-action-btn"><ThumbsUp size={16} /> Like</button>
                <button className="fbc-action-btn"><MessageCircle size={16} /> Comment</button>
                <button className="fbc-action-btn"><Share2 size={16} /> Share</button>
            </div>
        </div>
    );
};


// ─── Gmail Card ───────────────────────────────────────────────────────────────
const GmailCard: React.FC<{ thread: { subject: string; messages: Array<{ senderName: string; content: string; isMe: boolean }> }; blurNames?: boolean }> = ({ thread, blurNames }) => {
    const nc = blurNames ? 'blur-name' : '';
    return (
        <div className="gmail-card-frame">
            <div className="gmail-card-header">
                <Mail size={16} color="#ea4335" />
                <span className="gmail-card-subject">{thread.subject}</span>
                <Star size={14} color="#ccc" />
            </div>
            <div className="gmail-card-messages">
                {thread.messages.slice(0, 4).map((msg, i) => (
                    <div key={i} className={`gmail-card-msg ${msg.isMe ? 'is-me' : ''}`}>
                        <div className="gmail-card-msg-header">
                            <span className={`gmail-card-sender ${!msg.isMe ? nc : ''}`}>{msg.senderName}</span>
                            {msg.isMe && <span className="gmail-card-me-badge">me</span>}
                        </div>
                        <div className="gmail-card-msg-body">{highlightSalesLines(msg.content.length > 140 ? msg.content.slice(0, 140) + '...' : msg.content)}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};


// ─── Messenger Card ───────────────────────────────────────────────────────────
const MessengerCard: React.FC<{ thread: { contactName: string; messages: Array<{ text: string; isMe: boolean }> }; blurNames?: boolean }> = ({ thread, blurNames }) => {
    const nc = blurNames ? 'blur-name' : '';
    return (
        <div className="messenger-card-frame">
            <div className="messenger-card-header">
                <div className="messenger-card-avatar">{thread.contactName.charAt(0)}</div>
                <div>
                    <div className={`messenger-card-name ${nc}`}>{thread.contactName}</div>
                    <div className="messenger-card-status">Active now</div>
                </div>
            </div>
            <div className="messenger-card-messages">
                {thread.messages.slice(0, 6).map((msg, i) => (
                    <div key={i} className={`messenger-card-bubble ${msg.isMe ? 'me' : 'them'}`}>
                        {highlightSalesLines(msg.text.length > 120 ? msg.text.slice(0, 120) + '...' : msg.text)}
                    </div>
                ))}
            </div>
        </div>
    );
};


// ─── TikTok Card ──────────────────────────────────────────────────────────────
const TikTokCard: React.FC<{ comment: { username: string; text: string; likes: string; avatar: string }; blurNames?: boolean }> = ({ comment, blurNames }) => {
    const nc = blurNames ? 'blur-name' : '';
    return (
        <div className="tiktok-card-frame">
            <div className="tiktok-card-header">
                <span className="tiktok-card-logo">TikTok</span>
                <span className="tiktok-card-section">Comments</span>
            </div>
            <div className="tiktok-card-body">
                <img src={comment.avatar} alt="" className="tiktok-card-avatar" onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.username)}&background=random&size=40`; }} />
                <div className="tiktok-card-content">
                    <div className={`tiktok-card-username ${nc}`}>{comment.username}</div>
                    <div className="tiktok-card-text">{highlightSalesLines(comment.text)}</div>
                    <div className="tiktok-card-meta">
                        <span>2d ago</span>
                        <span>Reply</span>
                    </div>
                </div>
                <div className="tiktok-card-likes">
                    <Heart size={16} color="#8a8b91" />
                    <span>{comment.likes}</span>
                </div>
            </div>
        </div>
    );
};


// ─── YouTube Card ─────────────────────────────────────────────────────────────
const YouTubeCard: React.FC<{ comment: { handle: string; text: string; likes: string; timeAgo: string }; blurNames?: boolean }> = ({ comment, blurNames }) => {
    const nc = blurNames ? 'blur-name' : '';
    return (
        <div className="youtube-card-frame">
            <div className="youtube-card-header">
                <span className="youtube-card-logo">YouTube</span>
                <span className="youtube-card-section">Comments</span>
            </div>
            <div className="youtube-card-body">
                <div className="youtube-card-avatar">{comment.handle.substring(1, 2).toUpperCase()}</div>
                <div className="youtube-card-content">
                    <div className="youtube-card-handle-row">
                        <span className={`youtube-card-handle ${nc}`}>{comment.handle}</span>
                        <span className="youtube-card-time">• {comment.timeAgo}</span>
                    </div>
                    <div className="youtube-card-text">{highlightSalesLines(comment.text)}</div>
                    <div className="youtube-card-actions">
                        <ThumbsUp size={14} color="#aaa" />
                        <span className="youtube-card-likes">{comment.likes}</span>
                        <ThumbsDown size={14} color="#aaa" />
                        <span className="youtube-card-reply">Reply</span>
                    </div>
                </div>
            </div>
        </div>
    );
};


export { FBPostCard };
export default BulkReviewPage;
