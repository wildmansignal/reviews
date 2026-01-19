import React from 'react';
import './Habituation.css';

interface DayStatus {
    day: number;
    status: 'empty' | 'green' | 'yellow' | 'orange' | 'red';
}

interface HabituationCalendarProps {
    days: DayStatus[];
    onDayClick: (index: number) => void;
}

const HabituationCalendar: React.FC<HabituationCalendarProps> = ({ days, onDayClick }) => {

    // Helper to get class based on status
    const getStatusClass = (status: string) => {
        if (status === 'empty') return '';
        return `active ${status}`;
    };

    return (
        <div className="ha-card" style={{ padding: 20 }}>
            {/* Calendar Grid - Mocking roughly 30 days or partial month view */}
            <div className="ha-calendar-grid">
                {/* Add some empty placeholders for offset if needed, but let's just do a simple grid */}
                {[31, 1, 2].map(d => <div key={`prev-${d}`} className="ha-day" style={{ color: '#d1d5db' }}>{d}</div>)}

                {days.map((dayObj, i) => (
                    <div
                        key={i}
                        className={`ha-day ${getStatusClass(dayObj.status)}`}
                        onClick={() => onDayClick(i)}
                    >
                        {dayObj.day}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="ha-legend">
                <div className="ha-legend-item">
                    <div className="ha-legend-dot" style={{ background: '#f3f4f6' }}></div> No entry
                </div>
                <div className="ha-legend-item">
                    <div className="ha-legend-dot" style={{ background: '#10b981' }}></div> 0–30
                </div>
                <div className="ha-legend-item">
                    <div className="ha-legend-dot" style={{ background: '#f59e0b' }}></div> 31–60
                </div>
                <div className="ha-legend-item">
                    <div className="ha-legend-dot" style={{ background: '#f97316' }}></div> 61–75
                </div>
                <div className="ha-legend-item">
                    <div className="ha-legend-dot" style={{ background: '#ef4444' }}></div> 76–100
                </div>
            </div>
        </div>
    );
};

export default HabituationCalendar;
