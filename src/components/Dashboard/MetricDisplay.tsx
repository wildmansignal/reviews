import React, { useState, useEffect, useRef } from 'react';
import './MetricDisplay.css';

interface MetricDisplayProps {
    label: string;
    value: number;
    subValue?: number;
    subLabel?: string;
    onChange: (newValue: number) => void;
}

const MetricDisplay: React.FC<MetricDisplayProps> = ({ label, value, subValue, subLabel, onChange }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value.toString());
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    useEffect(() => {
        setInputValue(value.toString());
    }, [value]);

    const handleClick = () => {
        setIsEditing(true);
    };

    const handleBlur = () => {
        setIsEditing(false);
        const num = parseFloat(inputValue);
        if (!isNaN(num)) {
            onChange(num);
        } else {
            setInputValue(value.toString());
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleBlur();
        }
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    };

    return (
        <div className="metric-container">
            <div className="metric-columns">
                <div className="metric-column main-column">
                    <div className="metric-header">
                        <span className="metric-label">{label}</span>
                        <span className="dropdown-arrow">▼</span>
                    </div>
                    <div className="metric-main-value">
                        {isEditing ? (
                            <input
                                ref={inputRef}
                                type="number"
                                className="metric-input"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onBlur={handleBlur}
                                onKeyDown={handleKeyDown}
                            />
                        ) : (
                            <h1 className="metric-value" onClick={handleClick} title="Click to edit">
                                {formatCurrency(value)}
                            </h1>
                        )}
                    </div>
                    <div className="metric-time">7:47 PM</div>
                </div>

                {subValue !== undefined && (
                    <div className="metric-column sub-column">
                        <div className="metric-header text-muted">
                            <span className="metric-label">{subLabel}</span>
                        </div>
                        <div className="sub-value">{formatCurrency(subValue)}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MetricDisplay;
