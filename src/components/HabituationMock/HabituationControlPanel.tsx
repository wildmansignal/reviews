import React from 'react';
import './Habituation.css';

interface HabituationControlPanelProps {
    entriesLogged: string;
    setEntriesLogged: (val: string) => void;
    dateRange: string;
    setDateRange: (val: string) => void;
    worstWeekAvg: string;
    setWorstWeekAvg: (val: string) => void;
    worstWeekSub: string; /* "Based on your..." */
    setWorstWeekSub: (val: string) => void;
    recentWeekAvg: string;
    setRecentWeekAvg: (val: string) => void;
    estHabit: string;
    setEstHabit: (val: string) => void;
    estHabitSub: string;
    setEstHabitSub: (val: string) => void;
    motivationText: string;
    setMotivationText: (val: string) => void;
    streakCount: string;
    setStreakCount: (val: string) => void;
}

const HabituationControlPanel: React.FC<HabituationControlPanelProps> = ({
    entriesLogged, setEntriesLogged,
    dateRange, setDateRange,
    worstWeekAvg, setWorstWeekAvg,
    worstWeekSub, setWorstWeekSub,
    recentWeekAvg, setRecentWeekAvg,
    estHabit, setEstHabit,
    estHabitSub, setEstHabitSub,
    motivationText, setMotivationText,
    streakCount, setStreakCount
}) => {
    return (
        <div className="ha-controls">
            <h3>Habituation Settings</h3>

            <div className="ha-control-group">
                <label className="ha-label">Streak Count (Header)</label>
                <input
                    className="ha-input"
                    value={streakCount}
                    onChange={(e) => setStreakCount(e.target.value)}
                    placeholder="2"
                />
            </div>

            <div className="ha-control-group">
                <label className="ha-label">Entries Card</label>
                <input
                    className="ha-input"
                    value={entriesLogged}
                    onChange={(e) => setEntriesLogged(e.target.value)}
                    placeholder="1"
                />
                <input
                    className="ha-input"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    placeholder="From..."
                />
            </div>

            <div className="ha-control-group">
                <label className="ha-label">Worst Week Card</label>
                <input
                    className="ha-input"
                    value={worstWeekAvg}
                    onChange={(e) => setWorstWeekAvg(e.target.value)}
                    placeholder="92/100"
                />
                <input
                    className="ha-input"
                    value={worstWeekSub}
                    onChange={(e) => setWorstWeekSub(e.target.value)}
                    placeholder="Based on..."
                />
            </div>

            <div className="ha-control-group">
                <label className="ha-label">Recent Week Card</label>
                <input
                    className="ha-input"
                    value={recentWeekAvg}
                    onChange={(e) => setRecentWeekAvg(e.target.value)}
                />
            </div>

            <div className="ha-control-group">
                <label className="ha-label">Estimated Habituation</label>
                <input
                    className="ha-input"
                    value={estHabit}
                    onChange={(e) => setEstHabit(e.target.value)}
                    placeholder="0%"
                />
                <textarea
                    className="ha-textarea"
                    value={estHabitSub}
                    onChange={(e) => setEstHabitSub(e.target.value)}
                    placeholder="0% = same as..."
                    style={{ minHeight: 60, marginTop: 8 }}
                />
            </div>

            <div className="ha-control-group">
                <label className="ha-label">Motivation Text (Bottom)</label>
                <textarea
                    className="ha-textarea"
                    value={motivationText}
                    onChange={(e) => setMotivationText(e.target.value)}
                />
            </div>
        </div>
    );
};

export default HabituationControlPanel;
