import React from 'react';
import { Bell, MessageCircle, Mail, HelpCircle } from 'lucide-react';
import './FinanceApp.css';

interface SnapshotScreenProps {
    userName: string;
    balance: string;
    onNavigate: (tab: 'spending') => void;
}

const SnapshotScreen: React.FC<SnapshotScreenProps> = ({ userName, balance, onNavigate }) => {
    return (
        <div className="fin-content">
            {/* Top Bar (Icons) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#d996dd' }}>Log Out</div>
                <div style={{ display: 'flex', gap: 15, color: '#d996dd' }}>
                    <Bell size={20} />
                    <MessageCircle size={20} />
                    <Mail size={20} />
                    <HelpCircle size={20} />
                </div>
            </div>

            {/* Greeting */}
            <h1 className="fin-h1" style={{ marginBottom: 10 }}>Good Afternoon, {userName}</h1>

            {/* Status Chips */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                <div style={{ background: '#4a1f4f', color: '#e3bce5', padding: '6px 16px', borderRadius: 16, fontSize: 13, fontWeight: 600 }}>
                    Status Tracker
                </div>
                <div style={{ background: '#4a1f4f', color: '#e3bce5', padding: '6px 16px', borderRadius: 16, fontSize: 13, fontWeight: 600 }}>
                    Refer friends
                </div>
            </div>

            {/* Total Balance */}
            <div className="fin-balance-large">${balance} <span style={{ fontSize: 16, fontWeight: 400, color: '#ccc' }}>Total (?)</span></div>

            {/* Savings Promo Card */}
            <div className="fin-card" style={{ display: 'flex', alignItems: 'center', gap: 15, background: '#1a1a1a' }}>
                <div style={{ width: 40, height: 40, background: '#4a1f4f', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ color: '#d996dd' }}>🏛</div>
                </div>
                <div>
                    <div style={{ fontSize: 14, color: 'white', lineHeight: 1.4 }}>
                        Save while you spend, automatically. Round ups help turn everyday spending into savings.
                    </div>
                    <div style={{ color: '#d996dd', fontWeight: 700, fontSize: 14, marginTop: 4 }}>
                        Open a Savings Account
                    </div>
                </div>
            </div>

            {/* Bank Accounts Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Bank Accounts</h2>
                <span style={{ fontSize: 16 }}>${balance}</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 10 }}>Checking</div>

            {/* Spending Account Card */}
            <div className="fin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => onNavigate('spending')}>
                <div>
                    <div style={{ fontSize: 16, fontWeight: 500 }}>Spending Account</div>
                    <div style={{ fontSize: 13, color: '#888' }}>••8178</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#d996dd' }}>${balance}</div>
                    <div style={{ fontSize: 13, color: '#888' }}>available</div>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: 30 }}>
                <button style={{ background: '#4a1f4f', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 20, fontSize: 15, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    Make a Transfer
                </button>
            </div>

            {/* Badges */}
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 10px 0' }}>Your shiny badges</h2>
            <div className="fin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 10 }}>
                    <div style={{ width: 30, height: 40, background: 'pink', borderRadius: 4 }}></div>
                    <div style={{ width: 30, height: 40, background: 'purple', borderRadius: 4 }}></div>
                </div>
                <button style={{ background: 'transparent', border: '1px solid #d996dd', color: '#d996dd', padding: '8px 16px', borderRadius: 20, fontWeight: 600 }}>
                    View Gallery
                </button>
            </div>
        </div>
    );
};

export default SnapshotScreen;
