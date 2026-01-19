import React from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Heart, ChevronDown } from 'lucide-react';
import './YouTubeComments.css';

interface YouTubeCommentItemProps {
    comment: any;
    isSelected: boolean;
    onClick: () => void;
    creatorAvatar: string; // To show in the heart badge
}

const YouTubeCommentItem: React.FC<YouTubeCommentItemProps> = ({ comment, isSelected, onClick, creatorAvatar }) => {
    return (
        <div
            className="yt-comment-row"
            onClick={onClick}
            style={{ backgroundColor: isSelected ? 'rgba(255,255,255,0.05)' : 'transparent', cursor: 'pointer', borderRadius: 8, padding: isSelected ? 8 : 0 }}
        >
            {/* Avatar - Handle potential color avatars (letters) vs images */}
            {comment.avatar.startsWith('color:') ? (
                <div className="yt-avatar" style={{ background: comment.avatar.split(':')[1], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                    {comment.handle.substring(1, 2).toUpperCase()}
                </div>
            ) : (
                <img src={comment.avatar} alt="avatar" className="yt-avatar" />
            )}

            <div className="yt-comment-content">
                <div className="yt-comment-header">
                    <span className="yt-handle">{comment.handle}</span>
                    <span className="yt-time">• {comment.time}</span>
                </div>

                <div className="yt-comment-text">
                    {comment.text}
                </div>

                <div className="yt-toolbar">
                    <div className="yt-tool-item">
                        <ThumbsUp size={14} />
                        <span className="yt-like-count">{comment.likes}</span>
                    </div>

                    <div className="yt-tool-item">
                        <ThumbsDown size={14} />
                    </div>

                    <div className="yt-tool-item">
                        <MessageSquare size={14} />
                    </div>

                    {/* Creator Hearted */}
                    {comment.isHearted && (
                        <div className="yt-creator-heart">
                            <img src={creatorAvatar} alt="creator" className="yt-creator-avatar-mini" />
                            <div className="yt-heart-mini">
                                <Heart size={10} fill="#fe2c55" color="#fe2c55" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Replies Button */}
                {parseInt(comment.replyCount) > 0 && (
                    <div className="yt-replies-btn" style={{ color: 'white' }}> {/* Made white per request */}
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span>{comment.replyCount} reply</span>
                            <ChevronDown size={14} style={{ transform: 'rotate(-90deg)' }} />
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default YouTubeCommentItem;
