import React, { useState, useEffect, useRef } from 'react';
import MessageBubble, { type MessageData } from './MessageBubble';
import ChatHeader from './ChatHeader';
import './Messenger.css';
import { getGenderedAvatar } from '../../utils/avatarUtils';

// ── Name Pools ──────────────────────────────────────────────────────────────
const FEMALE_NAMES = [
    'Emily Johnson', 'Sarah Mitchell', 'Lauren Carter', 'Amanda Davis', 'Jessica Wilson',
    'Megan Thomas', 'Ashley Brown', 'Nicole Garcia', 'Stephanie Martinez', 'Rachel Anderson',
    'Brittany Taylor', 'Melissa Harris', 'Heather Robinson', 'Amber Clark', 'Diana Lewis',
    'Tiffany Walker', 'Samantha Hall', 'Christina Young', 'Vanessa Allen', 'Kimberly Wright',
    'Hannah Scott', 'Olivia Green', 'Sophia Baker', 'Emma Moore', 'Chloe Adams',
];
const MALE_NAMES = [
    'Ryan Evans', 'Michael Chen', 'David Rodriguez', 'James Thompson', 'Chris Walker',
    'Brandon Lee', 'Tyler Scott', 'Justin Harris', 'Eric Martinez', 'Nathan Brown',
    'Kevin Clark', 'Andrew Jackson', 'Joshua White', 'Matthew Taylor', 'Daniel Martin',
    'Kyle Anderson', 'Sean Wilson', 'Cody Johnson', 'Alex Davis', 'Derek Lewis',
    'Marcus Green', 'Troy Robinson', 'Austin Hall', 'Dustin Allen', 'Garrett Young',
];

// ── Message Templates ──────────────────────────────────────────────────────
// Indexed by [0=opener from them, 1=me reply, 2=them update, 3=me react, 4=them income reveal, 5=me congrats, 6=them thanks, 7=me close]
function buildThread(name: string, income: string, firstName: string): MessageData[] {
    const templates = [
        [
            `Hey Dan! I've been wanting to reach out for months but kept putting it off. I honestly wasn't sure if I should message you or not 😅`,
            `Hey ${firstName}! Of course! What's going on?`,
            `So I finally quit my job last month. I took the leap and I'm still shaking a little lol. I've been following your stuff for a while and just wanted to tell you what happened`,
            `No way! Tell me everything 👀`,
            `I hit ${income} this month. Like actual profit. I'm still in disbelief. A year ago I was making $3,800/month at my 9-5 and stressed out of my mind. Now I'm working from home, picking my kids up from school, and my husband said he's never seen me this happy`,
            `${firstName}!! That is INCREDIBLE! Seriously so proud of you 🎉 What finally clicked for you?`,
            `Honestly? It was the part where you broke down the offer framework. I had been overcomplicating everything. Once I simplified it, things just started converting. I can't thank you enough Dan. You genuinely changed my life`,
            `That's exactly why I do this. Go celebrate!! You earned this 🚀`,
        ],
        [
            `Dan I have to tell you something. I've been debating sending this for weeks`,
            `Please do! What's up ${firstName}?`,
            `I was laid off in January. It was humiliating honestly. 12 years at the same company and just... gone. I found your training shortly after and decided to go all in because I had nothing to lose`,
            `Man I remember those feelings. What happened?`,
            `I made ${income} last month. I want to cry typing that. I actually called my old boss last week just to thank him for firing me lol. I've never had this kind of freedom in my life`,
            `${firstName} this literally made my day. Turning that pain into that kind of outcome 🔥`,
            `I tell everyone about you. Seriously. Everyone I know who's struggling I point them to your stuff. Thank you for putting this out into the world`,
            `And thank YOU for trusting the process. I love hearing this 💪`,
        ],
        [
            `Hey! Quick update - I know you're busy but I wanted to share this with someone who'd actually get it`,
            `Always time for good news! What happened?`,
            `${income} month 🤯 I set a goal back in February and I literally just hit it. I've been staring at my dashboard for like 20 minutes`,
            `WAIT. That's amazing!! Tell me more!`,
            `I followed your system almost exactly. Didn't try to reinvent anything, just executed. My wife kept telling me I was obsessing over it and I kept saying "just give me 6 months". Well it's been 5 lol`,
            `5 months!! ${firstName} that is unreal execution. You didn't just learn it - you DID it`,
            `That's honestly the whole secret right? You said it in the training. "Don't get ready to start. Just start." That stuck with me. Thank you Dan, for real`,
            `This is what it's all about. You did that. Own it! 🙌`,
        ],
        [
            `Hi Dan! Sorry to randomly message you but I had to tell someone and you're the person who started this whole thing for me`,
            `Never apologize for good news! Talk to me ${firstName} 😄`,
            `I handed in my resignation yesterday. After 8 years. My hands were literally shaking. My boss asked if I was sure and I said "I've never been more sure of anything" and walked out`,
            `Okay I'm obsessed. What tipped the scale?`,
            `I crossed ${income} last month and realized... I'm never going back. I make in one good week what I used to make in a month. My commute is now walking to my kitchen. It's still surreal`,
            `${firstName} yes YES YES! This is the life. This is what it's supposed to feel like! So happy for you 🎊`,
            `You gave me the blueprint. I just followed it. I tell everyone - stop waiting for the "right time", the right time is now. That's what I learned from you. Thank you Dan`,
            `Go enjoy every second of it. You built this 💯`,
        ],
        [
            `Dan!! I wasn't going to message today but something just happened and I couldn't not tell you`,
            `What happened?! Tell me!`,
            `I just got off a call and closed a deal that put me over ${income} for the month. I screamed in my car in a parking lot like a crazy person 😂`,
            `HAHA I love that so much! That parking lot scream is iconic 😂💪`,
            `I remember watching your stuff thinking "this is for other people, not me". I was so defeated. Now I'm the person my friends call for advice. It's wild. You really changed the trajectory of my life ${firstName ? '' : 'Dan'}`,
            `That is the transformation right there. From "not for me" to the person others look to. That's everything ${firstName}!`,
            `Thank you for making your content accessible and real. You don't make it feel impossible. You make it feel inevitable if you just do the work. I'm proof`,
            `You are 100% the proof. And I love you for sharing this with me! 🙏`,
        ],
    ];

    const variant = templates[Math.floor(Math.random() * templates.length)];
    return variant.map((text, i) => ({
        id: i + 1,
        text,
        sender: (i % 2 === 1 ? 'me' : 'them') as 'me' | 'them',
    }));
}

// ── Income formatter ──────────────────────────────────────────────────────
function formatIncome(value: number): string {
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
    return `$${value.toLocaleString()}`;
}

// ── Conversation type ──────────────────────────────────────────────────────
interface Conversation {
    id: number;
    name: string;
    avatar: string;
    income: number;
    messages: MessageData[];
    unread?: boolean;
}

// ── Main App ─────────────────────────────────────────────────────────────
const MessengerApp = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeIdx, setActiveIdx] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);

    // Range controls
    const [minIncome, setMinIncome] = useState(10000);
    const [maxIncome, setMaxIncome] = useState(250000);
    const [count, setCount] = useState(15);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const themAvatarInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(() => { scrollToBottom(); }, [conversations, activeIdx]);

    const active = conversations[activeIdx];

    // ── Generate conversations ─────────────────────────────────────────
    const handleGenerate = async () => {
        setIsGenerating(true);
        const allNames = [...FEMALE_NAMES, ...MALE_NAMES].sort(() => Math.random() - 0.5).slice(0, count);
        const generated: Conversation[] = await Promise.all(allNames.map(async (name, i) => {
            const avatar = await getGenderedAvatar(name);
            const income = Math.round(
                (minIncome + Math.random() * (maxIncome - minIncome)) / 500
            ) * 500;
            const firstName = name.split(' ')[0];
            const messages = buildThread(name, formatIncome(income), firstName);
            return {
                id: i,
                name,
                avatar,
                income,
                messages,
                unread: Math.random() > 0.5,
            };
        }));
        setConversations(generated);
        setActiveIdx(0);
        setIsGenerating(false);
    };

    // Auto-generate on mount
    useEffect(() => { handleGenerate(); }, []);

    const handleUpdateMessage = (id: number, newData: Partial<MessageData>) => {
        if (!active) return;
        setConversations(prev => prev.map((c, i) =>
            i === activeIdx
                ? { ...c, messages: c.messages.map(m => m.id === id ? { ...m, ...newData } : m) }
                : c
        ));
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && active) {
            const url = URL.createObjectURL(file);
            setConversations(prev => prev.map((c, i) => i === activeIdx ? { ...c, avatar: url } : c));
        }
        e.target.value = '';
    };

    const formatIncomeDisplay = (val: number) => {
        if (val >= 1000000) return `$${(val / 1000).toFixed(0)}k`;
        if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
        return `$${val.toLocaleString()}`;
    };

    return (
        <div className="messenger-app-container" style={{ alignItems: 'flex-start', paddingTop: 24, gap: 20 }}>

            {/* ─── LEFT: Conversation List ─── */}
            <div className="ms-convo-list">
                <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid #2a2a2a' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 12 }}>💬 Chats</div>

                    {/* Profit Range */}
                    <div style={{ background: '#1c1c1e', borderRadius: 10, padding: 12, marginBottom: 10 }}>
                        <div style={{ fontSize: 11, color: '#8e8e93', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Profit Range</div>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 11, color: '#8e8e93', marginBottom: 3 }}>Min</div>
                                <select
                                    value={minIncome}
                                    onChange={e => setMinIncome(Number(e.target.value))}
                                    style={{ width: '100%', background: '#2c2c2e', color: 'white', border: '1px solid #3a3a3c', borderRadius: 6, padding: '5px 6px', fontSize: 12 }}
                                >
                                    {[5000, 10000, 20000, 25000, 50000, 75000, 100000].map(v => (
                                        <option key={v} value={v}>{formatIncomeDisplay(v)}/mo</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 11, color: '#8e8e93', marginBottom: 3 }}>Max</div>
                                <select
                                    value={maxIncome}
                                    onChange={e => setMaxIncome(Number(e.target.value))}
                                    style={{ width: '100%', background: '#2c2c2e', color: 'white', border: '1px solid #3a3a3c', borderRadius: 6, padding: '5px 6px', fontSize: 12 }}
                                >
                                    {[25000, 50000, 75000, 100000, 150000, 200000, 250000, 500000].map(v => (
                                        <option key={v} value={v}>{formatIncomeDisplay(v)}/mo</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div style={{ marginBottom: 8 }}>
                            <div style={{ fontSize: 11, color: '#8e8e93', marginBottom: 3 }}>Count: {count} conversations</div>
                            <input
                                type="range" min={5} max={25} value={count}
                                onChange={e => setCount(Number(e.target.value))}
                                style={{ width: '100%', accentColor: '#0084ff' }}
                            />
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            style={{
                                width: '100%', background: isGenerating ? '#333' : 'linear-gradient(135deg,#0084ff,#0052cc)',
                                color: 'white', border: 'none', borderRadius: 8, padding: '9px 0',
                                fontSize: 13, fontWeight: 700, cursor: isGenerating ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {isGenerating ? '⏳ Generating…' : '🎲 Generate Conversations'}
                        </button>
                    </div>
                </div>

                {/* Conversation rows */}
                <div style={{ overflowY: 'auto', flex: 1 }}>
                    {conversations.map((c, i) => (
                        <div
                            key={c.id}
                            onClick={() => setActiveIdx(i)}
                            className={`ms-convo-row ${i === activeIdx ? 'active' : ''}`}
                        >
                            <div style={{ position: 'relative', flexShrink: 0 }}>
                                <img src={c.avatar} alt={c.name} className="ms-convo-avatar" />
                                <div className="ms-convo-online-dot" />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: c.unread ? 700 : 500, fontSize: 14, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</span>
                                    <span style={{ fontSize: 11, color: '#8e8e93', flexShrink: 0, marginLeft: 6 }}>now</span>
                                </div>
                                <div style={{ fontSize: 12, color: c.unread ? 'white' : '#8e8e93', fontWeight: c.unread ? 600 : 400, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                    {formatIncomeDisplay(c.income)}/mo 🎉
                                </div>
                            </div>
                            {c.unread && <div className="ms-unread-dot" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* ─── RIGHT: Phone Frame ─── */}
            {active ? (
                <div className="messenger-frame">
                    {/* Header */}
                    <ChatHeader
                        name={active.name}
                        onNameChange={name => setConversations(prev => prev.map((c, i) => i === activeIdx ? { ...c, name } : c))}
                        avatar={active.avatar}
                        onAvatarClick={() => themAvatarInputRef.current?.click()}
                    />

                    <input
                        type="file" accept="image/*" ref={themAvatarInputRef}
                        style={{ display: 'none' }} onChange={handleAvatarUpload}
                    />

                    {/* Messages */}
                    <div className="messenger-body" ref={messagesContainerRef}>
                        {/* Date stamp */}
                        <div style={{ textAlign: 'center', fontSize: 11, color: '#8e8e93', margin: '8px 0 4px' }}>
                            Today {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                        </div>

                        {active.messages.map((msg, idx) => (
                            <MessageBubble
                                key={msg.id}
                                message={msg}
                                onUpdate={handleUpdateMessage}
                                themAvatar={active.avatar}
                                onAvatarClick={() => themAvatarInputRef.current?.click()}
                                showDelivered={
                                    msg.sender === 'me' &&
                                    idx === active.messages
                                        .map((m, i) => ({ m, i }))
                                        .filter(({ m }) => m.sender === 'me')
                                        .slice(-1)[0]?.i
                                }
                            />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Footer */}
                    <img
                        src="/src/assets/messenger/static_footer.jpg"
                        alt="Footer"
                        className="static-footer-img"
                    />
                </div>
            ) : (
                <div className="messenger-frame" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: 14 }}>
                    {isGenerating ? '⏳ Generating conversations…' : 'Click Generate to start'}
                </div>
            )}
        </div>
    );
};

export default MessengerApp;
