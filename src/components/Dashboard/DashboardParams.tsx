import { useState, useEffect } from 'react';

import MetricDisplay from './MetricDisplay';
import InteractiveChart from './InteractiveChart';
import FailedPaymentsCard from './FailedPaymentsCard';
import NewCustomersCard from './NewCustomersCard';
import TopCustomersCard from './TopCustomersCard';
import EditableAmount from './EditableAmount';
import './OverviewCards.css';
import './DashboardParams.css';

const DashboardParams = () => {

    // Initial data matching the shape of the screenshot roughly
    const initialData = [500, 800, 450, 1218, 900, 1100, 1000];
    const [chartData, setChartData] = useState<number[]>(initialData);

    const [grossVolume, setGrossVolume] = useState(1218);
    // Editable state for other numbers
    const [yesterdayVolume, setYesterdayVolume] = useState(1204);
    const [usdBalance, setUsdBalance] = useState("2,714.64");
    const [payouts, setPayouts] = useState("2,732.64");
    const [payoutsExpected, setPayoutsExpected] = useState("Expected tomorrow");

    // Compute a real default: 6 weeks ago → today
    const todayDate = new Date();
    const sixWeeksAgo = new Date(todayDate);
    sixWeeksAgo.setDate(todayDate.getDate() - 42);
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const defaultRange = `${fmt(sixWeeksAgo)} - ${fmt(todayDate)}`;

    // Date Range State
    const [dateRangeInput, setDateRangeInput] = useState(defaultRange);
    // Default matching the screenshot request
    const [chartLabels, setChartLabels] = useState<string[]>(() => {
        const step = 42 / 3;
        return [0, 1, 2, 3].map(i => fmt(new Date(sixWeeksAgo.getTime() + i * step * 86400000)));
    });

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

        if (index === chartData.length - 1) {
            setGrossVolume(val);
        }
    };


    return (
        <div className="dashboard-params">
            <header className="dashboard-header">
                <h1>Today</h1>
                <div className="header-actions">
                    <button
                        className="btn-ai-reviews"
                        onClick={() => {
                            const min = 10000;
                            const max = 250000;
                            const randomProfit = Math.floor(Math.random() * (max - min + 1)) + min;
                            const today = randomProfit;
                            const yesterday = Math.floor(randomProfit * (0.85 + Math.random() * 0.3));
                            handleMetricChange(today);
                            setYesterdayVolume(yesterday);
                            setUsdBalance((randomProfit * 2.23).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
                            setPayouts((randomProfit * 2.25).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
                            const newData = Array.from({ length: 7 }, (_, i) =>
                                i === 6 ? today : Math.floor(randomProfit * (0.6 + Math.random() * 0.8))
                            );
                            setChartData(newData);
                        }}
                        style={{
                            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: 8,
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            marginRight: 8
                        }}
                    >
                        🎲 Profit Randomizer
                    </button>
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
                    onSubChange={setYesterdayVolume}
                />

                <InteractiveChart
                    data={chartData}
                    labels={chartLabels}
                    onDataChange={handleChartChange}
                />


            </section>

            <div className="balance-row">
                <div className="balance-item">
                    <div className="balance-header">
                        <span className="balance-label">USD balance</span>
                        <a href="#" className="balance-link">View</a>
                    </div>
                    <EditableAmount
                        value={usdBalance}
                        onChange={setUsdBalance}
                        className="balance-amount"
                        prefix="$"
                    />
                </div>
                <div className="balance-item">
                    <div className="balance-header">
                        <span className="balance-label">Payouts</span>
                        <a href="#" className="balance-link">View</a>
                    </div>
                    <EditableAmount
                        value={payouts}
                        onChange={setPayouts}
                        className="balance-amount"
                        prefix="$"
                    />
                    <EditableAmount
                        value={payoutsExpected}
                        onChange={setPayoutsExpected}
                        className="balance-sub"
                    />
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
