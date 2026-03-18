import React, { useState, useCallback } from 'react';
import { generateAllProfiles, type ResultsProfile } from '../../services/openai';
import { getSeededAvatar } from '../../utils/avatarUtils';
import './ResultsProfiles.css';

// ── Income formatter ───────────────────────────────────────────────────────
const fmt = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;
const fmtFull = (n: number) => `$${n.toLocaleString()}`;

// ── FB Post Card ───────────────────────────────────────────────────────────
const FBCard: React.FC<{ p: ResultsProfile }> = ({ p }) => (
    <div className="rp-card rp-fb">
        <div className="rp-card-label">📘 Facebook Post</div>
        <div className="rp-fb-header">
            <img src={p.avatarUrl} className="rp-fb-avatar" alt={p.name} />
            <div>
                <div className="rp-fb-name">{p.name}</div>
                <div className="rp-fb-meta">{p.fbTimestamp} · 🌎</div>
            </div>
            <div className="rp-fb-follow">Follow</div>
        </div>
        <p className="rp-fb-text">{p.fbPost}</p>
        <div className="rp-fb-stats">
            <span>👍 {p.fbLikes}</span>
            <span style={{ marginLeft: 'auto' }}>{p.fbComments} comments · {p.fbShares} shares</span>
        </div>
        <div className="rp-fb-actions">
            <span>👍 Like</span>
            <span>💬 Comment</span>
            <span>↗️ Share</span>
        </div>
    </div>
);

// ── Income / Bank Card ─────────────────────────────────────────────────────
const IncomeCard: React.FC<{ p: ResultsProfile }> = ({ p }) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const bars = Array.from({ length: 6 }, (_, i) => {
        const pct = 0.35 + (i / 5) * 0.5 + (Math.random() - 0.5) * 0.1;
        return { month: months[(now.getMonth() - 5 + i + 12) % 12], pct: Math.min(0.95, Math.max(0.2, pct)) };
    });
    return (
        <div className="rp-card rp-income">
            <div className="rp-card-label">🏦 Income Screenshot</div>
            <div className="rp-income-bank">{p.bankLabel}</div>
            <div className="rp-income-balance">{p.bankBalance}</div>
            <div className="rp-income-sublabel">Available balance</div>
            <div className="rp-income-monthly">
                <span className="rp-income-monthly-label">Monthly Income</span>
                <span className="rp-income-monthly-val">{fmtFull(p.income)}</span>
            </div>
            <div className="rp-income-bars">
                {bars.map(b => (
                    <div key={b.month} className="rp-income-bar-col">
                        <div className="rp-income-bar-wrap">
                            <div className="rp-income-bar" style={{ height: `${b.pct * 100}%` }} />
                        </div>
                        <div className="rp-income-bar-label">{b.month}</div>
                    </div>
                ))}
            </div>
            <div className="rp-income-footer">
                <span className="rp-income-trend">↑ {Math.floor(40 + Math.random() * 80)}% vs last month</span>
            </div>
        </div>
    );
};

// ── Messenger Card ─────────────────────────────────────────────────────────
const MessengerCard: React.FC<{ p: ResultsProfile }> = ({ p }) => (
    <div className="rp-card rp-msg">
        <div className="rp-card-label">💬 Messenger</div>
        <div className="rp-msg-header">
            <img src={p.avatarUrl} className="rp-msg-avatar" alt={p.name} />
            <div>
                <div className="rp-msg-name">{p.name}</div>
                <div className="rp-msg-status">Active now</div>
            </div>
        </div>
        <div className="rp-msg-body">
            {p.messengerMessages.map((m, i) => (
                <div key={i} className={`rp-msg-row ${m.isMe ? 'me' : 'them'}`}>
                    {!m.isMe && <img src={p.avatarUrl} className="rp-msg-row-avatar" alt="" />}
                    <div className={`rp-bubble ${m.isMe ? 'me' : 'them'}`}>{m.text}</div>
                </div>
            ))}
        </div>
    </div>
);

// ── Social Comment Card ────────────────────────────────────────────────────
const SocialCard: React.FC<{ p: ResultsProfile }> = ({ p }) => {
    const isYT = p.socialPlatform === 'YouTube';
    const likes = Math.floor(8 + Math.random() * 120);
    const timeAgo = ['2y ago', '1y ago', '8mo ago', '5mo ago', '3mo ago', '1mo ago'][Math.floor(Math.random() * 6)];
    return (
        <div className={`rp-card rp-social ${isYT ? 'yt' : 'tt'}`}>
            <div className="rp-card-label">{isYT ? '▶️ YouTube' : '🎵 TikTok'} Comment</div>
            <div className="rp-social-row">
                <img src={p.avatarUrl} className="rp-social-avatar" alt={p.name} />
                <div style={{ flex: 1 }}>
                    <div className="rp-social-handle">
                        {isYT ? `@${p.socialHandle.toLowerCase().replace(/\s/g, '_')}` : `@${p.socialHandle}`}
                        {isYT && <span className="rp-yt-time"> · {timeAgo}</span>}
                    </div>
                    <div className="rp-social-text">{p.socialComment}</div>
                    <div className="rp-social-meta">
                        {isYT
                            ? <><span className="rp-yt-like">👍 {likes}</span><span className="rp-yt-reply">Reply</span></>
                            : <><span className="rp-tt-heart">❤️ {likes}</span></>}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ── Main App ───────────────────────────────────────────────────────────────
const ResultsProfilesApp: React.FC = () => {
    const [profiles, setProfiles] = useState<ResultsProfile[]>([]);
    const [activeIdx, setActiveIdx] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [total, setTotal] = useState(50);
    const [count, setCount] = useState(50);
    const [minIncome, setMinIncome] = useState(10000);
    const [maxIncome, setMaxIncome] = useState(250000);
    const [statusMsg, setStatusMsg] = useState('');

    const getAvatar = useCallback((name: string) => getSeededAvatar(name), []);

    const handleGenerate = async () => {
        setIsGenerating(true);
        setProgress(0);
        setTotal(count);
        setStatusMsg(`Generating ${count} profiles with AI…`);
        setProfiles([]);

        try {
            const result = await generateAllProfiles(
                count, minIncome, maxIncome, getAvatar,
                (done, tot) => {
                    setProgress(done);
                    setStatusMsg(`Generated ${done}/${tot} profiles…`);
                }
            );
            setProfiles(result);
            setActiveIdx(0);
            setStatusMsg('');
        } catch (e) {
            setStatusMsg(`Error: ${e instanceof Error ? e.message : 'Generation failed'}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const active = profiles[activeIdx];

    return (
        <div className="rp-app">
            {/* ─── Left Sidebar ─── */}
            <div className="rp-sidebar">
                <div className="rp-sidebar-top">
                    <div className="rp-sidebar-title">🎯 Results Profiles</div>

                    {/* Controls */}
                    <div className="rp-controls">
                        <div className="rp-ctrl-row">
                            <label>Min Income</label>
                            <select value={minIncome} onChange={e => setMinIncome(+e.target.value)} className="rp-select">
                                {[5000, 10000, 20000, 25000, 50000, 75000, 100000].map(v =>
                                    <option key={v} value={v}>{fmt(v)}/mo</option>)}
                            </select>
                        </div>
                        <div className="rp-ctrl-row">
                            <label>Max Income</label>
                            <select value={maxIncome} onChange={e => setMaxIncome(+e.target.value)} className="rp-select">
                                {[25000, 50000, 75000, 100000, 150000, 200000, 250000, 500000].map(v =>
                                    <option key={v} value={v}>{fmt(v)}/mo</option>)}
                            </select>
                        </div>
                        <div className="rp-ctrl-row">
                            <label>People: {count}</label>
                            <input type="range" min={5} max={50} value={count}
                                onChange={e => setCount(+e.target.value)}
                                style={{ flex: 1, accentColor: '#ff6b35' }} />
                        </div>

                        <button
                            className="rp-generate-btn"
                            onClick={handleGenerate}
                            disabled={isGenerating}
                        >
                            {isGenerating
                                ? `⏳ ${progress}/${total} profiles…`
                                : '🎲 Generate Profiles'}
                        </button>

                        {/* Progress bar */}
                        {isGenerating && (
                            <div className="rp-progress-bar-wrap">
                                <div className="rp-progress-bar" style={{ width: `${(progress / total) * 100}%` }} />
                            </div>
                        )}
                        {statusMsg && !isGenerating && (
                            <div className="rp-status">{statusMsg}</div>
                        )}
                    </div>
                </div>

                {/* Person List */}
                <div className="rp-person-list">
                    {profiles.map((p, i) => (
                        <div
                            key={i}
                            className={`rp-person-row ${i === activeIdx ? 'active' : ''}`}
                            onClick={() => setActiveIdx(i)}
                        >
                            <img src={p.avatarUrl} className="rp-person-avatar" alt={p.name} />
                            <div className="rp-person-info">
                                <div className="rp-person-name">{p.name}</div>
                                <div className="rp-person-income">{fmt(p.income)}/mo 🎉</div>
                            </div>
                            <div className="rp-person-num">#{i + 1}</div>
                        </div>
                    ))}
                    {profiles.length === 0 && !isGenerating && (
                        <div className="rp-empty">Click Generate to create profiles</div>
                    )}
                </div>
            </div>

            {/* ─── Main Canvas ─── */}
            <div className="rp-canvas">
                {active ? (
                    <>
                        {/* Profile Header */}
                        <div className="rp-canvas-header">
                            <img src={active.avatarUrl} className="rp-canvas-avatar" alt={active.name} />
                            <div>
                                <div className="rp-canvas-name">{active.name}</div>
                                <div className="rp-canvas-income">Making {fmtFull(active.income)}/month with Code On Fire</div>
                            </div>
                            <div className="rp-canvas-badge">{fmt(active.income)}/mo</div>
                        </div>

                        {/* 2×2 Grid of Cards */}
                        <div className="rp-grid">
                            <FBCard p={active} />
                            <IncomeCard p={active} />
                            <MessengerCard p={active} />
                            <SocialCard p={active} />
                        </div>
                    </>
                ) : (
                    <div className="rp-canvas-empty">
                        {isGenerating
                            ? <div className="rp-canvas-generating">
                                <div className="rp-spinner" />
                                <div>{statusMsg}</div>
                                <div className="rp-canvas-sub">Generating {count} profiles with real AI content…</div>
                            </div>
                            : <div style={{ textAlign: 'center', color: '#555' }}>
                                <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
                                <div style={{ fontSize: 20, fontWeight: 700, color: '#aaa', marginBottom: 8 }}>Results Profile Generator</div>
                                <div style={{ fontSize: 14, color: '#666', maxWidth: 360 }}>
                                    Set your income range and click <strong style={{ color: '#ff6b35' }}>Generate Profiles</strong> to create up to 50 complete people — each with a Facebook post, income screenshot, Messenger convo, and social comment.
                                </div>
                            </div>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultsProfilesApp;
