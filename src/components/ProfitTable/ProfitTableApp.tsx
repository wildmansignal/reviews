import { useState } from 'react';
import './ProfitTable.css';

const randBetween = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const fmtDollar = (n: number) =>
    n >= 1_000_000
        ? `$${(n / 1_000_000).toFixed(2)}M`
        : n >= 1_000
            ? `$${(n / 1_000).toFixed(1)}K`
            : `$${n.toLocaleString()}`;

const fmtPct = (n: number) => `+${n.toFixed(1)}%`;

function generateSparkline(trend: 'up' | 'noisy' | 'down', points = 24): number[] {
    const data: number[] = [];
    for (let i = 0; i < points; i++) {
        const progress = i / (points - 1);
        let base = trend === 'up' ? progress : trend === 'down' ? (1 - progress) : 0.5;
        base += (Math.random() - 0.5) * 0.4;
        data.push(Math.max(0.05, Math.min(1, base)));
    }
    return data;
}

interface MetricRow {
    label: string;
    value: string;
    pct: string;
    compare: string;
    trend: 'up' | 'noisy' | 'down';
    spark: number[];
}

function buildRows(base: number): MetricRow[] {
    const customers = randBetween(800, 3000);
    const payments = randBetween(2000, 8000);
    const arpc = base / customers;
    const highRisk = randBetween(100, 500);
    return [
        {
            label: 'Gross volume',
            value: fmtDollar(base),
            pct: fmtPct(randBetween(50, 250)),
            compare: fmtDollar(Math.floor(base * 0.35)),
            trend: 'up',
            spark: generateSparkline('up'),
        },
        {
            label: 'New customers',
            value: customers.toLocaleString(),
            pct: fmtPct(randBetween(100, 200)),
            compare: randBetween(400, 900).toLocaleString(),
            trend: 'up',
            spark: generateSparkline('noisy'),
        },
        {
            label: 'Successful payments',
            value: payments.toLocaleString(),
            pct: fmtPct(randBetween(1, 15)),
            compare: Math.floor(payments * 0.97).toLocaleString(),
            trend: 'noisy',
            spark: generateSparkline('noisy'),
        },
        {
            label: 'Average revenue per customer',
            value: `$${arpc.toFixed(2)}`,
            pct: fmtPct(randBetween(80, 180)),
            compare: `$${(arpc * 0.42).toFixed(2)}`,
            trend: 'up',
            spark: generateSparkline('up'),
        },
        {
            label: 'Payments evaluated as high risk by Stripe',
            value: highRisk.toLocaleString(),
            pct: '+100.0%',
            compare: `0  $0.00`,
            trend: 'down',
            spark: generateSparkline('noisy'),
        },
    ];
}

const Sparkline = ({ data, trend }: { data: number[]; trend: 'up' | 'noisy' | 'down' }) => {
    const W = 120, H = 36;
    const pts = data.map((v, i) => ({
        x: (i / (data.length - 1)) * W,
        y: H - v * H,
    }));
    const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const fillD = `${pathD} L${W},${H} L0,${H} Z`;

    const darkColor = trend === 'down' ? '#3f3f8a' : '#3f6aad';
    const lightColor = trend === 'down' ? '#c8caee' : '#c7ddf5';

    return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
            <defs>
                <linearGradient id={`sg-${trend}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={darkColor} stopOpacity="0.15" />
                    <stop offset="100%" stopColor={darkColor} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={fillD} fill={`url(#sg-${trend})`} />
            <path d={pathD} stroke={darkColor} strokeWidth="1.5" fill="none" />
            {/* Compare line (lighter) */}
            <path
                d={pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${(p.y + 8).toFixed(1)}`).join(' ')}
                stroke={lightColor}
                strokeWidth="1.2"
                fill="none"
                strokeDasharray="2,2"
            />
        </svg>
    );
};

const ProfitTableApp = () => {
    const [minVal, setMinVal] = useState('10000');
    const [maxVal, setMaxVal] = useState('1500000');
    const [customVal, setCustomVal] = useState('');
    const [period, setPeriod] = useState('Mar 1, 2019 → Mar 31, 2019');
    const [comparePeriod, setComparePeriod] = useState('Aug 25, 2019 → Sep 28, 2019');
    const [rows, setRows] = useState<MetricRow[]>(() => buildRows(randBetween(300_000, 1_200_000)));

    const randomize = () => {
        const min = parseInt(minVal.replace(/,/g, '')) || 10_000;
        const max = parseInt(maxVal.replace(/,/g, '')) || 1_500_000;
        setRows(buildRows(randBetween(min, max)));
    };

    const applyCustom = () => {
        const val = parseFloat(customVal.replace(/[$,]/g, ''));
        if (!isNaN(val) && val > 0) setRows(buildRows(val));
    };

    return (
        <div className="pt-wrapper">
            {/* Header */}
            <div className="pt-title">Analytics</div>

            {/* Toolbar */}
            <div className="pt-toolbar">
                <div className="pt-toolbar-left">
                    <div className="pt-period-group">
                        <button className="pt-pill pt-period-active" onClick={() => {
                            const v = prompt('Enter period label', period);
                            if (v) setPeriod(v);
                        }}>{period}</button>
                        <span className="pt-vs">vs.</span>
                        <button className="pt-pill" onClick={() => {
                            const v = prompt('Enter compare period', comparePeriod);
                            if (v) setComparePeriod(v);
                        }}>{comparePeriod}</button>
                    </div>
                    <div className="pt-freq-group">
                        <button className="pt-freq-btn active">Daily</button>
                        <button className="pt-freq-btn">Weekly</button>
                    </div>
                </div>
                <div className="pt-toolbar-right">
                    <button className="pt-customize-btn">⚙ Customize</button>
                </div>
            </div>

            {/* Table */}
            <div className="pt-table">
                {rows.map((row, i) => (
                    <div key={i} className="pt-row">
                        <div className="pt-row-label">{row.label}</div>
                        <div className="pt-row-value">{row.value}</div>
                        <div className="pt-row-pct">{row.pct}</div>
                        <div className="pt-row-compare">{row.compare}</div>
                        <div className="pt-row-spark">
                            <Sparkline data={row.spark} trend={row.trend} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Randomizer */}
            <div className="pt-rand-panel">
                <div className="pt-rand-title">🎲 Profit Randomizer</div>
                <div className="pt-rand-row">
                    <label>Min $<input className="pt-rand-input" value={minVal} onChange={e => setMinVal(e.target.value)} /></label>
                    <label>Max $<input className="pt-rand-input" value={maxVal} onChange={e => setMaxVal(e.target.value)} /></label>
                    <button className="pt-rand-btn" onClick={randomize}>Randomize All</button>
                </div>
                <div className="pt-rand-row" style={{ marginTop: 10 }}>
                    <label>Set exact gross volume $<input className="pt-rand-input" style={{ width: 160 }} value={customVal} onChange={e => setCustomVal(e.target.value)} placeholder="e.g. 1040000" /></label>
                    <button className="pt-rand-btn" onClick={applyCustom}>Apply</button>
                </div>
            </div>
        </div>
    );
};

export default ProfitTableApp;
