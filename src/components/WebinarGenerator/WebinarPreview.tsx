import React from 'react';
import { ChevronLeft, ChevronRight, Image, Plus } from 'lucide-react';
import './WebinarGen.css';

interface WebinarPreviewProps {
    slide: any;
    config: any;
    onNext: () => void;
    onPrev: () => void;
}

const WebinarPreview: React.FC<WebinarPreviewProps> = ({ slide, config, onNext, onPrev }) => {

    const getSlideStyle = () => {
        const base = {
            flex: 1,
            display: 'flex',
            flexDirection: 'column' as const,
            padding: 60
        };

        switch (config.style.colorScheme) {
            case 'modern-dark': return { ...base, background: '#111', color: 'white' };
            case 'corporate-blue': return { ...base, background: '#1e3a8a', color: 'white' };
            case 'vibrant-orange': return { ...base, background: 'linear-gradient(135deg, #c2410c 0%, #ea580c 100%)', color: 'white' };
            case 'luxury-gold': return { ...base, background: '#000', color: '#fbbf24' };
            default: return { ...base, background: 'white', color: '#111827' };
        }
    };

    return (
        <div className="wg-canvas">
            <div className="wg-slide-container">
                {/* Slide Content */}
                <div style={getSlideStyle()}>
                    {/* Header/Logo Placeholder */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 40 }}>
                        <div style={{ fontWeight: 700, opacity: 0.7 }}>{config.general.title || 'Webinar Title'}</div>
                        {config.general.logo && <img src={config.general.logo} style={{ height: 30 }} />}
                    </div>

                    {slide?.type === 'empty' ? (
                        <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', opacity: 0.3, fontSize: 24, border: '2px dashed currentColor', borderRadius: 10 }}>
                            Empty Slide {slide.id + 1}
                        </div>
                    ) : (
                        <>
                            <div className="wg-slide-title">
                                {slide?.title || 'Untitled Slide'}
                            </div>

                            {/* Content Renderer based on Type */}
                            {slide?.type === 'social-proof' && slide.images && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginTop: 20 }}>
                                    {slide.images.map((img: string, i: number) => (
                                        <img key={i} src={img} style={{ height: 60, borderRadius: 4, background: 'white', padding: 4 }} />
                                    ))}
                                </div>
                            )}

                            {slide?.type === 'testimonial' && (
                                <div style={{ background: 'rgba(255,255,255,0.1)', padding: 30, borderRadius: 12, marginTop: 20 }}>
                                    <div style={{ fontSize: 20, fontStyle: 'italic', marginBottom: 16 }}>"{slide.content}"</div>
                                    {slide.images && slide.images[0] && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <img src={slide.images[0]} style={{ width: 40, height: 40, borderRadius: '50%' }} />
                                            <div style={{ fontSize: 14, fontWeight: 600 }}>Verified Student</div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {(slide?.type === 'content' || slide?.type === 'intro' || !slide?.type) && (
                                <div className="wg-slide-text">
                                    {slide?.content}
                                </div>
                            )}
                        </>
                    )}

                    {/* Footer */}
                    <div style={{ marginTop: 'auto', fontSize: 14, opacity: 0.5, borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 20 }}>
                        {config.style.footerText || '© 2026 Webinar Program • Confidential Blueprint'}
                    </div>
                </div>

                {/* Host Bubble */}
                <div className="wg-host-bubble">
                    <img src={config.media.hostImage || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} alt="Host" />
                </div>

                {/* Navigation Hover Controls */}
                <button
                    onClick={onPrev}
                    style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: 40, height: 40, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={onNext}
                    style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: 40, height: 40, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
};

export default WebinarPreview;
