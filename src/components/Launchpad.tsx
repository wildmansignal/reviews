import React from 'react';
import { Link } from 'react-router-dom';
import {
    LayoutDashboard,
    MessageSquare,
    Facebook,
    DollarSign,
    BarChart2,
    Activity,
    Video,
    Youtube,
    Mail,
    FileText,
    MonitorPlay,
    Edit,
    Settings,
    Zap,
    Smartphone
} from 'lucide-react';
import './Launchpad.css';

const Launchpad = () => {
    return (
        <div className="launchpad-container">
            <div className="launchpad-content">
                <header className="launchpad-header">
                    <h1 className="launchpad-title">
                        Review Builder Suite
                    </h1>
                    <p className="launchpad-subtitle">Select a tool to begin.</p>
                </header>

                <div className="launchpad-sections">
                    {/* Section: Core Dashboards */}
                    <section>
                        <h2 className="launchpad-section-title">
                            <LayoutDashboard color="#60a5fa" size={20} />
                            Core Dashboards
                        </h2>
                        <div className="launchpad-grid">
                            <Card
                                to="/dashboard"
                                title="Main Dashboard"
                                desc="Central overview of all metrics and activity."
                                icon={<LayoutDashboard size={24} color="#60a5fa" />}
                            />
                            <Card
                                to="/business-dashboard"
                                title="Business Dashboard"
                                desc="Revenue, payments, and customer management."
                                icon={<DollarSign size={24} color="#4ade80" />}
                            />
                            <Card
                                to="/analytics-dashboard"
                                title="Analytics Dashboard"
                                desc="Traffic sources, conversion rates, and funnel tracking."
                                icon={<BarChart2 size={24} color="#c084fc" />}
                            />
                            <Card
                                to="/blue-analytics"
                                title="Blue Analytics"
                                desc="Alternative high-contrast analytics view."
                                icon={<Activity size={24} color="#22d3ee" />}
                            />
                            <Card
                                to="/finance-app"
                                title="Finance App"
                                desc="Financial snapshots and projections."
                                icon={<DollarSign size={24} color="#facc15" />}
                            />
                        </div>
                    </section>

                    {/* Section: Social Mockups */}
                    <section>
                        <h2 className="launchpad-section-title">
                            <MessageSquare color="#f472b6" size={20} />
                            Social Mockups
                        </h2>
                        <div className="launchpad-grid">
                            <Card
                                to="/tiktok-comments"
                                title="TikTok Comments"
                                desc="Simulate TikTok comment sections and engagement."
                                icon={<Video size={24} color="#ec4899" />}
                            />
                            <Card
                                to="/youtube-comments"
                                title="YouTube Comments"
                                desc="Create realistic YouTube comment threads."
                                icon={<Youtube size={24} color="#ef4444" />}
                            />
                            <Card
                                to="/facebook-post"
                                title="Facebook Post"
                                desc="Mockup Facebook posts and interactions."
                                icon={<Facebook size={24} color="#2563eb" />}
                            />
                            <Card
                                to="/gmail-thread"
                                title="Gmail Thread"
                                desc="Generate email thread visualizations."
                                icon={<Mail size={24} color="#f87171" />}
                            />
                            <Card
                                to="/messenger"
                                title="Messenger"
                                desc="Simulate chat conversations."
                                icon={<MessageSquare size={24} color="#3b82f6" />}
                            />
                        </div>
                    </section>

                    {/* Section: Content & Webinar */}
                    <section>
                        <h2 className="launchpad-section-title">
                            <MonitorPlay color="#fb923c" size={20} />
                            Content & Webinars
                        </h2>
                        <div className="launchpad-grid">
                            <Card
                                to="/webinar-generator"
                                title="Webinar Generator"
                                desc="Generate slide decks and webinar assets."
                                icon={<Zap size={24} color="#eab308" />}
                            />
                            <Card
                                to="/webinar-editor"
                                title="Webinar Editor"
                                desc="Edit and refine webinar presentations."
                                icon={<Edit size={24} color="#f97316" />}
                            />
                            <Card
                                to="/review-slider"
                                title="Review Slider"
                                desc="Auto-scroll review screenshots in a phone frame."
                                icon={<Smartphone size={24} color="#a855f7" />}
                            />
                        </div>
                    </section>

                    {/* Section: Tools */}
                    <section>
                        <h2 className="launchpad-section-title">
                            <Settings color="#9ca3af" size={20} />
                            Tools & Utilities
                        </h2>
                        <div className="launchpad-grid">
                            <Card
                                to="/master-control"
                                title="Master Control"
                                desc="Global settings and configuration."
                                icon={<Settings size={24} color="#9ca3af" />}
                            />
                            <Card
                                to="/habituation-report"
                                title="Habituation Report"
                                desc="View habituation metrics and reports."
                                icon={<FileText size={24} color="#22c55e" />}
                            />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

// Helper Card Component
const Card = ({ to, title, desc, icon }: { to: string, title: string, desc: string, icon: React.ReactNode }) => (
    <Link to={to} className="launchpad-card-link group">
        <div className="launchpad-card">
            <div className="card-header">
                <div className="card-icon-wrapper">
                    {icon}
                </div>
                <div className="card-arrow">
                    Open →
                </div>
            </div>
            <h3 className="card-title">{title}</h3>
            <p className="card-desc">{desc}</p>
        </div>
    </Link>
);

export default Launchpad;
