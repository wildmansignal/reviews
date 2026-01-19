import React, { useRef } from 'react';
import { Slide } from './types';

interface EditorCanvasProps {
    slide: Slide;
    selectedId: string | null;
    onSelectElement: (id: string | null) => void;
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({ slide, selectedId, onSelectElement }) => {
    return (
        <div className="keynote-canvas-area">
            <div
                className="keynote-slide"
                onClick={() => onSelectElement(null)}
            >
                {/* Background (e.g. Imported Slide) */}
                {slide.background && (
                    <img
                        src={slide.background}
                        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, objectFit: 'contain', zIndex: 0 }}
                    />
                )}

                {/* Editable Elements */}
                {slide.elements.map(el => (
                    <div
                        key={el.id}
                        className={`canvas-element ${selectedId === el.id ? 'selected' : ''}`}
                        style={{
                            left: el.x,
                            top: el.y,
                            width: el.width,
                            height: el.height,
                            ...el.style
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelectElement(el.id);
                        }}
                    >
                        {/* Selection Handles */}
                        {selectedId === el.id && (
                            <>
                                <div className="resize-handle" style={{ top: -4, left: -4, cursor: 'nw-resize' }} />
                                <div className="resize-handle" style={{ top: -4, right: -4, cursor: 'ne-resize' }} />
                                <div className="resize-handle" style={{ bottom: -4, left: -4, cursor: 'sw-resize' }} />
                                <div className="resize-handle" style={{ bottom: -4, right: -4, cursor: 'se-resize' }} />
                            </>
                        )}

                        {el.type === 'text' && (
                            <div
                                contentEditable
                                suppressContentEditableWarning
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    outline: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: el.style?.textAlign === 'center' ? 'center' : 'flex-start'
                                }}
                            >
                                {el.content}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EditorCanvas;
