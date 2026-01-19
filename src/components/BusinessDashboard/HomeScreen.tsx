import React from 'react';
import DashboardChart from './DashboardChart';
import './BusinessDashboard.css';

interface HomeScreenProps {
    grossVolume: string;
    netVolume: string;
    newCustomers: string;

    // Arrays for charts
    chartDataGross: number[];
    chartDataNet: number[];
    chartDataCustomers: number[];
}

const HomeScreen: React.FC<HomeScreenProps> = ({
    grossVolume,
    netVolume,
    newCustomers,
    chartDataGross,
    chartDataNet,
    chartDataCustomers
}) => {
    return (
        <div className="bd-content">
            {/* Time Tabs */}
            <div className="bd-time-tabs">
                <div className="bd-time-tab">1W</div>
                <div className="bd-time-tab active">4W</div>
                <div className="bd-time-tab">1Y</div>
                <div className="bd-time-tab">MTD</div>
                <div className="bd-time-tab">QTD</div>
                <div className="bd-time-tab">YTD</div>
                <div className="bd-time-tab">ALL</div>
            </div>

            {/* Gross Volume Card */}
            <div className="bd-metric-card">
                <div className="bd-metric-title">Gross volume</div>
                <div className="bd-metric-value-row">
                    <div className="bd-metric-value">${grossVolume}</div>
                    <div className="bd-metric-badge">+0.0%</div>
                </div>
                <div className="bd-metric-date-range">
                    <span>Nov 19 – Dec 16</span>
                    <span>Dec 17 – Today</span>
                </div>
                <DashboardChart data={chartDataGross} secondaryData={[10, 40, 20, 50, 30, 60, 20, 40]} />
            </div>

            {/* Net Volume Card */}
            <div className="bd-metric-card">
                <div className="bd-metric-title">Net volume from sales</div>
                <div className="bd-metric-value-row">
                    <div className="bd-metric-value">${netVolume}</div>
                    <div className="bd-metric-badge">+0.0%</div>
                </div>
                <div className="bd-metric-date-range">
                    <span>Nov 19 – Dec 16</span>
                    <span>Dec 17 – Today</span>
                </div>
                <DashboardChart data={chartDataNet} color="#635bff" secondaryData={[20, 30, 10, 40, 20, 50, 30, 40]} />
            </div>

            {/* New Customers Card */}
            <div className="bd-metric-card" style={{ borderBottom: 'none' }}>
                <div className="bd-metric-title">New customers</div>
                <div className="bd-metric-value-row">
                    <div className="bd-metric-value">{newCustomers}</div>
                    <div className="bd-metric-badge">+0.0%</div>
                </div>
                <div className="bd-metric-date-range">
                    <span>Nov 19 – Dec 16</span>
                    <span>Dec 17 – Today</span>
                </div>
                <DashboardChart data={chartDataCustomers} color="#635bff" secondaryData={[5, 2, 8, 1, 6, 3, 7, 4]} />
            </div>
        </div>
    );
};

export default HomeScreen;
