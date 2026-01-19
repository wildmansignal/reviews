import React from 'react';
import './WebinarGen.css';

interface WebinarCanvasProps {
    slide: any;
    onDrop: (e: React.DragEvent, zoneId: string) => void;
}

const WebinarCanvas: React.FC<WebinarCanvasProps> = ({ slide, onDrop }) => {

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // Necessary to allow dropping
    };

    // If no slide is selected or blank
    if (!slide || slide.type === 'blank') {
        return (
            <div className="wg-canvas-area empty">
                <div>Select a Reference Slide from the Library to begin</div>
            </div>
        );
    }

    // For the "Social Proof" template, we mock up some drop zones specifically
    // In a real app, these would be defined by the template data
    return (
        <div className="wg-canvas-area" style={{ position: 'relative' }}>
            {/* Background Reference */}
            <img
                src={slide.background}
                style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.9 }} // Slight opacity to differentiate
                alt="Reference"
            />

            {/* Overlay Drop Zones - Manually posited for this specific template mockup */}
            {/* Zone 1: Main Left Image */}
            <div
                className="wg-drop-zone"
                style={{ top: '20%', left: '5%', width: '40%', height: '40%' }}
                onDragOver={handleDragOver}
                onDrop={(e) => onDrop(e, 'zone1')}
            >
                {slide.assets?.zone1 ? <img src={slide.assets.zone1} /> : <span>Drop Asset Here</span>}
            </div>

            {/* Zone 2: Right Top Circular */}
            <div
                className="wg-drop-zone"
                style={{ top: '15%', right: '10%', width: '15%', height: '15%', borderRadius: '50%' }}
                onDragOver={handleDragOver}
                onDrop={(e) => onDrop(e, 'zone2')}
            >
                {slide.assets?.zone2 ? <img src={slide.assets.zone2} style={{ borderRadius: '50%' }} /> : <span>Drop</span>}
            </div>

            {/* Zone 3: Bottom Right Video */}
            <div
                className="wg-drop-zone"
                style={{ bottom: '5%', right: '5%', width: '25%', height: '25%' }}
                onDragOver={handleDragOver}
                onDrop={(e) => onDrop(e, 'zone3')}
            >
                {slide.assets?.zone3 ? <img src={slide.assets.zone3} /> : <span>Drop Host</span>}
            </div>

        </div>
    );
};

export default WebinarCanvas;
