import React from 'react';
import { X, HelpCircle, LayoutGrid } from 'lucide-react';
import './FinanceApp.css';

interface AccountScreenProps {
    balance: string;
    onBack: () => void;
    onNavigateTransactions: () => void;
    recentTransactions: any[];
}

const AccountScreen: React.FC<AccountScreenProps> = ({ balance, onBack, onNavigateTransactions, recentTransactions }) => {
    return (
        <div className="fin-content">
            {/* Top Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
                <X size={24} color="white" onClick={onBack} style={{ cursor: 'pointer' }} />
                <div style={{ fontWeight: 700, fontSize: 16 }}>Spending Account ••8178</div>
                <HelpCircle size={24} color="#d996dd" />
            </div>

            <div style={{ fontSize: 14, color: '#ccc', marginBottom: 5 }}>Available balance (?)</div>
            <div style={{ fontSize: 42, fontWeight: 800, marginBottom: 5 }}>${balance}</div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 30 }}>
                <span style={{ fontSize: 14, color: '#ccc' }}>Current balance (?)</span>
                <span style={{ fontSize: 16, fontWeight: 700 }}>${balance}</span>
            </div>

            {/* Actions */}
            <div className="fin-action-row">
                <button className="fin-btn-primary">Transfer</button>
                <button className="fin-btn-secondary" onClick={onNavigateTransactions}>
                    <LayoutGrid size={18} /> Menu
                </button>
            </div>

            <div className="fin-action-row">
                <button className="fin-btn-tertiary">Deposit checks</button>
                <button className="fin-btn-tertiary">Zelle®</button>
                <button className="fin-btn-tertiary">Manage Card</button>
            </div>

            <div className="fin-action-row" style={{ marginTop: 20 }}>
                <div style={{ background: '#1a1a1a', width: '100%', padding: '15px', borderRadius: '20px 20px 0 0', borderBottom: '1px solid #333' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 700, fontSize: 16, color: '#d996dd' }}>Account Info</span>
                        <span>▼</span>
                    </div>
                </div>
            </div>

            {/* Activity Preview */}
            <div style={{ background: '#1a1a1a', padding: 20, borderRadius: '0 0 20px 20px', minHeight: 200 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                    <span style={{ fontWeight: 700, fontSize: 16, color: '#d996dd' }}>Activity</span>
                    <span>^</span>
                </div>

                {recentTransactions.slice(0, 3).map(tx => (
                    <div key={tx.id} className="fin-transaction-row" style={{ padding: '10px 0', borderBottom: '1px solid #333' }}>
                        <div className="fin-trans-info">
                            <div className="fin-trans-title">{tx.title}</div>
                            <div className="fin-trans-sub">{tx.date}</div>
                        </div>
                        <div>
                            <div className="fin-trans-amount fin-amount-credit">${tx.amount}</div>
                            <div className="fin-trans-balance">${balance}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AccountScreen;
