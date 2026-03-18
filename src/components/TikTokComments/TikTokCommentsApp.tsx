import { useState } from 'react';
import { Settings2, X, Image as ImageIcon, Smile, AtSign } from 'lucide-react';
import TikTokCommentItem from './TikTokCommentItem';
import TikTokControlPanel from './TikTokControlPanel';
import './TikTokComments.css';
import { getSeededAvatar, getRandomAvatar, MY_AVATAR } from '../../utils/avatarUtils';

// Initial Data
const INITIAL_COMMENTS = [
    {
        id: '1',
        username: 'GringoLocoInMexico',
        avatar: getSeededAvatar('GringoLocoInMexico'),
        text: 'watching this from my beachfront property in Isla Aguada MX ❤️🔥',
        image: 'https://cdn.pixabay.com/photo/2016/03/04/19/36/beach-1236581_1280.jpg', // Beach sunset
        date: '2025-12-21',
        likes: '72',
        isCreator: false,
        likedByCreator: false
    },
    {
        id: '2',
        username: 'user69768081680044',
        avatar: getSeededAvatar('user69768081680044'),
        text: 'AMERICA IS A FALLING CIVILIZATION',
        image: null,
        date: '2025-12-8',
        likes: '218',
        isCreator: false,
        likedByCreator: false
    },
    {
        id: '3',
        username: 'Ghost',
        avatar: getSeededAvatar('Ghost'),
        text: "America only works well if you've got a few million dollars.",
        image: null,
        date: '2025-12-10',
        likes: '176',
        isCreator: false,
        likedByCreator: true // The little heart badge
    },
    {
        id: '4',
        username: 'Dan Plants',
        avatar: MY_AVATAR,
        text: 'Facts',
        image: null,
        date: '2025-12-10',
        likes: '31',
        isCreator: true, // "Creator" badge
        likedByCreator: false
    }
];

const TikTokCommentsApp = () => {
    // Global Header Stats
    const [headerComments, setHeaderComments] = useState("1,048");
    const [headerLikes, setHeaderLikes] = useState("16.3K");
    const [myAvatar, setMyAvatar] = useState(MY_AVATAR); // Dan Plants avatar

    // Comments Data
    const [comments, setComments] = useState(INITIAL_COMMENTS);
    const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);

    // Handlers
    const handleUpdateComment = (id: string, field: string, value: any) => {
        setComments(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const handleAddComment = () => {
        const newId = Date.now().toString();
        const newComment = {
            id: newId,
            username: 'New User',
            avatar: getRandomAvatar(),
            text: 'New comment text...',
            image: null,
            date: '2025-1-15',
            likes: '0',
            isCreator: false,
            likedByCreator: false
        };
        setComments([...comments, newComment]);
        setSelectedCommentId(newId);
    };

    const handleAIResults = (aiComments: any[], totalComments: string, totalLikes: string) => {
        const newComments = aiComments.map((c: any, i: number) => ({
            id: (Date.now() + i).toString(),
            username: c.username,
            avatar: getSeededAvatar(c.username),
            text: c.text,
            image: null,
            date: '2025-12-' + (Math.floor(Math.random() * 28) + 1),
            likes: c.likes,
            isCreator: false,
            likedByCreator: false,
        }));
        setComments(newComments);
        setHeaderComments(totalComments);
        setHeaderLikes(totalLikes);
    };

    const selectedComment = comments.find(c => c.id === selectedCommentId);

    return (
        <div className="tt-app-container">
            {/* Control Panel */}
            <TikTokControlPanel
                headerComments={headerComments} setHeaderComments={setHeaderComments}
                headerLikes={headerLikes} setHeaderLikes={setHeaderLikes}
                myAvatar={myAvatar} setMyAvatar={setMyAvatar}
                selectedComment={selectedComment}
                onUpdateComment={handleUpdateComment}
                onAddComment={handleAddComment}
                onAIGenerate={handleAIResults}
            />

            {/* Phone Screen */}
            <div className="tt-phone-frame">

                {/* Header */}
                <div className="tt-header">
                    <div></div> {/* Spacer for center alignment trick or just flex-start? Screenshot: Title Left */}
                    <div style={{ display: 'flex', alignItems: 'baseline' }}>
                        <span className="tt-header-title">Comments {headerComments}</span>
                        <span className="tt-header-likes">Likes {headerLikes}</span>
                    </div>

                    <div className="tt-header-icons">
                        <Settings2 size={20} />
                        <X size={20} />
                    </div>
                </div>

                {/* List */}
                <div className="tt-comments-list">
                    {comments.map(comment => (
                        <TikTokCommentItem
                            key={comment.id}
                            comment={comment}
                            isSelected={selectedCommentId === comment.id}
                            onClick={() => setSelectedCommentId(comment.id)}
                        />
                    ))}

                    {/* Hardcoded 'View replies' simulation for aesthetic if needed, 
                        or loop logic to indent. The layout has 10 replies collapsed for comment 2 and 9 for comment 4.
                        I'll just add static placeholders for the specific ones to match screenshot.
                    */}
                    <div className="tt-view-replies">
                        <div className="tt-reply-line"></div>
                        <span>View 10 replies ⌄</span>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="tt-bottom-bar">
                    <img src={myAvatar} alt="me" className="tt-avatar" />
                    <input className="tt-input-field" placeholder="Replying to bia" />
                    <div className="tt-bottom-icons">
                        <AtSign size={24} />
                        <Smile size={24} />
                        <ImageIcon size={24} />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TikTokCommentsApp;
