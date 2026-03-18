import React from 'react';
import { Check } from 'lucide-react';
import './BusinessDashboard.css';

export interface PaymentItem {
    id: string;
    amount: string;
    name: string;
    email: string;
    date: string;
    status: 'succeeded';
}

interface PaymentsScreenProps {
    payments: PaymentItem[];
    onSelectPayment: (id: string) => void;
    scrollRef?: React.RefObject<HTMLDivElement | null>;
}

const PaymentsScreen: React.FC<PaymentsScreenProps> = ({ payments, onSelectPayment, scrollRef }) => {
    return (
        <div
            ref={scrollRef}
            className="bd-content"
            style={{
                marginTop: 0,
                overflowY: 'scroll',
                height: '100%',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
            } as React.CSSProperties}
        >
            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: 15, margin: '16px 0 12px', borderBottom: '1px solid #2e3548', paddingBottom: 10 }}>
                <span style={{ color: '#635bff', fontWeight: 600, borderBottom: '2px solid #635bff', paddingBottom: 10 }}>Payments</span>
                <span style={{ color: '#aab7c4', fontWeight: 600 }}>Invoices</span>
                <span style={{ color: '#aab7c4', fontWeight: 600 }}>Subscriptions</span>
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
                <span style={{ background: '#2d2e3f', padding: '4px 12px', borderRadius: 12, fontSize: 13, color: 'white' }}>Status</span>
                <span style={{ background: '#2d2e3f', padding: '4px 12px', borderRadius: 12, fontSize: 13, color: 'white' }}>Created</span>
            </div>

            {payments.map(payment => (
                <div key={payment.id} className="bd-payment-row" onClick={() => onSelectPayment(payment.id)}>
                    <div className="bd-status-icon success">
                        <Check size={16} strokeWidth={3} />
                    </div>

                    <div className="bd-payment-info">
                        <div className="bd-payment-amount">${payment.amount} succeeded</div>
                        <div className="bd-payment-sub">Subscription update</div>
                        <div className="bd-payment-sub" style={{ color: 'white' }}>{payment.name}</div>
                        {/* Blurred email */}
                        <div
                            className="bd-payment-sub"
                            style={{
                                filter: 'blur(4px)',
                                userSelect: 'none',
                                pointerEvents: 'none',
                            }}
                        >
                            {payment.email}
                        </div>
                        <div className="bd-payment-sub">{payment.date}</div>
                    </div>

                    <div className="bd-arrow-right">›</div>
                </div>
            ))}
            {/* Bottom padding so last item isn't clipped by nav */}
            <div style={{ height: 80 }} />
        </div>
    );
};

export default PaymentsScreen;
