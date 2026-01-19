import React from 'react';
import './AnalyticsDashboard.css';

interface AnalyticsChartProps {
    data: number[];
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data }) => {
    // 1. Find Max for scaling
    const maxVal = Math.max(...data, 1000);

    // 2. Generate Y-axis ticks (0, 1/3, 2/3, Max)
    // Actually typically 0, 2k, 6k, 10k... let's simplify to 3 steps
    const ticks = [0, maxVal * 0.33, maxVal * 0.66, maxVal];

    // Format helper: $10k
    const formatTick = (val: number) => {
        if (val === 0) return ''; // Sometimes 0 is hidden or just line
        if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
        return `$${val.toFixed(0)}`;
    };

    return (
        <div className="ana-chart-wrapper">
            {/* Y Axis Labels */}
            <div className="ana-y-axis">
                <div style={{ position: 'absolute', top: '0%' }}>{formatTick(ticks[3])}</div>
                <div style={{ position: 'absolute', top: '33%' }}>{formatTick(ticks[2])}</div>
                <div style={{ position: 'absolute', top: '66%' }}>{formatTick(ticks[1])}</div>
                <div style={{ position: 'absolute', top: '100%' }}></div> {/* $0 usually implied or hidden */}
            </div>

            <div className="ana-chart-content">
                {/* Grid Lines */}
                <div className="ana-grid-line" style={{ top: '0%' }}></div>
                <div className="ana-grid-line" style={{ top: '33%' }}></div>
                <div className="ana-grid-line" style={{ top: '66%' }}></div>

                {/* Bars */}
                <div className="ana-bars-container">
                    {data.map((val, i) => {
                        const height = (val / maxVal) * 100;
                        return (
                            <div
                                key={i}
                                className="ana-bar"
                                style={{ height: `${height}%` }}
                                title={`$${val.toFixed(2)}`}
                            ></div>
                        );
                    })}
                </div>

                {/* X Axis Labels */}
                <div className="ana-x-labels">
                    <span>Sep 21</span>
                    <span>Oct 4</span>
                    <span>Oct 18</span>
                    <span>Oct 31</span>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsChart;
