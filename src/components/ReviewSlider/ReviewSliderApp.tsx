import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Upload, Trash2, Battery, Wifi, Signal } from 'lucide-react';
import './ReviewSlider.css';

const ReviewSliderApp = () => {
    const [images, setImages] = useState<string[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(2); // Pixel increment per frame
    const scrollRef = useRef<HTMLDivElement>(null);
    const animationFrameRef = useRef<number | null>(null);

    // Handle File Upload
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newImages = Array.from(event.target.files).map(file => URL.createObjectURL(file));
            setImages(prev => [...prev, ...newImages]);
        }
    };

    // Clear All Images
    const handleClear = () => {
        setImages([]);
        setIsPlaying(false);
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
    };

    // Auto-Scroll Logic
    const animateScroll = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop += speed;

            // Loop if needed? Or just stop at bottom?
            // For now, let's stop at bottom or loop. Usually sliders loop.
            // Let's implement Loop logic: When we hit the bottom, jump to top smoothly?
            // "Proof" videos usually just scroll down one long list.
            // Let's stick to simple scrolling for now. User can reset.

            if (scrollRef.current.scrollTop + scrollRef.current.clientHeight >= scrollRef.current.scrollHeight) {
                setIsPlaying(false); // Stop when limits reached
                return;
            }
        }
        animationFrameRef.current = requestAnimationFrame(animateScroll);
    };

    useEffect(() => {
        if (isPlaying) {
            animationFrameRef.current = requestAnimationFrame(animateScroll);
        } else {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        }

        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [isPlaying, speed]);

    // Cleanup Object URLs
    useEffect(() => {
        return () => {
            images.forEach(url => URL.revokeObjectURL(url));
        };
    }, []);

    const getCurrentTime = () => {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false });
    };

    return (
        <div className="review-slider-workspace">
            {/* Control Panel */}
            <div className="controls-panel">
                <div className="control-group">
                    <span className="control-label">Upload Reviews</span>
                    <label className="btn-primary">
                        <Upload size={18} />
                        Add Screenshots
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="file-input"
                        />
                    </label>
                </div>

                <div className="control-group">
                    <span className="control-label">Playback</span>
                    <div className="flex gap-2">
                        <button
                            className="btn-primary"
                            onClick={() => setIsPlaying(!isPlaying)}
                            disabled={images.length === 0}
                            style={{
                                backgroundColor: isPlaying ? '#ef4444' : '#3b82f6',
                                width: '120px',
                                justifyContent: 'center'
                            }}
                        >
                            {isPlaying ? <><Pause size={18} /> Stop</> : <><Play size={18} /> Play</>}
                        </button>
                        <button className="btn-secondary" onClick={handleClear} title="Clear All">
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>

                <div className="control-group">
                    <span className="control-label">Speed</span>
                    <div className="slider-container">
                        <span className="text-xs">Slower</span>
                        <input
                            type="range"
                            min="0.5"
                            max="10"
                            step="0.5"
                            value={speed}
                            onChange={(e) => setSpeed(parseFloat(e.target.value))}
                            className="speed-slider"
                        />
                        <span className="text-xs">Faster</span>
                    </div>
                </div>
            </div>

            {/* iPhone Frame */}
            <div className={`iphone-frame ${isPlaying ? 'is-playing' : ''}`}>

                {/* Status Bar Elements */}
                <div className="status-bar-time">{getCurrentTime()}</div>
                <div className="dynamic-island"></div>
                <div className="status-bar-icons">
                    <Signal size={14} fill="currentColor" />
                    <Wifi size={14} />
                    <Battery size={14} fill="currentColor" />
                </div>

                {/* Main Content Area */}
                <div className="screen-content" ref={scrollRef}>
                    {images.length === 0 ? (
                        <div className="empty-state">
                            <Upload size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                            <p>Upload screenshot images to begin.</p>
                        </div>
                    ) : (
                        <div className="reviews-feed">
                            {images.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`Review ${index + 1}`}
                                    className="review-image"
                                />
                            ))}
                            {/* Extra padding at bottom for smooth finish */}
                            <div style={{ height: '100px' }}></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewSliderApp;
