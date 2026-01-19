import React, { useState, useRef } from 'react';
import { Upload, Trash2, Plus, Image, Type } from 'lucide-react';
import './WebinarGen.css';

interface WebinarSetupProps {
    config: any;
    setConfig: (newConfig: any) => void;
    onClearDeck: () => void;
    onUpdateSlide: (index: number, data: any) => void;
}

const WebinarSetup: React.FC<WebinarSetupProps> = ({ config, setConfig, onClearDeck, onUpdateSlide }) => {

    // Builder State
    const [targetSlide, setTargetSlide] = useState(1);
    const [slideType, setSlideType] = useState('content');
    const [refImage, setRefImage] = useState<string | null>(null);

    // Content Fields
    const [headline, setHeadline] = useState('');
    const [bodyText, setBodyText] = useState('');

    // Social Proof / Assets
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);

    const refInput = useRef<HTMLInputElement>(null);
    const assetInput = useRef<HTMLInputElement>(null);

    const handleRefUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setRefImage(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleAssetUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setUploadedImages([...uploadedImages, URL.createObjectURL(e.target.files[0])]);
        }
    };

    const handleBuild = () => {
        // Construct slide data based on type
        const slideData = {
            type: slideType,
            title: headline,
            content: bodyText,
            images: uploadedImages,
            refImage: refImage
        };

        onUpdateSlide(targetSlide - 1, slideData); // 0-indexed

        // Advance to next slide automatically
        setTargetSlide(prev => prev + 1);
        setHeadline('');
        setBodyText('');
        setUploadedImages([]);
        setRefImage(null);
    };

    return (
        <div className="wg-setup-panel">
            <div className="wg-header">
                <h2>Slide Builder</h2>
                <button className="wg-btn-secondary" onClick={onClearDeck} style={{ padding: '4px 10px', fontSize: 12, borderColor: '#ef4444', color: '#ef4444' }}>
                    <Trash2 size={12} style={{ marginRight: 4 }} /> Clear All
                </button>
            </div>

            <div className="wg-scroll-content">

                {/* 1. Target & Type */}
                <div className="wg-section">
                    <div style={{ display: 'flex', gap: 10 }}>
                        <div className="wg-input-group" style={{ flex: 1 }}>
                            <label className="wg-label">Target Slide #</label>
                            <input
                                className="wg-input"
                                type="number"
                                value={targetSlide}
                                onChange={e => setTargetSlide(parseInt(e.target.value))}
                            />
                        </div>
                        <div className="wg-input-group" style={{ flex: 2 }}>
                            <label className="wg-label">Slide Type</label>
                            <select
                                className="wg-select"
                                value={slideType}
                                onChange={e => setSlideType(e.target.value)}
                            >
                                <option value="content">Content / Text</option>
                                <option value="social-proof">Social Proof (Logos/Screenshots)</option>
                                <option value="testimonial">Testimonial / Review</option>
                                <option value="title">Title / Big Header</option>
                                <option value="offer">Offer / Price</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 2. Reference Image */}
                <div className="wg-section">
                    <div className="wg-section-title">Reference (Optional)</div>
                    <input type="file" ref={refInput} style={{ display: 'none' }} onChange={handleRefUpload} />
                    <div className="wg-dropzone" onClick={() => refInput.current?.click()}>
                        {refImage ? (
                            <img src={refImage} style={{ maxHeight: 100, maxWidth: '100%' }} />
                        ) : (
                            <div style={{ fontSize: 12, color: '#9ca3af' }}>Upload slide screenshot to copy style...</div>
                        )}
                    </div>
                </div>

                {/* 3. Content Builder - Dynamic based on Type */}
                <div className="wg-section">
                    <div className="wg-section-title">Slide Content</div>

                    <div className="wg-input-group">
                        <label className="wg-label">Headline / Title</label>
                        <input
                            className="wg-input"
                            value={headline}
                            onChange={e => setHeadline(e.target.value)}
                            placeholder="Enter main headline..."
                        />
                    </div>

                    {(slideType === 'content' || slideType === 'testimonial') && (
                        <div className="wg-input-group">
                            <label className="wg-label">{slideType === 'testimonial' ? 'Review Text' : 'Body Text'}</label>
                            <textarea
                                className="wg-textarea" rows={4}
                                value={bodyText}
                                onChange={e => setBodyText(e.target.value)}
                                placeholder="Enter content..."
                            />
                        </div>
                    )}

                    {(slideType === 'social-proof' || slideType === 'testimonial') && (
                        <div className="wg-input-group">
                            <label className="wg-label">Assets (Screenshots/Logos)</label>
                            <input type="file" ref={assetInput} style={{ display: 'none' }} onChange={handleAssetUpload} />
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                                {uploadedImages.map((img, i) => (
                                    <img key={i} src={img} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                                ))}
                                <button className="wg-btn-secondary" onClick={() => assetInput.current?.click()} style={{ width: 40, height: 40, padding: 0 }}>
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 4. Action */}
                <button className="wg-btn" onClick={handleBuild}>
                    Build Slide #{targetSlide}
                </button>

                <div style={{ marginTop: 30, paddingTop: 30, borderTop: '1px solid #374151' }}>
                    <div className="wg-section-title">Global Settings</div>
                    <div className="wg-input-group">
                        <label className="wg-label">Color Scheme</label>
                        <select
                            className="wg-select"
                            value={config.style.colorScheme}
                            onChange={e => setConfig({ ...config, style: { ...config.style, colorScheme: e.target.value } })}
                        >
                            <option value="modern-dark">Modern Dark</option>
                            <option value="corporate-blue">Corporate Blue</option>
                            <option value="vibrant-orange">Vibrant Orange</option>
                            <option value="luxury-gold">Luxury Gold</option>
                        </select>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default WebinarSetup;
