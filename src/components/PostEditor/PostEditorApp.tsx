import React, { useState } from 'react';
import FacebookPost from './FacebookPost';
import PostControlPanel from './PostControlPanel';
import './PostEditor.css';
import { MY_AVATAR } from '../../utils/avatarUtils';

const PostEditorApp = () => {
    // State
    const [authorName, setAuthorName] = useState("Thefarmacyreal");
    const [authorAvatar, setAuthorAvatar] = useState(MY_AVATAR);
    const [timestamp, setTimestamp] = useState("5h");
    const [text, setText] = useState("Having intercourse more than twice a week as a woman can boost immunity, improve heart health, reduce stress and anxiety, strengthen the pelvic floor and improve sleep!...");
    const [postImage, setPostImage] = useState("https://placehold.co/600x600");
    const [likesCount, setLikesCount] = useState("462");
    const [commentsCount, setCommentsCount] = useState("64");
    const [sharesCount, setSharesCount] = useState("99");
    const [isLiked] = useState(false);

    // Handlers
    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAuthorAvatar(URL.createObjectURL(file));
        }
        e.target.value = '';
    };

    const handlePostImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPostImage(URL.createObjectURL(file));
        }
        e.target.value = '';
    };

    return (
        <div className="post-editor-container">
            {/* Left: Controls */}
            <PostControlPanel
                authorName={authorName} setAuthorName={setAuthorName}
                timestamp={timestamp} setTimestamp={setTimestamp}
                text={text} setText={setText}
                likesCount={likesCount} setLikesCount={setLikesCount}
                commentsCount={commentsCount} setCommentsCount={setCommentsCount}
                sharesCount={sharesCount} setSharesCount={setSharesCount}
                onAvatarUpload={handleAvatarUpload}
                onPostImageUpload={handlePostImageUpload}
            />

            {/* Right: Preview */}
            <FacebookPost
                authorName={authorName}
                authorAvatar={authorAvatar}
                timestamp={timestamp}
                text={text}
                image={postImage}
                likesCount={likesCount}
                commentsCount={commentsCount}
                sharesCount={sharesCount}
                isLiked={isLiked}
            />
        </div>
    );
};

export default PostEditorApp;
