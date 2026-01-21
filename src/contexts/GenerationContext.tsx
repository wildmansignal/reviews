import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { OpenAIService, type GeneratedMessengerData, type GeneratedFinanceData, type GeneratedBusinessData, type GeneratedAnalyticsData } from '../services/OpenAIService';

interface GenerationConfig {
    apiKey: string;
    mastermindName: string;
    incomeClaim: string;
}

interface GeneratedData {
    messenger?: GeneratedMessengerData;
    finance?: GeneratedFinanceData;
    business?: GeneratedBusinessData;
    analytics?: GeneratedAnalyticsData;
}

interface GenerationContextType {
    config: GenerationConfig;
    setConfig: React.Dispatch<React.SetStateAction<GenerationConfig>>;
    data: GeneratedData;
    isGenerating: boolean;
    generateAll: () => Promise<void>;
    resetData: () => void;
}

const GenerationContext = createContext<GenerationContextType | undefined>(undefined);

export const GenerationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // initialize from local storage if available
    const [config, setConfig] = useState<GenerationConfig>(() => {
        const saved = localStorage.getItem('gen_config');
        return saved ? JSON.parse(saved) : { apiKey: '', mastermindName: 'Code On Fire', incomeClaim: '$100k/year' };
    });

    const [data, setData] = useState<GeneratedData>(() => {
        const savedData = localStorage.getItem('gen_data');
        return savedData ? JSON.parse(savedData) : {};
    });

    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        localStorage.setItem('gen_config', JSON.stringify(config));
    }, [config]);

    useEffect(() => {
        localStorage.setItem('gen_data', JSON.stringify(data));
    }, [data]);

    const generateAll = async () => {
        if (!config.apiKey) {
            alert("Please enter an OpenAI API Key");
            return;
        }

        setIsGenerating(true);
        const service = new OpenAIService(config.apiKey);

        try {
            // Parallelize generation requests
            const [messengerData, financeData, businessData, analyticsData] = await Promise.all([
                service.generateMessengerData(config.mastermindName),
                service.generateFinanceData(config.incomeClaim),
                service.generateBusinessData(config.mastermindName, config.incomeClaim),
                service.generateAnalyticsData(config.incomeClaim)
            ]);

            setData({
                messenger: messengerData,
                finance: financeData,
                business: businessData,
                analytics: analyticsData
            });

        } catch (error) {
            console.error("Generation failed", error);
            alert("Generation failed. Check console for details.");
        } finally {
            setIsGenerating(false);
        }
    };

    const resetData = () => {
        setData({});
        localStorage.removeItem('gen_data');
    };

    return (
        <GenerationContext.Provider value={{ config, setConfig, data, isGenerating, generateAll, resetData }}>
            {children}
        </GenerationContext.Provider>
    );
};

export const useGenerationContext = () => {
    const context = useContext(GenerationContext);
    if (context === undefined) {
        throw new Error('useGenerationContext must be used within a GenerationProvider');
    }
    return context;
};
