import React from 'react';
import { SlideElement } from './types';

interface EditorPropertiesProps {
    element?: SlideElement;
}

const EditorProperties: React.FC<EditorPropertiesProps> = ({ element }) => {
    return (
        <div className="keynote-inspector">
            <div className="inspector-tabs">
                <div className="inspector-tab active">Format</div>
                <div className="inspector-tab">Animate</div>
                <div className="inspector-tab">Document</div>
            </div>

            <div className="inspector-content">
                {!element ? (
                    <div className="inspector-section">
                        <span className="inspector-label">Slide Layout</span>
                        <div style={{ color: '#666', fontSize: 12, fontStyle: 'italic' }}>
                            No element selected.
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="inspector-section">
                            <span className="inspector-label">{element.type.toUpperCase()}</span>
                        </div>

                        {element.type === 'text' && (
                            <div className="inspector-section">
                                <span className="inspector-label">Style</span>
                                <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
                                    <div className="inspector-row">
                                        <select className="inspector-input">
                                            <option>Arial</option>
                                            <option>Helvetica</option>
                                            <option>Inter</option>
                                            <option>Georgia</option>
                                        </select>
                                    </div>
                                    <div className="inspector-row">
                                        <div style={{ display: 'flex', gap: 4 }}>
                                            <button className="inspector-input" style={{ width: 30, textAlign: 'center' }}>B</button>
                                            <button className="inspector-input" style={{ width: 30, textAlign: 'center' }}>I</button>
                                            <button className="inspector-input" style={{ width: 30, textAlign: 'center' }}>U</button>
                                        </div>
                                        <input type="color" className="inspector-input" style={{ width: 30, padding: 0, height: 24 }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="inspector-section">
                            <span className="inspector-label">Position & Size</span>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                <div>
                                    <label style={{ fontSize: 10, color: '#666' }}>X</label>
                                    <input className="inspector-input" value={element.x} readOnly />
                                </div>
                                <div>
                                    <label style={{ fontSize: 10, color: '#666' }}>Y</label>
                                    <input className="inspector-input" value={element.y} readOnly />
                                </div>
                                <div>
                                    <label style={{ fontSize: 10, color: '#666' }}>Width</label>
                                    <input className="inspector-input" value={element.width} readOnly />
                                </div>
                                <div>
                                    <label style={{ fontSize: 10, color: '#666' }}>Height</label>
                                    <input className="inspector-input" value={element.height} readOnly />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default EditorProperties;
