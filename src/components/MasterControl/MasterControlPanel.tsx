import React from 'react';
import { useGenerationContext } from '../../contexts/GenerationContext';
import './MasterControl.css';

const MasterControlPanel = () => {
    const { config, setConfig, generateAll, isGenerating, data, resetData } = useGenerationContext();

    const handleChange = (field: keyof typeof config) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfig(prev => ({ ...prev, [field]: e.target.value }));
    };

    return (
        <div className="master-control-container">
            <div className="master-header">
                <h1>AI Content Generator</h1>
                <p>One Click. Infinite Social Proof.</p>
            </div>

            <div className="master-section">
                <div className="section-title">Configuration</div>

                <div className="input-group">
                    <label>OpenAI API Key</label>
                    <input
                        type="password"
                        className="master-input"
                        value={config.apiKey}
                        onChange={handleChange('apiKey')}
                        placeholder="sk-..."
                    />
                </div>

                <div className="input-group">
                    <label>Mastermind Name</label>
                    <input
                        type="text"
                        className="master-input"
                        value={config.mastermindName}
                        onChange={handleChange('mastermindName')}
                        placeholder="e.g. Code On Fire"
                    />
                </div>

                <div className="input-group">
                    <label>Income / Success Claim</label>
                    <input
                        type="text"
                        className="master-input"
                        value={config.incomeClaim}
                        onChange={handleChange('incomeClaim')}
                        placeholder="e.g. $100k/year"
                    />
                </div>
            </div>

            <div className="master-section">
                <div className="section-title">Generation Status</div>
                <div className="status-grid">
                    <div className="status-item">
                        <span>Messenger</span>
                        <div className={`status-indicator ${data.messenger ? 'ready' : ''}`} />
                    </div>
                    <div className="status-item">
                        <span>Finance App</span>
                        <div className={`status-indicator ${data.finance ? 'ready' : ''}`} />
                    </div>
                    <div className="status-item">
                        <span>Business Dashboard</span>
                        <div className={`status-indicator ${data.business ? 'ready' : ''}`} />
                    </div>
                </div>
            </div>

            <div className="action-bar">
                <button
                    className="generate-btn"
                    onClick={generateAll}
                    disabled={isGenerating || !config.apiKey}
                >
                    {isGenerating ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                            <span className="loading-spinner"></span> Generating...
                        </span>
                    ) : 'GENERATE ALL CONTENT'}
                </button>

                <button className="reset-btn" onClick={resetData} disabled={isGenerating}>
                    Reset Data
                </button>
            </div>
        </div>
    );
};

export default MasterControlPanel;
