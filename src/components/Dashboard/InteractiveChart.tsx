import React, { useRef, useState, useEffect } from 'react';
import './InteractiveChart.css';

interface InteractiveChartProps {
    data: number[];
    labels: string[];
    onDataChange: (index: number, newValue: number) => void;
}

const InteractiveChart: React.FC<InteractiveChartProps> = ({ data, labels, onDataChange }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

    // Chart dimensions
    const width = 800;
    const height = 300;
    const padding = 20;

    // Calculate scales
    const maxVal = Math.max(...data, 100) * 1.2; // Add some headroom
    const minVal = 0;

    const getX = (index: number) => {
        return padding + (index / (data.length - 1)) * (width - 2 * padding);
    };

    const getY = (value: number) => {
        const range = maxVal - minVal;
        if (range === 0) return height - padding;
        const normalized = (value - minVal) / range;
        return height - padding - normalized * (height - 2 * padding);
    };

    const getValueFromY = (y: number) => {
        const range = maxVal - minVal;
        const plotHeight = height - 2 * padding;
        const normalized = (height - padding - y) / plotHeight;
        let val = normalized * range + minVal;
        return Math.max(0, Math.round(val)); // Snap to integer, non-negative
    };

    // Generate path
    const points = data.map((val, i) => `${getX(i)},${getY(val)}`).join(' ');
    // Create area path for gradient
    const areaPath = `${points} ${getX(data.length - 1)},${height} ${getX(0)},${height} Z`;

    const handleMouseDown = (index: number) => {
        setDraggingIndex(index);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (draggingIndex !== null && svgRef.current) {
            const rect = svgRef.current.getBoundingClientRect();
            const y = e.clientY - rect.top;
            const newValue = getValueFromY(y);
            onDataChange(draggingIndex, newValue);
        }
    };

    const handleMouseUp = () => {
        setDraggingIndex(null);
    };

    useEffect(() => {
        if (draggingIndex !== null) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [draggingIndex]);

    return (
        <div className="chart-container">
            <svg
                ref={svgRef}
                viewBox={`0 0 ${width} ${height}`}
                preserveAspectRatio="none"
                className="chart-svg"
            >
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#635bff" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#635bff" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
                    const lineY = height - padding - pct * (height - 2 * padding);
                    return (
                        <line
                            key={i}
                            x1={padding}
                            y1={lineY}
                            x2={width - padding}
                            y2={lineY}
                            stroke="#e3e8ee"
                            strokeDasharray="4 4"
                        />
                    );
                })}

                {/* Area fill */}
                <path d={`M ${points.split(' ')[0]} L ${areaPath}`} fill="url(#chartGradient)" stroke="none" />

                {/* Line */}
                <polyline
                    points={points}
                    fill="none"
                    stroke="#635bff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="chart-line"
                />

                {/* Interactive Points */}
                {data.map((val, i) => (
                    <circle
                        key={i}
                        cx={getX(i)}
                        cy={getY(val)}
                        r={draggingIndex === i ? 8 : 5}
                        fill="#ffffff"
                        stroke="#635bff"
                        strokeWidth="3"
                        className="chart-point"
                        style={{ cursor: 'ns-resize' }}
                        onMouseDown={() => handleMouseDown(i)}
                    />
                ))}

                {/* Labels */}
                {labels.map((label, i) => {
                    // Distribute labels evenly
                    if (!label) return null;
                    const xPos = padding + (i / (labels.length - 1)) * (width - 2 * padding);
                    // Adjust text anchor
                    let anchor = 'middle';
                    if (i === 0) anchor = 'start';
                    if (i === labels.length - 1) anchor = 'end';

                    return (
                        <text
                            key={i}
                            x={xPos}
                            y={height - 5}
                            className="chart-label"
                            textAnchor={anchor}
                        >
                            {label}
                        </text>
                    );
                })}
            </svg>
        </div>
    );
};

export default InteractiveChart;
