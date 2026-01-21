import React from 'react';
import type { Slide } from './types';

interface EditorSidebarProps {
    slides: Slide[];
    activeId: string;
    onSelect: (id: string) => void;
}

const EditorSidebar: React.FC<EditorSidebarProps> = ({ slides, activeId, onSelect }) => {
    return (
        <div className="keynote-sidebar">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`slide-thumbnail ${slide.id === activeId ? 'active' : ''}`}
                    onClick={() => onSelect(slide.id)}
                >
                    <div className="slide-num">{index + 1}</div>
                    <div className="thumbnail-preview">
                        {slide.background ? (
                            <img src={slide.background} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        ) : (
                            <div style={{ width: '100%', height: '100%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: '#333' }}>
                                {slide.elements.length > 0 ? 'Abc' : ''}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EditorSidebar;
