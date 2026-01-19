import React, { useRef } from 'react';
import './PostEditor.css';

interface PostControlPanelProps {
    authorName: string;
    setAuthorName: (val: string) => void;
    timestamp: string;
    setTimestamp: (val: string) => void;
    text: string;
    setText: (val: string) => void;
    likesCount: string;
    setLikesCount: (val: string) => void;
    commentsCount: string;
    setCommentsCount: (val: string) => void;
    sharesCount: string;
    setSharesCount: (val: string) => void;
    onAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPostImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PostControlPanel: React.FC<PostControlPanelProps> = ({
    authorName, setAuthorName,
    timestamp, setTimestamp,
    text, setText,
    likesCount, setLikesCount,
    commentsCount, setCommentsCount,
    sharesCount, setSharesCount,
    onAvatarUpload,
    onPostImageUpload
}) => {

    const avatarInputRef = useRef<HTMLInputElement>(null);
    const postImageInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="post-controls">
            <h3 style={{ color: 'white', marginTop: 0 }}>Create Post</h3>

            {/* Author Section */}
            <div>
                <div className="control-section-title">Author Info</div>
                <div className="control-group">
                    <label className="control-label">Name</label>
                    <input
                        className="control-input"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                    />
                </div>
                <div className="control-group" style={{ marginTop: 10 }}>
                    <label className="control-label">Time (e.g. 5h)</label>
                    <input
                        className="control-input"
                        value={timestamp}
                        onChange={(e) => setTimestamp(e.target.value)}
                    />
                </div>
                <div className="control-group" style={{ marginTop: 10 }}>
                    <label className="control-label">Profile Picture</label>
                    <input
                        type="file"
                        accept="image/*"
                        ref={avatarInputRef}
                        style={{ display: 'none' }}
                        onChange={onAvatarUpload}
                    />
                    <button className="control-btn" onClick={() => avatarInputRef.current?.click()}>
                        Upload Avatar
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div>
                <div className="control-section-title">Post Content</div>
                <div className="control-group">
                    <label className="control-label">Message</label>
                    <textarea
                        className="control-input"
                        rows={6}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="What's on your mind?"
                    />
                </div>
                <div className="control-group" style={{ marginTop: 10 }}>
                    <label className="control-label">Post Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        ref={postImageInputRef}
                        style={{ display: 'none' }}
                        onChange={onPostImageUpload}
                    />
                    <button className="control-btn" onClick={() => postImageInputRef.current?.click()}>
                        Upload Image
                    </button>
                </div>
            </div>

            {/* Stats Section */}
            <div>
                <div className="control-section-title">Engagement Stats</div>
                <div className="control-group">
                    <label className="control-label">Likes Count</label>
                    <input
                        className="control-input"
                        value={likesCount}
                        onChange={(e) => setLikesCount(e.target.value)}
                    />
                </div>
                <div className="control-group" style={{ marginTop: 10 }}>
                    <label className="control-label">Comments Count</label>
                    <input
                        className="control-input"
                        value={commentsCount}
                        onChange={(e) => setCommentsCount(e.target.value)}
                    />
                </div>
                <div className="control-group" style={{ marginTop: 10 }}>
                    <label className="control-label">Shares Count</label>
                    <input
                        className="control-input"
                        value={sharesCount}
                        onChange={(e) => setSharesCount(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default PostControlPanel;
