import { useState, useRef, useEffect } from 'react';
import './ProfitGrowth.css';

const fmt = (n: number) =>
    n >= 1_000_000
        ? `$${(n / 1_000_000).toFixed(2)}M`
        : `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const fmtPct = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`;

const randBetween = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

function generateGrowthData(finalValue: number, points: number): number[] {
    const data: number[] = [];
    for (let i = 0; i < points; i++) {
        const progress = i / (points - 1);
        // Smooth S-curve growth
        const base = finalValue * (Math.pow(progress, 1.4));
        const noise = base * 0.08 * (Math.random() - 0.5);
        data.push(Math.max(0, base + noise));
    }
    data[data.length - 1] = finalValue;
    return data;
}



function buildDefaultState() {
    const endYear = 2019;
    const startYear = 2018;
    const final = randBetween(150_000, 950_000);
    const points = 90; // ~3 months daily
    const data = generateGrowthData(final, points);
    const startPct = randBetween(800, 2500);
    return {
        data,
        final,
        startPct,
        startLabel: `Dec '${String(startYear).slice(2)}`,
        midLabel: `Jan '${String(endYear).slice(2)}`,
        endLabel: `Feb '${String(endYear).slice(2)}`,
    };
}

const ProfitGrowthApp = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [state, setState] = useState(buildDefaultState);
    const [hovered, setHovered] = useState<{ x: number; y: number; value: number; label: string } | null>(null);
    const [customFinal, setCustomFinal] = useState('');
    const [minVal, setMinVal] = useState('10000');
    const [maxVal, setMaxVal] = useState('950000');

    const randomize = () => {
        const min = parseInt(minVal.replace(/,/g, '')) || 10_000;
        const max = parseInt(maxVal.replace(/,/g, '')) || 950_000;
        const final = randBetween(min, max);
        const points = 90;
        const data = generateGrowthData(final, points);
        const startPct = randBetween(800, 2500);
        setState(s => ({ ...s, data, final, startPct }));
        setCustomFinal('');
    };

    const applyCustom = () => {
        const val = parseFloat(customFinal.replace(/[$,]/g, ''));
        if (!isNaN(val) && val > 0) {
            const data = generateGrowthData(val, 90);
            const startPct = randBetween(800, 2500);
            setState(s => ({ ...s, data, final: val, startPct }));
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const W = canvas.width;
        const H = canvas.height;
        const PAD_L = 80, PAD_R = 20, PAD_T = 20, PAD_B = 30;
        const chartW = W - PAD_L - PAD_R;
        const chartH = H - PAD_T - PAD_B;

        ctx.clearRect(0, 0, W, H);

        const { data } = state;
        const maxV = Math.max(...data) * 1.1;

        // Y axis labels
        const ySteps = 5;
        ctx.font = '11px Inter, sans-serif';
        ctx.fillStyle = '#8b92a5';
        ctx.textAlign = 'right';
        for (let i = 0; i <= ySteps; i++) {
            const val = (maxV / ySteps) * i;
            const y = PAD_T + chartH - (i / ySteps) * chartH;
            ctx.fillText(fmt(val), PAD_L - 8, y + 4);
            // grid line
            ctx.strokeStyle = '#e8eaf0';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(PAD_L, y);
            ctx.lineTo(PAD_L + chartW, y);
            ctx.stroke();
        }

        // Line path
        const points = data.map((v, i) => ({
            x: PAD_L + (i / (data.length - 1)) * chartW,
            y: PAD_T + chartH - (v / maxV) * chartH,
        }));

        // Fill gradient
        const grad = ctx.createLinearGradient(0, PAD_T, 0, PAD_T + chartH);
        grad.addColorStop(0, 'rgba(105, 131, 245, 0.25)');
        grad.addColorStop(1, 'rgba(105, 131, 245, 0.0)');
        ctx.beginPath();
        ctx.moveTo(points[0].x, PAD_T + chartH);
        points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.lineTo(points[points.length - 1].x, PAD_T + chartH);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        // Line
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const cpX = (prev.x + curr.x) / 2;
            ctx.bezierCurveTo(cpX, prev.y, cpX, curr.y, curr.x, curr.y);
        }
        ctx.strokeStyle = '#5169e8';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Hover dot
        if (hovered) {
            ctx.beginPath();
            ctx.arc(hovered.x, hovered.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();
            ctx.strokeStyle = '#5169e8';
            ctx.lineWidth = 2.5;
            ctx.stroke();
        }

    }, [state, hovered]);

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const PAD_L = 80, PAD_R = 20, PAD_T = 20, PAD_B = 30;
        const chartW = canvas.width - PAD_L - PAD_R;
        const chartH = canvas.height - PAD_T - PAD_B;
        const { data } = state;
        const maxV = Math.max(...data) * 1.1;

        const idx = Math.round(((mx - PAD_L) / chartW) * (data.length - 1));
        if (idx < 0 || idx >= data.length) { setHovered(null); return; }
        const val = data[idx];
        const x = PAD_L + (idx / (data.length - 1)) * chartW;
        const y = PAD_T + chartH - (val / maxV) * chartH;
        const pct = Math.floor((idx / (data.length - 1)) * 100);
        const labelIdx = Math.floor(pct / 50); // 0=start, 1=mid, 2=end-ish
        const labels = [state.startLabel, state.midLabel, state.endLabel];
        setHovered({ x, y, value: val, label: labels[Math.min(labelIdx, 2)] });
    };



    return (
        <div className="pg-wrapper">
            {/* Control bar */}
            <div className="pg-controls">
                <div className="pg-controls-left">
                    <button className="pg-pill">Compare Dates ▾</button>
                    <button className="pg-pill">Trendlines ▾</button>
                    <button className="pg-pill">Annotations</button>
                </div>
                <div className="pg-controls-right">
                    <span className="pg-graph-btn">📊 Graph</span>
                    <select className="pg-pill pg-select">
                        <option>Months</option>
                        <option>Days</option>
                        <option>Weeks</option>
                    </select>
                </div>
            </div>

            {/* Main card */}
            <div className="pg-card">
                {/* Header row */}
                <div className="pg-header">
                    <div>
                        <div className="pg-metric-label">OTHER REVENUE</div>
                        <div className="pg-big-value">{fmt(state.final)}</div>
                        <div className="pg-growth-badge">
                            ↑ {fmtPct(state.startPct)} in selected period
                        </div>
                    </div>
                </div>

                {/* Chart */}
                <div className="pg-chart-wrap" style={{ position: 'relative' }}>
                    <canvas
                        ref={canvasRef}
                        width={900}
                        height={300}
                        style={{ width: '100%', height: 300 }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={() => setHovered(null)}
                    />
                    {hovered && (
                        <div className="pg-tooltip" style={{
                            left: hovered.x,
                            top: hovered.y - 90,
                        }}>
                            <div className="pg-tooltip-label">{hovered.label}</div>
                            <div className="pg-tooltip-value">{fmt(hovered.value)}</div>
                            <div className="pg-tooltip-sub">↑ 100.0% from 30 days ago</div>
                            <div className="pg-tooltip-annotate">+ Annotate</div>
                        </div>
                    )}
                    {/* X axis labels */}
                    <div className="pg-x-labels">
                        <span>{state.startLabel}</span>
                        <span>{state.midLabel}</span>
                        <span>{state.endLabel}</span>
                    </div>
                </div>
            </div>

            {/* Randomizer panel */}
            <div className="pg-randomizer-panel">
                <div className="pg-rand-title">🎲 Profit Randomizer</div>
                <div className="pg-rand-row">
                    <label>Min $<input className="pg-rand-input" value={minVal} onChange={e => setMinVal(e.target.value)} /></label>
                    <label>Max $<input className="pg-rand-input" value={maxVal} onChange={e => setMaxVal(e.target.value)} /></label>
                    <button className="pg-rand-btn" onClick={randomize}>Randomize</button>
                </div>
                <div className="pg-rand-row" style={{ marginTop: 10 }}>
                    <label>Set exact value $<input className="pg-rand-input" style={{ width: 160 }} value={customFinal} onChange={e => setCustomFinal(e.target.value)} placeholder="e.g. 250000" /></label>
                    <button className="pg-rand-btn" onClick={applyCustom}>Apply</button>
                </div>
            </div>
        </div>
    );
};

export default ProfitGrowthApp;
