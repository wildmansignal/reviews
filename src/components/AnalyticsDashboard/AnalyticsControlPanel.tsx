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
    const handleRandomize = () => {
        const profit = Math.floor(Math.random() * 990000) + 10000;
        const orders = Math.floor(Math.random() * 4500) + 50;
        setTotalProfit(profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        setOrdersCount(orders.toString());
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
        const mIdx = Math.floor(Math.random() * 10);
        setDateRange(`${months[mIdx]} 1 – ${months[mIdx + 1]} 1, 2025`);
    };
    return (
        <div className="ana-controls">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ margin: 0 }}>Dashboard Controls</h3>
                <button
                    onClick={handleRandomize}
                    style={{ background: 'linear-gradient(135deg,#635bff,#4f46e5)', color: 'white', border: 'none', padding: '7px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                >
                    🎲 Randomize
                </button>
            </div>

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
