import React, { useState, useEffect } from 'react';
import AnalyticsChart from './AnalyticsChart';
import AnalyticsControlPanel from './AnalyticsControlPanel';
import './AnalyticsDashboard.css';

const AnalyticsApp = () => {
    // State
    const [totalProfit, setTotalProfit] = useState("137,987.69");
    const [dateRange, setDateRange] = useState("Sep 21–Oct 31");
    const [ordersCount, setOrdersCount] = useState("2,039 orders");
    const [chartData, setChartData] = useState<number[]>([]);

    // Logic: Generate Trending Up Data
    useEffect(() => {
        // 1. Parse max value from input string
        const cleanVal = totalProfit.replace(/[^0-9.]/g, '');
        const maxTotal = parseFloat(cleanVal) || 10000;

        // 2. Generate 30 bars
        const barsCount = 30;
        const generatedData = [];

        // We want the SUM of bars to roughly equate to Total? 
        // Or usually "Total Sales" is the sum over period. 
        // Screenshot graph shows bars around $2k - $10k. 
        // Sum of ~ avg $5k * 30 days = $150k. Which matches $137k.
        // So we should aim for the SUM to match the input.

        // Base Average per day
        const avgPerDay = maxTotal / barsCount;

        for (let i = 0; i < barsCount; i++) {
            // Trend Factor: 0.2 (start) -> 1.8 (end)
            // This creates the "Trend Up" slope
            const progress = i / barsCount;
            const trendFactor = 0.2 + (progress * 1.6); // 0.2 to 1.8

            // Random Noise: +/- 30%
            const noise = 0.7 + Math.random() * 0.6;

            const value = avgPerDay * trendFactor * noise;
            generatedData.push(value);
        }

        setChartData(generatedData);

    }, [totalProfit]);

    return (
        <div className="ana-app-container">
            {/* Left Controls */}
            <AnalyticsControlPanel
                totalProfit={totalProfit} setTotalProfit={setTotalProfit}
                dateRange={dateRange} setDateRange={setDateRange}
                ordersCount={ordersCount} setOrdersCount={setOrdersCount}
            />

            {/* Right Phone/Card Display */}
            <div className="ana-phone-frame">
                <div className="ana-content">

                    {/* Header Info */}
                    <div className="ana-header">
                        <div className="ana-value-row">
                            <div>
                                <div className="ana-label">TOTAL PROFIT</div>
                                <div className="ana-big-value">${totalProfit}</div>
                            </div>
                            <div className="ana-meta-col">
                                <div className="ana-date-range">{dateRange}</div>
                                <div className="ana-orders">{ordersCount}</div>
                            </div>
                        </div>
                    </div>

                    {/* The Chart */}
                    <AnalyticsChart data={chartData} />

                </div>
            </div>
        </div>
    );
};

export default AnalyticsApp;
