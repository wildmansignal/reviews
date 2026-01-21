
import './OverviewCards.css';

const FailedPaymentsCard = () => {
    return (
        <div className="overview-card">
            <div className="card-header">
                <span className="card-title">Failed payments</span>
                <span className="info-icon">ⓘ</span>
            </div>

            <div className="card-content">
                <div className="failed-amount-row">
                    <span className="failed-amount">$29.00</span>
                    <span className="badge-failed">Failed</span>
                </div>
                <div className="failed-detail">
                    Jan 13, 8:01 AM · dhocsman@hotmail.com
                </div>
            </div>

            <div className="card-footer">
                <a href="#" className="view-all-link">View all</a>
            </div>
        </div>
    );
};

export default FailedPaymentsCard;
