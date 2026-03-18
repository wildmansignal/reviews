import React, { useState, useEffect, useRef } from 'react';
import { generateMessengerThread } from '../../services/openai';
import MessageBubble, { type MessageData } from './MessageBubble';
import ChatHeader from './ChatHeader';
import { useGenerationContext } from '../../contexts/GenerationContext';
import './Messenger.css';

// Initial Mock Data
const INITIAL_MESSAGES: MessageData[] = [
    { id: 1, text: "Honest to God I am still in a state of being overwhelmed", sender: 'them' },
    { id: 2, text: "If you don't mind me telling my personal experience, here is my video. I shared this with few people", sender: 'them' },
    {
        id: 3,
        sender: 'them',
        preview: {
            title: "What happened to me",
            desc: "Bekijk je favoriete video's, luister naar de muziek die je leuk vindt...",
            thumbnail: "https://placehold.co/600x400/333/fff?text=Youtube+Preview",
        }
    },
    { id: 4, text: "Edited", sender: 'me', isEdited: true },
    { id: 5, text: "Thank you for listening on behalf 🙏. If you want to let me know your reaction to it, please be free to do so and I will much appreciate it 🙏", sender: 'them' },
    { id: 6, text: "Every thought is welcome and will be received with gratitude", sender: 'them' },
];

const MessengerApp = () => {
    const { data } = useGenerationContext();
    const [messages, setMessages] = useState<MessageData[]>(INITIAL_MESSAGES);

    useEffect(() => {
        if (data.messenger && data.messenger.messages) {
            setMessages(data.messenger.messages);
            if (data.messenger.headerName) setHeaderName(data.messenger.headerName);
            if (data.messenger.themAvatar) setThemAvatar(data.messenger.themAvatar);
        }
    }, [data.messenger]);

    // Control Panel State
    const [myMessage, setMyMessage] = useState("");
    const [theirMessage, setTheirMessage] = useState("");
    const [themAvatar, setThemAvatar] = useState("https://placehold.co/28");
    const [headerName, setHeaderName] = useState("Sai Garcia");
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const themImageInputRef = useRef<HTMLInputElement>(null);
    const themAvatarInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (text: string, sender: 'me' | 'them') => {
        if (!text.trim()) return;

        const newMessage: MessageData = {
            id: Date.now(),
            text: text,
            sender: sender,
        };

        setMessages(prev => [...prev, newMessage]);
        if (sender === 'me') setMyMessage("");
        if (sender === 'them') setTheirMessage("");
    };

    const handleUpdateMessage = (id: number, newData: Partial<MessageData>) => {
        setMessages(messages.map(msg => msg.id === id ? { ...msg, ...newData } : msg));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, sender: 'me' | 'them') => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            const newMessage: MessageData = {
                id: Date.now(),
                sender: sender,
                image: imageUrl
            };
            setMessages(prev => [...prev, newMessage]);
        }
        // Reset input so same file can be selected again
        e.target.value = '';
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setThemAvatar(imageUrl);
        }
        e.target.value = '';
    };


    const handleAIFill = async () => {
        setAiLoading(true);
        setAiError('');
        try {
            const result = await generateMessengerThread();
            const newMsgs = result.messages.map((m: any, i: number) => ({
                id: Date.now() + i,
                text: m.text,
                sender: (m.isMe ? 'me' : 'them') as 'me' | 'them',
            }));
            setMessages(newMsgs);
            setHeaderName(result.contactName);
        } catch (e: unknown) {
            setAiError(e instanceof Error ? e.message : 'AI generation failed');
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <div className="messenger-app-container">
            {/* Side Control Panel */}
            <div className="control-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <h3 style={{ color: 'white', margin: 0 }}>Simulation Controls</h3>
                    <button
                        onClick={handleAIFill}
                        disabled={aiLoading}
                        style={{ background: 'linear-gradient(135deg,#0099ff,#0d47a1)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: aiLoading ? 'not-allowed' : 'pointer', opacity: aiLoading ? 0.7 : 1 }}
                    >
                        {aiLoading ? '...' : '⚡ AI Fill'}
                    </button>
                </div>
                {aiError && <div style={{ color: '#f87171', fontSize: 12, marginBottom: 8 }}>{aiError}</div>}

                <div className="control-group">
                    <label className="control-label">My Message (Blue)</label>
                    <textarea
                        className="control-input"
                        rows={3}
                        value={myMessage}
                        onChange={(e) => setMyMessage(e.target.value)}
                        placeholder="Type a message as You..."
                    />
                    <button className="control-btn" onClick={() => handleSendMessage(myMessage, 'me')}>
                        Send as Me
                    </button>
                    <button className="control-btn secondary" onClick={() => handleSendMessage("👍", 'me')}>
                        Send Thumbs Up
                    </button>
                </div>

                <div className="divider" style={{ height: 1, background: '#333', margin: '10px 0' }}></div>

                <div className="control-group">
                    <label className="control-label">Their Message (Gray)</label>
                    <textarea
                        className="control-input"
                        rows={3}
                        value={theirMessage}
                        onChange={(e) => setTheirMessage(e.target.value)}
                        placeholder="Type a message as Them..."
                    />
                    <button className="control-btn secondary" onClick={() => handleSendMessage(theirMessage, 'them')}>
                        Receive as Them
                    </button>

                    {/* Image Upload for Them */}
                    <input
                        type="file"
                        accept="image/*"
                        ref={themImageInputRef}
                        style={{ display: 'none' }}
                        onChange={(e) => handleImageUpload(e, 'them')}
                    />
                    <button className="control-btn secondary" onClick={() => themImageInputRef.current?.click()}>
                        Receive Image as Them
                    </button>

                    {/* Hidden Avatar Upload Input */}
                    <input
                        type="file"
                        accept="image/*"
                        ref={themAvatarInputRef}
                        style={{ display: 'none' }}
                        onChange={handleAvatarUpload}
                        id="them-avatar-upload"
                    />
                </div>

                <div className="control-group">
                    <label className="control-label">General Actions</label>
                    <button className="control-btn secondary" onClick={() => setMessages([])}>
                        Clear Chat
                    </button>
                </div>
            </div>

            {/* Phone Simulation Frame */}
            <div className="messenger-frame">
                {/* Interactive Header */}
                <ChatHeader
                    name={headerName}
                    onNameChange={setHeaderName}
                    avatar={themAvatar}
                    onAvatarClick={() => themAvatarInputRef.current?.click()}
                />

                {/* Scrollable Message Body */}
                <div className="messenger-body" ref={messagesContainerRef}>
                    {messages.map(msg => (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                            onUpdate={handleUpdateMessage}
                            themAvatar={themAvatar}
                            onAvatarClick={() => themAvatarInputRef.current?.click()}
                            showDelivered={msg.sender === 'me' && msg.id === [...messages].reverse().find(m => m.sender === 'me')?.id}
                        />
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Static Footer */}
                <img
                    src="/src/assets/messenger/static_footer.jpg"
                    alt="Footer"
                    className="static-footer-img"
                />
            </div>
        </div>
    );
};

export default MessengerApp;
