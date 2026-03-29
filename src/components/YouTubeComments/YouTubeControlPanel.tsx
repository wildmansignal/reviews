import React, { useState } from 'react';
import { generateYouTubeComments } from '../../services/openai';
import './YouTubeComments.css';

interface YouTubeControlPanelProps {
    myAvatar: string;
    setMyAvatar: (val: string) => void;
    creatorAvatar: string;
    setCreatorAvatar: (val: string) => void;
    selectedComment: any;
    onUpdateComment: (id: string, field: string, value: any) => void;
    onAddComment: () => void;
    onAIGenerate?: (comments: any[]) => void;
}

const YouTubeControlPanel: React.FC<YouTubeControlPanelProps> = ({
    setMyAvatar, setCreatorAvatar,
    selectedComment, onUpdateComment,
    onAddComment, onAIGenerate
}) => {
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');
    const [tinnitusMode, setTinnitusMode] = useState(false);

    const handleAIGenerate = async () => {
        setAiLoading(true);
        setAiError('');
        try {
            const result = await generateYouTubeComments(tinnitusMode ? 'tinnitus' : 'default');
            if (onAIGenerate) onAIGenerate(result.comments);
        } catch (e: unknown) {
            setAiError(e instanceof Error ? e.message : 'AI generation failed');
        } finally {
            setAiLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
        if (e.target.files && e.target.files[0]) {
            const url = URL.createObjectURL(e.target.files[0]);
            setter(url);
        }
    };

    const handleCommentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && selectedComment) {
            const url = URL.createObjectURL(e.target.files[0]);
            onUpdateComment(selectedComment.id, 'avatar', url);
        }
    };

    return (
        <div className="yt-controls">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h3 style={{ margin: 0 }}>YouTube Simulation</h3>
                <button
                    onClick={handleAIGenerate}
                    disabled={aiLoading}
                    style={{ background: 'linear-gradient(135deg,#ff0000,#ff6b35)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: aiLoading ? 'not-allowed' : 'pointer', opacity: aiLoading ? 0.7 : 1 }}
                >
                    {aiLoading ? '...' : '⚡ AI Fill'}
                </button>
            </div>
            {aiError && <div style={{ color: '#f87171', fontSize: 12, marginBottom: 8 }}>{aiError}</div>}

            {/* Tinnitus Mode Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#1a1a1a', borderRadius: 8, padding: '7px 12px', marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: '#aaa', whiteSpace: 'nowrap' }}>🔥 Code On Fire</span>
                <label style={{ position: 'relative', display: 'inline-block', width: 40, height: 22, cursor: 'pointer', flexShrink: 0 }}>
                    <input type="checkbox" checked={tinnitusMode} onChange={e => setTinnitusMode(e.target.checked)} style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }} />
                    <span style={{
                        position: 'absolute', inset: 0, borderRadius: 999,
                        background: tinnitusMode ? 'linear-gradient(135deg,#0ea5e9,#06b6d4)' : '#374151',
                        transition: 'background 0.25s'
                    }}>
                        <span style={{
                            position: 'absolute', height: 16, width: 16, left: tinnitusMode ? 21 : 3, top: 3,
                            background: 'white', borderRadius: '50%', transition: 'left 0.25s',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.4)'
                        }} />
                    </span>
                </label>
                <span style={{ fontSize: 12, color: '#aaa', whiteSpace: 'nowrap' }}>👂 Tinnitus</span>
            </div>

            <div className="yt-control-group">
                <label className="yt-label">Global Avatars</label>
                <div style={{ display: 'flex', gap: 10 }}>
                    <div style={{ flex: 1 }}>
                        <label className="yt-label" style={{ fontSize: 11 }}>My Avatar (Bottom)</label>
                        <input type="file" onChange={(e) => handleFileChange(e, setMyAvatar)} style={{ fontSize: 11 }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label className="yt-label" style={{ fontSize: 11 }}>Creator Avatar (Heart)</label>
                        <input type="file" onChange={(e) => handleFileChange(e, setCreatorAvatar)} style={{ fontSize: 11 }} />
                    </div>
                </div>
            </div>

            <div className="yt-control-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="yt-label">Edit Comment</label>
                    <button
                        onClick={onAddComment}
                        style={{ padding: '4px 8px', fontSize: 11, background: '#3ea6ff', color: 'black', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        + Add New
                    </button>
                </div>

                {selectedComment ? (
                    <div style={{ marginTop: 10 }}>
                        <label className="yt-label">Handle (@user)</label>
                        <input
                            className="yt-input"
                            value={selectedComment.handle}
                            onChange={(e) => onUpdateComment(selectedComment.id, 'handle', e.target.value)}
                        />

                        <label className="yt-label">Text</label>
                        <textarea
                            className="yt-input" style={{ height: 60 }}
                            value={selectedComment.text}
                            onChange={(e) => onUpdateComment(selectedComment.id, 'text', e.target.value)}
                        />

                        <div style={{ display: 'flex', gap: 10 }}>
                            <div style={{ flex: 1 }}>
                                <label className="yt-label">Time</label>
                                <input
                                    className="yt-input"
                                    value={selectedComment.time}
                                    onChange={(e) => onUpdateComment(selectedComment.id, 'time', e.target.value)}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label className="yt-label">Likes</label>
                                <input
                                    className="yt-input"
                                    value={selectedComment.likes}
                                    onChange={(e) => onUpdateComment(selectedComment.id, 'likes', e.target.value)}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 10 }}>
                            <div style={{ flex: 1 }}>
                                <label className="yt-label">Replies Count</label>
                                <input
                                    className="yt-input"
                                    value={selectedComment.replyCount}
                                    onChange={(e) => onUpdateComment(selectedComment.id, 'replyCount', e.target.value)}
                                />
                            </div>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', marginTop: 15 }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedComment.isHearted}
                                        onChange={(e) => onUpdateComment(selectedComment.id, 'isHearted', e.target.checked)}
                                    />
                                    Hearted?
                                </label>
                            </div>
                        </div>

                        <label className="yt-label">User Avatar</label>
                        <input type="file" onChange={handleCommentFileChange} style={{ fontSize: 11, color: '#ccc' }} />

                    </div>
                ) : (
                    <div style={{ padding: 20, textAlign: 'center', color: '#666', border: '1px dashed #444', marginTop: 10, fontSize: 13 }}>
                        Select a comment to edit.
                    </div>
                )}
            </div>
        </div>
    );
};

export default YouTubeControlPanel;
