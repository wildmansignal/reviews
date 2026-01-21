import { useState } from 'react';
import './OverviewCards.css';
import EditableField from '../EditableField';

const NewCustomersCard = () => {
    const [count, setCount] = useState<string | number>(1);
    const [percentage, setPercentage] = useState<string | number>(-80);

    return (
        <div className="overview-card">
            <div className="card-header">
                <span className="card-title">New customers</span>
                <span className="info-icon">ⓘ</span>
            </div>

            <div className="card-content">
                <div className="metric-row-small">
                    <EditableField
                        value={count}
                        onChange={(val) => setCount(val)}
                        className="metric-value-small"
                    />
                    <EditableField
                        value={Math.abs(Number(percentage))}
                        onChange={(val) => setPercentage(Number(val) * (Number(percentage) < 0 ? -1 : 1))}
                        prefix={Number(percentage) < 0 ? '-' : '+'}
                        suffix="%"
                        className={`metric-change ${Number(percentage) < 0 ? 'negative' : 'positive'}`}
                    />
                </div>
                <div className="metric-period">5 previous period</div>

                {/* Simple Sparkline SVG for visual effect */}
                <div className="sparkline-container">
                    <svg viewBox="0 0 100 40" className="sparkline-svg" preserveAspectRatio="none">
                        <path d="M0 38 L20 38 L40 38 L60 5 L80 38 L100 38" fill="none" stroke="#635bff" strokeWidth="1.5" />
                        <path d="M0 20 L100 20" stroke="#e3e8ee" strokeDasharray="3 3" strokeWidth="1" />
                    </svg>
                    <div className="sparkline-axis">
                        <span>2</span>
                        <span>1.5</span>
                        <span>1</span>
                        <span>0.5</span>
                        <span>0</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewCustomersCard;
