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

// Realistic first names and last names pool
const FIRST_NAMES = [
    'Jessica', 'Michael', 'Amanda', 'Brandon', 'Sarah', 'Chris', 'Melissa',
    'Derek', 'Tiffany', 'Jason', 'Ashley', 'Tyler', 'Lauren', 'Justin', 'Nicole',
    'Ryan', 'Brittany', 'Kevin', 'Heather', 'Nathan', 'Amber', 'Andrew', 'Megan',
    'Travis', 'Courtney', 'Kyle', 'Crystal', 'Sean', 'Danielle', 'Cody',
    'Kayla', 'Aaron', 'Samantha', 'Eric', 'Rachel', 'Adam', 'Chelsea', 'Josh',
    'Alyssa', 'Marcus', 'Vanessa', 'DaVonte', 'Shanice', 'Terrell', 'Latoya',
    'Carlos', 'Maria', 'Miguel', 'Isabel', 'Robert', 'Patricia', 'James', 'Linda',
    'Darnell', 'Keisha', 'DeShawn', 'Tanya', 'Victor', 'Alicia'
];

const LAST_NAMES = [
    'Johnson', 'Williams', 'Smith', 'Brown', 'Davis', 'Miller', 'Wilson',
    'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris',
    'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez',
    'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'Hernandez', 'King',
    'Wright', 'Lopez', 'Hill', 'Scott', 'Green', 'Adams', 'Baker', 'Gonzalez',
    'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips',
    'Campbell', 'Parker', 'Evans', 'Edwards', 'Collins', 'Stewart'
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

export function generateEngagementStats() {
    return {
        likes: Math.floor(Math.random() * 800) + 50,
        comments: Math.floor(Math.random() * 80) + 5,
        shares: Math.floor(Math.random() * 60) + 2,
    };
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

const REVIEW_TEMPLATES = [
    (income: string) => `I was skeptical at first but Dan's Code On Fire system completely changed my life. I went from struggling to make ends meet to consistently making ${income} a month. The strategies are simple once you understand them and the community support is unreal. Highly recommend this to anyone serious about changing their financial situation! 🔥`,
    (income: string) => `Okay I'm not usually one to post about stuff like this but I HAVE to share this. Started Dan's Code On Fire program 4 months ago. This month I hit ${income}. I literally cried when I saw my account. Dan actually responds to messages and the training is step by step easy to follow. This is the real deal guys 🙏`,
    (income: string) => `3 months in and I'm already making ${income} a month with Code On Fire. Dan's system works period. I've tried other courses and nothing came close to this. The support alone is worth it. Thank you Dan for actually caring about your students' success!`,
    (income: string) => `Just hit ${income} this month using Dan's Code On Fire method. I've been at this for about 6 months now and the consistency is incredible. Started at zero with no experience. If I can do it literally anyone can. Don't sleep on this program 💪`,
    (income: string) => `Real talk - Code On Fire saved me. Was about to give up on making money online until a friend told me about Dan. 5 months later I'm making ${income} every single month. My wife doesn't have to work anymore. This program is life changing and I don't say that lightly 🔥🔥`,
    (income: string) => `Dan's system is different. He doesn't just show you the what, he shows you the WHY and HOW. 7 months in and I'm at ${income} a month. The best investment I've ever made. Period. Drop everything and get into Code On Fire if you're serious about financial freedom.`,
    (income: string) => `I wasn't sure if this was for me but I bought Code On Fire 3 months ago and just had my first ${income} month 🤯 Dan literally walks you through everything. The step by step training is so clear and easy to follow. My only regret is not finding this sooner!`,
    (income: string) => `${income}/month. That's what I'm making now thanks to Dan and Code On Fire. Went from working 60hrs a week at my job to this. The system works you just have to put in the effort and follow the training. Dan is the real deal and genuinely wants you to win 🙌`,
    (income: string) => `Listen I've spent thousands on courses over the years. Code On Fire is the only one that actually delivered. Dan knows what he's talking about and the results speak for themselves. I'm at ${income} a month now and growing every week. Worth every penny and then some`,
    (income: string) => `Never thought I'd be the type to post something like this but here we are lol. Dan's Code On Fire method has me bringing in ${income} per month now. My friends don't believe me until I show them the screenshots. This program is literally changing my whole life trajectory 🙏🙏`,
    (income: string) => `6 weeks into Code On Fire and already seeing ${income} months. Dan keeps it real and the strategies actually work in today's market. No fluff, no hype, just a proven system that delivers. If you're on the fence just do it you won't regret it!`,
    (income: string) => `Can we appreciate Dan for a second?? This man has genuinely changed my life. Code On Fire gave me the tools and mindset to build a ${income}/month income stream from scratch. The community he's built is so supportive and Dan himself is always there. This is what a REAL program looks like 🔥`,
];

export async function generateBatchReviews(count: number): Promise<GeneratedReview[]> {
    const reviews: GeneratedReview[] = [];

    for (let i = 0; i < count; i++) {
        const name = generateRandomName();
        const income = getRandomIncome();
        const template = REVIEW_TEMPLATES[i % REVIEW_TEMPLATES.length];
        const review = template(income);
        const stats = generateEngagementStats();

        // Generate avatar using DiceBear (free, no API key needed, realistic looking)
        const seed = encodeURIComponent(name + i);
        const avatarUrl = `https://api.dicebear.com/7.x/personas/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

        reviews.push({
            name,
            avatarUrl,
            review,
            likes: stats.likes,
            comments: stats.comments,
            shares: stats.shares,
            timestamp: generateRandomTimestamp(),
        });
    }

    return reviews;
}

// Generate a single review via OpenAI for maximum variety
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
                    content: `You write authentic-sounding Facebook testimonial posts from real people. 
Write like a real person posting on Facebook - casual, genuine, emotional, with occasional typos or informal grammar. 
Use emojis naturally. Keep it between 80-180 words. 
The person is sharing their success with "Code On Fire" - a program by Dan that teaches an online income system.
Always mention Dan by name, mention a specific income amount (${income}/month or ${income} a month), 
and sound like someone genuinely sharing good news with their Facebook friends - not like an ad.
Do NOT use hashtags. Do NOT use formal language. Sound like a real Facebook post.`
                },
                {
                    role: 'user',
                    content: `Write a Facebook testimonial post from ${name} about Dan's Code On Fire program. They made ${income} this month.`
                }
            ],
            max_tokens: 250,
            temperature: 0.9,
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
export async function generateAIBatchReviews(count: number, onProgress?: (done: number, total: number) => void): Promise<GeneratedReview[]> {
    const reviews: GeneratedReview[] = [];
    const BATCH_SIZE = 5; // Process 5 at a time to avoid rate limits

    for (let i = 0; i < count; i += BATCH_SIZE) {
        const batchSize = Math.min(BATCH_SIZE, count - i);
        const batch = Array.from({ length: batchSize }, (_, j) => {
            const name = generateRandomName();
            const seed = encodeURIComponent(name + (i + j));
            const avatarUrl = `https://api.dicebear.com/7.x/personas/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
            const stats = generateEngagementStats();
            return { name, avatarUrl, stats };
        });

        const texts = await Promise.all(
            batch.map(async (b) => {
                try {
                    return await generateAIReview(b.name);
                } catch {
                    // Fallback to template if API fails
                    const income = ['$15,000', '$25,000', '$40,000', '$60,000', '$100,000'][Math.floor(Math.random() * 5)];
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
