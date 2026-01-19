import React from 'react';
import './GmailThread.css';

interface GmailControlPanelProps {
    // Selected Message
    selectedMsg: any;
    onUpdateMsg: (id: string, field: string, value: any) => void;
    onAddMsg: () => void;
}

const GmailControlPanel: React.FC<GmailControlPanelProps> = ({
    selectedMsg, onUpdateMsg, onAddMsg
}) => {
    return (
        <div className="gm-controls">
            <h3>Gmail Simulation</h3>

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
