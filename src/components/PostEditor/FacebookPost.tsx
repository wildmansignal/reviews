import React from 'react';
import { MoreHorizontal, X, Globe, ThumbsUp, MessageCircle, Share2, Heart } from 'lucide-react';
import './PostEditor.css';

export interface FacebookPostProps {
    authorName: string;
    authorAvatar: string;
    timestamp: string;
    text: string;
    image?: string;
    likesCount: string;
    commentsCount: string;
    sharesCount: string;
    isLiked: boolean;
}

const FacebookPost: React.FC<FacebookPostProps> = ({
    authorName,
    authorAvatar,
    timestamp,
    text,
    image,
    likesCount,
    commentsCount,
    sharesCount
}) => {

    // Simple text truncation logic for "See more"
    // User wants "See more" if long. Let's arbitrarily say > 150 chars triggers it visually for now?
    // Or just always show it if user wants to type a lot. 
    // Ideally we just render what is there, but user asked for "see more collapsable".
    // I will implement a basic toggle.

    const [isExpanded, setIsExpanded] = React.useState(false);

    const shouldShowSeeMore = text.length > 200;
    const displayText = isExpanded ? text : (shouldShowSeeMore ? text.slice(0, 200) + '...' : text);

    return (
        <div className="fb-phone-frame">
            {/* Header */}
            <div className="fb-post-header">
                <img src={authorAvatar} alt="Author" className="fb-avatar" />

                <div className="fb-header-info">
                    <div className="fb-author-line">
                        <span className="fb-author-name">{authorName}</span>
                        <span className="fb-dot-separator">·</span>
                        <span className="fb-follow-link">Follow</span>
                    </div>
                    <div className="fb-metadata-line">
                        <span className="fb-time">{timestamp}</span>
                        <span className="fb-dot-separator">·</span>
                        <img src="/src/assets/people.png" style={{ width: 12, height: 12, opacity: 0.6 }} alt="privacy" />
                    </div>
                </div>

                <div className="fb-header-actions">
                    <MoreHorizontal size={20} />
                    <X size={20} />
                </div>
            </div>

            {/* Content */}
            <div className="fb-post-content">
                {displayText}
                {shouldShowSeeMore && !isExpanded && (
                    <span className="fb-see-more" onClick={() => setIsExpanded(true)}> See more</span>
                )}
            </div>

            {/* Media */}
            {image && (
                <div className="fb-post-media">
                    <img src={image} alt="Post Content" className="fb-media-img" />
                </div>
            )}

            {/* Stats */}
            <div className="fb-stats-bar">
                <div className="fb-like-icon-group">
                    <div className="fb-like-circle">
                        <ThumbsUp size={10} fill="white" strokeWidth={0} />
                    </div>
                    <div className="fb-heart-circle">
                        <Heart size={10} fill="white" strokeWidth={0} />
                    </div>
                    <span className="fb-stats-text">{likesCount}</span>
                </div>

                <div className="fb-stats-text">
                    {commentsCount} comments · {sharesCount} shares
                </div>
            </div>

            {/* Actions */}
            <div className="fb-action-bar">
                <button className="fb-action-btn">
                    <ThumbsUp size={18} />
                    Like
                </button>
                <button className="fb-action-btn">
                    <MessageCircle size={18} />
                    Comment
                </button>
                <button className="fb-action-btn">
                    <Share2 size={18} />
                    Share
                </button>
            </div>
        </div>
    );
};

export default FacebookPost;
