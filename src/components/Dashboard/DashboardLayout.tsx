import Sidebar from '../Sidebar';
import DashboardParams from './DashboardParams';
import '../../App.css'; // Assuming App.css contains layout styles, might need to adjustment import path

const DashboardLayout = () => {
    return (
        <div className="app-container">
            <Sidebar />
            <main className="main-content">
                <header className="top-search-bar">
                    <div className="search-input-wrapper">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="search-icon">
                            <path fillRule="evenodd" clipRule="evenodd" d="M11.5002 7C11.5002 9.48528 9.48545 11.5 7.00017 11.5C4.51488 11.5 2.50017 9.48528 2.50017 7C2.50017 4.51472 4.51488 2.5 7.00017 2.5C9.48545 2.5 11.5002 4.51472 11.5002 7ZM10.6865 11.8532C9.66444 12.5786 8.39719 13 7.00017 13C3.68646 13 1.00017 10.3137 1.00017 7C1.00017 3.68629 3.68646 1 7.00017 1C10.3139 1 13.0002 3.68629 13.0002 7C13.0002 8.44111 12.5132 9.76867 11.7019 10.8226L14.7352 13.856C14.922 14.0428 14.922 14.3456 14.7352 14.5325C14.5484 14.7193 14.2456 14.7193 14.0588 14.5325L10.6865 11.8532Z" fill="#697386" />
                        </svg>
                        <input type="text" placeholder="Search" />
                    </div>
                    <div className="top-actions">
                        <span>Test mode has moved. <a href="#">Show me</a></span>
                        <div className="action-icons">
                            <button className="icon-btn">⋮</button>
                            <button className="icon-btn">?</button>
                        </div>
                        <button className="avatar-btn"></button>
                    </div>
                </header>

                <div className="content-scrollable">
                    <DashboardParams />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
