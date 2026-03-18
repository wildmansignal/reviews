// OpenAI service for generating reviews, names, and avatars

const getApiKey = () => {
    const key = import.meta.env.VITE_OPENAI_API_KEY;
    if (!key) throw new Error('OpenAI API key not found in .env');
    return key;
};

export interface GeneratedReview {
    name: string;
    avatarUrl: string;
    review: string;
    likes: number;
    comments: number;
    shares: number;
    timestamp: string;
}

// Realistic engagement — much lower to feel organic
export function generateEngagementStats() {
    return {
        likes: Math.floor(Math.random() * 120) + 8,      // 8–128
        comments: Math.floor(Math.random() * 25) + 1,     // 1–26
        shares: Math.floor(Math.random() * 15) + 0,       // 0–15
    };
}

// Realistic first names and last names pool
const FIRST_NAMES = [
    'Jessica', 'Michael', 'Amanda', 'Brandon', 'Sarah', 'Chris', 'Melissa',
    'Derek', 'Tiffany', 'Jason', 'Ashley', 'Tyler', 'Lauren', 'Justin', 'Nicole',
    'Ryan', 'Brittany', 'Kevin', 'Heather', 'Nathan', 'Amber', 'Andrew', 'Megan',
    'Travis', 'Courtney', 'Kyle', 'Crystal', 'Sean', 'Danielle', 'Cody',
    'Kayla', 'Aaron', 'Samantha', 'Eric', 'Rachel', 'Adam', 'Chelsea', 'Josh',
    'Alyssa', 'Marcus', 'Vanessa', 'DaVonte', 'Shanice', 'Terrell', 'Latoya',
    'Carlos', 'Maria', 'Miguel', 'Isabel', 'Robert', 'Patricia', 'James', 'Linda',
    'Darnell', 'Keisha', 'DeShawn', 'Tanya', 'Victor', 'Alicia', 'Todd', 'Diane',
    'Blake', 'Lindsey', 'Wesley', 'Monique', 'Seth', 'Brooke', 'Chad', 'Lacey'
];

const LAST_NAMES = [
    'Johnson', 'Williams', 'Smith', 'Brown', 'Davis', 'Miller', 'Wilson',
    'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris',
    'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez',
    'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'Hernandez', 'King',
    'Wright', 'Lopez', 'Hill', 'Scott', 'Green', 'Adams', 'Baker', 'Gonzalez',
    'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips',
    'Campbell', 'Parker', 'Evans', 'Edwards', 'Collins', 'Stewart', 'Sanchez',
    'Morris', 'Rogers', 'Reed', 'Cook', 'Morgan', 'Bell', 'Murphy', 'Bailey'
];

export function generateRandomName(): string {
    const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    return `${first} ${last}`;
}

export function generateRandomTimestamp(): string {
    const options = ['2h', '3h', '5h', '6h', '8h', '12h', '1d', '2d', '3d', '4d', '1w'];
    return options[Math.floor(Math.random() * options.length)];
}

const INCOME_AMOUNTS = [
    '$10,000', '$12,000', '$15,000', '$18,000', '$20,000', '$22,000', '$25,000',
    '$28,000', '$30,000', '$35,000', '$40,000', '$45,000', '$50,000', '$55,000',
    '$60,000', '$65,000', '$70,000', '$75,000', '$80,000', '$90,000', '$100,000',
    '$110,000', '$120,000', '$130,000', '$150,000'
];

function getRandomIncome(): string {
    return INCOME_AMOUNTS[Math.floor(Math.random() * INCOME_AMOUNTS.length)];
}

// Review templates — minimal emojis, conversational and real
const REVIEW_TEMPLATES = [
    (income: string) => `I was honestly skeptical at first but Dan's Code On Fire system changed everything for me. Went from struggling to consistently making ${income} a month. The strategies make sense once you actually go through the training and the community support is genuinely helpful. Highly recommend to anyone who is serious about changing their situation.`,

    (income: string) => `Not usually the type to post about stuff like this but I have to share. Started Dan's Code On Fire program about 4 months ago. Hit ${income} this month. I cried when I saw my account balance. Dan actually responds and the training is step by step. This is the real deal.`,

    (income: string) => `3 months in and already making ${income} a month with Code On Fire. Dan's system works, plain and simple. I've tried other programs and nothing came close. The support alone is worth it. Thank you Dan for actually caring about your students' results.`,

    (income: string) => `Just hit ${income} this month using Dan's Code On Fire method. Been doing this about 6 months now and the consistency is incredible. Started at zero with zero experience. If I can do it anyone can. Don't sleep on this program.`,

    (income: string) => `Real talk, Code On Fire saved me. Was about to give up on making money online until a friend told me about Dan. 5 months later I'm making ${income} every month. My wife doesn't have to work anymore. This program is genuinely life changing.`,

    (income: string) => `Dan's system is different because he doesn't just show you what to do, he explains why it works. 7 months in and I'm at ${income} a month. The best investment I've ever made, no question. If you're serious about financial freedom get into Code On Fire.`,

    (income: string) => `Wasn't sure this was for me but I joined Code On Fire 3 months ago and just had my first ${income} month. Dan literally walks you through everything. The step by step training is so clear. My only regret is not finding this sooner.`,

    (income: string) => `${income} per month. That's where I'm at now thanks to Dan and Code On Fire. Went from working 60 hour weeks to this. The system works, you just have to put in the effort and follow the training. Dan genuinely wants you to win.`,

    (income: string) => `I've spent thousands on programs over the years. Code On Fire is the only one that actually delivered real results. Dan knows what he's talking about and the results speak for themselves. I'm at ${income} a month now and growing every week.`,

    (income: string) => `Never thought I'd post something like this but here we are. Dan's Code On Fire method has me bringing in ${income} per month now. My friends don't believe me until I show them the actual numbers. This program has completely changed my life trajectory.`,

    (income: string) => `6 weeks into Code On Fire and already seeing ${income} months. Dan keeps it real, no hype, no fluff, just a proven system that delivers. If you're on the fence just do it, you won't regret it.`,

    (income: string) => `Can we appreciate Dan for a second. This man genuinely changed my financial situation. Code On Fire gave me the tools to build a ${income}/month income from scratch. The community is supportive and Dan himself is always available. This is what a real program looks like.`,

    (income: string) => `Doing ${income} a month now because of Dan. Started from nothing, no tech background, no experience. Code On Fire laid it all out for me step by step. If you're tired of the 9 to 5 grind this is the move.`,

    (income: string) => `My boyfriend kept telling me to look into Dan's Code On Fire and I finally did. Best decision I ever made. I'm now consistently at ${income} a month. The training is thorough and Dan is literally the most accessible mentor I've ever had.`,

    (income: string) => `Look I don't normally leave reviews but after hitting ${income} this month with Code On Fire I felt like I had to say something. Dan is the real thing. The system works. I wish I had found this 2 years ago honestly.`,
];

// Get avatar — use local folder first if available, else DiceBear
export function getAvatarUrl(name: string, index: number): string {
    // Try to use a local avatar from /avatars/ folder if images exist (user adds them)
    // We rotate through potential filenames: avatar1.jpg through avatar20.jpg
    const localCount = 20; // assume up to 20 local avatars
    const localIndex = (index % localCount) + 1;

    // We'll always fall back to DiceBear since we can't know what files exist at runtime
    // The user can override avatars by using the upload button on individual posts
    const seed = encodeURIComponent(name + index);
    return `https://api.dicebear.com/7.x/personas/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf,d4e6f1`;

    // Note: to use local avatars, user should add images to /public/avatars/
    // and they can be referenced as /avatars/avatar1.jpg etc.
    void localIndex; // suppress unused warning
}

// Generate reviews using local templates (fast, no API needed)
export async function generateBatchReviews(count: number): Promise<GeneratedReview[]> {
    const reviews: GeneratedReview[] = [];

    for (let i = 0; i < count; i++) {
        const name = generateRandomName();
        const income = getRandomIncome();
        const template = REVIEW_TEMPLATES[i % REVIEW_TEMPLATES.length];
        const review = template(income);
        const stats = generateEngagementStats();

        reviews.push({
            name,
            avatarUrl: getAvatarUrl(name, i),
            review,
            likes: stats.likes,
            comments: stats.comments,
            shares: stats.shares,
            timestamp: generateRandomTimestamp(),
        });
    }

    return reviews;
}

// Generate a single AI review via OpenAI
export async function generateAIReview(name: string): Promise<string> {
    const apiKey = getApiKey();
    const income = getRandomIncome();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `You write authentic-sounding Facebook testimonial posts from real everyday people.
Rules:
- Write casually, like a real person posting on Facebook to their friends
- NO hashtags
- Use at most ONE emoji in the entire post, or none at all — most posts should have zero emojis
- Keep it 70–160 words
- Sound genuinely excited but grounded, not salesy or over-the-top
- Mention Dan by name and Code On Fire
- Include the income amount: ${income}/month or ${income} a month
- The person should mention a detail that makes it feel personal (e.g. their old job, their spouse, a timeframe, their skepticism at first)
- Do NOT use exclamation marks more than once per post
- No ALL CAPS words`
                },
                {
                    role: 'user',
                    content: `Write a Facebook testimonial post from ${name} about Dan's Code On Fire program. They made ${income} this month.`
                }
            ],
            max_tokens: 220,
            temperature: 0.85,
        }),
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`OpenAI error: ${err}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
}

// Generate multiple AI reviews in parallel batches
export async function generateAIBatchReviews(
    count: number,
    onProgress?: (done: number, total: number) => void
): Promise<GeneratedReview[]> {
    const reviews: GeneratedReview[] = [];
    const BATCH_SIZE = 5;

    for (let i = 0; i < count; i += BATCH_SIZE) {
        const batchSize = Math.min(BATCH_SIZE, count - i);
        const batch = Array.from({ length: batchSize }, (_, j) => {
            const name = generateRandomName();
            const stats = generateEngagementStats();
            return { name, avatarUrl: getAvatarUrl(name, i + j), stats };
        });

        const texts = await Promise.all(
            batch.map(async (b) => {
                try {
                    return await generateAIReview(b.name);
                } catch {
                    // Fallback to template if API fails
                    const income = getRandomIncome();
                    return REVIEW_TEMPLATES[Math.floor(Math.random() * REVIEW_TEMPLATES.length)](income);
                }
            })
        );

        batch.forEach((b, j) => {
            reviews.push({
                name: b.name,
                avatarUrl: b.avatarUrl,
                review: texts[j],
                likes: b.stats.likes,
                comments: b.stats.comments,
                shares: b.stats.shares,
                timestamp: generateRandomTimestamp(),
            });
        });

        if (onProgress) onProgress(Math.min(i + BATCH_SIZE, count), count);
    }

    return reviews;
}

// ─── AI Generators for other dashboards ────────────────────────────────────

export interface GeneratedBusinessData {
    grossVolume: string;
    netVolume: string;
    newCustomers: string;
    customerName: string;
    customerEmail: string;
    period: string;
}

export async function generateBusinessDashboardData(): Promise<GeneratedBusinessData> {
    const apiKey = getApiKey();
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{
                role: 'user',
                content: `Generate realistic Stripe-style dashboard data for an online coaching/course business. Return ONLY valid JSON, no markdown:
{
  "grossVolume": "XXXX.XX",
  "netVolume": "XXXX.XX",
  "newCustomers": "XX",
  "customerName": "Full Name",
  "customerEmail": "email@example.com",
  "period": "Sep 21 - Oct 31"
}
Make gross volume between $5,000-$50,000. Net volume should be ~93% of gross. New customers 8-80.`
            }],
            max_tokens: 200,
            temperature: 0.9,
        }),
    });
    const data = await response.json();
    const raw = data.choices[0].message.content.trim().replace(/```json|```/g, '');
    return JSON.parse(raw);
}

export interface GeneratedAnalyticsData {
    sessions: string;
    pageViews: string;
    bounceRate: string;
    avgDuration: string;
    conversionRate: string;
    topSource: string;
    revenue: string;
}

export async function generateAnalyticsDashboardData(): Promise<GeneratedAnalyticsData> {
    const apiKey = getApiKey();
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{
                role: 'user',
                content: `Generate realistic Google Analytics style data for a successful online business. Return ONLY valid JSON, no markdown:
{
  "sessions": "X,XXX",
  "pageViews": "XX,XXX",
  "bounceRate": "XX.X%",
  "avgDuration": "X:XX",
  "conversionRate": "X.X%",
  "topSource": "Organic Search",
  "revenue": "$XX,XXX.XX"
}
Make it look like a thriving online business. Sessions 2000-15000.`
            }],
            max_tokens: 200,
            temperature: 0.9,
        }),
    });
    const data = await response.json();
    const raw = data.choices[0].message.content.trim().replace(/```json|```/g, '');
    return JSON.parse(raw);
}

export interface GeneratedTikTokComments {
    comments: Array<{ username: string; text: string; likes: string; }>;
    totalComments: string;
    totalLikes: string;
}

export async function generateTikTokComments(): Promise<GeneratedTikTokComments> {
    const apiKey = getApiKey();
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{
                role: 'user',
                content: `Generate realistic TikTok comments for a video about making money online / Code On Fire by Dan. 
Return ONLY valid JSON, no markdown:
{
  "comments": [
    {"username": "tiktok_handle", "text": "comment text with 1-2 emojis max", "likes": "XX"},
    ...4 more comments
  ],
  "totalComments": "X,XXX",
  "totalLikes": "XX.XK"
}
Make usernames look realistic (lowercase, numbers, underscores). Comments should be 5-20 words, casual TikTok style. 1-2 emojis max per comment. Likes between 10-500.`
            }],
            max_tokens: 400,
            temperature: 0.9,
        }),
    });
    const data = await response.json();
    const raw = data.choices[0].message.content.trim().replace(/```json|```/g, '');
    return JSON.parse(raw);
}

export interface GeneratedYouTubeComments {
    comments: Array<{ handle: string; text: string; likes: string; timeAgo: string; }>;
}

export async function generateYouTubeComments(): Promise<GeneratedYouTubeComments> {
    const apiKey = getApiKey();
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{
                role: 'user',
                content: `Generate realistic YouTube comments for a video about Dan's Code On Fire program / making money online. People sharing their results.
Return ONLY valid JSON, no markdown:
{
  "comments": [
    {"handle": "@username123", "text": "comment text, no emojis or max 1", "likes": "XX", "timeAgo": "Xy ago"},
    ...4 more
  ]
}
Handles start with @. Likes between 3-50. TimeAgo like "3y ago", "1y ago", "8mo ago". Comments 15-40 words. Authentic, varied reactions.`
            }],
            max_tokens: 400,
            temperature: 0.9,
        }),
    });
    const data = await response.json();
    const raw = data.choices[0].message.content.trim().replace(/```json|```/g, '');
    return JSON.parse(raw);
}

export interface GeneratedGmailThread {
    messages: Array<{ senderName: string; content: string; isMe: boolean; }>;
    subject: string;
}

export async function generateGmailThread(): Promise<GeneratedGmailThread> {
    const apiKey = getApiKey();
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{
                role: 'user',
                content: `Generate a realistic Gmail email thread between Dan (an online coach) and a customer/student of his Code On Fire program. The customer has a question or is sharing their success.
Return ONLY valid JSON, no markdown:
{
  "subject": "Thread subject",
  "messages": [
    {"senderName": "Customer Name", "content": "email content", "isMe": false},
    {"senderName": "Dan", "content": "Dan's reply", "isMe": true},
    ...2-3 more messages alternating
  ]
}
Keep emails realistic, 2-4 sentences each. Customer has a genuine question or success story.`
            }],
            max_tokens: 500,
            temperature: 0.9,
        }),
    });
    const data = await response.json();
    const raw = data.choices[0].message.content.trim().replace(/```json|```/g, '');
    return JSON.parse(raw);
}

export interface GeneratedMessengerThread {
    messages: Array<{ text: string; isMe: boolean; }>;
    contactName: string;
}

export async function generateMessengerThread(): Promise<GeneratedMessengerThread> {
    const apiKey = getApiKey();
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{
                role: 'user',
                content: `Generate a realistic Facebook Messenger conversation between Dan (an online business coach / Code On Fire creator) and a student who is excited about their results.
Return ONLY valid JSON, no markdown:
{
  "contactName": "Full Name",
  "messages": [
    {"text": "message text", "isMe": false},
    {"text": "Dan's reply", "isMe": true},
    ...5-7 more messages alternating
  ]
}
Messages should be short, 1-2 sentences, casual. Student shares results or asks about implementation. Dan is helpful, encouraging.`
            }],
            max_tokens: 400,
            temperature: 0.9,
        }),
    });
    const data = await response.json();
    const raw = data.choices[0].message.content.trim().replace(/```json|```/g, '');
    return JSON.parse(raw);
}

export interface GeneratedFinanceData {
    accountBalance: string;
    monthlyIncome: string;
    monthlyExpenses: string;
    savingsRate: string;
    topCategory: string;
    recentTransactions: Array<{ name: string; amount: string; type: 'income' | 'expense'; }>;
}

export async function generateFinanceData(): Promise<GeneratedFinanceData> {
    const apiKey = getApiKey();
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{
                role: 'user',
                content: `Generate realistic personal finance / business finance data for someone making $30k-$100k/month from online business.
Return ONLY valid JSON, no markdown:
{
  "accountBalance": "$XXX,XXX.XX",
  "monthlyIncome": "$XX,XXX.XX",
  "monthlyExpenses": "$X,XXX.XX",
  "savingsRate": "XX%",
  "topCategory": "Category Name",
  "recentTransactions": [
    {"name": "Transaction Name", "amount": "$X,XXX.XX", "type": "income"},
    ...4 more transactions, mix of income and expense
  ]
}`
            }],
            max_tokens: 300,
            temperature: 0.9,
        }),
    });
    const data = await response.json();
    const raw = data.choices[0].message.content.trim().replace(/```json|```/g, '');
    return JSON.parse(raw);
}
