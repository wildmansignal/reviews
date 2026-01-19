import React, { useState } from 'react';
import { Folder, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import './WebinarGen.css';

interface WebinarLibraryProps {
    onSelectTemplate: (templateUrl: string, type: string) => void;
}

const WebinarLibrary: React.FC<WebinarLibraryProps> = ({ onSelectTemplate }) => {
    const [currentFolder, setCurrentFolder] = useState<string | null>(null);

    // Mock Folders
    const folders = [
        { id: 'social-proof', name: 'Social Proof', count: 5 },
        { id: 'content', name: 'Content Slides', count: 12 },
        { id: 'offer', name: 'Offer / Stack', count: 4 },
        { id: 'intro', name: 'Intro / Hook', count: 3 }
    ];

    // Mock Templates (Pretending to be inside folders)
    const templates = {
        'social-proof': [
            // User's specific uploaded reference
            '/Users/danplants/.gemini/antigravity/brain/b5c82db2-32ec-4beb-b451-e763ade8ff65/uploaded_image_1768444150330.png'
        ]
    };

    if (currentFolder) {
        return (
            <div className="wg-library-panel">
                <div className="wg-header clickable" onClick={() => setCurrentFolder(null)}>
                    <ArrowLeft size={16} />
                    <span style={{ marginLeft: 8 }}>{folders.find(f => f.id === currentFolder)?.name}</span>
                </div>
                <div className="wg-grid-2">
                    {templates[currentFolder as keyof typeof templates]?.map((url, i) => (
                        <div key={i} className="wg-template-card" onClick={() => onSelectTemplate(url, currentFolder)}>
                            <img src={url} alt="Template" />
                        </div>
                    )) || <div style={{ opacity: 0.5, fontSize: 12 }}>No templates yet.</div>}
                </div>
            </div>
        );
    }

    return (
        <div className="wg-library-panel">
            <div className="wg-header">
                <h2>Reference Library</h2>
            </div>
            <div className="wg-folder-list">
                {folders.map(folder => (
                    <div key={folder.id} className="wg-folder-item" onClick={() => setCurrentFolder(folder.id)}>
                        <Folder size={18} fill="#3b82f6" color="#3b82f6" />
                        <div style={{ flex: 1 }}>{folder.name}</div>
                        <div className="wg-badge">{folder.count}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WebinarLibrary;
