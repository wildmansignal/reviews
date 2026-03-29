import React, { useState } from 'react';
import { generateGmailThread } from '../../services/openai';
import './GmailThread.css';

interface GmailControlPanelProps {
    selectedMsg: any;
    onUpdateMsg: (id: string, field: string, value: any) => void;
    onAddMsg: () => void;
    onAIGenerate?: (messages: any[], subject: string) => void;
}

const GmailControlPanel: React.FC<GmailControlPanelProps> = ({
    selectedMsg, onUpdateMsg, onAddMsg, onAIGenerate
}) => {
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');
    const [tinnitusMode, setTinnitusMode] = useState(false);

    const handleAIGenerate = async () => {
        setAiLoading(true);
        setAiError('');
        try {
            const result = await generateGmailThread(tinnitusMode ? 'tinnitus' : 'default');
            if (onAIGenerate) onAIGenerate(result.messages, result.subject);
        } catch (e: unknown) {
            setAiError(e instanceof Error ? e.message : 'AI generation failed');
        } finally {
            setAiLoading(false);
        }
    };
    return (
        <div className="gm-controls">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h3 style={{ margin: 0 }}>Gmail Simulation</h3>
                <button
                    onClick={handleAIGenerate}
                    disabled={aiLoading}
                    style={{ background: 'linear-gradient(135deg,#1a73e8,#0d47a1)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: aiLoading ? 'not-allowed' : 'pointer', opacity: aiLoading ? 0.7 : 1 }}
                >
                    {aiLoading ? '...' : '⚡ AI Fill'}
                </button>
            </div>
            {aiError && <div style={{ color: '#d93025', fontSize: 12, marginBottom: 8 }}>{aiError}</div>}

            {/* Tinnitus Mode Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8f9fa', borderRadius: 8, padding: '7px 12px', marginBottom: 10, border: '1px solid #e8eaed' }}>
                <span style={{ fontSize: 12, color: '#5f6368', whiteSpace: 'nowrap' }}>🔥 Code On Fire</span>
                <label style={{ position: 'relative', display: 'inline-block', width: 40, height: 22, cursor: 'pointer', flexShrink: 0 }}>
                    <input type="checkbox" checked={tinnitusMode} onChange={e => setTinnitusMode(e.target.checked)} style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }} />
                    <span style={{
                        position: 'absolute', inset: 0, borderRadius: 999,
                        background: tinnitusMode ? 'linear-gradient(135deg,#0ea5e9,#06b6d4)' : '#bdc1c6',
                        transition: 'background 0.25s'
                    }}>
                        <span style={{
                            position: 'absolute', height: 16, width: 16, left: tinnitusMode ? 21 : 3, top: 3,
                            background: 'white', borderRadius: '50%', transition: 'left 0.25s',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                        }} />
                    </span>
                </label>
                <span style={{ fontSize: 12, color: '#5f6368', whiteSpace: 'nowrap' }}>👂 Tinnitus</span>
            </div>

            <div className="gm-control-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="gm-label">Edit Message</label>
                    <button
                        onClick={onAddMsg}
                        style={{ padding: '6px 12px', fontSize: 12, background: '#1a73e8', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: '500' }}
                    >
                        + Reply / Add
                    </button>
                </div>

                {selectedMsg ? (
                    <div style={{ marginTop: 15 }}>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <div style={{ flex: 1 }}>
                                <label className="gm-label">Sender Name</label>
                                <input
                                    className="gm-input"
                                    value={selectedMsg.senderName}
                                    onChange={(e) => onUpdateMsg(selectedMsg.id, 'senderName', e.target.value)}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label className="gm-label">Avatar Type</label>
                                {/* Simple toggle or just instructions? Let's use a select */}
                                <select
                                    className="gm-input"
                                    value={selectedMsg.avatar.startsWith('letter') ? 'Letter' : 'Image'}
                                    onChange={(e) => {
                                        if (e.target.value === 'Letter') onUpdateMsg(selectedMsg.id, 'avatar', 'letter:D:#009688');
                                        else onUpdateMsg(selectedMsg.id, 'avatar', 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png');
                                    }}
                                >
                                    <option value="Image">Image</option>
                                    <option value="Letter">Letter</option>
                                </select>
                            </div>
                        </div>

                        {selectedMsg.avatar.startsWith('letter') ? (
                            <div style={{ display: 'flex', gap: 10 }}>
                                <div style={{ flex: 1 }}>
                                    <label className="gm-label">Letter</label>
                                    <input
                                        className="gm-input"
                                        value={selectedMsg.avatar.split(':')[1]}
                                        onChange={(e) => {
                                            const parts = selectedMsg.avatar.split(':');
                                            onUpdateMsg(selectedMsg.id, 'avatar', `letter:${e.target.value}:${parts[2]}`);
                                        }}
                                        maxLength={1}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="gm-label">Color (Hex)</label>
                                    <input
                                        className="gm-input"
                                        value={selectedMsg.avatar.split(':')[2]}
                                        onChange={(e) => {
                                            const parts = selectedMsg.avatar.split(':');
                                            onUpdateMsg(selectedMsg.id, 'avatar', `letter:${parts[1]}:${e.target.value}`);
                                        }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label className="gm-label">Upload Avatar</label>
                                <input
                                    type="file"
                                    className="gm-input"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            const url = URL.createObjectURL(e.target.files[0]);
                                            onUpdateMsg(selectedMsg.id, 'avatar', url);
                                        }
                                    }}
                                />
                            </div>
                        )}

                        <label className="gm-label">Date String</label>
                        <input
                            className="gm-input"
                            value={selectedMsg.date}
                            onChange={(e) => onUpdateMsg(selectedMsg.id, 'date', e.target.value)}
                        />

                        <label className="gm-label">Message Content</label>
                        <textarea
                            className="gm-input"
                            style={{ height: 200, fontFamily: 'monospace' }}
                            value={selectedMsg.content}
                            onChange={(e) => onUpdateMsg(selectedMsg.id, 'content', e.target.value)}
                        />

                        <label className="gm-label">Details Subtext</label>
                        <input
                            className="gm-input"
                            value={selectedMsg.details}
                            onChange={(e) => onUpdateMsg(selectedMsg.id, 'details', e.target.value)}
                        />

                    </div>
                ) : (
                    <div style={{ padding: 20, textAlign: 'center', color: '#666', border: '1px dashed #ccc', marginTop: 10 }}>
                        Select a message to edit.
                    </div>
                )}
            </div>
        </div>
    );
};

export default GmailControlPanel;
