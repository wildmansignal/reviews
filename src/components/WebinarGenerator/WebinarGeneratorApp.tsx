import React, { useState, useEffect } from 'react';
import { Download, LayoutGrid, MonitorPlay, Save } from 'lucide-react';
import WebinarSetup from './WebinarSetup';
import WebinarPreview from './WebinarPreview';
import SlideGrid from './SlideGrid';
import './WebinarGen.css';

const WebinarGeneratorApp = () => {
    // Master Config State
    const [config, setConfig] = useState({
        general: { title: 'New Webinar', host: 'Host Name', about: '', logo: '' },
        media: { hostImage: '', testimonials: [], socialProof: [] },
        style: { colorScheme: 'modern-dark', slideCount: 100, footerText: '' }
    });

    const [viewMode, setViewMode] = useState<'preview' | 'grid'>('grid');
    const [currentSlideIdx, setCurrentSlideIdx] = useState(0);

    // Initialize with 100 empty slides
    const [slides, setSlides] = useState<any[]>(
        Array.from({ length: 100 }, (_, i) => ({ id: i, type: 'empty', title: 'Empty Slide' }))
    );
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleClearDeck = () => {
        if (confirm("Are you sure? This will wipe all slides.")) {
            setSlides(Array.from({ length: 100 }, (_, i) => ({ id: i, type: 'empty', title: 'Empty Slide' })));
        }
    };

    const handleUpdateSlide = (index: number, slideData: any) => {
        setSlides(prev => {
            const newSlides = [...prev];
            // Ensure array is large enough if accessing index > current length
            if (index >= newSlides.length) {
                // expand array if needed, though we init with 100
            }
            newSlides[index] = { ...newSlides[index], ...slideData, type: slideData.type, id: index };
            return newSlides;
        });
        setCurrentSlideIdx(index);
        setViewMode('preview');
    };

    const handleAnalyze = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            setIsAnalyzing(false);
            // Simulate AI recognizing the 187 slides
            setConfig(prev => ({
                ...prev,
                general: { ...prev.general, title: "AI Analyzed: 187 Slide Blueprint" },
                style: { ...prev.style, slideCount: 187 } // Set to 187 specifically
            }));
            alert("Analysis Complete! 187 Slides Processed.");
        }, 1500);
    };

    const handleDownload = () => {
        alert("Downloading .pptx and Keynote assets...");
    };

    return (
        <div className="wg-app-container">
            {/* Left: Configuration */}
            <WebinarSetup
                config={config}
                setConfig={setConfig}
                onClearDeck={handleClearDeck}
                onUpdateSlide={handleUpdateSlide}
            />

            {/* Right: Main View */}
            <div className="wg-main-area">
                <div className="wg-toolbar">
                    {/* View Switcher */}
                    <div className="wg-mode-switch">
                        <div
                            className={`wg-mode-btn ${viewMode === 'preview' ? 'active' : ''}`}
                            onClick={() => setViewMode('preview')}
                        >
                            <MonitorPlay size={14} style={{ display: 'inline', marginRight: 6 }} /> Live Preview
                        </div>
                        <div
                            className={`wg-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                        >
                            <LayoutGrid size={14} style={{ display: 'inline', marginRight: 6 }} /> Blueprint Grid
                        </div>
                    </div>

                    {/* Actions */}
                    <button className="wg-btn" onClick={handleDownload} style={{ width: 'auto', fontSize: 13, padding: '6px 16px' }}>
                        <Download size={16} /> Export Keynote/PPTX
                    </button>
                </div>

                {/* View Content */}
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
