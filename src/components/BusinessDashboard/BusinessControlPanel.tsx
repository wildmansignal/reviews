import React from 'react';
import './BusinessDashboard.css';

interface BusinessControlPanelProps {
    grossVolume: string;
    setGrossVolume: (val: string) => void;
    netVolume: string;
    setNetVolume: (val: string) => void;
    newCustomers: string;
    setNewCustomers: (val: string) => void;

    // Payment Edit Props
    selectedPaymentId: string | null;
    paymentName: string;
    setPaymentName: (val: string) => void;
    paymentAmount: string;
    setPaymentAmount: (val: string) => void;
    paymentDate: string;
    setPaymentDate: (val: string) => void;
    onSavePayment: () => void;
}

const BusinessControlPanel: React.FC<BusinessControlPanelProps> = ({
    grossVolume, setGrossVolume,
    netVolume, setNetVolume,
    newCustomers, setNewCustomers,
    selectedPaymentId,
    paymentName, setPaymentName,
    paymentAmount, setPaymentAmount,
    paymentDate, setPaymentDate,
    onSavePayment
}) => {
    const handleRandomize = () => {
        const gross = Math.floor(Math.random() * 990000) + 10000; // $10k - $1M
        const net = Math.floor(gross * (0.90 + Math.random() * 0.06)); // 90–96% of gross
        const customers = Math.floor(Math.random() * 190) + 10; // 10–200
        setGrossVolume(gross.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        setNetVolume(net.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        setNewCustomers(customers.toString());
    };

    return (
        <div className="bd-controls">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ color: 'white', margin: 0 }}>Dashboard Controls</h3>
                <button
                    onClick={handleRandomize}
                    style={{ background: 'linear-gradient(135deg,#635bff,#4f46e5)', color: 'white', border: 'none', padding: '7px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                >
                    🎲 Randomize
                </button>
            </div>

            <div style={{ marginBottom: 20 }}>
                <div style={{ color: '#aab7c4', fontSize: '13px', textTransform: 'uppercase', marginBottom: 10 }}>Global Metrics</div>

                <div style={{ marginBottom: 15 }}>
                    <label style={{ display: 'block', color: 'white', marginBottom: 5 }}>Gross Volume ($)</label>
                    <input
                        className="control-input"
                        value={grossVolume}
                        onChange={(e) => setGrossVolume(e.target.value)}
                    />
                    <div style={{ fontSize: '12px', color: '#635bff', marginTop: 4 }}>
                        * Changing this automates graphs
                    </div>
                </div>

                <div style={{ marginBottom: 15 }}>
                    <label style={{ display: 'block', color: 'white', marginBottom: 5 }}>Net Volume ($)</label>
                    <input
                        className="control-input"
                        value={netVolume}
                        onChange={(e) => setNetVolume(e.target.value)}
                    />
                </div>

                <div style={{ marginBottom: 15 }}>
                    <label style={{ display: 'block', color: 'white', marginBottom: 5 }}>New Customers</label>
                    <input
                        className="control-input"
                        value={newCustomers}
                        onChange={(e) => setNewCustomers(e.target.value)}
                    />
                </div>
            </div>

            {selectedPaymentId && (
                <div style={{ borderTop: '1px solid #333', paddingTop: 20 }}>
                    <div style={{ color: '#635bff', fontSize: '13px', textTransform: 'uppercase', marginBottom: 10 }}>
                        Editing Selected Payment
                    </div>

                    <div style={{ marginBottom: 15 }}>
                        <label style={{ display: 'block', color: 'white', marginBottom: 5 }}>Customer Name</label>
                        <input
                            className="control-input"
                            value={paymentName}
                            onChange={(e) => setPaymentName(e.target.value)}
                        />
                    </div>

                    <div style={{ marginBottom: 15 }}>
                        <label style={{ display: 'block', color: 'white', marginBottom: 5 }}>Amount ($)</label>
                        <input
                            className="control-input"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                        />
                    </div>

                    <div style={{ marginBottom: 15 }}>
                        <label style={{ display: 'block', color: 'white', marginBottom: 5 }}>Date</label>
                        <input
                            className="control-input"
                            value={paymentDate}
                            onChange={(e) => setPaymentDate(e.target.value)}
                        />
                    </div>

                    <button className="control-btn" onClick={onSavePayment}>
                        Save Changes
                    </button>
                </div>
            )}

            {!selectedPaymentId && (
                <div style={{ borderTop: '1px solid #333', paddingTop: 20, color: '#666', fontStyle: 'italic' }}>
                    Click a payment row in the phone screen to edit its details here.
                </div>
            )}
        </div>
    );
};

export default BusinessControlPanel;
