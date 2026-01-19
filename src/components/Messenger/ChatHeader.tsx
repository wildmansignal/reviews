import React from 'react';

interface ChatHeaderProps {
    name: string;
    onNameChange: (newName: string) => void;
    avatar: string;
    onAvatarClick: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ name, onNameChange, avatar, onAvatarClick }) => {
    return (
        <div className="messenger-header">
            <div className="header-left">
                <div className="ms-icon ms-icon-back"></div>
            </div>

            <div className="header-center">
                <div className="header-avatar-container" onClick={onAvatarClick}>
                    <img src={avatar} alt="Profile" className="header-avatar" />
                    <div className="header-active-dot"></div>
                </div>
                <div className="header-info">
                    <input
                        type="text"
                        className="header-name-input"
                        value={name}
                        onChange={(e) => onNameChange(e.target.value)}
                    />
                    <div className="header-status-text">Active now</div>
                </div>
            </div>

            <div className="header-right">
                <div className="ms-icon ms-icon-phone"></div>
                <div className="ms-icon ms-icon-video"></div>
            </div>
        </div>
    );
};

export default ChatHeader;
