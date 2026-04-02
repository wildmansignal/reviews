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

// Tinnitus Coaching Session review templates — positive reviews about Dan's 1-on-1 coaching sessions
const TINNITUS_COACHING_REVIEW_TEMPLATES = [
    () => `I did one of Dan Plants' 1-on-1 tinnitus coaching sessions last week and it genuinely moved the needle for me. He looked at my specific situation and gave me a personalized plan I never could have built on my own. Best investment I've made on this journey.`,

    () => `After months of struggling with tinnitus I finally booked a coaching session with Dan Plants. Within an hour he helped me understand exactly why my brain was stuck in threat mode and what to do about it. I left feeling more hopeful than I have in months.`,

    () => `Dan's 1-on-1 coaching session was a turning point for me. He didn't give me generic advice — he actually listened to my whole history and then built a roadmap specific to my situation. Two weeks later my anxiety around the sound has dropped significantly.`,

    () => `ngl I was hesitant to book a coaching session because I wasn't sure it would be different from the usual stuff. But Dan Plants is on another level. He identified patterns in my situation I hadn't even noticed and gave me targeted exercises. My spike days are shorter now.`,

    () => `Just finished a private coaching call with Dan Plants and wow. He explained what my nervous system is doing in a way that finally made sense. I've read so much about habituation but never had it applied to MY situation like this. Game changer.`,

    () => `I've been through group programs and watched hours of tinnitus content online. Nothing compared to sitting down with Dan one-on-one for an hour. He zeroed in on my specific triggers and gave me a week-by-week plan. Worth every dollar.`,

    () => `Booked a 1-on-1 session with Dan after a bad tinnitus spike month. He helped me rebuild my approach from scratch and figure out where I was getting in my own way. Two sessions later I feel like I have my life back on track.`,

    () => `Dan Plants' coaching sessions are something else. He doesn't just repeat what's in his program — he works with what you bring to the call. I learned more in 60 minutes with him than in weeks of researching on my own. My sleep is already improving.`,

    () => `My doctor told me there was nothing to do for tinnitus. Dan Plants spent an hour with me on a 1-on-1 call and showed me exactly what to do. The difference is incredible. He's the most knowledgeable person I've found on this topic by far.`,

    () => `I cried at the end of my coaching session with Dan because for the first time someone actually got it. He didn't just validate my suffering — he gave me a real plan. Three weeks later I'm sleeping better and the dread is mostly gone.`,

    () => `Dan's 1-on-1 coaching cut through months of confusion in one hour. He has this gift for explaining exactly what the brain is doing and then telling you the specific thing you need to do about it. I felt clear and calm after the session in a way I hadn't felt in a long time.`,

    () => `Shared my tinnitus coaching session with my sister who also suffers and she's booking one now. Dan Plants is just a different level of support. Personal, targeted, and he actually follows up. Not just another program — genuine coaching.`,

    () => `Was skeptical that a coaching session could help when I'd already tried so many things. Dan proved me wrong. He identified that my rumination habits were keeping my nervous system on high alert and we built a strategy around that. Things have shifted noticeably since.`,

    () => `Dan's 1-on-1 tinnitus coaching is the thing I wish I had found on day one. He helps you understand your specific pattern, not just tinnitus in general. That personalized approach is what makes the difference when everything else has felt generic and unhelpful.`,

    () => `had a coaching session with Dan Plants and the guy just knows his stuff. He asked the right questions, identified my problem areas quickly, and gave me a clear set of things to focus on. Within two weeks I am noticeably less reactive to the sound. That's huge for me.`,
];

// Tinnitus Chat review templates — positive reviews about Dan's free tinnitus AI chat
const TINNITUS_CHAT_REVIEW_TEMPLATES = [
    () => `After talking to Dans chat, my tinnitus has reduced by like 20%. I don't know how to explain it but just having someone walk me through what's happening made a huge difference. Genuinely recommend it to anyone dealing with this.`,

    () => `I feel hopeful, like I have a game plan after just a 5 minute conversation with Dans tinnitus chat. It asked the right questions and gave me actual steps I can follow. First time in months I don't feel completely lost.`,

    () => `ngl I was skeptical about a tinnitus chatbot but Dan's chat actually understood what I was going through. It didn't just say "learn to live with it" — it gave me real strategies. My anxiety around the ringing has dropped significantly.`,

    () => `Just had a conversation with Dan's free tinnitus chat and I'm genuinely shocked. It explained what's happening in my brain in a way no doctor ever has. Feel like I finally have direction instead of just panicking.`,

    () => `Dan's tinnitus chat is incredible for something that's free. I spent 10 minutes talking to it and walked away feeling more informed and calm than after any ENT appointment I've had. Seriously underrated resource.`,

    () => `Talked to Dan's tinnitus chat at 3am during a spike and it actually helped me calm down. It walked me through a breathing exercise and explained why the spike was happening. I fell asleep 20 minutes later. Game changer.`,

    () => `My wife found Dan's free tinnitus chat and made me try it. I'm glad she did. The chat helped me understand that my reaction to the sound is what's making it worse. Simple concept but hearing it explained clearly changed my perspective.`,

    () => `I've been dealing with tinnitus for 8 months and Dan's chat is honestly the best free resource I've found. It doesn't promise miracles but gives you a clear understanding of habituation and what you can actually do. Felt hopeful for the first time.`,

    () => `Dan's tinnitus chat told me something no audiologist ever did — that my brain is treating the sound as a threat and that's why I can't ignore it. That one insight alone reduced my distress level. This chat is doing real good.`,

    () => `had a quick chat with Dan's tinnitus AI and it literally mapped out a plan for me. Like here's what to do this week, here's what to focus on. No one has ever given me that kind of structure. And it's free which is wild.`,

    () => `I recommended Dan's tinnitus chat to my support group and three people messaged me saying it helped them too. It's like having a knowledgeable friend who actually gets what you're going through. 10 out of 10.`,

    () => `Spoke to Dan's chat about my tinnitus and it didn't just give generic advice. It asked about my sleep, my stress levels, how long I've had it. Then gave me personalized suggestions. Felt like a real consultation honestly.`,

    () => `Dan's free tinnitus chat helped me more in 5 minutes than months of googling. It broke down habituation in plain English and gave me hope that this doesn't have to control my life. If you have tinnitus try it seriously.`,

    () => `Was having a terrible tinnitus day and someone in a Facebook group told me to try Dan's chat. Best advice I've gotten. The chat was calm, informative, and actually made me feel like there's a path forward.`,

    () => `lowkey Dan's tinnitus chat changed my whole outlook. I went in feeling defeated and came out with an actual understanding of what habituation means and why it works. Free resource doing more than most paid programs.`,
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
    mode: 'default' | 'tinnitus' | 'tinnitus-chat' | 'tinnitus-coaching' = 'default'
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

    if (mode === 'tinnitus-coaching') {
        systemContent = `You write authentic Facebook posts from real everyday people sharing their positive experience with Dan Plants' 1-on-1 tinnitus coaching sessions.
Rules:
- ${lengthInstruction}
- ${toneInstruction}
- NO hashtags ever
- At most ONE emoji in the whole post — many posts should have zero
- Mention Dan Plants by name and describe it as a coaching session, 1-on-1 call, or private coaching
- The sessions are personal, targeted, one-hour calls where Dan builds a specific habituation plan for the individual
- People should talk about how personalized the help was, how much clarity they got, how their anxiety/distress dropped, how their sleep improved, how their spike days got shorter, or how they finally felt heard
- Some posts can mention how it was different from generic advice online or from doctors who just say "live with it"
- Do NOT promise a cure — coaching helps with understanding, personalized strategy, and nervous system regulation
- Do NOT start with "Hey everyone" or "Hey friends" — vary the opening
- Do NOT use exclamation marks more than once
- No ALL CAPS
- Do not write like a formal testimonial or advertisement`;
        userContent = `Write a Facebook post from ${name} about their positive experience with Dan Plants' 1-on-1 tinnitus coaching session. They got a personalized plan and came away feeling clearer, more hopeful, less anxious, or with measurably better days.`;
    } else if (mode === 'tinnitus-chat') {
        systemContent = `You write authentic Facebook posts from real everyday people sharing their positive experience with Dan Plants' free tinnitus AI chat.
Rules:
- ${lengthInstruction}
- ${toneInstruction}
- NO hashtags ever
- At most ONE emoji in the whole post — many posts should have zero
- Mention Dan's chat, Dan's tinnitus chat, or Dan's free tinnitus chat by name
- The chat is a free AI chatbot that helps people understand tinnitus, gives them a game plan, calms their anxiety, explains habituation, and provides personalized suggestions
- People should talk about how hopeful they feel, how their anxiety reduced, how they finally have a plan, how the chat explained things better than doctors
- Some posts can mention a percentage reduction in distress or tinnitus awareness
- Do NOT promise a cure — the chat helps with understanding, coping, and direction
- Do NOT start with "Hey everyone" or "Hey friends" — vary the opening
- Do NOT use exclamation marks more than once
- No ALL CAPS
- Do not write like a formal testimonial or advertisement`;
        userContent = `Write a Facebook post from ${name} about their positive experience with Dan Plants' free tinnitus AI chat. They had a conversation and came away feeling hopeful, more informed, less anxious, or with a clear plan.`;
    } else if (mode === 'tinnitus') {
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
    mode: 'default' | 'tinnitus' | 'tinnitus-chat' | 'tinnitus-coaching' = 'default'
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
                    return await generateAIReview(b.name, incomeMin, incomeMax, mode);
                } catch {
                    // Fallback to template if API fails
                    if (mode === 'tinnitus-coaching') {
                        return TINNITUS_COACHING_REVIEW_TEMPLATES[Math.floor(Math.random() * TINNITUS_COACHING_REVIEW_TEMPLATES.length)]();
                    }
                    if (mode === 'tinnitus-chat') {
                        return TINNITUS_CHAT_REVIEW_TEMPLATES[Math.floor(Math.random() * TINNITUS_CHAT_REVIEW_TEMPLATES.length)]();
                    }
                    if (mode === 'tinnitus') {
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

export async function generateTikTokComments(mode: 'default' | 'tinnitus' | 'tinnitus-chat' | 'tinnitus-coaching' = 'default'): Promise<GeneratedTikTokComments> {
    const apiKey = getApiKey();
    let prompt: string;
    if (mode === 'tinnitus-coaching') {
        prompt = `Generate realistic TikTok comments for a video by Dan Plants about his 1-on-1 tinnitus coaching sessions that help people build a personalized habituation plan.
Return ONLY valid JSON, no markdown:
{
  "comments": [
    {"username": "tiktok_handle", "text": "comment text with 1-2 emojis max", "likes": "XX"},
    ...4 more comments
  ],
  "totalComments": "X,XXX",
  "totalLikes": "XX.XK"
}
Make usernames realistic (lowercase, numbers, underscores). Comments 5-20 words, casual TikTok style. People sharing how Dan's personal coaching helped them, gave them a specific plan, reduced anxiety, improved sleep. 1-2 emojis max. Likes 10-500.`;
    } else if (mode === 'tinnitus-chat') {
        prompt = `Generate realistic TikTok comments for a video by Dan Plants about his free tinnitus AI chat that helps people understand and cope with tinnitus.
Return ONLY valid JSON, no markdown:
{
  "comments": [
    {"username": "tiktok_handle", "text": "comment text with 1-2 emojis max", "likes": "XX"},
    ...4 more comments
  ],
  "totalComments": "X,XXX",
  "totalLikes": "XX.XK"
}
Make usernames realistic (lowercase, numbers, underscores). Comments 5-20 words, casual TikTok style. People sharing how Dan's free tinnitus chat helped them, gave them a game plan, reduced their anxiety. 1-2 emojis max. Likes 10-500.`;
    } else if (mode === 'tinnitus') {
        prompt = `Generate realistic TikTok comments for a video by Dan Plants about tinnitus habituation and recovering your quality of life from tinnitus.
Return ONLY valid JSON, no markdown:
{
  "comments": [
    {"username": "tiktok_handle", "text": "comment text with 1-2 emojis max", "likes": "XX"},
    ...4 more comments
  ],
  "totalComments": "X,XXX",
  "totalLikes": "XX.XK"
}
Make usernames realistic (lowercase, numbers, underscores). Comments 5-20 words, casual TikTok style. People sharing their tinnitus habituation journey or thanking Dan. 1-2 emojis max. Likes 10-500.`;
    } else {
        prompt = `Generate realistic TikTok comments for a video about making money online / Code On Fire by Dan.
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
    }
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

export async function generateYouTubeComments(mode: 'default' | 'tinnitus' | 'tinnitus-chat' | 'tinnitus-coaching' = 'default'): Promise<GeneratedYouTubeComments> {
    const apiKey = getApiKey();
    let prompt: string;
    if (mode === 'tinnitus-coaching') {
        prompt = `Generate realistic YouTube comments for a video by Dan Plants about 1-on-1 tinnitus coaching — people sharing their personal experience after a coaching session.
Return ONLY valid JSON, no markdown:
{
  "comments": [
    {"handle": "@username123", "text": "comment text, no emojis or max 1", "likes": "XX", "timeAgo": "Xy ago"},
    ...4 more
  ]
}
Handles start with @. Likes between 3-50. TimeAgo like "3y ago", "1y ago", "8mo ago". Comments 15-40 words. People mention how Dan's personalized coaching session gave them a breakthrough, a specific plan, or relief from anxiety. Authentic and grounded.`;
    } else if (mode === 'tinnitus-chat') {
        prompt = `Generate realistic YouTube comments for a video by Dan Plants about his free tinnitus AI chat that helps people understand and cope with tinnitus.
Return ONLY valid JSON, no markdown:
{
  "comments": [
    {"handle": "@username123", "text": "comment text, no emojis or max 1", "likes": "XX", "timeAgo": "Xy ago"},
    ...4 more
  ]
}
Handles start with @. Likes between 3-50. TimeAgo like "3y ago", "1y ago", "8mo ago". Comments 15-40 words. People sharing how Dan's free tinnitus chat helped them feel hopeful, gave them a plan, reduced anxiety. Authentic and grounded.`;
    } else if (mode === 'tinnitus') {
        prompt = `Generate realistic YouTube comments for a video by Dan Plants about tinnitus habituation — people sharing their recovery journey and thanking Dan.
Return ONLY valid JSON, no markdown:
{
  "comments": [
    {"handle": "@username123", "text": "comment text, no emojis or max 1", "likes": "XX", "timeAgo": "Xy ago"},
    ...4 more
  ]
}
Handles start with @. Likes between 3-50. TimeAgo like "3y ago", "1y ago", "8mo ago". Comments 15-40 words. People mention how Dan's program helped them habituate to tinnitus and get their life back. Authentic, emotional but grounded.`;
    } else {
        prompt = `Generate realistic YouTube comments for a video about Dan's Code On Fire program / making money online. People sharing their results.
Return ONLY valid JSON, no markdown:
{
  "comments": [
    {"handle": "@username123", "text": "comment text, no emojis or max 1", "likes": "XX", "timeAgo": "Xy ago"},
    ...4 more
  ]
}
Handles start with @. Likes between 3-50. TimeAgo like "3y ago", "1y ago", "8mo ago". Comments 15-40 words. Authentic, varied reactions.`;
    }
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

// ─── Local Gmail Thread Fallbacks ─────────────────────────────────────────────
const GMAIL_TEMPLATES_COF: GeneratedGmailThread[] = [
    {
        subject: 'Just hit my first $20k month — had to tell you',
        messages: [
            { senderName: 'Jessica Williams', content: 'Hey Dan, I just wanted to send a quick note because I\'m still in shock. I just checked my Stripe dashboard and I hit $20,400 this month. I started your Code On Fire program 4 months ago and couldn\'t close a single client. Now I have 6 retainer clients. I don\'t even know what to say.', isMe: false },
            { senderName: 'Dan', content: 'Jessica! This is incredible — $20k in month 4 is genuinely impressive. Six retainers already? That is not luck, that is you executing consistently. I\'m so proud of you. What part of the training clicked the most for you?', isMe: true },
            { senderName: 'Jessica Williams', content: 'Honestly the outreach framework. Once I stopped overthinking it and just followed the script, my response rate tripled. Thank you for building something that actually works. I tell literally everyone about this program.', isMe: false },
            { senderName: 'Dan', content: 'That is the exact shift — go from tinkering to executing. You earned every dollar. Go celebrate! And keep going — $20k is just the beginning 🔥', isMe: true },
        ],
    },
    {
        subject: 'Question about scaling — and a huge thank you',
        messages: [
            { senderName: 'Marcus Thompson', content: 'Hi Dan, I\'ve been in Code On Fire for about 6 months now. I\'m consistently at $15k–18k/month but I\'m trying to break through to $30k. I have a quick question about how to structure my offer stack for higher-ticket clients. Also wanted to say this program changed my life.', isMe: false },
            { senderName: 'Dan', content: 'Marcus, congrats on hitting that $15k–18k range consistently — that is genuinely great. For breaking through to $30k, it\'s usually not about getting more clients, it\'s about raising prices and adding a premium tier. Have you done a price audit recently?', isMe: true },
            { senderName: 'Marcus Thompson', content: 'I haven\'t, no. I\'ve been scared to raise prices because I don\'t want to lose clients. But I\'ll try it. Thank you for being so responsive. You don\'t have to do this and it means a lot.', isMe: false },
            { senderName: 'Dan', content: 'You\'ll be surprised — often the clients who stick are the better ones. Raise prices on new clients first. Let me know how it goes!', isMe: true },
        ],
    },
];

const GMAIL_TEMPLATES_TINNITUS_CHAT: GeneratedGmailThread[] = [
    {
        subject: 'Your tinnitus chat helped me more than my doctor',
        messages: [
            { senderName: 'Lauren Carter', content: 'Hi Dan, I just wanted to send you a note about your free tinnitus chat. I used it last night during a really bad spike and it actually calmed me down. It explained what was happening in my nervous system and gave me a breathing exercise. I felt better within 20 minutes. No doctor has ever given me that kind of practical help.', isMe: false },
            { senderName: 'Dan', content: 'Lauren, thank you so much for sharing this. That\'s exactly what the chat is designed to do — meet you where you are and give you immediate, practical support. How are you feeling today?', isMe: true },
            { senderName: 'Lauren Carter', content: 'So much better. I went back and talked to it again this morning and it helped me build a weekly plan. I feel like I actually have direction for the first time since this started. Thank you for making this free.', isMe: false },
            { senderName: 'Dan', content: 'That means the world. The chat is there anytime you need it. You\'re already on the right path just by seeking understanding instead of fighting the sound.', isMe: true },
        ],
    },
    {
        subject: 'Thank you for the free tinnitus chat',
        messages: [
            { senderName: 'Marcus Green', content: 'Dan, I found your tinnitus chat through a Reddit thread and I have to say it\'s the most helpful free resource I\'ve come across. It asked about my situation, how long I\'ve had tinnitus, what my anxiety levels are like, and then gave me a personalized plan. I felt hopeful for the first time in months.', isMe: false },
            { senderName: 'Dan', content: 'Marcus, really glad it helped! The chat is built to give people personalized guidance because everyone\'s tinnitus journey is different. What resonated most with you?', isMe: true },
            { senderName: 'Marcus Green', content: 'The part about how my brain is treating the sound as a threat. Once I understood that, my whole relationship with tinnitus shifted. I\'m still early but I feel like I have a game plan now.', isMe: false },
            { senderName: 'Dan', content: 'That insight is the foundation of everything. Once you understand the mechanism, the fear loses its power. Keep going — you\'re on the right track.', isMe: true },
        ],
    },
];

const GMAIL_TEMPLATES_TINNITUS: GeneratedGmailThread[] = [
    {
        subject: 'I think I finally habituated — thank you',
        messages: [
            { senderName: 'Sarah Mitchell', content: 'Hi Dan, I wanted to write to you because I\'m not sure I would have made it through without your program. I had severe tinnitus for 14 months. I was barely functioning. I started your habituation program in October and something shifted around week 10. I went three full days last week without thinking about my ears once. I don\'t know how to thank you.', isMe: false },
            { senderName: 'Dan', content: 'Sarah, this is genuinely one of the best messages I receive. Three days without awareness — that is textbook habituation. That doesn\'t happen by accident. You did the work consistently even when it was hard. The nervous system responds to that. How are you sleeping now?', isMe: true },
            { senderName: 'Sarah Mitchell', content: 'I\'m sleeping 7–8 hours most nights. Without medication. I haven\'t done that since before all this started. My husband said he has his wife back. I still can\'t believe how much better life is. The sound hasn\'t changed but my whole relationship with it has.', isMe: false },
            { senderName: 'Dan', content: 'That is exactly it — "the sound hasn\'t changed but my relationship with it has." That sentence IS habituation. I\'m so happy for you Sarah. Thank you for trusting the process and for taking the time to write. This is why I built this program.', isMe: true },
        ],
    },
    {
        subject: 'Update from your program — 6 months in',
        messages: [
            { senderName: 'Ryan Evans', content: 'Dan, just hitting 6 months since I finished your tinnitus habituation program and wanted to give you an update. I was in a really dark place when I found you. ENT told me to "just live with it" and gave me nothing else. Your program gave me an actual roadmap. I\'m at maybe 5% of the distress I had when I started.', isMe: false },
            { senderName: 'Dan', content: 'Ryan! 5% distress at 6 months out is exceptional. The "just live with it" advice from doctors is so frustrating because it\'s technically correct but completely useless without showing HOW. I\'m glad the roadmap helped. What ended up being the most useful piece for you?', isMe: true },
            { senderName: 'Ryan Evans', content: 'Understanding the nervous system piece. Once I understood that my brain had categorized the sound as a threat and was going into fight-or-flight, I could approach it differently. The fear started to dissolve. I still have spikes occasionally but they don\'t scare me anymore. That shift is everything.', isMe: false },
            { senderName: 'Dan', content: 'When the fear goes, the suffering goes. The sound can still be loud but it loses its grip. You\'ve got this long-term now. Thank you for the update — genuinely made my day.', isMe: true },
        ],
    },
];

const GMAIL_TEMPLATES_TINNITUS_COACHING: GeneratedGmailThread[] = [
    {
        subject: 'That coaching session completely changed my approach',
        messages: [
            { senderName: 'Amanda Torres', content: 'Hi Dan, I just wanted to reach out after our 1-on-1 session yesterday. I went in feeling hopeless and came out with an actual plan specific to my situation. Nobody has ever applied this stuff to MY case before — it was always generic advice. Last night was the first quiet night I\'ve had in weeks.', isMe: false },
            { senderName: 'Dan', content: 'Amanda, hearing this made my morning. That\'s exactly what the 1-on-1 is for — generic content can only take you so far. What do you think was the biggest shift from the session?', isMe: true },
            { senderName: 'Amanda Torres', content: 'Understanding that my hypervigilance was making everything worse, not the tinnitus itself. You identified that in the first 10 minutes. I\'ve been fighting the wrong thing this whole time. Now I know what to actually work on.', isMe: false },
            { senderName: 'Dan', content: 'That insight is the whole ballgame. Once you stop fighting the sound and start working on the nervous system response, things move fast. Keep me posted — I\'m rooting for you.', isMe: true },
        ],
    },
    {
        subject: 'Two weeks after our session — wanted to update you',
        messages: [
            { senderName: 'Kevin Marshall', content: 'Dan, it\'s been two weeks since our coaching call and I wanted to give you an update. My bad days are fewer. I\'m sleeping better. And the plan you gave me — I\'ve been sticking to it. I was skeptical that one session could do much but I was wrong. The personalized approach is completely different from anything else I\'ve tried.', isMe: false },
            { senderName: 'Dan', content: 'Kevin! Two weeks of consistent work and already seeing results — that is exactly how it\'s supposed to go. Better sleep is often the first domino. What\'s been the easiest part of the plan to stick with?', isMe: true },
            { senderName: 'Kevin Marshall', content: 'The morning routine you outlined. Having something specific to do when I wake up instead of just lying there dreading the sound has been huge. Thank you for putting this together for me specifically. It makes all the difference.', isMe: false },
            { senderName: 'Dan', content: 'That morning anchor is one of the most powerful pieces. Keep building on it. You\'re doing great — this is exactly the trajectory I hoped for you.', isMe: true },
        ],
    },
];

export async function generateGmailThread(mode: 'default' | 'tinnitus' | 'tinnitus-chat' | 'tinnitus-coaching' = 'default'): Promise<GeneratedGmailThread> {
    // Try the API first, fall back to local templates
    try {
        const apiKey = getApiKey();
        let prompt: string;
        if (mode === 'tinnitus-coaching') {
            prompt = `Generate a realistic Gmail email thread between Dan Plants and someone who just completed a 1-on-1 tinnitus coaching session with him and is sharing how much it helped.
Return ONLY valid JSON, no markdown:
{
  "subject": "Thread subject",
  "messages": [
    {"senderName": "Person Name", "content": "email content", "isMe": false},
    {"senderName": "Dan", "content": "Dan's reply", "isMe": true},
    ...2-3 more messages alternating
  ]
}
Keep emails realistic, 2-4 sentences each. The person describes how personalized the session felt, what their specific breakthrough was, how their anxiety or sleep has improved, or how the plan Dan gave them is actually working. Dan is warm and encouraging. Do NOT promise a cure.`;
        } else if (mode === 'tinnitus-chat') {
            prompt = `Generate a realistic Gmail email thread between Dan Plants and someone who used his free tinnitus AI chat and is sharing how much it helped them.
Return ONLY valid JSON, no markdown:
{
  "subject": "Thread subject",
  "messages": [
    {"senderName": "Person Name", "content": "email content", "isMe": false},
    {"senderName": "Dan", "content": "Dan's reply", "isMe": true},
    ...2-3 more messages alternating
  ]
}
Keep emails realistic, 2-4 sentences each. The person describes how Dan's free tinnitus chat gave them hope, a game plan, reduced their anxiety, or explained things better than their doctor. Dan is warm and grateful. Do NOT promise a cure.`;
        } else if (mode === 'tinnitus') {
            prompt = `Generate a realistic Gmail email thread between Dan Plants (a tinnitus habituation coach) and someone who went through his tinnitus habituation group program and is sharing their success.
Return ONLY valid JSON, no markdown:
{
  "subject": "Thread subject",
  "messages": [
    {"senderName": "Customer Name", "content": "email content", "isMe": false},
    {"senderName": "Dan", "content": "Dan's reply", "isMe": true},
    ...2-3 more messages alternating
  ]
}
Keep emails realistic, 2-4 sentences each. The person describes how long they suffered, what shifted for them, and how life improved after completing the program. Dan is warm and encouraging. Do NOT promise a cure — habituation means the sound is still there but no longer distressing.`;
        } else {
            prompt = `Generate a realistic Gmail email thread between Dan (an online coach) and a customer/student of his Code On Fire program. The customer has a question or is sharing their success.
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
        }
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
        if (!response.ok) throw new Error(`OpenAI error ${response.status}`);
        const data = await response.json();
        const raw = data.choices[0].message.content.trim().replace(/```json|```/g, '');
        return JSON.parse(raw);
    } catch {
        // Fallback to local templates
        const templates = mode === 'tinnitus-coaching' ? GMAIL_TEMPLATES_TINNITUS_COACHING
            : mode === 'tinnitus-chat' ? GMAIL_TEMPLATES_TINNITUS_CHAT
            : mode === 'tinnitus' ? GMAIL_TEMPLATES_TINNITUS
            : GMAIL_TEMPLATES_COF;
        return templates[Math.floor(Math.random() * templates.length)];
    }
}


export interface GeneratedMessengerThread {
    messages: Array<{ text: string; isMe: boolean; }>;
    contactName: string;
}

export async function generateMessengerThread(mode: 'default' | 'tinnitus' | 'tinnitus-chat' | 'tinnitus-coaching' = 'default'): Promise<GeneratedMessengerThread> {
    const apiKey = getApiKey();
    let prompt: string;
    if (mode === 'tinnitus-coaching') {
        prompt = `Generate a realistic Facebook Messenger conversation between Dan Plants and someone who just had a 1-on-1 tinnitus coaching session with him and is messaging to share how much it helped.
Return ONLY valid JSON, no markdown:
{
  "contactName": "Full Name",
  "messages": [
    {"text": "message text", "isMe": false},
    {"text": "Dan's reply", "isMe": true},
    ...5-7 more messages alternating
  ]
}
Messages should be short, 1-2 sentences, casual. Person shares how personalized the call felt, what shifted for them, how their anxiety/sleep/spike days improved. Dan is warm and encouraging. Do NOT promise a cure.`;
    } else if (mode === 'tinnitus-chat') {
        prompt = `Generate a realistic Facebook Messenger conversation between Dan Plants and someone who just used his free tinnitus AI chat and is messaging him about how much it helped.
Return ONLY valid JSON, no markdown:
{
  "contactName": "Full Name",
  "messages": [
    {"text": "message text", "isMe": false},
    {"text": "Dan's reply", "isMe": true},
    ...5-7 more messages alternating
  ]
}
Messages should be short, 1-2 sentences, casual. Person shares how the chat gave them hope, a plan, reduced their anxiety, or explained tinnitus better than doctors. Dan is grateful and encouraging.`;
    } else if (mode === 'tinnitus') {
        prompt = `Generate a realistic Facebook Messenger conversation between Dan Plants (tinnitus habituation coach) and someone who completed his tinnitus habituation program and is sharing their success.
Return ONLY valid JSON, no markdown:
{
  "contactName": "Full Name",
  "messages": [
    {"text": "message text", "isMe": false},
    {"text": "Dan's reply", "isMe": true},
    ...5-7 more messages alternating
  ]
}
Messages should be short, 1-2 sentences, casual. Person shares how they habituated, sleep better, don't fear the sound anymore. Dan is warm and encouraging. Do NOT promise a cure.`;
    } else {
        prompt = `Generate a realistic Facebook Messenger conversation between Dan (an online business coach / Code On Fire creator) and a student who is excited about their results.
Return ONLY valid JSON, no markdown:
{
  "contactName": "Full Name",
  "messages": [
    {"text": "message text", "isMe": false},
    {"text": "Dan's reply", "isMe": true},
    ...5-7 more messages alternating
  ]
}
Messages should be short, 1-2 sentences, casual. Student shares results or asks about implementation. Dan is helpful, encouraging.`;
    }
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


// ─── Mixed Bulk Content Generator ─────────────────────────────────────────────

export type ContentType = 'facebook' | 'gmail' | 'messenger' | 'tiktok' | 'youtube';

export interface MixedContentItem {
    type: ContentType;
    // Facebook fields
    fbReview?: GeneratedReview;
    // Gmail fields
    gmailThread?: GeneratedGmailThread;
    // Messenger fields
    messengerThread?: GeneratedMessengerThread;
    // TikTok fields
    tiktokComment?: { username: string; text: string; likes: string; avatar: string; };
    // YouTube fields
    youtubeComment?: { handle: string; text: string; likes: string; timeAgo: string; };
}

export async function generateMixedBulkContent(
    count: number,
    mode: 'default' | 'tinnitus' | 'tinnitus-chat' | 'tinnitus-coaching' = 'default',
    incomeMin = 10000,
    incomeMax = 150000,
    onProgress?: (done: number, total: number) => void
): Promise<MixedContentItem[]> {
    const items: MixedContentItem[] = [];
    const BATCH_SIZE = 5;
    const types: ContentType[] = ['facebook', 'gmail', 'messenger', 'tiktok', 'youtube'];

    // Pre-assign types randomly for each slot
    const assignments: ContentType[] = Array.from({ length: count }, () =>
        types[Math.floor(Math.random() * types.length)]
    );

    for (let i = 0; i < count; i += BATCH_SIZE) {
        const batchAssignments = assignments.slice(i, i + BATCH_SIZE);

        const batchResults = await Promise.all(
            batchAssignments.map(async (type): Promise<MixedContentItem> => {
                try {
                    switch (type) {
                        case 'facebook': {
                            const name = generateRandomName();
                            const text = await generateAIReview(name, incomeMin, incomeMax, mode);
                            const stats = generateEngagementStats();
                            return {
                                type: 'facebook',
                                fbReview: {
                                    name,
                                    avatarUrl: getAvatarUrl(name, 0),
                                    review: text,
                                    likes: stats.likes,
                                    comments: stats.comments,
                                    shares: stats.shares,
                                    timestamp: generateRandomTimestamp(),
                                },
                            };
                        }
                        case 'gmail': {
                            const thread = await generateGmailThread(mode);
                            return { type: 'gmail', gmailThread: thread };
                        }
                        case 'messenger': {
                            const thread = await generateMessengerThread(mode);
                            return { type: 'messenger', messengerThread: thread };
                        }
                        case 'tiktok': {
                            const data = await generateTikTokComments(mode);
                            const comment = data.comments[Math.floor(Math.random() * data.comments.length)];
                            const name = generateRandomName();
                            return {
                                type: 'tiktok',
                                tiktokComment: {
                                    username: comment.username,
                                    text: comment.text,
                                    likes: comment.likes,
                                    avatar: getAvatarUrl(name, 0),
                                },
                            };
                        }
                        case 'youtube': {
                            const data = await generateYouTubeComments(mode);
                            const comment = data.comments[Math.floor(Math.random() * data.comments.length)];
                            return {
                                type: 'youtube',
                                youtubeComment: {
                                    handle: comment.handle,
                                    text: comment.text,
                                    likes: comment.likes,
                                    timeAgo: comment.timeAgo,
                                },
                            };
                        }
                    }
                } catch {
                    // Fallback to a facebook post on error
                    const name = generateRandomName();
                    const stats = generateEngagementStats();
                    const fallbackText = mode === 'tinnitus-coaching'
                        ? TINNITUS_COACHING_REVIEW_TEMPLATES[Math.floor(Math.random() * TINNITUS_COACHING_REVIEW_TEMPLATES.length)]()
                        : mode === 'tinnitus-chat'
                            ? TINNITUS_CHAT_REVIEW_TEMPLATES[Math.floor(Math.random() * TINNITUS_CHAT_REVIEW_TEMPLATES.length)]()
                            : mode === 'tinnitus'
                                ? TINNITUS_REVIEW_TEMPLATES[Math.floor(Math.random() * TINNITUS_REVIEW_TEMPLATES.length)](name)
                                : REVIEW_TEMPLATES[Math.floor(Math.random() * REVIEW_TEMPLATES.length)](getRandomIncome(incomeMin, incomeMax));
                    return {
                        type: 'facebook',
                        fbReview: {
                            name,
                            avatarUrl: getAvatarUrl(name, 0),
                            review: fallbackText,
                            likes: stats.likes,
                            comments: stats.comments,
                            shares: stats.shares,
                            timestamp: generateRandomTimestamp(),
                        },
                    };
                }
            })
        );

        items.push(...batchResults);
        if (onProgress) onProgress(Math.min(i + BATCH_SIZE, count), count);
    }

    return items;
}
