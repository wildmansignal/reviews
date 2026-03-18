import { useState } from 'react';
import { Download, LayoutGrid, MonitorPlay, Sparkles, Wrench, FileDown } from 'lucide-react';
import AIWebinarPanel, { TRAVEL_PICS } from './AIWebinarPanel';
import WebinarSetup from './WebinarSetup';
import WebinarPreview from './WebinarPreview';
import SlideGrid from './SlideGrid';
import { exportWebinarToPptx } from '../../services/pptxExport';
import './WebinarGen.css';

const WebinarGeneratorApp = () => {
    const [config, setConfig] = useState({
        general: { title: 'Code On Fire University Webinar', host: 'Dan Plants', about: '', logo: '' },
        media: { hostImage: '/my-avatar/profile.jpg', testimonials: [], socialProof: [] },
        style: { colorScheme: 'modern-dark', slideCount: 100, footerText: '© 2026 Code On Fire University  •  Confidential Blueprint' }
    });

    const [viewMode, setViewMode] = useState<'preview' | 'grid'>('grid');
    const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
    const [leftTab, setLeftTab] = useState<'ai' | 'manual'>('ai');
    const [exporting, setExporting] = useState(false);

    const [slides, setSlides] = useState<any[]>(
        Array.from({ length: 100 }, (_, i) => ({ id: i, type: 'empty', title: 'Empty Slide' }))
    );

    const handleClearDeck = () => {
        if (confirm('Are you sure? This will wipe all slides.')) {
            setSlides(Array.from({ length: 100 }, (_, i) => ({ id: i, type: 'empty', title: 'Empty Slide' })));
        }
    };

    const handleUpdateSlide = (index: number, slideData: any) => {
        setSlides(prev => {
            const newSlides = [...prev];
            newSlides[index] = { ...newSlides[index], ...slideData, id: index };
            return newSlides;
        });
        setCurrentSlideIdx(index);
        setViewMode('preview');
    };

    // Update a single slide's field inline (for click-to-edit)
    const handleEditSlideField = (index: number, field: string, value: any) => {
        setSlides(prev => {
            const newSlides = [...prev];
            newSlides[index] = { ...newSlides[index], [field]: value };
            return newSlides;
        });
    };

    const handleSlidesGenerated = (newSlides: any[]) => {
        const padded = [...newSlides];
        while (padded.length < 100) {
            padded.push({ id: padded.length, type: 'empty', title: 'Empty Slide' });
        }
        setSlides(padded.map((s, i) => ({ ...s, id: i })));
        setCurrentSlideIdx(0);
        setViewMode('grid');
    };

    const handleDownloadPptx = async () => {
        setExporting(true);
        try {
            await exportWebinarToPptx(slides, config, TRAVEL_PICS);
        } catch (err) {
            console.error('PPTX export failed:', err);
            alert('PPTX export failed — check console for details.');
        } finally {
            setExporting(false);
        }
    };

    const handleDownloadJson = () => {
        const json = JSON.stringify({ config, slides: slides.filter(s => s.type !== 'empty') }, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${config.general.title.replace(/\s+/g, '_')}_webinar.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const filledSlides = slides.filter(s => s.type !== 'empty').length;

    return (
        <div className="wg-app-container">
            {/* Left Panel */}
            <div className="wg-setup-panel">
                <div className="wg-tab-bar">
                    <button className={`wg-tab ${leftTab === 'ai' ? 'active' : ''}`} onClick={() => setLeftTab('ai')}>
                        <Sparkles size={13} /> AI Generate
                    </button>
                    <button className={`wg-tab ${leftTab === 'manual' ? 'active' : ''}`} onClick={() => setLeftTab('manual')}>
                        <Wrench size={13} /> Manual Builder
                    </button>
                </div>

                {leftTab === 'ai' ? (
                    <AIWebinarPanel onSlidesGenerated={handleSlidesGenerated} />
                ) : (
                    <WebinarSetup
                        config={config}
                        setConfig={setConfig}
                        onClearDeck={handleClearDeck}
                        onUpdateSlide={handleUpdateSlide}
                    />
                )}
            </div>

            {/* Right: Main Content */}
            <div className="wg-main-area">
                <div className="wg-toolbar">
                    <div style={{ fontSize: 13, color: '#9ca3af' }}>
                        <span style={{ color: '#a78bfa', fontWeight: 700 }}>{filledSlides}</span> slides
                        {filledSlides > 0 && <span style={{ marginLeft: 8, color: '#6b7280' }}>· Click any slide to preview/edit</span>}
                    </div>

                    <div className="wg-mode-switch">
                        <div className={`wg-mode-btn ${viewMode === 'preview' ? 'active' : ''}`} onClick={() => setViewMode('preview')}>
                            <MonitorPlay size={14} style={{ display: 'inline', marginRight: 6 }} />Preview
                        </div>
                        <div className={`wg-mode-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
                            <LayoutGrid size={14} style={{ display: 'inline', marginRight: 6 }} />Grid
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                        <button
                            className="wg-btn"
                            onClick={handleDownloadPptx}
                            disabled={exporting || filledSlides === 0}
                            style={{ width: 'auto', fontSize: 13, padding: '6px 16px', background: exporting ? '#4b5563' : 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
                        >
                            {exporting ? <><Loader size={15} /> Exporting...</> : <><FileDown size={15} /> Download .pptx</>}
                        </button>
                        <button
                            className="wg-btn"
                            onClick={handleDownloadJson}
                            disabled={filledSlides === 0}
                            style={{ width: 'auto', fontSize: 13, padding: '6px 16px', background: '#374151' }}
                        >
                            <Download size={15} /> JSON
                        </button>
                    </div>
                </div>

                {viewMode === 'preview' ? (
                    <WebinarPreview
                        slide={slides[currentSlideIdx]}
                        config={config}
                        onNext={() => setCurrentSlideIdx(prev => Math.min(prev + 1, slides.length - 1))}
                        onPrev={() => setCurrentSlideIdx(prev => Math.max(prev - 1, 0))}
                        onEditSlide={(field, value) => handleEditSlideField(currentSlideIdx, field, value)}
                    />
                ) : (
                    <SlideGrid
                        slides={slides}
                        config={config}
                        currentSlideIdx={currentSlideIdx}
                        onSelectSlide={(idx) => { setCurrentSlideIdx(idx); setViewMode('preview'); }}
                    />
                )}
            </div>
        </div>
    );
};

// Minimal spinner icon
const Loader = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 0.8s linear infinite', display: 'inline' }}>
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
);

export default WebinarGeneratorApp;
