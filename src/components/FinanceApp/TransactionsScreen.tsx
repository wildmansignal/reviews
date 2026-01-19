import React from 'react';
import { X, Search } from 'lucide-react';
import './FinanceApp.css';

interface TransactionsScreenProps {
    transactions: any[];
    balance: string;
    onBack: () => void;
    onSelectTransaction: (id: string) => void;
}

const TransactionsScreen: React.FC<TransactionsScreenProps> = ({ transactions, balance, onBack, onSelectTransaction }) => {
    return (
        <div className="fin-content">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <X size={24} color="white" onClick={onBack} style={{ cursor: 'pointer' }} />
                <div style={{ fontWeight: 700, fontSize: 14 }}>Spending Account ••8178</div>
                <div style={{ width: 24 }}></div>{/* Spacer */}
            </div>

            <div className="fin-header-row">
                <h1 className="fin-h1">Transactions</h1>
                <button className="fin-search-btn">
                    <Search size={14} /> Search
                </button>
            </div>

            {/* View upcoming pills */}
            <div style={{ background: '#1a1a1a', padding: '15px', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span>View upcoming transactions</span>
                <span>›</span>
            </div>

            {/* Transactions List */}
            {transactions.map(tx => (
                <div key={tx.id} className="fin-transaction-row" onClick={() => onSelectTransaction(tx.id)}>
                    <div className="fin-trans-info">
                        <div className="fin-trans-title">{tx.title}</div>
                        {tx.subtitle && <div className="fin-trans-sub" style={{ textTransform: 'uppercase', fontSize: 11, marginBottom: 2 }}>{tx.subtitle}</div>}
                        {tx.location && <div className="fin-trans-sub" style={{ textTransform: 'uppercase', fontSize: 11, marginBottom: 2 }}>{tx.location}</div>}
                        <div className="fin-trans-sub">{tx.date}</div>
                    </div>
                    <div>
                        <div className="fin-trans-amount fin-amount-credit">{tx.amount.startsWith('-') ? tx.amount : `$${tx.amount}`}</div>
                        <div className="fin-trans-balance">${balance}</div>
                    </div>
                </div>
            ))}

            <div className="fin-transaction-row">
                <div className="fin-trans-info">
                    <div className="fin-trans-title">Interest Paid</div>
                    <div className="fin-trans-sub">Dec 31, 2025</div>
                </div>
                <div>
                    <div className="fin-trans-amount fin-amount-credit">$0.02</div>
                    <div className="fin-trans-balance">$320.54</div>
                </div>
            </div>
        </div>
    );
};

export default TransactionsScreen;
