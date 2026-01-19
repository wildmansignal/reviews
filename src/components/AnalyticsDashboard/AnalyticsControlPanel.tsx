import React from 'react';
import './AnalyticsDashboard.css';

interface AnalyticsControlPanelProps {
    totalProfit: string;
    setTotalProfit: (val: string) => void;
    dateRange: string;
    setDateRange: (val: string) => void;
    ordersCount: string;
    setOrdersCount: (val: string) => void;
}

const AnalyticsControlPanel: React.FC<AnalyticsControlPanelProps> = ({
    totalProfit, setTotalProfit,
    dateRange, setDateRange,
    ordersCount, setOrdersCount
}) => {
    return (
        <div className="ana-controls">
            <h3 style={{ marginTop: 0 }}>Dashboard Controls</h3>

            <div>
                <label className="ana-label" style={{ display: 'block' }}>Total Profit Metric</label>
                <input
                    className="ana-control-input"
                    value={totalProfit}
                    onChange={(e) => setTotalProfit(e.target.value)}
                />
                <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>
                    * Graph auto-scales to this max value
                </div>
            </div>

            <div>
                <label className="ana-label" style={{ display: 'block' }}>Date Range</label>
                <input
                    className="ana-control-input"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                />
            </div>

            <div>
                <label className="ana-label" style={{ display: 'block' }}>Orders Count</label>
                <input
                    className="ana-control-input"
                    value={ordersCount}
                    onChange={(e) => setOrdersCount(e.target.value)}
                />
            </div>

            <div style={{ marginTop: 20, padding: 10, background: '#f9f9f9', borderRadius: 4, fontSize: 12, color: '#666' }}>
                <strong>Note:</strong> The graph is algorithmically generated to always "trend up" regardless of the Total Profit number input.
            </div>
        </div>
    );
};

export default AnalyticsControlPanel;
