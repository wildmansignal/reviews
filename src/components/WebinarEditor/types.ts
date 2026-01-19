import React from 'react';

export interface SlideElement {
    id: string;
    type: 'text' | 'image' | 'shape';
    content?: string;
    x: number;
    y: number;
    width: number;
    height: number;
    style?: React.CSSProperties;
}

export interface Slide {
    id: string;
    elements: SlideElement[];
    background?: string;
}
