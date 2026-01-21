import { useState, useEffect } from 'react';
import BlueChart from './BlueChart';
import BlueControlPanel from './BlueControlPanel';
import './BlueAnalytics.css';

const BlueAnalyticsApp = () => {
    const [activeTab, setActiveTab] = useState("This month");
    const [totalSales, setTotalSales] = useState("5.36k");
    const [ordersCount, setOrdersCount] = useState("140 orders");

    // Additional Metrics State
    const [visitsCount, setVisitsCount] = useState("33");
    const [visitsLabel, setVisitsLabel] = useState("visitors");
    const [onlineCount, setOnlineCount] = useState("5.0");
    const [onlineRate, setOnlineRate] = useState("5.12%");

    // Initial data resembling the screenshot (hump shape)
    const [chartData, setChartData] = useState<number[]>([
        200, 100, 150, 180, 50, 60, 250, 420, 550,
        240, 400, 430, 450, 80, 320, 60, 120, 180,
        150, 130, 20, 60, 40, 100, 30, 180, 400
    ]);

    // Rescale data if user changes "Total Sales"
    useEffect(() => {
        const num = parseFloat(totalSales.replace(/[^0-9.]/g, '')) || 5;
        // Simple heuristic: Multiply base pattern by the new number relative to default
        const factor = num / 5.36;

        const basePattern = [
            200, 100, 150, 180, 50, 60, 250, 420, 550,
            240, 400, 430, 450, 80, 320, 60, 120, 180,
            150, 130, 20, 60, 40, 100, 30, 180, 400
        ];

        const newData = basePattern.map(val => val * factor);
        setChartData(newData);
    }, [totalSales]);

    return (
        <div className="blue-app-container">
            {/* Left Controls */}
            <BlueControlPanel
                totalSales={totalSales} setTotalSales={setTotalSales}
                ordersCount={ordersCount} setOrdersCount={setOrdersCount}
                visitsCount={visitsCount} setVisitsCount={setVisitsCount}
                visitsLabel={visitsLabel} setVisitsLabel={setVisitsLabel}
                onlineCount={onlineCount} setOnlineCount={setOnlineCount}
                onlineRate={onlineRate} setOnlineRate={setOnlineRate}
            />

            {/* Phone Screen */}
            <div className="blue-phone-frame">

                {/* Tabs */}
                <div className="blue-tabs">
                    <div className={`blue-tab ${activeTab === 'Today' ? 'active' : ''}`} onClick={() => setActiveTab('Today')}>Today</div>
                    <div className={`blue-tab ${activeTab === 'Yesterday' ? 'active' : ''}`} onClick={() => setActiveTab('Yesterday')}>Yesterday</div>
                    <div className={`blue-tab ${activeTab === 'This week' ? 'active' : ''}`} onClick={() => setActiveTab('This week')}>This week</div>
                    <div className={`blue-tab ${activeTab === 'This month' ? 'active' : ''}`} onClick={() => setActiveTab('This month')}>This month</div>
                </div>

                {/* Metrics */}
                <div className="blue-metrics-row">
                    <div className="blue-metric-col" style={{ opacity: 0.5 }}>
                        <div className="blue-metric-label">Visits</div>
                        <div className="blue-metric-val">{visitsCount}</div>
                        <div className="blue-metric-sub">{visitsLabel}</div>
                    </div>

                    <div className="blue-metric-col" style={{ flex: 1.5 }}>
                        <div className="blue-metric-label">Total sales</div>
                        <div className="blue-metric-val">${totalSales}</div>
                        <div className="blue-metric-sub">{ordersCount}</div>
                    </div>

                    <div className="blue-metric-col" style={{ opacity: 0.5 }}>
                        <div className="blue-metric-label">Online</div>
                        <div className="blue-metric-val">{onlineCount}</div>
                        <div className="blue-metric-sub">{onlineRate}</div>
                    </div>
                </div>

                {/* Dashboard Button */}
                <button className="blue-dash-btn">View dashboard</button>

                {/* Chart */}
                <BlueChart data={chartData} />

            </div>
        </div>
    );
};

export default BlueAnalyticsApp;
