export interface GeneratedMessengerData {
    messages: {
        id: number;
        text: string;
        sender: 'me' | 'them';
        isEdited?: boolean;
    }[];
    themAvatar?: string;
    headerName?: string;
}

export interface GeneratedFinanceData {
    totalBalance: string;
    transactions: {
        id: string;
        title: string;
        subtitle?: string;
        location?: string;
        date: string;
        amount: string;
    }[];
}

export interface GeneratedBusinessData {
    grossVolume: string;
    netVolume: string;
    newCustomers: string;
    payments: {
        id: string;
        amount: string;
        name: string;
        email: string;
        date: string;
        status: string;
    }[];
}

export interface GeneratedAnalyticsData {
    totalProfit: string;
    dateRange: string;
    ordersCount: string;
}

export class OpenAIService {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    private async callOpenAI(systemPrompt: string, userPrompt: string): Promise<any> {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o', // or gpt-3.5-turbo if preferred
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ],
                    response_format: { type: "json_object" }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`OpenAI API Error: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            const content = data.choices[0].message.content;
            return JSON.parse(content);
        } catch (error) {
            console.error("OpenAI Generation Failed:", error);
            throw error;
        }
    }

    async generateMessengerData(mastermindName: string): Promise<GeneratedMessengerData> {
        const systemPrompt = `You are a creative AI generator. Generate a JSON object representing a realistic conversation between a user ('me') and a student/customer ('them') who is praising a course or mastermind called "${mastermindName}".
        The Output must STRICTLY follow this Schema:
        {
            "headerName": "string (Realistic Name)",
            "messages": [
                { "id": number, "text": "string", "sender": "me" | "them" }
            ]
        }
        Generate 5-7 messages. The conversation should be enthusiastic, authentic, and specific to the success they are having. Ensure the 'me' side is supportive.`;

        const userPrompt = `Generate a conversation for "${mastermindName}".`;

        return await this.callOpenAI(systemPrompt, userPrompt);
    }

    async generateFinanceData(incomeClaim: string): Promise<GeneratedFinanceData> {
        const systemPrompt = `You are a creative AI generator. Generate a JSON object representing finance app data for a user making roughly "${incomeClaim}".
        The Output must STRICTLY follow this Schema:
        {
            "totalBalance": "string (e.g. 12,450.00)",
            "transactions": [
                { "id": "string", "title": "string", "date": "string (e.g. Jan 10, 2026)", "amount": "string (positive or negative)" }
            ]
        }
        Generate 6-8 recent transactions. Include a mix of income (e.g. Stripe, Paypal) and business expenses (e.g. Server costs, Ads). Ensure the totals aligned with the income claim request.`;

        const userPrompt = `Generate finance data for an income level of: ${incomeClaim}`;

        return await this.callOpenAI(systemPrompt, userPrompt);
    }

    async generateBusinessData(mastermindName: string, incomeClaim: string): Promise<GeneratedBusinessData> {
        const systemPrompt = `You are a creative AI generator. Generate a JSON object representing business dashboard metrics and payments for "${mastermindName}" with an income level of "${incomeClaim}".
        The Output must STRICTLY follow this Schema:
        {
            "grossVolume": "string (formatted money e.g. 15,230.00)",
            "netVolume": "string (slightly less than gross)",
            "newCustomers": "string (integer count)",
            "payments": [
                { "id": "string", "amount": "string", "name": "string", "email": "string", "date": "string", "status": "string" }
            ]
        }
        Generate 5 recent payments. Names should be realistic. Amounts should make sense for a course or digital product.`;

        const userPrompt = `Generate business dashboard data for ${mastermindName} at ${incomeClaim}.`;

        return await this.callOpenAI(systemPrompt, userPrompt);
    }

    async generateAnalyticsData(incomeClaim: string): Promise<GeneratedAnalyticsData> {
        const systemPrompt = `You are a creative AI generator. Generate a JSON object representing analytics overview data for a user making "${incomeClaim}".
        The Output must STRICTLY follow this Schema:
        {
            "totalProfit": "string (formatted money e.g. 137,987.69)",
            "dateRange": "string (e.g. Sep 21–Oct 31)",
            "ordersCount": "string (e.g. 2,039 orders)"
        }
        Ensure the profit matches the income claim roughly (maybe a monthly or quarterly view).`;

        const userPrompt = `Generate analytics data for income: ${incomeClaim}`;

        return await this.callOpenAI(systemPrompt, userPrompt);
    }
}
