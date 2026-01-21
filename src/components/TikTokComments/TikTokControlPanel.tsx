import React from 'react';
import './TikTokComments.css';

interface TikTokControlPanelProps {
    headerComments: string;
    setHeaderComments: (val: string) => void;
    headerLikes: string;
    setHeaderLikes: (val: string) => void;

    // User
    myAvatar: string;
    setMyAvatar: (val: string) => void;

    // Selected Comment
    selectedComment: any;
    onUpdateComment: (id: string, field: string, value: any) => void;
    onAddComment: () => void;
}

const TikTokControlPanel: React.FC<TikTokControlPanelProps> = ({
    headerComments, setHeaderComments,
    headerLikes, setHeaderLikes,
    setMyAvatar,
    selectedComment, onUpdateComment,
    onAddComment
}) => {

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
        if (e.target.files && e.target.files[0]) {
            const url = URL.createObjectURL(e.target.files[0]);
            setter(url);
        }
    };

    const handleCommentFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        if (e.target.files && e.target.files[0] && selectedComment) {
            const url = URL.createObjectURL(e.target.files[0]);
            onUpdateComment(selectedComment.id, field, url);
        }
    };

    return (
        <div className="tt-controls">
            <h3>TikTok Simulation</h3>

            {/* Global */}
            <div className="tt-control-group">
                <label className="tt-label">Header Stats</label>
                <div style={{ display: 'flex', gap: 10 }}>
                    <input
                        className="tt-input"
                        value={headerComments}
                        onChange={(e) => setHeaderComments(e.target.value)}
                        placeholder="Comments"
                    />
                    <input
                        className="tt-input"
                        value={headerLikes}
                        onChange={(e) => setHeaderLikes(e.target.value)}
                        placeholder="Likes"
                    />
                </div>

                <label className="tt-label" style={{ marginTop: 10 }}>My Avatar (Bottom Bar)</label>
                <input type="file" onChange={(e) => handleFileChange(e, setMyAvatar)} />
            </div>

            {/* Comment Editor */}
            <div className="tt-control-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="tt-label">Edit Selected Comment</label>
                    <button
                        onClick={onAddComment}
                        style={{ padding: '4px 8px', fontSize: 11, background: '#fe2c55', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                    >
                        + Add New
                    </button>
                </div>

                {selectedComment ? (
                    <div style={{ marginTop: 10 }}>
                        <label className="tt-label">Username</label>
                        <input
                            className="tt-input"
                            value={selectedComment.username}
                            onChange={(e) => onUpdateComment(selectedComment.id, 'username', e.target.value)}
                        />

                        <label className="tt-label">Text</label>
                        <textarea
                            className="tt-input"
                            style={{ height: 60 }}
                            value={selectedComment.text}
                            onChange={(e) => onUpdateComment(selectedComment.id, 'text', e.target.value)}
                        />

                        <div style={{ display: 'flex', gap: 10, marginTop: 5 }}>
                            <div style={{ flex: 1 }}>
                                <label className="tt-label">Avatar</label>
                                <input type="file" onChange={(e) => handleCommentFileChange(e, 'avatar')} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label className="tt-label">Attach Image</label>
                                <input type="file" onChange={(e) => handleCommentFileChange(e, 'image')} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                            <div style={{ flex: 1 }}>
                                <label className="tt-label">Date</label>
                                <input
                                    className="tt-input"
                                    value={selectedComment.date}
                                    onChange={(e) => onUpdateComment(selectedComment.id, 'date', e.target.value)}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label className="tt-label">Likes Count</label>
                                <input
                                    className="tt-input"
                                    value={selectedComment.likes}
                                    onChange={(e) => onUpdateComment(selectedComment.id, 'likes', e.target.value)}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 15, marginTop: 10 }}>
                            <label style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                                <input
                                    type="checkbox"
                                    checked={selectedComment.isCreator}
                                    onChange={(e) => onUpdateComment(selectedComment.id, 'isCreator', e.target.checked)}
                                />
                                Is Creator
                            </label>

                            <label style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                                <input
                                    type="checkbox"
                                    checked={selectedComment.likedByCreator}
                                    onChange={(e) => onUpdateComment(selectedComment.id, 'likedByCreator', e.target.checked)}
                                />
                                Liked by Creator
                            </label>
                        </div>

                    </div>
                ) : (
                    <div style={{ padding: 20, textAlign: 'center', color: '#999', fontSize: 13, border: '1px dashed #ccc', marginTop: 10 }}>
                        Select a comment on the phone screen to edit it.
                    </div>
                )}
            </div>
        </div>
    );
};

export default TikTokControlPanel;
