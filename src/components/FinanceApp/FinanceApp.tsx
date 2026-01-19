import React, { useState } from 'react';
import SnapshotScreen from './SnapshotScreen';
import AccountScreen from './AccountScreen';
import TransactionsScreen from './TransactionsScreen';
import FinanceControlPanel from './FinanceControlPanel';
import { Home, User, Compass, Menu } from 'lucide-react';
import './FinanceApp.css';

interface Transaction {
    id: string;
    title: string;
    subtitle?: string;
    location?: string;
    date: string;
    amount: string; // pre-formatted string
}

const FinanceApp = () => {
    // State
    const [activeTab, setActiveTab] = useState<'snapshot' | 'spending' | 'transactions'>('snapshot');
    const [userName, setUserName] = useState("Daniel");
    const [totalBalance, setTotalBalance] = useState("375.38");

    // Transactions State
    const [transactions, setTransactions] = useState<Transaction[]>([
        { id: '1', title: 'STRIPE TRANSFER', date: 'Jan 7, 2026', amount: '27.20' },
        { id: '2', title: 'STRIPE TRANSFER', date: 'Jan 2, 2026', amount: '27.20' },
        { id: '3', title: 'SPROUTVIDEO LLC', subtitle: '190 N 10TH ST STE 313', location: 'BROOKLYN, NY, US', date: 'Jan 1, 2026', amount: '-10.00' },
        { id: '4', title: 'DIGITALOCEAN.COM', subtitle: '101 Ave of the', location: 'Americas NEW YORK, NY, US', date: 'Jan 1, 2026', amount: '-17.00' },
        { id: '5', title: 'STRIPE TRANSFER', date: 'Dec 31, 2025', amount: '27.42' },
        { id: '6', title: 'STRIPE TRANSFER', date: 'Dec 30, 2025', amount: '27.42' },
    ]);

    // Editing logic
    const [selectedTxId, setSelectedTxId] = useState<string | null>(null);
    const [editTxTitle, setEditTxTitle] = useState("");
    const [editTxAmount, setEditTxAmount] = useState("");
    const [editTxDate, setEditTxDate] = useState("");

    const handleSelectTx = (id: string) => {
        const tx = transactions.find(t => t.id === id);
        if (tx) {
            setSelectedTxId(id);
            setEditTxTitle(tx.title);
            setEditTxAmount(tx.amount);
            setEditTxDate(tx.date);
        }
    };

    const handleSaveTx = () => {
        if (selectedTxId) {
            setTransactions(prev => prev.map(t =>
                t.id === selectedTxId
                    ? { ...t, title: editTxTitle, amount: editTxAmount, date: editTxDate }
                    : t
            ));
        }
    };

    return (
        <div className="fin-app-container">
            {/* Left: Controls */}
            <FinanceControlPanel
                userName={userName} setUserName={setUserName}
                totalBalance={totalBalance} setTotalBalance={setTotalBalance}
                selectedTxId={selectedTxId}
                txTitle={editTxTitle} setTxTitle={setEditTxTitle}
                txAmount={editTxAmount} setTxAmount={setEditTxAmount}
                txDate={editTxDate} setTxDate={setEditTxDate}
                onSaveTx={handleSaveTx}
            />

            {/* Right: Phone Frame */}
            <div className="fin-phone-frame">

                {/* Screen Rendering */}
                {activeTab === 'snapshot' && (
                    <SnapshotScreen
                        userName={userName}
                        balance={totalBalance}
                        onNavigate={(tab) => setActiveTab(tab)}
                    />
                )}

                {activeTab === 'spending' && (
                    <AccountScreen
                        balance={totalBalance}
                        onBack={() => setActiveTab('snapshot')}
                        onNavigateTransactions={() => setActiveTab('transactions')}
                        recentTransactions={transactions}
                    />
                )}

                {activeTab === 'transactions' && (
                    <TransactionsScreen
                        transactions={transactions}
                        balance={totalBalance}
                        onBack={() => setActiveTab('spending')}
                        onSelectTransaction={handleSelectTx}
                    />
                )}

                {/* Bottom Nav (Only visible on Snapshot usually, but let's keep it persistent for app feel unless in deep view? 
                   Screenshot shows Bottom Nav on "Good Afternoon" screen.
                   Spending/Transactions screens usually cover it or have different nav.
                   I will hide it on Transacitons/Spending for realism if screenshot implies full modal.
                   Screenshot 2 (Spending Account) does NOT show bottom nav. It has a back X.
                   Screenshot 3 (Transactions) does NOT show bottom nav. It has a back X.
                   Screenshot 1 (Snapshot) SHOWS bottom nav.
                */}
                {activeTab === 'snapshot' && (
                    <div className="fin-bottom-nav">
                        <div className="fin-nav-item active">
                            <Home size={24} />
                            Snapshot
                        </div>
                        <div className="fin-nav-item">
                            <User size={24} />
                            Profile
                        </div>
                        <div className="fin-nav-item">
                            <Compass size={24} />
                            Explore
                        </div>
                        <div className="fin-nav-item">
                            <Menu size={24} />
                            Menu
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FinanceApp;
