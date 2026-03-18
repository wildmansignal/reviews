import { useState } from 'react';
import { Headphones } from 'lucide-react';
import YouTubeCommentItem from './YouTubeCommentItem';
import YouTubeControlPanel from './YouTubeControlPanel';
import './YouTubeComments.css';

// Initial Data
const INITIAL_COMMENTS = [
    {
        id: '1',
        handle: '@darren861',
        avatar: 'color:#D84315', // Simple color avatar simulation (Orange D)
        text: 'Hey Dan, Thanks for sharing the story. I have been through a very similar journey myself with an inner ear infection causing severe hyperacusis and very loud intrusiv... Read more',
        time: '3y ago',
        likes: '17',
        isHearted: true,
        replyCount: '1'
    },
    {
        id: '2',
        handle: '@nikotrip',
        avatar: 'https://cdn.pixabay.com/photo/2016/09/24/03/20/man-1690965_1280.png', // BW avatar
        text: '4 years with tinnitus, hyperacusis and insomnia. Thanks for sharing',
        time: '2y ago',
        likes: '6',
        isHearted: true,
        replyCount: '0'
    },
    {
        id: '3',
        handle: '@itsmewayne428',
        avatar: 'https://cdn.pixabay.com/photo/2017/02/23/13/05/avatar-2092113_1280.png', // Flower/Logo avatar
        text: 'Fucking hero!',
        time: '3y ago',
        likes: '4',
        isHearted: true,
        replyCount: '0'
    }
];

const YouTubeCommentsApp = () => {
    // Media State
    const [comments, setComments] = useState(INITIAL_COMMENTS);
    const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
    const [myAvatar, setMyAvatar] = useState("https://cdn.pixabay.com/photo/2015/03/04/22/35/head-659652_1280.png"); // Headphones avatar
    const [creatorAvatar, setCreatorAvatar] = useState("https://cdn.pixabay.com/photo/2017/01/31/21/23/avatar-2027366_1280.png");

    // Handlers
    const handleUpdateComment = (id: string, field: string, value: any) => {
        setComments(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const handleAddComment = () => {
        const newId = Date.now().toString();
        const newComment = {
            id: newId,
            handle: '@newuser',
            avatar: 'color:#555',
            text: 'New comment here...',
            time: '1d ago',
            likes: '0',
            isHearted: false,
            replyCount: '0'
        };
        setComments([...comments, newComment]);
        setSelectedCommentId(newId);
    };

    const handleAIResults = (aiComments: any[]) => {
        const newComments = aiComments.map((c: any, i: number) => ({
            id: (Date.now() + i).toString(),
            handle: c.handle,
            avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(c.handle)}&backgroundColor=b6e3f4,d1d4f9`,
            text: c.text,
            time: c.timeAgo,
            likes: c.likes,
            isHearted: i === 0, // heart the first one
            replyCount: '0',
        }));
        setComments(newComments);
    };

    const selectedComment = comments.find(c => c.id === selectedCommentId);

    return (
        <div className="yt-app-container">
            {/* Control Panel */}
            <YouTubeControlPanel
                myAvatar={myAvatar} setMyAvatar={setMyAvatar}
                creatorAvatar={creatorAvatar} setCreatorAvatar={setCreatorAvatar}
                selectedComment={selectedComment}
                onUpdateComment={handleUpdateComment}
                onAddComment={handleAddComment}
                onAIGenerate={handleAIResults}
            />

            {/* Phone Screen */}
            <div className="yt-phone-frame">

                {/* Comments List */}
                <div className="yt-comments-list">
                    {comments.map(comment => (
                        <YouTubeCommentItem
                            key={comment.id}
                            comment={comment}
                            isSelected={selectedCommentId === comment.id}
                            onClick={() => setSelectedCommentId(comment.id)}
                            creatorAvatar={creatorAvatar}
                        />
                    ))}

                    {/* Add one more static one for the screenshot match "@vegetoss..." */}
                    <div className="yt-comment-row" style={{ opacity: 0.6 }}>
                        <div className="yt-avatar" style={{ background: '#E91E63', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>V</div>
                        <div className="yt-comment-content">
                            <div className="yt-comment-header">
                                <span className="yt-handle">@vegetossgss1114</span>
                                <span className="yt-time">• 2y ago</span>
                            </div>
                            <div className="yt-comment-text">We should create an international fund to safely</div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="yt-bottom-bar">
                    <img src={myAvatar} alt="me" className="yt-user-avatar-mini" />
                    <div className="yt-input-field" style={{ color: '#aaa' }}>Add a comment or @mention...</div>
                    <Headphones size={20} color="#333" /> {/* Placeholder for right icon if any? Screenshot cuts off */}
                </div>

            </div>
        </div>
    );
};

export default YouTubeCommentsApp;
