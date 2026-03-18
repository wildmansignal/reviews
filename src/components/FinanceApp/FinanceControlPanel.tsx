import React from 'react';
import './FinanceApp.css';

interface FinanceControlPanelProps {
    userName: string;
    setUserName: (val: string) => void;
    totalBalance: string;
    setTotalBalance: (val: string) => void;

    // Transaction Editing
    selectedTxId: string | null;
    txTitle: string;
    setTxTitle: (val: string) => void;
    txAmount: string;
    setTxAmount: (val: string) => void;
    txDate: string;
    setTxDate: (val: string) => void;
    onSaveTx: () => void;
}

const FinanceControlPanel: React.FC<FinanceControlPanelProps> = ({
    userName, setUserName,
    totalBalance, setTotalBalance,
    selectedTxId,
    txTitle, setTxTitle,
    txAmount, setTxAmount,
    txDate, setTxDate,
    onSaveTx
}) => {
    const handleRandomize = () => {
        const balance = Math.floor(Math.random() * 990000) + 10000;
        setTotalBalance('$' + balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        void userName; // name stays as-is since it's personal
    };
    return (
        <div className="fin-controls">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ color: 'white', margin: 0 }}>Finance App Controls</h3>
                <button
                    onClick={handleRandomize}
                    style={{ background: 'linear-gradient(135deg,#d996dd,#9c27b0)', color: 'white', border: 'none', padding: '7px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                >
                    🎲 Randomize
                </button>
            </div>

            <div style={{ marginBottom: 20 }}>
                <div style={{ color: '#d996dd', fontSize: '13px', textTransform: 'uppercase', marginBottom: 10 }}>Global Settings</div>

                <div style={{ marginBottom: 15 }}>
                    <label style={{ display: 'block', color: 'white', marginBottom: 5 }}>User Name</label>
                    <input
                        className="control-input"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        style={{ width: '100%', padding: 8, background: '#333', border: '1px solid #444', color: 'white', borderRadius: 4 }}
                    />
                </div>

                <div style={{ marginBottom: 15 }}>
                    <label style={{ display: 'block', color: 'white', marginBottom: 5 }}>Total Balance ($)</label>
                    <input
                        className="control-input"
                        value={totalBalance}
                        onChange={(e) => setTotalBalance(e.target.value)}
                        style={{ width: '100%', padding: 8, background: '#333', border: '1px solid #444', color: 'white', borderRadius: 4 }}
                    />
                </div>
            </div>

            <div style={{ borderTop: '1px solid #333', paddingTop: 20 }}>
                <div style={{ color: '#d996dd', fontSize: '13px', textTransform: 'uppercase', marginBottom: 10 }}>
                    {selectedTxId ? 'Edit Transaction' : 'Transaction Editor'}
                </div>

                {selectedTxId ? (
                    <>
                        <div style={{ marginBottom: 15 }}>
                            <label style={{ display: 'block', color: 'white', marginBottom: 5 }}>Merchant / Title</label>
                            <input
                                value={txTitle}
                                onChange={(e) => setTxTitle(e.target.value)}
                                style={{ width: '100%', padding: 8, background: '#333', border: '1px solid #444', color: 'white', borderRadius: 4 }}
                            />
                        </div>

                        <div style={{ marginBottom: 15 }}>
                            <label style={{ display: 'block', color: 'white', marginBottom: 5 }}>Amount ($)</label>
                            <input
                                value={txAmount}
                                onChange={(e) => setTxAmount(e.target.value)}
                                style={{ width: '100%', padding: 8, background: '#333', border: '1px solid #444', color: 'white', borderRadius: 4 }}
                            />
                        </div>

                        <div style={{ marginBottom: 15 }}>
                            <label style={{ display: 'block', color: 'white', marginBottom: 5 }}>Date</label>
                            <input
                                value={txDate}
                                onChange={(e) => setTxDate(e.target.value)}
                                style={{ width: '100%', padding: 8, background: '#333', border: '1px solid #444', color: 'white', borderRadius: 4 }}
                            />
                        </div>

                        <button
                            onClick={onSaveTx}
                            style={{ width: '100%', padding: 10, background: '#d996dd', border: 'none', borderRadius: 6, fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            Save Changes
                        </button>
                    </>
                ) : (
                    <div style={{ color: '#666', fontStyle: 'italic', fontSize: 13 }}>
                        Click a transaction in the list to edit it here.
                    </div>
                )}
            </div>
        </div>
    );
};

export default FinanceControlPanel;
