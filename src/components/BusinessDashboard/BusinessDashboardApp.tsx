import React, { useState, useEffect } from 'react';
import { Home, CreditCard, Users, Plus, Search } from 'lucide-react';
import HomeScreen from './HomeScreen';
import PaymentsScreen from './PaymentsScreen';
import type { PaymentItem } from './PaymentsScreen';
import BusinessControlPanel from './BusinessControlPanel';
import './BusinessDashboard.css';

const BusinessDashboardApp = () => {
    // Navigation State
    const [activeTab, setActiveTab] = useState<'home' | 'payments' | 'customers'>('home');

    // Metrics State
    const [grossVolume, setGrossVolume] = useState("145.00");
    const [netVolume, setNetVolume] = useState("137.98");
    const [newCustomers, setNewCustomers] = useState("12");

    // Chart Data State (Simulated based on metrics)
    // We will generate chart data array based on the numeric value of grossVolume to simulate "automation"
    const [chartDataGross, setChartDataGross] = useState<number[]>([]);
    const [chartDataNet, setChartDataNet] = useState<number[]>([]);
    const [chartDataCustomers, setChartDataCustomers] = useState<number[]>([]);

    // Payments Data State
    const [payments, setPayments] = useState<PaymentItem[]>([
        { id: '1', amount: '29.00', name: 'Holly Jarrett', email: 'allrsfarm@gmail.com', date: 'Jan 11 at 8:24 AM', status: 'succeeded' },
        { id: '2', amount: '29.00', name: 'Maria jacqueline chorny l', email: 'jackeline.chorny@gmail.com', date: 'Jan 5 at 3:39 PM', status: 'succeeded' },
        { id: '3', amount: '29.00', name: 'James Doe', email: 'james.d@example.com', date: 'Jan 4 at 1:00 PM', status: 'succeeded' },
        { id: '4', amount: '29.00', name: 'Sarah Smith', email: 's.smith@example.com', date: 'Jan 3 at 9:15 AM', status: 'succeeded' },
    ]);

    // Editing State
    const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [editAmount, setEditAmount] = useState("");
    const [editDate, setEditDate] = useState("");

    // Effect: Update Charts when Metrics Change to simulate "Automation"
    useEffect(() => {
        // Parse gross volume to a number for seeding
        const seed = parseFloat(grossVolume.replace(/,/g, '')) || 100;

        // Generate pseudo-random chart data that "scales" with the volume
        const generateChart = (baseValue: number, volatility: number) => {
            return Array.from({ length: 15 }, (_, i) => {
                // Random variation relative to base value
                const randomFactor = 0.5 + Math.random();
                return Math.max(0, (baseValue / 10) * randomFactor * (i % 2 === 0 ? 1.5 : 0.5));
            });
        };

        setChartDataGross(generateChart(seed, 0.5));
        setChartDataNet(generateChart(parseFloat(netVolume) || seed * 0.9, 0.5));
        setChartDataCustomers(generateChart(parseInt(newCustomers) || 10, 0.5));

    }, [grossVolume, netVolume, newCustomers]);

    // Handlers
    const handleSelectPayment = (id: string) => {
        const payment = payments.find(p => p.id === id);
        if (payment) {
            setSelectedPaymentId(id);
            setEditName(payment.name);
            setEditAmount(payment.amount);
            setEditDate(payment.date);
            setActiveTab('payments'); // Ensure we stay on payments
        }
    };

    const handleSavePayment = () => {
        if (selectedPaymentId) {
            setPayments(prev => prev.map(p =>
                p.id === selectedPaymentId
                    ? { ...p, name: editName, amount: editAmount, date: editDate }
                    : p
            ));
            // Optional: deselect or keep selected
            // setSelectedPaymentId(null); 
        }
    };

    return (
        <div className="bd-app-container">
            {/* Left: Controls */}
            <BusinessControlPanel
                grossVolume={grossVolume} setGrossVolume={setGrossVolume}
                netVolume={netVolume} setNetVolume={setNetVolume}
                newCustomers={newCustomers} setNewCustomers={setNewCustomers}
                selectedPaymentId={selectedPaymentId}
                paymentName={editName} setPaymentName={setEditName}
                paymentAmount={editAmount} setPaymentAmount={setEditAmount}
                paymentDate={editDate} setPaymentDate={setEditDate}
                onSavePayment={handleSavePayment}
            />

            {/* Right: Phone Frame */}
            <div className="bd-phone-frame">
                {/* Header */}
                <div className="bd-header">
                    <div className="bd-icon-btn">
                        <Home size={18} />
                    </div>
                    <div className="bd-header-title">
                        {activeTab === 'home' ? 'Home' :
                            activeTab === 'payments' ? 'Payments' : 'Customers'}
                    </div>
                    <div className="bd-icon-btn primary">
                        <Plus size={18} />
                    </div>
                </div>

                {/* Main Content Area */}
                {activeTab === 'home' && (
                    <HomeScreen
                        grossVolume={grossVolume}
                        netVolume={netVolume}
                        newCustomers={newCustomers}
                        chartDataGross={chartDataGross}
                        chartDataNet={chartDataNet}
                        chartDataCustomers={chartDataCustomers}
                    />
                )}

                {activeTab === 'payments' && (
                    <PaymentsScreen
                        payments={payments}
                        onSelectPayment={handleSelectPayment}
                    />
                )}

                {activeTab === 'customers' && (
                    <div className="bd-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#666' }}>
                        Customer List Placeholder
                    </div>
                )}

                {/* Bottom Navigation */}
                <div className="bd-bottom-nav">
                    <div
                        className={`bd-nav-item ${activeTab === 'home' ? 'active' : ''}`}
                        onClick={() => setActiveTab('home')}
                    >
                        <Home size={24} />
                        Home
                    </div>
                    <div
                        className={`bd-nav-item ${activeTab === 'payments' ? 'active' : ''}`}
                        onClick={() => setActiveTab('payments')}
                    >
                        <CreditCard size={24} />
                        Payments
                    </div>
                    <div
                        className={`bd-nav-item ${activeTab === 'customers' ? 'active' : ''}`}
                        onClick={() => setActiveTab('customers')}
                    >
                        <Users size={24} />
                        Customers
                    </div>
                    <div className="bd-nav-item">
                        <Search size={24} />
                        Search
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessDashboardApp;
