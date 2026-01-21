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
    Zap
} from 'lucide-react';

const Launchpad = () => {
    return (
        <div className="min-h-screen bg-slate-900 text-white p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
                        Review Builder Suite
                    </h1>
                    <p className="text-slate-400 text-lg">Select a tool to begin.</p>
                </header>

                <div className="space-y-12">
                    {/* Section: Core Dashboards */}
                    <section>
                        <h2 className="text-xl font-semibold text-slate-300 mb-6 flex items-center gap-2">
                            <LayoutDashboard className="text-blue-400" size={20} />
                            Core Dashboards
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Card
                                to="/dashboard"
                                title="Main Dashboard"
                                desc="Central overview of all metrics and activity."
                                icon={<LayoutDashboard size={24} className="text-blue-400" />}
                            />
                            <Card
                                to="/business-dashboard"
                                title="Business Dashboard"
                                desc="Revenue, payments, and customer management."
                                icon={<DollarSign size={24} className="text-green-400" />}
                            />
                            <Card
                                to="/analytics-dashboard"
                                title="Analytics Dashboard"
                                desc="Traffic sources, conversion rates, and funnel tracking."
                                icon={<BarChart2 size={24} className="text-purple-400" />}
                            />
                            <Card
                                to="/blue-analytics"
                                title="Blue Analytics"
                                desc="Alternative high-contrast analytics view."
                                icon={<Activity size={24} className="text-cyan-400" />}
                            />
                            <Card
                                to="/finance-app"
                                title="Finance App"
                                desc="Financial snapshots and projections."
                                icon={<DollarSign size={24} className="text-yellow-400" />}
                            />
                        </div>
                    </section>

                    {/* Section: Social Mockups */}
                    <section>
                        <h2 className="text-xl font-semibold text-slate-300 mb-6 flex items-center gap-2">
                            <MessageSquare className="text-pink-400" size={20} />
                            Social Mockups
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Card
                                to="/tiktok-comments"
                                title="TikTok Comments"
                                desc="Simulate TikTok comment sections and engagement."
                                icon={<Video size={24} className="text-pink-500" />}
                            />
                            <Card
                                to="/youtube-comments"
                                title="YouTube Comments"
                                desc="Create realistic YouTube comment threads."
                                icon={<Youtube size={24} className="text-red-500" />}
                            />
                            <Card
                                to="/facebook-post"
                                title="Facebook Post"
                                desc="Mockup Facebook posts and interactions."
                                icon={<Facebook size={24} className="text-blue-600" />}
                            />
                            <Card
                                to="/gmail-thread"
                                title="Gmail Thread"
                                desc="Generate email thread visualizations."
                                icon={<Mail size={24} className="text-red-400" />}
                            />
                            <Card
                                to="/messenger"
                                title="Messenger"
                                desc="Simulate chat conversations."
                                icon={<MessageSquare size={24} className="text-blue-500" />}
                            />
                        </div>
                    </section>

                    {/* Section: Content & Webinar */}
                    <section>
                        <h2 className="text-xl font-semibold text-slate-300 mb-6 flex items-center gap-2">
                            <MonitorPlay className="text-orange-400" size={20} />
                            Content & Webinars
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Card
                                to="/webinar-generator"
                                title="Webinar Generator"
                                desc="Generate slide decks and webinar assets."
                                icon={<Zap size={24} className="text-yellow-500" />}
                            />
                            <Card
                                to="/webinar-editor"
                                title="Webinar Editor"
                                desc="Edit and refine webinar presentations."
                                icon={<Edit size={24} className="text-orange-500" />}
                            />
                        </div>
                    </section>

                    {/* Section: Tools */}
                    <section>
                        <h2 className="text-xl font-semibold text-slate-300 mb-6 flex items-center gap-2">
                            <Settings className="text-gray-400" size={20} />
                            Tools & Utilities
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Card
                                to="/master-control"
                                title="Master Control"
                                desc="Global settings and configuration."
                                icon={<Settings size={24} className="text-gray-400" />}
                            />
                            <Card
                                to="/habituation-report"
                                title="Habituation Report"
                                desc="View habituation metrics and reports."
                                icon={<FileText size={24} className="text-green-500" />}
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
    <Link to={to} className="block group">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 h-full transition-all duration-200 hover:border-blue-500/50 hover:bg-slate-800/80 hover:scale-[1.02]">
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-slate-900 rounded-lg group-hover:bg-slate-950 transition-colors">
                    {icon}
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400 text-sm font-medium">
                    Open →
                </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
        </div>
    </Link>
);

export default Launchpad;
