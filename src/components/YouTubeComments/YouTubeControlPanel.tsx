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

    const handleAIGenerate = async () => {
        setAiLoading(true);
        setAiError('');
        try {
            const result = await generateYouTubeComments();
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
