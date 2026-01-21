import React, { useRef } from 'react';

export interface MessageData {
    id: number;
    text?: string;
    image?: string;
    preview?: {
        title: string;
        desc: string;
        thumbnail: string;
    };
    sender: 'me' | 'them';
    isEdited?: boolean;
}

interface MessageBubbleProps {
    message: MessageData;
    onUpdate: (id: number, newData: Partial<MessageData>) => void;
    themAvatar?: string;
    onAvatarClick?: () => void;
    showDelivered?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onUpdate, themAvatar, onAvatarClick, showDelivered }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);



    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) {
                    onUpdate(message.id, { image: ev.target.result as string });
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const [isEditing, setIsEditing] = React.useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleBlur = () => {
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            setIsEditing(false);
        }
    };

    // Auto-resize textarea
    React.useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
            textareaRef.current.focus();
        }
    }, [isEditing, message.text]);

    const renderContent = () => {
        if (message.image) {
            return (
                <div className="image-wrapper" onClick={handleImageClick}>
                    <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
                    <img src={message.image} alt="Sent" className="chat-image" />
                </div>
            );
        } else if (message.preview) {
            return (
                <div className="preview-wrapper">
                    <div className="preview-image-container">
                        <img src={message.preview.thumbnail} alt="Preview" className="preview-image" />
                        <div className="play-button-overlay">▶</div>
                    </div>
                    <div className="preview-content">
                        <div className="preview-title" contentEditable suppressContentEditableWarning>
                            {message.preview.title}
                        </div>
                        <div className="preview-desc" contentEditable suppressContentEditableWarning>
                            {message.preview.desc}
                        </div>
                    </div>
                </div>
            );
        } else {
            if (isEditing) {
                return (
                    <textarea
                        ref={textareaRef}
                        className="bubble-text-input"
                        value={message.text || ''}
                        onChange={(e) => onUpdate(message.id, { text: e.target.value })}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        rows={1}
                    />
                );
            } else {
                return (
                    <div onClick={() => setIsEditing(true)} style={{ whiteSpace: 'pre-wrap', cursor: 'text' }}>
                        {message.text || ' '}
                    </div>
                );
            }
        }
    };

    return (
        <div className={`message-row ${message.sender}`}>
            {message.sender === 'them' && (
                <div className="row-avatar" onClick={onAvatarClick} title="Click to change avatar">
                    {themAvatar ? (
                        <img src={themAvatar} alt="Avatar" className="row-avatar-img" />
                    ) : (
                        <div className="row-avatar-placeholder"></div>
                    )}
                </div>
            )}

            <div className={`bubble ${message.sender} ${message.image ? 'image-bubble' : ''} ${message.preview ? 'preview-bubble' : ''}`}>
                {renderContent()}
            </div>
            {showDelivered && <div className="delivered-status">Delivered</div>}
        </div>
    );
};

export default MessageBubble;
