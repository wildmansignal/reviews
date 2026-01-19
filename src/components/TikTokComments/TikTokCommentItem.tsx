import React from 'react';
import { Heart } from 'lucide-react';
import './TikTokComments.css';

interface TikTokCommentItemProps {
    comment: any;
    isSelected: boolean;
    onClick: () => void;
}

const TikTokCommentItem: React.FC<TikTokCommentItemProps> = ({ comment, isSelected, onClick }) => {
    return (
        <div
            className="tt-comment-row"
            onClick={onClick}
            style={{ backgroundColor: isSelected ? 'rgba(0,0,0,0.03)' : 'transparent', cursor: 'pointer' }}
        >
            <img src={comment.avatar} alt="avatar" className="tt-avatar" />

            <div className="tt-comment-content">
                <div className="tt-username">
                    {comment.username}
                    {comment.isCreator && (
                        <>
                            <span className="tt-creator-dot"> • </span>
                            <span className="tt-creator-badge">Creator</span>
                        </>
                    )}
                </div>

                <div className="tt-comment-text">
                    {comment.text}
                </div>

                {comment.image && (
                    <img src={comment.image} alt="attachment" className="tt-comment-image" />
                )}

                <div className="tt-meta-row">
                    <span>{comment.date}</span>
                    <span className="tt-reply-text">Reply</span>
                    {comment.likedByCreator && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#f8f8f8', padding: '2px 6px', borderRadius: 4 }}>
                            {/* Mini creator heart badge usually shows small avatar + heart overlay. 
                              For sim, just "Creator liked" or icon. 
                              Screenshot shows: Just text or icon? 
                              Screenshot comment 3 has a picture next to Reply? 
                              Ah, "Ghost" comment has a small avatar with a heart on it next to "Reply".
                           */}
                            <div style={{ position: 'relative', width: 16, height: 16 }}>
                                <img
                                    src={comment.avatar} // Usually creator's avatar, but using comment's for placeholder if no creator passed. Ideally pass creator avatar.
                                    // Actually let's just use a generic red heart bubble or the user's avatar.
                                    // The screenshot "Ghost" comment shows a small circle with a red heart badge.
                                    style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                                    alt="liked"
                                />
                                <div style={{ position: 'absolute', bottom: -2, right: -2, background: 'white', borderRadius: '50%', padding: 1 }}>
                                    <Heart size={8} fill="#fe2c55" color="#fe2c55" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="tt-like-col">
                <Heart size={18} color="#8a8b91" />
                <span className="tt-like-count">{comment.likes}</span>
            </div>
        </div>
    );
};

export default TikTokCommentItem;
