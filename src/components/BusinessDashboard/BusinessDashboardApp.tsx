import { useState, useRef, useEffect } from 'react';
import { Home, CreditCard, Users, Plus, Search, Play, Pause } from 'lucide-react';
import HomeScreen from './HomeScreen';
import PaymentsScreen from './PaymentsScreen';
import type { PaymentItem } from './PaymentsScreen';
import BusinessControlPanel from './BusinessControlPanel';
import { useGenerationContext } from '../../contexts/GenerationContext';
import './BusinessDashboard.css';

// ── Name pool ──────────────────────────────────────────────────────────────
const FIRST_NAMES = [
    'James', 'Maria', 'David', 'Sarah', 'Michael', 'Emily', 'Robert', 'Jessica', 'William', 'Amanda',
    'John', 'Ashley', 'Christopher', 'Stephanie', 'Daniel', 'Rebecca', 'Matthew', 'Sharon', 'Anthony', 'Laura',
    'Mark', 'Cynthia', 'Donald', 'Kathleen', 'Steven', 'Dorothy', 'Paul', 'Christine', 'Andrew', 'Diane',
    'Joshua', 'Ruth', 'Kenneth', 'Virginia', 'Kevin', 'Helen', 'Brian', 'Janet', 'George', 'Catherine',
    'Timothy', 'Debra', 'Ronald', 'Carol', 'Edward', 'Maria', 'Jason', 'Patricia', 'Jeffrey', 'Rachel',
    'Ryan', 'Linda', 'Jacob', 'Barbara', 'Gary', 'Carol', 'Nicholas', 'Angela', 'Eric', 'Melissa',
    'Stephen', 'Brenda', 'Jonathan', 'Amy', 'Scott', 'Amy', 'Frank', 'Anna', 'Justin', 'Tamara',
    'Brandon', 'Heather', 'Raymond', 'Brittany', 'Gregory', 'Christine', 'Lawrence', 'Kelly', 'Samuel', 'Amy',
];
const LAST_NAMES = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Wilson', 'Martinez',
    'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
    'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Hall',
    'Allen', 'Torres', 'Nelson', 'King', 'Scott', 'Baker', 'Carter', 'Mitchell', 'Evans', 'Turner',
    'Collins', 'Roberts', 'Morris', 'Phillips', 'Jenkins', 'Patterson', 'Howard', 'Stewart', 'Gray', 'Wells',
    'Bennett', 'Brooks', 'Ross', 'Coleman', 'Richardson', 'Cruz', 'Reed', 'Bailey', 'Cooper', 'Rogers',
];
const AMOUNTS = [500, 750, 1000, 1250, 1500, 2000, 2500, 3000, 5000, 7500, 10000];

function generatePayments(): PaymentItem[] {
    const payments: PaymentItem[] = [];
    const now = new Date(2026, 2, 18, 14, 0, 0); // Current date
    const msInMonth = 30 * 24 * 60 * 60 * 1000;

    const usedNames = new Set<string>();

    for (let i = 0; i < 50; i++) {
        let firstName: string, lastName: string, fullName: string;
        // Ensure somewhat unique names
        do {
            firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
            lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
            fullName = `${firstName} ${lastName}`;
        } while (usedNames.has(fullName) && usedNames.size < FIRST_NAMES.length * LAST_NAMES.length);
        usedNames.add(fullName);

        const amount = AMOUNTS[Math.floor(Math.random() * AMOUNTS.length)];
        const emailUser = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 999)}`;
        const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];
        const email = `${emailUser}@${domains[Math.floor(Math.random() * domains.length)]}`;

        // Spread payments across the past 30 days, newest first
        const msOffset = (i / 50) * msInMonth;
        const paymentDate = new Date(now.getTime() - msOffset);
        const dateStr = paymentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const timeStr = paymentDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

        payments.push({
            id: String(i + 1),
            amount: amount.toLocaleString('en-US', { minimumFractionDigits: 2 }),
            name: fullName,
            email,
            date: `${dateStr} at ${timeStr}`,
            status: 'succeeded',
        });
    }
    return payments;
}

const BusinessDashboardApp = () => {
    const { data } = useGenerationContext();
    const [activeTab, setActiveTab] = useState<'home' | 'payments' | 'customers'>('home');
    const [grossVolume, setGrossVolume] = useState("145.00");
    const [netVolume, setNetVolume] = useState("137.98");
    const [newCustomers, setNewCustomers] = useState("12");
    const [chartDataGross, setChartDataGross] = useState<number[]>([]);
    const [chartDataNet, setChartDataNet] = useState<number[]>([]);
    const [chartDataCustomers, setChartDataCustomers] = useState<number[]>([]);
    const [payments, setPayments] = useState<PaymentItem[]>(generatePayments);

    // Play / scroll state
    const [isScrollPlaying, setIsScrollPlaying] = useState(false);
    const paymentsScrollRef = useRef<HTMLDivElement>(null);
    const animFrameRef = useRef<number | null>(null);

    useEffect(() => {
        if (data.business) {
            if (data.business.grossVolume) setGrossVolume(data.business.grossVolume);
            if (data.business.netVolume) setNetVolume(data.business.netVolume);
            if (data.business.newCustomers) setNewCustomers(data.business.newCustomers);
            if (data.business.payments) setPayments(data.business.payments as any);
        }
    }, [data.business]);

    const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [editAmount, setEditAmount] = useState("");
    const [editDate, setEditDate] = useState("");

    useEffect(() => {
        const seed = parseFloat(grossVolume.replace(/,/g, '')) || 100;
        const generateChart = (baseValue: number) =>
            Array.from({ length: 15 }, (_, i) => {
                const randomFactor = 0.5 + Math.random();
                return Math.max(0, (baseValue / 10) * randomFactor * (i % 2 === 0 ? 1.5 : 0.5));
            });
        setChartDataGross(generateChart(seed));
        setChartDataNet(generateChart(parseFloat(netVolume) || seed * 0.9));
        setChartDataCustomers(generateChart(parseInt(newCustomers) || 10));
    }, [grossVolume, netVolume, newCustomers]);

    // Auto-scroll animation
    const animate = () => {
        const el = paymentsScrollRef.current;
        if (!el) return;
        el.scrollTop += 1.2;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
            setIsScrollPlaying(false);
            return;
        }
        animFrameRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        if (isScrollPlaying && activeTab === 'payments') {
            animFrameRef.current = requestAnimationFrame(animate);
        } else {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        }
        return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
    }, [isScrollPlaying, activeTab]);

    const handleSelectPayment = (id: string) => {
        const payment = payments.find(p => p.id === id);
        if (payment) {
            setSelectedPaymentId(id);
            setEditName(payment.name);
            setEditAmount(payment.amount);
            setEditDate(payment.date);
            setActiveTab('payments');
        }
    };

    const handleSavePayment = () => {
        if (selectedPaymentId) {
            setPayments(prev => prev.map(p =>
                p.id === selectedPaymentId
                    ? { ...p, name: editName, amount: editAmount, date: editDate }
                    : p
            ));
        }
    };

    const handleRegeneratePayments = () => {
        setPayments(generatePayments());
        setSelectedPaymentId(null);
        if (paymentsScrollRef.current) paymentsScrollRef.current.scrollTop = 0;
        setIsScrollPlaying(false);
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
                onRegeneratePayments={handleRegeneratePayments}
            />

            {/* Right: Phone frame + play button */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>

                {/* Play button — only visible when on payments tab */}
                {activeTab === 'payments' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button
                            onClick={() => {
                                if (!isScrollPlaying && paymentsScrollRef.current) {
                                    paymentsScrollRef.current.scrollTop = 0;
                                }
                                setIsScrollPlaying(p => !p);
                            }}
                            style={{
                                background: isScrollPlaying
                                    ? 'linear-gradient(135deg,#ef4444,#dc2626)'
                                    : 'linear-gradient(135deg,#22c55e,#16a34a)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 30,
                                padding: '10px 24px',
                                fontSize: 14,
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                            }}
                        >
                            {isScrollPlaying ? <><Pause size={16} /> Stop Recording Scroll</> : <><Play size={16} /> ▶ Play (Screen Record This)</>}
                        </button>
                        <button
                            onClick={handleRegeneratePayments}
                            style={{
                                background: 'linear-gradient(135deg,#635bff,#4f46e5)',
                                color: 'white', border: 'none', borderRadius: 20,
                                padding: '8px 16px', fontSize: 13, fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            🎲 New List
                        </button>
                    </div>
                )}

                {/* Phone Frame */}
                <div className="bd-phone-frame">
                    <div className="bd-header">
                        <div className="bd-icon-btn"><Home size={18} /></div>
                        <div className="bd-header-title">
                            {activeTab === 'home' ? 'Home' : activeTab === 'payments' ? 'Payments' : 'Customers'}
                        </div>
                        <div className="bd-icon-btn primary"><Plus size={18} /></div>
                    </div>

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
                            scrollRef={paymentsScrollRef}
                        />
                    )}
                    {activeTab === 'customers' && (
                        <div className="bd-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#666' }}>
                            Customer List Placeholder
                        </div>
                    )}

                    <div className="bd-bottom-nav">
                        <div className={`bd-nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
                            <Home size={24} />Home
                        </div>
                        <div className={`bd-nav-item ${activeTab === 'payments' ? 'active' : ''}`} onClick={() => setActiveTab('payments')}>
                            <CreditCard size={24} />Payments
                        </div>
                        <div className={`bd-nav-item ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => setActiveTab('customers')}>
                            <Users size={24} />Customers
                        </div>
                        <div className="bd-nav-item">
                            <Search size={24} />Search
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessDashboardApp;
