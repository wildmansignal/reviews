import {
    MessageSquare,
    MoreHorizontal,
    Layers,
    BarChart2,
    CreditCard,
    TrendingUp,
    PieChart,
    Youtube,
    Mail,
    Activity,
    Presentation,
    Home,
    Users,
    Box,
    FileText,
    Clock,
    MessageCircle,
    Link as LinkIcon
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const location = useLocation();
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="store-selector" style={{ marginBottom: 10 }}>
                    <span className="store-name">Dan Plants Tinnitus...</span>
                    <span className="arrow">▼</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-group">
                    <Link to="/" className="nav-item title-nav">
                        <Layers size={16} className="text-blue-400" />
                        <span className="font-bold text-blue-400">All Apps</span>
                    </Link>
                    <Link to="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                        <Home size={16} />
                        <span>Dashboard</span>
                    </Link>
                    <a href="#" className="nav-item">
                        <CreditCard size={16} />
                        <span>Balances</span>
                    </a>
                    <a href="#" className="nav-item">
                        <LinkIcon size={16} />
                        <span>Transactions</span>
                    </a>
                    <a href="#" className="nav-item">
                        <Users size={16} />
                        <span>Customers</span>
                    </a>
                    <a href="#" className="nav-item">
                        <Box size={16} />
                        <span>Product catalog</span>
                    </a>
                </div>

                <div className="nav-group-title">Shortcuts</div>
                <div className="nav-group">
                    <a href="#" className="nav-item">
                        <FileText size={16} />
                        <span>Invoices</span>
                    </a>
                    <a href="#" className="nav-item">
                        <Clock size={16} />
                        <span>Subscriptions</span>
                    </a>
                    <a href="#" className="nav-item">
                        <BarChart2 size={16} />
                        <span>Reports</span>
                    </a>
                    <a href="#" className="nav-item">
                        <LinkIcon size={16} />
                        <span>Payment Links</span>
                    </a>
                </div>

                <div className="nav-group-title">Products</div>
                <div className="nav-group">
                    <a href="#" className="nav-item">
                        <CreditCard size={16} />
                        <span>Payments</span>
                    </a>
                    <a href="#" className="nav-item">
                        <FileText size={16} />
                        <span>Billing</span>
                    </a>
                    <a href="#" className="nav-item">
                        <BarChart2 size={16} />
                        <span>Reporting</span>
                    </a>
                    <a href="#" className="nav-item">
                        <MoreHorizontal size={16} />
                        <span>More</span>
                    </a>
                </div>

                <div className="nav-group-title">Tools</div>
                <div className="nav-group">
                    <a href="/messenger" className="nav-item">
                        <MessageCircle size={16} />
                        <span>Messenger Sim</span>
                    </a>
                    <a href="/facebook-post" className="nav-item">
                        <Layers size={16} />
                        <span>Facebook Post</span>
                    </a>
                    <a href="/business-dashboard" className="nav-item">
                        <BarChart2 size={16} />
                        <span>Business Dash</span>
                    </a>
                    <a href="/finance-app" className="nav-item">
                        <CreditCard size={16} />
                        <span>Finance App</span>
                    </a>
                    <a href="/analytics-dashboard" className="nav-item">
                        <TrendingUp size={16} />
                        <span>Analytics Dash</span>
                    </a>
                    <a href="/blue-analytics" className="nav-item">
                        <PieChart size={16} />
                        <span>Blue Analytics</span>
                    </a>
                    <a href="/tiktok-comments" className="nav-item">
                        <MessageSquare size={16} />
                        <span>TikTok Comments</span>
                    </a>
                    <a href="/youtube-comments" className="nav-item">
                        <Youtube size={16} />
                        <span>YouTube Comments</span>
                    </a>
                    <a href="/gmail-thread" className="nav-item">
                        <Mail size={16} />
                        <span>Gmail Thread</span>
                    </a>
                    <a href="/habituation-report" className="nav-item">
                        <Activity size={16} />
                        <span>Habituation Report</span>
                    </a>
                    <Link to="/webinar-generator" className={`nav-item ${location.pathname === '/webinar-generator' ? 'active' : ''}`}>
                        <Presentation size={16} />
                        <span>Webinar Generator</span>
                    </Link>
                    <Link to="/webinar-editor" className={`nav-item ${location.pathname === '/webinar-editor' ? 'active' : ''}`}>
                        <Presentation size={16} />
                        <span>Webinar Editor</span>
                    </Link>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
