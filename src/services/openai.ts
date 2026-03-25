import { getSeededAvatar } from '../utils/avatarUtils';
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


function getRandomIncome(min = 10000, max = 150000): string {
    // Round to nice numbers
    const raw = Math.floor(Math.random() * (max - min + 1)) + min;
    // Round to nearest $5k for amounts over $10k to look realistic
    const rounded = raw >= 10000 ? Math.round(raw / 5000) * 5000 : Math.round(raw / 1000) * 1000;
    return '$' + rounded.toLocaleString();
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

// Tinnitus Habituation review templates — success stories for Dan Plants' program
const TINNITUS_REVIEW_TEMPLATES = [
    (_name: string) => `I had tinnitus for 3 years and honestly thought I'd never feel normal again. Found Dan Plants' habituation program and within about 8 weeks I stopped dreading the sound. It's still there but I genuinely don't care anymore. Life is so much better.`,

    (_name: string) => `Dan's tinnitus habituation program changed everything for me. I used to wake up in a panic every morning. Now I barely notice the ringing. The way he explains the nervous system stuff finally made it click for me. Highly recommend to anyone struggling with this.`,

    (_name: string) => `Not gonna lie I was skeptical when my audiologist mentioned habituation. But Dan's program walked me through it step by step and about 6 weeks in I had my first day where I forgot I even had tinnitus. That was huge for me.`,

    (_name: string) => `I spent so much money on masking devices and supplements before finding Dan Plants. His habituation approach is the only thing that actually worked. 4 months in and my quality of life is genuinely back to normal.`,

    (_name: string) => `My tinnitus started after a concert and I went into a really dark place. Dan's program taught me how to stop fighting the sound and just let it be there. Sounds simple but it's genuinely hard to do without guidance. I'm so grateful.`,

    (_name: string) => `Dan Plants is the real deal. His tinnitus habituation program is not a cure but it's honestly better — you stop caring about the sound. I went from checking volume levels 50 times a day to just living my life. That shift is everything.`,

    (_name: string) => `3 months into Dan's program and I'm sleeping through the night again. That alone was worth every penny. If you're suffering with tinnitus and feel like it's ruining your life, this program is a genuine lifeline.`,

    (_name: string) => `What I appreciate about Dan is that he doesn't promise a cure. He teaches you to rewire your reaction to the sound and it actually works. 10 weeks in and my spike days don't scare me anymore. Huge win.`,

    (_name: string) => `I was in fight or flight mode 24/7 because of my tinnitus. Dan's habituation program broke that cycle for me. The audio exercises and mindset work are unlike anything I found on YouTube or Reddit. This is next level.`,

    (_name: string) => `My husband noticed the change before I did. He said I stopped talking about my ears every single day. That's when I realized Dan's program was actually working. Tinnitus is still there but I've got my life back.`,

    (_name: string) => `Six weeks felt too short to expect results but I noticed my anxiety around the ringing was dropping. By week 10 I had a full day of zero distress. Dan's approach just makes biological sense and the support in the program is incredible.`,

    (_name: string) => `I tried two other tinnitus programs before Dan Plants. Nothing clicked until his. The way he explains why habituation works and what's actually happening in your brain made all the difference. I finally trusted the process and it worked.`,

    (_name: string) => `ngl I was desperate when I joined Dan's habituation program. Tinnitus had me in tears daily. 7 weeks later I'm genuinely okay. Not perfect but okay in a way I hadn't been in over a year. Dan is the real thing.`,

    (_name: string) => `My ENT basically told me to just live with it. Dan Plants actually showed me HOW to live with it. Big difference. His program gave me the tools to retrain my brain and I honestly feel like I got my identity back.`,

    (_name: string) => `Wife kept telling me to try Dan's tinnitus program. Finally did after about a year of suffering. Wish I hadn't waited. The habituation process is real and Dan explains it better than anyone. 3 months in and I feel like myself again.`,
];

// Get avatar — gender-aware, uses Human Faces Dataset via avatarUtils
export function getAvatarUrl(name: string, _index: number): string {
    return getSeededAvatar(name);
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
export async function generateAIReview(
    name: string,
    incomeMin = 10000,
    incomeMax = 150000,
    tinnitusMode = false
): Promise<string> {
    const apiKey = getApiKey();

    // Randomly assign a post style so we get natural variety
    const style = Math.random();
    let lengthInstruction: string;
    let toneInstruction: string;

    if (style < 0.35) {
        lengthInstruction = `Write ONLY 1-3 short sentences. Maximum 40 words total. Short and punchy like a real casual Facebook comment.`;
        toneInstruction = `Use modern casual language naturally — things like: "ngl", "lowkey", "no cap", "literally", "fr", "wild", "insane", "changed my life fr", "not gonna lie", "I don't even know what to say", "y'all". Sound like a real person texting.`;
    } else if (style < 0.70) {
        lengthInstruction = `Write 3-5 sentences, around 50-90 words. Casual and conversational.`;
        toneInstruction = `Sound like a real person on Facebook — casual, genuine, maybe a tiny bit emotional but not over the top. Can use light slang naturally but don't force it.`;
    } else {
        lengthInstruction = `Write 5-8 sentences, around 90-150 words. Tell a short personal story.`;
        toneInstruction = `Be authentic and personal — mention a specific detail like how long they suffered, their sleeping problems, how skeptical they were. Casual Facebook tone, not a sales pitch.`;
    }

    let systemContent: string;
    let userContent: string;

    if (tinnitusMode) {
        systemContent = `You write authentic Facebook posts from real everyday people sharing their tinnitus habituation success stories.
Rules:
- ${lengthInstruction}
- ${toneInstruction}
- NO hashtags ever
- At most ONE emoji in the whole post — many posts should have zero
- Mention Dan Plants by name and his tinnitus habituation program
- Be specific: mention how long they suffered, what changed, and how life improved
- Do NOT promise a cure — habituation means the sound is still there but no longer distressing
- Do NOT start with "Hey everyone" or "Hey friends" — vary the opening
- Do NOT use exclamation marks more than once
- No ALL CAPS
- Do not write like a formal testimonial or advertisement`;
        userContent = `Write a Facebook post from ${name} sharing their success with Dan Plants' tinnitus habituation program. They went from being severely distressed by tinnitus to achieving habituation and getting their quality of life back.`;
    } else {
        const income = getRandomIncome(incomeMin, incomeMax);
        systemContent = `You write authentic Facebook posts from real everyday people sharing wins.
Rules:
- ${lengthInstruction}
- ${toneInstruction}
- NO hashtags ever
- At most ONE emoji in the whole post — many posts should have zero
- Mention Dan by name and Code On Fire
- Include the income: ${income}/month or ${income} this month
- Do NOT start with "Hey everyone" or "Hey friends" — vary the opening
- Do NOT use exclamation marks more than once
- No ALL CAPS
- Do not write like a formal testimonial or advertisement`;
        userContent = `Write a Facebook post from ${name} about Dan's Code On Fire program. They made ${income} this month.`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemContent },
                { role: 'user', content: userContent }
            ],
            max_tokens: 220,
            temperature: 0.92,
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
    onProgress?: (done: number, total: number) => void,
    incomeMin = 10000,
    incomeMax = 150000,
    tinnitusMode = false
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
                    return await generateAIReview(b.name, incomeMin, incomeMax, tinnitusMode);
                } catch {
                    // Fallback to template if API fails
                    if (tinnitusMode) {
                        return TINNITUS_REVIEW_TEMPLATES[Math.floor(Math.random() * TINNITUS_REVIEW_TEMPLATES.length)](b.name);
                    }
                    const income = getRandomIncome(incomeMin, incomeMax);
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

export async function generateTikTokComments(tinnitusMode = false): Promise<GeneratedTikTokComments> {
    const apiKey = getApiKey();
    const prompt = tinnitusMode
        ? `Generate realistic TikTok comments for a video by Dan Plants about tinnitus habituation and recovering your quality of life from tinnitus.
Return ONLY valid JSON, no markdown:
{
  "comments": [
    {"username": "tiktok_handle", "text": "comment text with 1-2 emojis max", "likes": "XX"},
    ...4 more comments
  ],
  "totalComments": "X,XXX",
  "totalLikes": "XX.XK"
}
Make usernames realistic (lowercase, numbers, underscores). Comments 5-20 words, casual TikTok style. People sharing their tinnitus habituation journey or thanking Dan. 1-2 emojis max. Likes 10-500.`
        : `Generate realistic TikTok comments for a video about making money online / Code On Fire by Dan.
Return ONLY valid JSON, no markdown:
{
  "comments": [
    {"username": "tiktok_handle", "text": "comment text with 1-2 emojis max", "likes": "XX"},
    ...4 more comments
  ],
  "totalComments": "X,XXX",
  "totalLikes": "XX.XK"
}
Make usernames look realistic (lowercase, numbers, underscores). Comments should be 5-20 words, casual TikTok style. 1-2 emojis max per comment. Likes between 10-500.`;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
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

export async function generateYouTubeComments(tinnitusMode = false): Promise<GeneratedYouTubeComments> {
    const apiKey = getApiKey();
    const prompt = tinnitusMode
        ? `Generate realistic YouTube comments for a video by Dan Plants about tinnitus habituation — people sharing their recovery journey and thanking Dan.
Return ONLY valid JSON, no markdown:
{
  "comments": [
    {"handle": "@username123", "text": "comment text, no emojis or max 1", "likes": "XX", "timeAgo": "Xy ago"},
    ...4 more
  ]
}
Handles start with @. Likes between 3-50. TimeAgo like "3y ago", "1y ago", "8mo ago". Comments 15-40 words. People mention how Dan's program helped them habituate to tinnitus and get their life back. Authentic, emotional but grounded.`
        : `Generate realistic YouTube comments for a video about Dan's Code On Fire program / making money online. People sharing their results.
Return ONLY valid JSON, no markdown:
{
  "comments": [
    {"handle": "@username123", "text": "comment text, no emojis or max 1", "likes": "XX", "timeAgo": "Xy ago"},
    ...4 more
  ]
}
Handles start with @. Likes between 3-50. TimeAgo like "3y ago", "1y ago", "8mo ago". Comments 15-40 words. Authentic, varied reactions.`;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
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

export async function generateGmailThread(tinnitusMode = false): Promise<GeneratedGmailThread> {
    const apiKey = getApiKey();
    const prompt = tinnitusMode
        ? `Generate a realistic Gmail email thread between Dan Plants (a tinnitus habituation coach) and someone who went through his tinnitus habituation program and is sharing their success.
Return ONLY valid JSON, no markdown:
{
  "subject": "Thread subject",
  "messages": [
    {"senderName": "Customer Name", "content": "email content", "isMe": false},
    {"senderName": "Dan", "content": "Dan's reply", "isMe": true},
    ...2-3 more messages alternating
  ]
}
Keep emails realistic, 2-4 sentences each. The person describes how long they suffered, what shifted for them, and how life improved after completing the program. Dan is warm and encouraging. Do NOT promise a cure — habituation means the sound is still there but no longer distressing.`
        : `Generate a realistic Gmail email thread between Dan (an online coach) and a customer/student of his Code On Fire program. The customer has a question or is sharing their success.
Return ONLY valid JSON, no markdown:
{
  "subject": "Thread subject",
  "messages": [
    {"senderName": "Customer Name", "content": "email content", "isMe": false},
    {"senderName": "Dan", "content": "Dan's reply", "isMe": true},
    ...2-3 more messages alternating
  ]
}
Keep emails realistic, 2-4 sentences each. Customer has a genuine question or success story.`;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 500,
            temperature: 0.9,
        }),
    });
    if (!response.ok) {
        const err = await response.text();
        throw new Error(`OpenAI error ${response.status}: ${err}`);
    }
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

// ─── Results Profile Generator ────────────────────────────────────────────

export interface ResultsProfile {
    name: string;
    income: number;           // monthly in dollars
    avatarUrl: string;
    fbPost: string;
    messengerMessages: Array<{ text: string; isMe: boolean }>;
    socialComment: string;
    socialPlatform: 'YouTube' | 'TikTok';
    socialHandle: string;
    fbLikes: number;
    fbComments: number;
    fbShares: number;
    fbTimestamp: string;
    bankBalance: string;
    bankLabel: string;        // e.g. "Chase Business Checking"
}

export async function generateResultsProfile(
    name: string,
    income: number,
    avatarUrl: string
): Promise<ResultsProfile> {
    const apiKey = getApiKey();
    const incomeStr = `$${Math.round(income / 1000)}k`;
    const firstName = name.split(' ')[0];
    const platform = Math.random() > 0.5 ? 'YouTube' : 'TikTok';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{
                role: 'system',
                content: `You generate realistic social proof content for Dan's "Code On Fire" online business program. The content is from real everyday people sharing their success. Keep everything authentic, casual, brief. No hashtags. Max 1 emoji total across the entire response. Dan is the coach/creator.`
            }, {
                role: 'user',
                content: `Generate social proof content for ${name} who is now making ${incomeStr}/month thanks to Dan's Code On Fire program.

Return ONLY this exact JSON (no markdown, no extra fields):
{
  "fbPost": "A Facebook testimonial post, 60-120 words. Casual, mentions their old situation, their income of ${incomeStr}/month, and thanks Dan by name.",
  "messengerMessages": [
    {"text": "Opening message from ${firstName} to Dan", "isMe": false},
    {"text": "Dan's enthusiastic reply", "isMe": true},
    {"text": "${firstName} shares the income result: ${incomeStr}", "isMe": false},
    {"text": "Dan's reaction / congrats", "isMe": true},
    {"text": "${firstName} thanks Dan", "isMe": false},
    {"text": "Dan's closing encouragement", "isMe": true}
  ],
  "socialComment": "A ${platform} comment, 15-30 words, mentioning ${incomeStr}/month and Dan's program. Casual ${platform} style.",
  "socialHandle": "a realistic ${platform} username for this person — lowercase, may include numbers or underscores, NO spaces, looks like a real account handle (e.g. jessicawilliams92, mjohnson_fire, sarah.m.davis)",
  "bankBalance": "$${(income * (8 + Math.random() * 6)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}",
  "bankLabel": "Chase Business Checking"
}`
            }],
            max_tokens: 600,
            temperature: 0.88,
        }),
    });

    const data = await response.json();
    const raw = data.choices[0].message.content.trim().replace(/```json|```/g, '');
    const parsed = JSON.parse(raw);

    const stats = generateEngagementStats();
    const balance = income * (8 + Math.random() * 6);
    const bankLabels = ['Chase Business Checking', 'Bank of America Business', 'Wells Fargo Business', 'Stripe Balance', 'PayPal Business', 'Mercury Business'];

    return {
        name,
        income,
        avatarUrl,
        fbPost: parsed.fbPost,
        messengerMessages: parsed.messengerMessages,
        socialComment: parsed.socialComment,
        socialPlatform: platform,
        socialHandle: parsed.socialHandle || `user${Math.floor(Math.random() * 9999)}`,
        fbLikes: stats.likes,
        fbComments: stats.comments,
        fbShares: stats.shares,
        fbTimestamp: generateRandomTimestamp(),
        bankBalance: `$${Math.round(balance).toLocaleString()}.${String(Math.floor(Math.random() * 99)).padStart(2, '0')}`,
        bankLabel: bankLabels[Math.floor(Math.random() * bankLabels.length)],
    };
}

export async function generateAllProfiles(
    count: number,
    incomeMin: number,
    incomeMax: number,
    getAvatar: (name: string) => string,
    onProgress?: (done: number, total: number) => void
): Promise<ResultsProfile[]> {
    const profiles: ResultsProfile[] = [];
    const BATCH = 5;

    // Build name list (shuffle both pools)
    const allFirst = ['Jessica', 'Michael', 'Amanda', 'Brandon', 'Sarah', 'Chris', 'Melissa', 'Derek',
        'Tiffany', 'Jason', 'Ashley', 'Tyler', 'Lauren', 'Justin', 'Nicole', 'Ryan', 'Brittany', 'Kevin',
        'Heather', 'Nathan', 'Amber', 'Andrew', 'Megan', 'Travis', 'Courtney', 'Kyle', 'Crystal', 'Sean',
        'Danielle', 'Cody', 'Kayla', 'Aaron', 'Samantha', 'Eric', 'Rachel', 'Adam', 'Chelsea', 'Josh',
        'Alyssa', 'Marcus', 'Vanessa', 'Carlos', 'Maria', 'Miguel', 'Isabel', 'Robert', 'Patricia',
        'James', 'Linda', 'Victor', 'Alicia', 'Blake', 'Lindsey', 'Wesley', 'Monique', 'Seth', 'Brooke'];
    const allLast = ['Johnson', 'Williams', 'Smith', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore',
        'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia',
        'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young',
        'King', 'Wright', 'Lopez', 'Hill', 'Scott', 'Green', 'Adams', 'Baker', 'Nelson', 'Carter',
        'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker', 'Evans', 'Edwards'];

    const shuffled = [...allFirst].sort(() => Math.random() - 0.5);
    const names = Array.from({ length: count }, (_, i) => {
        const f = shuffled[i % shuffled.length];
        const l = allLast[Math.floor(Math.random() * allLast.length)];
        return `${f} ${l}`;
    });

    for (let i = 0; i < count; i += BATCH) {
        const batch = names.slice(i, i + BATCH);
        const results = await Promise.all(batch.map(async (name) => {
            const income = Math.round((incomeMin + Math.random() * (incomeMax - incomeMin)) / 500) * 500;
            const avatar = getAvatar(name);
            try {
                return await generateResultsProfile(name, income, avatar);
            } catch {
                // Fallback to template content
                const incomeStr = `$${Math.round(income / 1000)}k`;
                const stats = generateEngagementStats();
                return {
                    name, income, avatarUrl: avatar,
                    fbPost: REVIEW_TEMPLATES[Math.floor(Math.random() * REVIEW_TEMPLATES.length)](incomeStr),
                    messengerMessages: [
                        { text: `Hey Dan! Just wanted to share something incredible with you.`, isMe: false },
                        { text: `Tell me everything! What happened?`, isMe: true },
                        { text: `I hit ${incomeStr} this month. I'm still in shock.`, isMe: false },
                        { text: `That is AMAZING! I'm so proud of you!! 🎉`, isMe: true },
                        { text: `Thank you for everything Dan. You changed my life.`, isMe: false },
                        { text: `You did the work. Own it! Go celebrate!`, isMe: true },
                    ],
                    socialComment: `Can't believe I'm making ${incomeStr}/month now thanks to Dan's program. This is real.`,
                    socialPlatform: 'YouTube' as const,
                    socialHandle: `user${Math.floor(Math.random() * 9999)}`,
                    fbLikes: stats.likes, fbComments: stats.comments, fbShares: stats.shares,
                    fbTimestamp: generateRandomTimestamp(),
                    bankBalance: `$${Math.round(income * 9).toLocaleString()}.00`,
                    bankLabel: 'Chase Business Checking',
                };
            }
        }));
        profiles.push(...results);
        if (onProgress) onProgress(Math.min(i + BATCH, count), count);
    }

    return profiles;
}

