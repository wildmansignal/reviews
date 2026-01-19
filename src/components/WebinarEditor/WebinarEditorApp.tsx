import React, { useState, useEffect } from 'react';
import {
    Plus,
    Play,
    Image as ImageIcon,
    Type,
    Square,
    Layout,
    ChevronDown,
    Share,
    Wand2,
    Settings
} from 'lucide-react';
import './WebinarEditor.css';

// --- INLINED TYPES ---
interface SlideElement {
    id: string;
    type: 'text' | 'image' | 'shape';
    content?: string;
    x: number;
    y: number;
    width: number;
    height: number;
    style?: React.CSSProperties;
}

interface Slide {
    id: string;
    elements: SlideElement[];
    background?: string;
}

// --- SUB-COMPONENTS ---

const EditorSidebar = ({ slides, activeId, onSelect }: { slides: Slide[], activeId: string, onSelect: (id: string) => void }) => {
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

const EditorCanvas = ({ slide, selectedId, onSelectElement }: { slide: Slide, selectedId: string | null, onSelectElement: (id: string | null) => void }) => {
    // Safety check if slide is undefined
    if (!slide) return <div className="keynote-canvas-area" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>No Slide Selected</div>;

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
                            zIndex: 10,
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

const EditorProperties = ({ element }: { element?: SlideElement }) => {
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


// --- MAIN APP ---

const WebinarEditorApp = () => {
    useEffect(() => {
        console.log('WebinarEditorApp MOUNTED');
    }, []);

    // Initial State: 1 Blank Slide
    const [slides, setSlides] = useState<Slide[]>([
        { id: '1', elements: [] }
    ]);
    const [activeSlideId, setActiveSlideId] = useState('1');
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

    // FIX: Defined activeSlide!
    const activeSlide = slides.find(s => s.id === activeSlideId) || slides[0];

    const handleAddSlide = () => {
        const newSlide: Slide = {
            id: String(slides.length + 1),
            elements: []
        };
        setSlides([...slides, newSlide]);
        setActiveSlideId(newSlide.id);
    };

    // Manual Import Handler (As requested by User)
    const handleImportPPTX = () => {
        const importedSlides: Slide[] = [
            {
                id: 'manual-import-1',
                // Explicitly pointing to the file user created
                background: '/src/assets/Code On Fire - New Webinar.png',
                elements: []
            },
            { id: 'demo-1', background: '/src/assets/ugly_slide.png', elements: [] },
        ];

        setSlides(importedSlides);
        setActiveSlideId('manual-import-1');
    };

    // AI Analyze Handler
    const handleAnalyzeSlide = () => {
        if (!activeSlide || !activeSlide.background) return;

        const newElements: SlideElement[] = [
            {
                id: `ai-${Date.now()}-1`, type: 'text', content: 'AI Detected Heading',
                x: 100, y: 80, width: 600, height: 60,
                style: { fontSize: '42px', fontWeight: 'bold', fontFamily: 'Arial', color: 'black', textAlign: 'left' }
            },
            {
                id: `ai-${Date.now()}-2`, type: 'text', content: 'Detected body text paragraph...',
                x: 100, y: 160, width: 700, height: 40,
                style: { fontSize: '24px', fontFamily: 'Arial', color: 'black', textAlign: 'left' }
            }
        ];

        const updatedSlides = slides.map(s => {
            if (s.id === activeSlideId) {
                return { ...s, elements: [...s.elements, ...newElements] };
            }
            return s;
        });
        setSlides(updatedSlides);
    };

    return (
        <div className="keynote-container">
            {/* Top Toolbar */}
            <div className="keynote-toolbar">
                <div className="toolbar-group">
                    <button className="toolbar-btn">
                        <Layout size={18} />
                        View
                    </button>
                    <button className="toolbar-btn">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            35% <ChevronDown size={10} />
                        </div>
                        Zoom
                    </button>
                    <button className="toolbar-btn" onClick={handleAddSlide}>
                        <Plus size={18} />
                        Add Slide
                    </button>
                    <button className="toolbar-btn" onClick={() => { }}>
                        <Play size={18} fill="currentColor" />
                        Play
                    </button>
                </div>

                <div className="toolbar-group">
                    <button className="toolbar-btn">
                        <Settings size={18} />
                        Table
                    </button>
                    <button className="toolbar-btn">
                        <Settings size={18} />
                        Chart
                    </button>
                    <button className="toolbar-btn">
                        <Type size={18} />
                        Text
                    </button>
                    <button className="toolbar-btn">
                        <Square size={18} />
                        Shape
                    </button>
                    <button className="toolbar-btn">
                        <ImageIcon size={18} />
                        Media
                    </button>
                    <button className="toolbar-btn">
                        <Settings size={18} />
                        Comment
                    </button>
                </div>

                <div className="toolbar-group">
                    {/* Primary Actions */}
                    <button
                        className="toolbar-btn"
                        onClick={handleImportPPTX}
                        style={{ color: '#60a5fa' }}
                    >
                        <Layout size={18} />
                        Import PPTX
                    </button>

                    <button
                        className="toolbar-btn"
                        onClick={handleAnalyzeSlide}
                        disabled={!activeSlide?.background}
                        style={{ color: activeSlide?.background ? '#a855f7' : '#555' }}
                    >
                        <Wand2 size={18} />
                        Analyze (AI)
                    </button>

                    <div className="toolbar-divider" />

                    <button className="toolbar-btn">
                        <Share size={18} />
                        Share
                    </button>
                </div>
            </div>

            {/* Main Workspace */}
            <div className="keynote-body">
                <EditorSidebar
                    slides={slides}
                    activeId={activeSlideId}
                    onSelect={setActiveSlideId}
                />

                <EditorCanvas
                    slide={activeSlide}
                    selectedId={selectedElementId}
                    onSelectElement={setSelectedElementId}
                />

                <EditorProperties
                    element={activeSlide?.elements.find(e => e.id === selectedElementId)}
                />
            </div>
        </div>
    );
};

export default WebinarEditorApp;
