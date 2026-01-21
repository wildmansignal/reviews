import React from 'react';
import './BlueAnalytics.css';

interface BlueChartProps {
    data: number[];
}

const BlueChart: React.FC<BlueChartProps> = ({ data }) => {
    const maxVal = Math.max(...data, 100);

    // Screenshot has: 0, 200, 400, 600.
    // Let's make it dynamic anyway for the "customizable" requirement, 
    // but scale visually to fit the screenshot style container.

    // Normalized Scale
    const scale = (val: number) => (val / maxVal) * 90; // Max bar 90% height

    return (
        <div className="blue-chart-container">
            {/* Grid Background */}
            <div className="blue-grid">
                <div className="blue-grid-line"><span className="blue-y-label">600</span></div>
                <div className="blue-grid-line"><span className="blue-y-label">400</span></div>
                <div className="blue-grid-line"><span className="blue-y-label">200</span></div>
                <div className="blue-grid-line" style={{ borderTop: '1px solid #555' }}>
                    <span className="blue-y-label">0</span>
                </div>
            </div>

            {/* Bars */}
            <div className="blue-bars-wrapper">
                {data.map((val, i) => (
                    <div
                        key={i}
                        className="blue-bar"
                        style={{ height: `${scale(val)}%` }}
                        title={`${val}`}
                    ></div>
                ))}
            </div>

            {/* X Axis */}
            <div className="blue-x-axis">
                <span>5</span>
                <span>10</span>
                <span>15</span>
                <span>20</span>
                <span>25</span>
                <span>30</span>
            </div>
        </div>
    );
};

export default BlueChart;
