import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Edit2, Check } from 'lucide-react';
import './WebinarGen.css';

interface WebinarPreviewProps {
    slide: any;
    config: any;
    onNext: () => void;
    onPrev: () => void;
    onEditSlide?: (field: string, value: any) => void;
}

const SCHEME_STYLES: Record<string, { bg: string; color: string; accent: string }> = {
    'modern-dark': { bg: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)', color: '#f1f5f9', accent: '#a78bfa' },
    'corporate-blue': { bg: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)', color: '#f0f9ff', accent: '#60a5fa' },
    'vibrant-orange': { bg: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 100%)', color: '#fff7ed', accent: '#fb923c' },
    'luxury-gold': { bg: 'linear-gradient(135deg, #000 0%, #111 100%)', color: '#fbbf24', accent: '#f59e0b' },
};

const EditableText: React.FC<{
    value: string;
    onSave: (v: string) => void;
    style?: React.CSSProperties;
    multiline?: boolean;
}> = ({ value, onSave, style, multiline }) => {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value);

    const save = () => { onSave(draft); setEditing(false); };

    if (editing) {
        return (
            <div style={{ position: 'relative', width: '100%' }}>
                {multiline ? (
                    <textarea
                        autoFocus
                        value={draft}
                        onChange={e => setDraft(e.target.value)}
                        style={{ ...style, width: '100%', background: 'rgba(0,0,0,0.5)', border: '2px solid #a78bfa', color: 'inherit', borderRadius: 6, padding: 8, resize: 'vertical', fontFamily: 'inherit' }}
                        rows={4}
                    />
                ) : (
                    <input
                        autoFocus
                        value={draft}
                        onChange={e => setDraft(e.target.value)}
                        style={{ ...style, width: '100%', background: 'rgba(0,0,0,0.5)', border: '2px solid #a78bfa', color: 'inherit', borderRadius: 6, padding: '6px 10px', fontFamily: 'inherit' }}
                    />
                )}
                <button onClick={save} style={{ position: 'absolute', top: 4, right: 4, background: '#a78bfa', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', color: '#000', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                    <Check size={12} /> Save
                </button>
            </div>
        );
    }

    return (
        <div style={{ position: 'relative', cursor: 'text', ...style }}
            onClick={() => { setDraft(value); setEditing(true); }}
            title="Click to edit"
        >
            {value}
            <Edit2 size={12} style={{ position: 'absolute', top: 2, right: -20, opacity: 0.4 }} />
        </div>
    );
};

const WebinarPreview: React.FC<WebinarPreviewProps> = ({ slide, config, onNext, onPrev, onEditSlide }) => {
    const scheme = SCHEME_STYLES[config.style?.colorScheme] ?? SCHEME_STYLES['modern-dark'];
    const isEmpty = !slide || slide.type === 'empty';
    const bullets: string[] = slide?.bullets ?? (slide?.content ? slide.content.split('\n').filter(Boolean) : []);

    const edit = (field: string, value: any) => onEditSlide?.(field, value);

    return (
        <div className="wg-canvas">
            <div className="wg-slide-container">

                {/* ── Main Slide ── */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: scheme.bg, color: scheme.color, padding: '48px 64px', minHeight: 0 }}>

                    {/* Section / Timing bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, fontSize: 12, opacity: 0.7 }}>
                        <span style={{ fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: scheme.accent }}>
                            {slide?.section ?? config.general?.title ?? 'Webinar'}
                        </span>
                        <span>{slide?.timing ?? ''}</span>
                    </div>

                    {isEmpty ? (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.2, fontSize: 22, border: `2px dashed ${scheme.accent}`, borderRadius: 12 }}>
                            Slide {(slide?.id ?? 0) + 1} — Empty
                        </div>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            {/* Editable Title */}
                            <EditableText
                                value={slide.title}
                                onSave={v => edit('title', v)}
                                style={{ fontSize: 36, fontWeight: 800, lineHeight: '1.2', marginBottom: 32, maxWidth: '85%', display: 'block' }}
                            />

                            {/* Editable Bullets */}
                            {bullets.length > 0 && (
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    {bullets.map((b, idx) => (
                                        <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, fontSize: 18, lineHeight: 1.5 }}>
                                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: scheme.accent, flexShrink: 0, marginTop: 8 }} />
                                            <EditableText
                                                value={b}
                                                onSave={v => {
                                                    const newBullets = [...bullets];
                                                    newBullets[idx] = v;
                                                    edit('bullets', newBullets);
                                                }}
                                                style={{ fontSize: 18, lineHeight: '1.5', flex: 1 }}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {slide.type === 'offer' && (
                                <div style={{ marginTop: 32, display: 'inline-block', background: scheme.accent, color: '#000', padding: '12px 32px', borderRadius: 8, fontWeight: 800, fontSize: 20 }}>
                                    Book Your Free Strategy Call →
                                </div>
                            )}
                        </div>
                    )}

                    {/* Footer */}
                    <div style={{ marginTop: 24, paddingTop: 16, borderTop: `1px solid ${scheme.accent}33`, fontSize: 11, opacity: 0.4, display: 'flex', justifyContent: 'space-between' }}>
                        <span>{config.style?.footerText || '© 2026 Code On Fire University'}</span>
                        <span>Slide {slide?.slideNum ?? (slide?.id ?? 0) + 1}</span>
                    </div>
                </div>

                {/* ── Editable Speaker Notes ── */}
                {slide?.speakerNote !== undefined && !isEmpty && (
                    <div className="wg-speaker-notes">
                        <div className="wg-speaker-label">🎤 Speaker Notes <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(click to edit)</span></div>
                        <EditableText
                            value={slide.speakerNote || ''}
                            onSave={v => edit('speakerNote', v)}
                            style={{ color: '#e2e8f0', lineHeight: '1.6', fontStyle: 'italic', fontSize: 13 }}
                            multiline
                        />
                    </div>
                )}

                {/* Host Bubble */}
                <div className="wg-host-bubble">
                    <img
                        src={config.media?.hostImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                        alt="Host"
                    />
                </div>

                {/* Nav */}
                <button onClick={onPrev} style={{ position: 'absolute', left: 20, top: '45%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 40, height: 40, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChevronLeft size={24} />
                </button>
                <button onClick={onNext} style={{ position: 'absolute', right: 20, top: '45%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 40, height: 40, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
};

export default WebinarPreview;
