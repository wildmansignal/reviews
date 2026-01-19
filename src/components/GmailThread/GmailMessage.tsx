import React from 'react';
import { Star, Reply, MoreVertical, CornerUpLeft } from 'lucide-react';
import './GmailThread.css';

interface GmailMessageProps {
    msg: any;
    onClick: () => void;
    isSelected: boolean;
}

const GmailMessage: React.FC<GmailMessageProps> = ({ msg, onClick, isSelected }) => {
    // Helper to render avatar image or letter
    const renderAvatar = () => {
        if (msg.avatar.startsWith('letter:')) {
            const letter = msg.avatar.split(':')[1];
            const bg = msg.avatar.split(':')[2] || '#009688'; // teal default
            return (
                <div className="gm-avatar" style={{ backgroundColor: bg }}>
                    {letter}
                </div>
            );
        } else {
            return <img src={msg.avatar} alt="avatar" className="gm-avatar" />;
        }
    };

    return (
        <div
            className="gm-message"
            onClick={onClick}
            style={{
                background: isSelected ? 'rgba(0,0,0,0.02)' : 'transparent',
                borderLeft: isSelected ? '4px solid #1a73e8' : '4px solid transparent'
            }}
        >
            <div className="gm-message-header">
                {renderAvatar()}

                <div className="gm-header-info">
                    <div>
                        <div className="gm-sender-line">
                            <span className="gm-sender-name">{msg.senderName}</span>
                            <span className="gm-sender-email" style={{ fontSize: 12, color: '#5f6368' }}>{msg.details}</span> {/* "to support" or similar details */}
                        </div>
                    </div>

                    <div className="gm-date-line">
                        <span>{msg.date}</span>
                        <Star size={18} className="gm-star-icon" />
                        <Reply size={18} color="#5f6368" />
                        <MoreVertical size={18} color="#5f6368" />
                    </div>
                </div>
            </div>

            <div className="gm-message-body">
                {msg.content}
            </div>
        </div>
    );
};

export default GmailMessage;
