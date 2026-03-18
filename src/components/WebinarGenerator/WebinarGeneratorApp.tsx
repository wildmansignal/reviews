import { useState } from 'react';
import { Download, LayoutGrid, MonitorPlay, Sparkles, Wrench } from 'lucide-react';
import AIWebinarPanel from './AIWebinarPanel';
import WebinarSetup from './WebinarSetup';
import WebinarPreview from './WebinarPreview';
import SlideGrid from './SlideGrid';
import './WebinarGen.css';

const WebinarGeneratorApp = () => {
    const [config, setConfig] = useState({
        general: { title: 'New Webinar', host: 'Host Name', about: '', logo: '' },
        media: { hostImage: '', testimonials: [], socialProof: [] },
        style: { colorScheme: 'modern-dark', slideCount: 100, footerText: '' }
    });

    const [viewMode, setViewMode] = useState<'preview' | 'grid'>('grid');
    const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
    const [leftTab, setLeftTab] = useState<'ai' | 'manual'>('ai');

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
            newSlides[index] = { ...newSlides[index], ...slideData, type: slideData.type, id: index };
            return newSlides;
        });
        setCurrentSlideIdx(index);
        setViewMode('preview');
    };

    // Called when AI generates the full deck
    const handleSlidesGenerated = (newSlides: any[]) => {
        // Pad to 100 if needed
        const padded = [...newSlides];
        while (padded.length < 100) {
            padded.push({ id: padded.length, type: 'empty', title: 'Empty Slide' });
        }
        setSlides(padded.map((s, i) => ({ ...s, id: i })));
        setCurrentSlideIdx(0);
        setViewMode('grid');
    };

    const handleDownload = () => {
        // Export as JSON for now — could be extended to PPTX
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
                {/* Tab switcher */}
                <div className="wg-tab-bar">
                    <button
                        className={`wg-tab ${leftTab === 'ai' ? 'active' : ''}`}
                        onClick={() => setLeftTab('ai')}
                    >
                        <Sparkles size={13} /> AI Generate
                    </button>
                    <button
                        className={`wg-tab ${leftTab === 'manual' ? 'active' : ''}`}
                        onClick={() => setLeftTab('manual')}
                    >
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

            {/* Right: Main View */}
            <div className="wg-main-area">
                <div className="wg-toolbar">
                    <div style={{ fontSize: 13, color: '#9ca3af' }}>
                        <span style={{ color: '#a78bfa', fontWeight: 700 }}>{filledSlides}</span> slides generated
                    </div>

                    <div className="wg-mode-switch">
                        <div className={`wg-mode-btn ${viewMode === 'preview' ? 'active' : ''}`} onClick={() => setViewMode('preview')}>
                            <MonitorPlay size={14} style={{ display: 'inline', marginRight: 6 }} />Live Preview
                        </div>
                        <div className={`wg-mode-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
                            <LayoutGrid size={14} style={{ display: 'inline', marginRight: 6 }} />Blueprint Grid
                        </div>
                    </div>

                    <button className="wg-btn" onClick={handleDownload} style={{ width: 'auto', fontSize: 13, padding: '6px 16px' }}>
                        <Download size={16} /> Export JSON
                    </button>
                </div>

                {viewMode === 'preview' ? (
                    <WebinarPreview
                        slide={slides[currentSlideIdx]}
                        config={config}
                        onNext={() => setCurrentSlideIdx(prev => Math.min(prev + 1, slides.length - 1))}
                        onPrev={() => setCurrentSlideIdx(prev => Math.max(prev - 1, 0))}
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

export default WebinarGeneratorApp;
