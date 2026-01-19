import React, { useState, useRef } from 'react';
import { Layout, Image as ImageIcon, Upload, Trash2, Download } from 'lucide-react';
import './WebinarDesigner.css';

interface ImageState {
    url: string | null;
    fileName: string;
}

const WebinarDesignerApp = () => {
    // State for exactly 2 photos
    const [images, setImages] = useState<[ImageState, ImageState]>([
        { url: null, fileName: '' },
        { url: null, fileName: '' }
    ]);

    // Refs for hidden inputs
    const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

    const handleSlotClick = (index: number) => {
        if (!images[index].url) {
            // Only trigger upload if empty, otherwise we show delete overlay
            inputRefs[index].current?.click();
        }
    };

    const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const tempUrl = URL.createObjectURL(file);
            const newImages = [...images] as [ImageState, ImageState];
            newImages[index] = { url: tempUrl, fileName: file.name };
            setImages(newImages);
        }
        // Reset input
        if (e.target) e.target.value = '';
    };

    const handleRemoveImage = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newImages = [...images] as [ImageState, ImageState];
        newImages[index] = { url: null, fileName: '' };
        setImages(newImages);
    };

    return (
        <div className="webinar-designer-container">
            {/* Header / Nav Area (Mock) */}
            <div style={{ marginBottom: '1rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Webinar Canvas</h1>
                <p style={{ color: '#64748b' }}>Create high-converting slide layouts.</p>
            </div>

            {/* The "Interface" */}
            <div className="designer-interface">
                <div className="designer-header">
                    <div className="designer-title">
                        <Layout size={20} className="text-blue-500" />
                        Split Layout Validator
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                        <Download size={16} /> Export Slide
                    </button>
                </div>

                <div className="designer-workspace">
                    {/* The Slide Canvas */}
                    <div className="webinar-slide-canvas" style={{ width: 800, height: 800 }}>
                        {/* Slot 1 */}
                        <div
                            className={`photo-slot ${images[0].url ? 'has-image' : ''}`}
                            onClick={() => handleSlotClick(0)}
                        >
                            <input
                                type="file"
                                hidden
                                ref={inputRefs[0]}
                                accept="image/*"
                                onChange={(e) => handleFileChange(0, e)}
                            />

                            {images[0].url ? (
                                <>
                                    <img src={images[0].url} alt="Slot 1" className="slot-image-preview" />
                                    <div className="slot-delete-overlay">
                                        <button className="delete-btn" onClick={(e) => handleRemoveImage(0, e)}>
                                            <Trash2 size={16} style={{ marginRight: 4 }} /> Remove
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="p-4 bg-blue-50 rounded-full mb-3">
                                        <ImageIcon size={32} className="text-blue-500" />
                                    </div>
                                    <span className="slot-label">Click to Upload Photo 1</span>
                                    <span className="slot-sublabel">400 x 800 px</span>
                                </>
                            )}
                        </div>

                        {/* Slot 2 */}
                        <div
                            className={`photo-slot ${images[1].url ? 'has-image' : ''}`}
                            onClick={() => handleSlotClick(1)}
                        >
                            <input
                                type="file"
                                hidden
                                ref={inputRefs[1]}
                                accept="image/*"
                                onChange={(e) => handleFileChange(1, e)}
                            />

                            {images[1].url ? (
                                <>
                                    <img src={images[1].url} alt="Slot 2" className="slot-image-preview" />
                                    <div className="slot-delete-overlay">
                                        <button className="delete-btn" onClick={(e) => handleRemoveImage(1, e)}>
                                            <Trash2 size={16} style={{ marginRight: 4 }} /> Remove
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="p-4 bg-blue-50 rounded-full mb-3">
                                        <ImageIcon size={32} className="text-blue-500" />
                                    </div>
                                    <span className="slot-label">Click to Upload Photo 2</span>
                                    <span className="slot-sublabel">400 x 800 px</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WebinarDesignerApp;
