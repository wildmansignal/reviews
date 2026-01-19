import React, { useState } from 'react';
import './OverviewCards.css';
import EditableField from '../EditableField';

const initialCustomers = [
    { name: 'Marco', email: 'dan@danplants.io', amount: '1,970.00' },
    { name: 'Manny Portelada', email: 'mportelada@aol.com', amount: '400.00' },
    { name: 'Sagar Vijapura', email: 's.vijapura@gmail.com', amount: '291.00' },
    { name: 'Juan Bernardo Cantu III', email: 'bernardocantu77@gmail.com', amount: '254.00' },
];

const TopCustomersCard = () => {
    const [customers, setCustomers] = useState(initialCustomers);

    const updateCustomer = (index: number, field: 'name' | 'email' | 'amount', value: string) => {
        const newCustomers = [...customers];
        newCustomers[index] = { ...newCustomers[index], [field]: value };
        setCustomers(newCustomers);
    };

    return (
        <div className="overview-card">
            <div className="card-header">
                <span className="card-title">Top customers by spend</span>
                <span className="info-icon">ⓘ</span>
                <span className="header-link">All time</span>
            </div>

            <div className="card-list">
                {customers.map((customer, index) => (
                    <div key={index} className="customer-row">
                        <div className="customer-info">
                            <EditableField
                                value={customer.name}
                                onChange={(val) => updateCustomer(index, 'name', val)}
                                className="customer-name"
                            />
                            <EditableField
                                value={customer.email}
                                onChange={(val) => updateCustomer(index, 'email', val)}
                                className="customer-email"
                            />
                        </div>
                        <EditableField
                            value={customer.amount}
                            onChange={(val) => updateCustomer(index, 'amount', val)}
                            prefix="$"
                            className="customer-amount"
                        />
                    </div>
                ))}
            </div>

            <div className="card-footer">
                <a href="#" className="view-all-link">View all</a>
            </div>
        </div>
    );
};

export default TopCustomersCard;
