import React, { useState, useEffect, useRef } from 'react';
import './MetricDisplay.css';

interface MetricDisplayProps {
    label: string;
    value: number;
    subValue?: number;
    subLabel?: string;
    onChange: (newValue: number) => void;
    onSubChange?: (newValue: number) => void;
}

const MetricDisplay: React.FC<MetricDisplayProps> = ({ label, value, subValue, subLabel, onChange, onSubChange }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value.toString());
    const inputRef = useRef<HTMLInputElement>(null);

    // Sub-value editing state
    const [isSubEditing, setIsSubEditing] = useState(false);
    const [subInputValue, setSubInputValue] = useState(subValue?.toString() || '');
    const subInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    useEffect(() => {
        if (isSubEditing && subInputRef.current) {
            subInputRef.current.focus();
        }
    }, [isSubEditing]);

    useEffect(() => {
        setInputValue(value.toString());
    }, [value]);

    useEffect(() => {
        if (subValue !== undefined) {
            setSubInputValue(subValue.toString());
        }
    }, [subValue]);

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

    const handleSubClick = () => {
        if (onSubChange) setIsSubEditing(true);
    };

    const handleSubBlur = () => {
        setIsSubEditing(false);
        const num = parseFloat(subInputValue);
        if (!isNaN(num) && onSubChange) {
            onSubChange(num);
        } else if (subValue !== undefined) {
            setSubInputValue(subValue.toString());
        }
    };

    const handleSubKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubBlur();
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
                        <div className="sub-value">
                            {isSubEditing ? (
                                <input
                                    ref={subInputRef}
                                    type="number"
                                    className="metric-input"
                                    style={{ fontSize: '14px', width: '80px' }} // Inline style for quick sizing
                                    value={subInputValue}
                                    onChange={(e) => setSubInputValue(e.target.value)}
                                    onBlur={handleSubBlur}
                                    onKeyDown={handleSubKeyDown}
                                />
                            ) : (
                                <span onClick={handleSubClick} style={{ cursor: onSubChange ? 'pointer' : 'default' }} title={onSubChange ? "Click to edit" : ""}>
                                    {formatCurrency(subValue)}
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MetricDisplay;
