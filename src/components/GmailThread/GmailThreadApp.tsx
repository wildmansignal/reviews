import { useState } from 'react';
import { ArrowLeft, Archive, AlertCircle, Trash2, Mail, Folder, MoreVertical, CornerUpLeft, Printer, ExternalLink, Smile } from 'lucide-react';
import GmailMessage from './GmailMessage';
import GmailControlPanel from './GmailControlPanel';
import './GmailThread.css';
import { getSeededAvatar } from '../../utils/avatarUtils';

// Initial Data
const INITIAL_MESSAGES = [
    {
        id: '1',
        senderName: 'Joanna Fisher',
        details: 'to support ▼',
        avatar: getSeededAvatar('Joanna Fisher'),
        date: 'Tue, Jan 6, 4:02 AM (9 days ago)',
        content: `Good evening 😊\n\nI was wondering when you get a minute if you could check my account joannafisher81@gmail.com, I have tried to reset my password but it's saying there isn't an account when I try to log in.\n\nThank you so much\n\nJoanna`
    },
    {
        id: '2',
        senderName: 'dan william',
        details: 'to Joanna ▼',
        avatar: 'letter:d:#009688',
        date: 'Tue, Jan 6, 5:06 AM (9 days ago)',
        content: 'Hey! Yes I\'ll check that for you, one second!'
    },
    {
        id: '3',
        senderName: 'dan william',
        details: 'to Joanna ▼',
        avatar: 'letter:d:#009688',
        date: 'Tue, Jan 6, 5:13 AM (9 days ago)',
        content: 'Ok I sent you an invite to rejoin the system, try to see if that onboarding works. If not I can manually put you back inside the system if you give me the passw'
    },
    {
        id: '4',
        senderName: 'Joanna Fisher',
        details: 'to me ▼',
        avatar: getSeededAvatar('Joanna Fisher'),
        date: 'Tue, Jan 6, 5:18 AM (9 days ago)',
        content: `Hi Dan It says it can't open because it couldn't connect to the server 🤔 Joanna On 5 Jan 2026, at 21:13, dan william <dplants99@gmail.com> wrote:`
    },
    {
        id: '5',
        senderName: 'Joanna Fisher',
        details: 'to me ▼',
        avatar: 'https://cdn.pixabay.com/photo/2016/06/06/17/05/woman-1439909_1280.jpg',
        date: 'Tue, Jan 6, 5:19 AM (9 days ago)',
        content: `So sorry! I know your probably busy 😔`
    },
    {
        id: '6',
        senderName: 'dan william',
        details: 'to Joanna ▼',
        avatar: 'letter:d:#009688',
        date: 'Tue, Jan 6, 5:22 AM (9 days ago)',
        content: `Hey its no problem at all, it's my job to do this stuff haha What email do you wanna sign in with and password, ill manually add it back into the system.`
    }
];

const GmailThreadApp = () => {
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [selectedMsgId, setSelectedMsgId] = useState<string | null>(null);

    // Handlers
    const handleUpdateMsg = (id: string, field: string, value: any) => {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
    };

    const handleAddMsg = () => {
        const newId = Date.now().toString();
        const newMsg = {
            id: newId,
            senderName: 'dan william',
            details: 'to Joanna ▼',
            avatar: 'letter:d:#009688',
            date: 'Just now',
            content: 'New reply...'
        };
        setMessages([...messages, newMsg]);
        setSelectedMsgId(newId);
    };

    const handleAIResults = (aiMessages: any[], subject: string) => {
        const newMessages = aiMessages.map((m: any, i: number) => ({
            id: (i + 1).toString(),
            senderName: m.senderName,
            details: m.isMe ? 'to them ▼' : 'to me ▼',
            avatar: m.isMe ? 'letter:d:#009688' : getSeededAvatar(m.senderName),
            date: `${['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][i % 5]}, Jan ${i + 5}, ${5 + i}:0${i} AM (${i + 1} days ago)`,
            content: m.content,
        }));
        setMessages(newMessages);
        void subject; // subject could be used to update a subject line state if added
    };

    const selectedMsg = messages.find(m => m.id === selectedMsgId);

    return (
        <div className="gm-app-container">
            {/* Control Panel */}
            <GmailControlPanel
                selectedMsg={selectedMsg}
                onUpdateMsg={handleUpdateMsg}
                onAddMsg={handleAddMsg}
                onAIGenerate={handleAIResults}
            />

            {/* Desktop Frame */}
            <div className="gm-desktop-frame">

                {/* Toolbar */}
                <div className="gm-toolbar">
                    <div className="gm-toolbar-left">
                        <ArrowLeft size={20} />
                        <div style={{ display: 'flex', gap: 24, paddingLeft: 10 }}>
                            <Archive size={20} />
                            <AlertCircle size={20} />
                            <Trash2 size={20} />
                        </div>
                        <div style={{ width: 1, background: '#ccc', height: 20 }}></div>
                        <div style={{ display: 'flex', gap: 24 }}>
                            <Mail size={20} />
                            <Folder size={20} />
                            <MoreVertical size={20} />
                        </div>
                    </div>
                    <div className="gm-toolbar-right" style={{ fontSize: 13, color: '#5f6368' }}>
                        <span>4 of 956</span>
                        <span style={{ display: 'flex', gap: 16 }}>
                            <span>&lt;</span>
                            <span>&gt;</span>
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="gm-scroll-area">
                    {/* Subject Line (Static for now or could be state) */}
                    <div className="gm-subject-row">
                        <span>Re: Support Question</span>
                        <div style={{ display: 'flex', gap: 16 }}>
                            <Printer size={20} color="#5f6368" />
                            <ExternalLink size={20} color="#5f6368" />
                        </div>
                    </div>

                    {/* Messages */}
                    {messages.map(msg => (
                        <GmailMessage
                            key={msg.id}
                            msg={msg}
                            isSelected={selectedMsgId === msg.id}
                            onClick={() => setSelectedMsgId(msg.id)}
                        />
                    ))}

                    {/* Bottom Action bar representation */}
                    <div className="gm-bottom-actions">
                        <button className="gm-action-btn">
                            <CornerUpLeft size={18} /> Reply
                        </button>
                        <button className="gm-action-btn">
                            Forward
                        </button>
                        <button className="gm-action-btn" style={{ border: 'none', padding: '0 10px' }}>
                            <Smile size={20} color="#5f6368" />
                        </button>
                    </div>

                    <div style={{ height: 100 }}></div> {/* Scrolling space */}

                </div>
            </div>
        </div>
    );
};

export default GmailThreadApp;
