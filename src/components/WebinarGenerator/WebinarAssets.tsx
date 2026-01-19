import React, { useRef } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import './WebinarGen.css';

interface WebinarAssetsProps {
    assets: string[];
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDragStart: (e: React.DragEvent, url: string) => void;
}

const WebinarAssets: React.FC<WebinarAssetsProps> = ({ assets, onUpload, onDragStart }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="wg-assets-panel">
            <div className="wg-header">
                <h2>My Assets</h2>
                <button className="wg-icon-btn" onClick={() => inputRef.current?.click()}>
                    <Upload size={16} />
                </button>
                <input type="file" multiple ref={inputRef} style={{ display: 'none' }} onChange={onUpload} />
            </div>

            <div className="wg-asset-grid">
                {assets.map((url, i) => (
                    <div
                        key={i}
                        className="wg-asset-item"
                        draggable
                        onDragStart={(e) => onDragStart(e, url)}
                    >
                        <img src={url} />
                    </div>
                ))}
                {assets.length === 0 && (
                    <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: 20, opacity: 0.5, fontSize: 12, border: '1px dashed #444', borderRadius: 8 }}>
                        Upload images to drag & drop.
                    </div>
                )}
            </div>
        </div>
    );
};

export default WebinarAssets;
