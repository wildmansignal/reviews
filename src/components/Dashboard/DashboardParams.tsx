import React, { useState, useEffect } from 'react';
import MetricDisplay from './MetricDisplay';
import InteractiveChart from './InteractiveChart';
import FailedPaymentsCard from './FailedPaymentsCard';
import NewCustomersCard from './NewCustomersCard';
import TopCustomersCard from './TopCustomersCard';
import './OverviewCards.css';
import './DashboardParams.css';

const DashboardParams = () => {
    // Initial data matching the shape of the screenshot roughly
    const initialData = [500, 800, 450, 1218, 900, 1100, 1000];
    const [chartData, setChartData] = useState<number[]>(initialData);

    const [grossVolume, setGrossVolume] = useState(1218);
    const yesterdayVolume = 1204;

    // Date Range State
    const [dateRangeInput, setDateRangeInput] = useState("Sep 21 - Oct 31");
    // Default matching the screenshot request
    const [chartLabels, setChartLabels] = useState<string[]>(['Sep 21', 'Oct 4', 'Oct 18', 'Oct 31']);

    const generateLabels = (input: string) => {
        const parts = input.split('-').map(s => s.trim());
        if (parts.length !== 2) return;

        const currentYear = new Date().getFullYear();
        const d1 = new Date(`${parts[0]} ${currentYear}`);
        const d2 = new Date(`${parts[1]} ${currentYear}`);

        if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
            const totalTime = d2.getTime() - d1.getTime();
            const step = totalTime / 3;

            const l1 = d1;
            const l2 = new Date(d1.getTime() + step);
            const l3 = new Date(d1.getTime() + step * 2);
            const l4 = d2;

            const format = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            setChartLabels([format(l1), format(l2), format(l3), format(l4)]);
        }
    };

    // Generate labels when input changes
    useEffect(() => {
        generateLabels(dateRangeInput);
    }, [dateRangeInput]);

    const handleMetricChange = (val: number) => {
        setGrossVolume(val);
        const newData = [...chartData];
        newData[newData.length - 1] = val; // Update 'today' point
        setChartData(newData);
    };

    const handleChartChange = (index: number, val: number) => {
        const newData = [...chartData];
        newData[index] = val;
        setChartData(newData);

        // If the manipulated point is the last one, update the main MetricDisplay
        if (index === chartData.length - 1) {
            setGrossVolume(val);
        }
    };

    return (
        <div className="dashboard-params">
            <header className="dashboard-header">
                <h1>Today</h1>
                <div className="header-actions">
                    <button className="btn-secondary">Pay out funds</button>
                </div>
            </header>

            <section className="chart-section">
                <MetricDisplay
                    label="Gross volume"
                    value={grossVolume}
                    subValue={yesterdayVolume}
                    subLabel="Yesterday"
                    onChange={handleMetricChange}
                />

                <InteractiveChart
                    data={chartData}
                    labels={chartLabels}
                    onDataChange={handleChartChange}
                />

                {/* Editable X-Axis Labels */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: -10, paddingLeft: 20, paddingRight: 20 }}>
                    {chartLabels.map((label, i) => (
                        <button
                            key={i}
                            onClick={() => updateLabel(i)}
                            className="btn-text-edit" // Define this style or assume existing reset
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#9ca3af',
                                fontSize: 12,
                                cursor: 'pointer',
                                fontFamily: 'sans-serif'
                            }}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </section>

            <div className="balance-row">
                <div className="balance-item">
                    <div className="balance-header">
                        <span className="balance-label">USD balance</span>
                        <a href="#" className="balance-link">View</a>
                    </div>
                    <div className="balance-amount">$2,714.64</div>
                </div>
                <div className="balance-item">
                    <div className="balance-header">
                        <span className="balance-label">Payouts</span>
                        <a href="#" className="balance-link">View</a>
                    </div>
                    <div className="balance-amount">$2,732.64</div>
                    <div className="balance-sub">Expected tomorrow</div>
                </div>
            </div>

            <section className="overview-section">
                <h2>Your overview</h2>
                <div className="overview-controls">
                    <div className="pill-group">
                        <div className="pill-btn" style={{ padding: '0 8px', display: 'flex', alignItems: 'center' }}>
                            Date range
                            <input
                                value={dateRangeInput}
                                onChange={(e) => setDateRangeInput(e.target.value)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'inherit',
                                    fontWeight: 'bold',
                                    marginLeft: 6,
                                    width: 120,
                                    fontSize: 13
                                }}
                            />
                            ▼
                        </div>
                        <button className="pill-btn">Daily ▼</button>
                    </div>
                    <div style={{ marginTop: 4, width: '100%' }}>
                        <button
                            style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: 12, cursor: 'pointer', padding: 0 }}
                            onClick={() => {
                                const newRange = prompt("Enter text for footer dates (e.g. Sep 21 - Oct 31)", dateRangeInput);
                                if (newRange) setDateRangeInput(newRange);
                            }}
                        >
                            Change Axis Dates
                        </button>
                    </div>
                    <div className="pill-group">
                        <button className="pill-btn">Compare <strong>Previous period</strong> ▼</button>
                    </div>
                    <div className="overview-actions">
                        <button className="btn-icon-text">+ Add</button>
                        <button className="btn-icon-text">Edit</button>
                    </div>
                </div>

                <div className="overview-grid">
                    <FailedPaymentsCard />
                    <NewCustomersCard />
                    <TopCustomersCard />
                </div>
            </section>
        </div>
    );
};

export default DashboardParams;
