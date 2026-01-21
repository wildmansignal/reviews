import { useState } from 'react';
import { Headphones, Flame, Menu, TrendingUp } from 'lucide-react';
import HabituationCalendar from './HabituationCalendar';
import HabituationControlPanel from './HabituationControlPanel';
import './Habituation.css';

// Generate initial 30 days
const generateInitialDays = () => {
    return Array.from({ length: 28 }, (_, i) => ({
        day: i + 3, // Start from 3rd to match screenshot offset roughly or just 1
        status: i === 12 ? 'empty' : 'empty' // Just defaults. 'empty' | 'green' | 'yellow' | 'orange' | 'red'
    })) as any[];
};

const HabituationApp = () => {
    // Stats State
    const [entriesLogged, setEntriesLogged] = useState("1");
    const [dateRange, setDateRange] = useState("From 2026-01-15 to 2026-01-15");
    const [worstWeekAvg, setWorstWeekAvg] = useState("92/100");
    const [worstWeekSub, setWorstWeekSub] = useState("Based on your 7 highest TBS days.");
    const [recentWeekAvg, setRecentWeekAvg] = useState("92/100");
    const [estHabit, setEstHabit] = useState("0%");
    const [estHabitSub, setEstHabitSub] = useState("0% = same as your worst week. 100% = very low distress compared to your worst week.");
    const [motivationText, setMotivationText] = useState("This isn’t a medical score, it’s a motivation meter. When the recent-week average is lower than your worst-week average, it means your brain is reacting less to tinnitus – you’re moving toward habituation.");
    const [streakCount, setStreakCount] = useState("2");

    // Calendar State
    const [days, setDays] = useState(generateInitialDays());

    // Cycle color on click
    const handleDayClick = (index: number) => {
        const statuses = ['empty', 'green', 'yellow', 'orange', 'red'];
        setDays(prev => {
            const newDays = [...prev];
            const currentStatus = newDays[index].status;
            const nextIdx = (statuses.indexOf(currentStatus) + 1) % statuses.length;
            newDays[index] = { ...newDays[index], status: statuses[nextIdx] };
            return newDays;
        });
    };

    return (
        <div className="ha-app-container">
            {/* Control Panel */}
            <HabituationControlPanel
                entriesLogged={entriesLogged} setEntriesLogged={setEntriesLogged}
                dateRange={dateRange} setDateRange={setDateRange}
                worstWeekAvg={worstWeekAvg} setWorstWeekAvg={setWorstWeekAvg}
                worstWeekSub={worstWeekSub} setWorstWeekSub={setWorstWeekSub}
                recentWeekAvg={recentWeekAvg} setRecentWeekAvg={setRecentWeekAvg}
                estHabit={estHabit} setEstHabit={setEstHabit}
                estHabitSub={estHabitSub} setEstHabitSub={setEstHabitSub}
                motivationText={motivationText} setMotivationText={setMotivationText}
                streakCount={streakCount} setStreakCount={setStreakCount}
            />

            {/* Phone Frame */}
            <div className="ha-phone-frame">
                <div className="ha-scroll-content">
                    {/* Header */}
                    <div className="ha-header">
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                            <div style={{ background: '#111827', padding: 8, borderRadius: '50%', color: 'white' }}>
                                <Headphones size={20} />
                            </div>
                            <div>
                                <div className="ha-app-title">AI Tinnitus<br />Recovery<br />Companion</div>
                                <div className="ha-app-subtitle">Track your healing. Rewire<br />the reaction. Find peace.</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <div className="ha-header-badge">
                                <Flame size={14} fill="#c2410c" /> {streakCount}
                            </div>
                            <div className="ha-menu-btn">
                                <Menu size={16} /> Menu
                            </div>
                        </div>
                    </div>

                    {/* Section 1: Stats Layout (Stacked) */}
                    <div className="ha-section-title">
                        <TrendingUp size={20} /> Habituation Summary
                    </div>

                    {/* Entries Card */}
                    <div className="ha-card">
                        <div className="ha-card-label">Entries logged</div>
                        <div className="ha-card-value">{entriesLogged}</div>
                        <div className="ha-card-sub">{dateRange}</div>
                    </div>

                    {/* Worst Week */}
                    <div className="ha-card">
                        <div className="ha-card-label">Worst-week average</div>
                        <div className="ha-card-value">{worstWeekAvg}</div>
                        <div className="ha-card-sub">{worstWeekSub}</div>
                    </div>

                    {/* Recent Week */}
                    <div className="ha-card">
                        <div className="ha-card-label">Recent-week average</div>
                        <div className="ha-card-value">{recentWeekAvg}</div>
                        <div className="ha-card-sub">Based on your 7 most recent entries.</div>
                    </div>

                    {/* Estimated Habituation */}
                    <div className="ha-card">
                        <div className="ha-card-label">Estimated habituation</div>
                        <div className="ha-card-value">{estHabit}</div>
                        <div className="ha-card-sub">{estHabitSub}</div>
                    </div>

                    {/* Motivation Text */}
                    <div className="ha-motivation" style={{ marginBottom: 30 }}>
                        {motivationText}
                    </div>

                    {/* Calendar Section */}
                    {/* Re-rendering header for second screenshot vibe or just inline? Screenshot 2 has header again.
                        I'll just put the calendar below in the same flow for simplicity unless instructed otherwise.
                    */}
                    <div className="ha-section-title" style={{ marginTop: 40 }}>
                        Calendar Log
                    </div>
                    <HabituationCalendar days={days} onDayClick={handleDayClick} />

                    {/* Duplicate Habituation Summary Card below calendar as per 2nd screenshot */}
                    <div className="ha-section-title">
                        <TrendingUp size={20} /> Habituation Summary
                    </div>
                    <div className="ha-card">
                        <div className="ha-motivation">
                            No entries yet. Start by logging today's TBS on the left. As you add more days, the app will estimate your overall improvement.
                        </div>
                    </div>

                    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 20, textAlign: 'center' }}>
                        Built with ❤️ for gentle, consistent progress. This is an MVP prototype.
                    </div>

                </div>
            </div>
        </div>
    );
};

export default HabituationApp;
