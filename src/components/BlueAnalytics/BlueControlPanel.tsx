import React from 'react';
import './BlueAnalytics.css';

interface BlueControlPanelProps {
    totalSales: string;
    setTotalSales: (val: string) => void;
    ordersCount: string;
    setOrdersCount: (val: string) => void;
    // New Props
    visitsCount: string;
    setVisitsCount: (val: string) => void;
    visitsLabel: string;
    setVisitsLabel: (val: string) => void;
    onlineCount: string;
    setOnlineCount: (val: string) => void;
    onlineRate: string;
    setOnlineRate: (val: string) => void;
}

const BlueControlPanel: React.FC<BlueControlPanelProps> = ({
    totalSales, setTotalSales,
    ordersCount, setOrdersCount,
    visitsCount, setVisitsCount,
    visitsLabel, setVisitsLabel,
    onlineCount, setOnlineCount,
    onlineRate, setOnlineRate
}) => {
    return (
        <div className="blue-controls">
            <h3 style={{ marginTop: 0, color: 'white' }}>Settings</h3>

            <div style={{ paddingBottom: 15, borderBottom: '1px solid #303575' }}>
                <label className="blue-metric-label" style={{ display: 'block', color: '#536dfe' }}>Main Metric</label>
                <div style={{ marginBottom: 10 }}>
                    <label className="blue-metric-label">Total Sales</label>
                    <input
                        className="blue-control-input"
                        value={totalSales}
                        onChange={(e) => setTotalSales(e.target.value)}
                    />
                </div>
                <div>
                    <label className="blue-metric-label">Orders Subtext</label>
                    <input
                        className="blue-control-input"
                        value={ordersCount}
                        onChange={(e) => setOrdersCount(e.target.value)}
                    />
                </div>
            </div>

            <div style={{ paddingTop: 15, paddingBottom: 15, borderBottom: '1px solid #303575' }}>
                <label className="blue-metric-label" style={{ display: 'block', color: '#536dfe' }}>Left Metric (Visits)</label>
                <div style={{ marginBottom: 10 }}>
                    <label className="blue-metric-label">Count</label>
                    <input
                        className="blue-control-input"
                        value={visitsCount}
                        onChange={(e) => setVisitsCount(e.target.value)}
                    />
                </div>
                <div>
                    <label className="blue-metric-label">Label</label>
                    <input
                        className="blue-control-input"
                        value={visitsLabel}
                        onChange={(e) => setVisitsLabel(e.target.value)}
                    />
                </div>
            </div>

            <div style={{ paddingTop: 15 }}>
                <label className="blue-metric-label" style={{ display: 'block', color: '#536dfe' }}>Right Metric (Online)</label>
                <div style={{ marginBottom: 10 }}>
                    <label className="blue-metric-label">Count</label>
                    <input
                        className="blue-control-input"
                        value={onlineCount}
                        onChange={(e) => setOnlineCount(e.target.value)}
                    />
                </div>
                <div>
                    <label className="blue-metric-label">Rate / Subtext</label>
                    <input
                        className="blue-control-input"
                        value={onlineRate}
                        onChange={(e) => setOnlineRate(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default BlueControlPanel;
