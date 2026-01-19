import React from 'react';
import './WebinarGen.css';

interface SlideData {
    id: number;
    type: string;
    title: string;
    content?: string;
}

interface SlideGridProps {
    slides: SlideData[];
    config: any;
    onSelectSlide: (id: number) => void;
    currentSlideIdx: number;
}

const SlideGrid: React.FC<SlideGridProps> = ({ slides, config, onSelectSlide, currentSlideIdx }) => {

    // Helper to get minimal styles for thumbnails based on config
    const getThumbStyle = (slide: SlideData) => {
        if (slide.type === 'empty') {
            return { background: '#1f2937', color: '#6b7280', border: '1px dashed #374151' };
        }

        switch (config.style.colorScheme) {
            case 'modern-dark': return { background: '#111', color: 'white' };
            case 'corporate-blue': return { background: '#1e3a8a', color: 'white' };
            case 'vibrant-orange': return { background: '#c2410c', color: 'white' };
            case 'luxury-gold': return { background: '#000', color: '#fbbf24', border: '1px solid #fbbf24' };
            default: return { background: 'white', color: '#333' };
        }
    };

    return (
        <div className="wg-canvas">
            <div className="wg-slide-grid">
                {slides.map((slide, idx) => (
                    <div
                        key={slide.id}
                        className={`wg-slide-thumb ${idx === currentSlideIdx ? 'selected' : ''}`}
                        onClick={() => onSelectSlide(idx)}
                        style={getThumbStyle(slide)}
                    >
                        {/* Mini Mock Content */}
                        <div style={{ padding: 15, transform: 'scale(0.8)', transformOrigin: 'top left', width: '120%' }}>
                            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{slide.title}</div>
                            <div style={{ fontSize: 9, opacity: 0.7 }}>
                                {slide.content?.substring(0, 50)}...
                            </div>
                        </div>
                        {/* Slide Number */}
                        <div style={{ position: 'absolute', bottom: 5, right: 8, fontSize: 10, opacity: 0.5 }}>
                            {idx + 1}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SlideGrid;
