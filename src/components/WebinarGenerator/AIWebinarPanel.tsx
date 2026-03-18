import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import './WebinarGen.css';

// 85 travel photos converted from Downloads
export const TRAVEL_PICS: string[] = Array.from({ length: 85 }, (_, i) => {
    const files = [
        'IMG_0312.jpg', 'IMG_0371.jpg', 'IMG_0639.jpg', 'IMG_1163 2.jpg', 'IMG_1163.jpg',
        'IMG_1496.jpg', 'IMG_1767.jpg', 'IMG_1907.jpg', 'IMG_2648.jpg', 'IMG_2794.jpg',
        'IMG_2796.jpg', 'IMG_2797.jpg', 'IMG_2799.jpg', 'IMG_2800.jpg', 'IMG_2802.jpg',
        'IMG_2804.jpg', 'IMG_2823.jpg', 'IMG_2825.jpg', 'IMG_2827.jpg', 'IMG_2828.jpg',
        'IMG_2829.jpg', 'IMG_2830.jpg', 'IMG_2831.jpg', 'IMG_2832.jpg', 'IMG_2845.jpg',
        'IMG_2846.jpg', 'IMG_2847.jpg', 'IMG_2848.jpg', 'IMG_2849.jpg', 'IMG_2850.jpg',
        'IMG_2851.jpg', 'IMG_2852.jpg', 'IMG_2853.jpg', 'IMG_2854.jpg', 'IMG_2855.jpg',
        'IMG_2856.jpg', 'IMG_2857.jpg', 'IMG_2859.jpg', 'IMG_2880.jpg', 'IMG_2888.jpg',
        'IMG_2928.jpg', 'IMG_2929.jpg', 'IMG_2939.jpg', 'IMG_2940.jpg', 'IMG_2941.jpg',
        'IMG_2968.jpg', 'IMG_2969.jpg', 'IMG_2970.jpg', 'IMG_2971.jpg', 'IMG_2972.jpg',
        'IMG_2973.jpg', 'IMG_2974.jpg', 'IMG_2975.jpg', 'IMG_3061.jpg', 'IMG_3132.jpg',
        'IMG_3133.jpg', 'IMG_3643.jpg', 'IMG_3644.jpg', 'IMG_7468.jpg', 'IMG_9210.jpg',
    ];
    return `/travel-pics/${files[i % files.length]}`;
});

interface AIWebinarPanelProps {
    onSlidesGenerated: (slides: any[]) => void;
    onConfigUpdate?: (config: Partial<any>) => void;
}

// Dan's story defaults — pre-filled
const DAN_DEFAULTS = {
    hostName: 'Dan Plants',
    audience: '25-45 year old 9-5 employees and aspiring entrepreneurs who feel trapped, unfulfilled, and want to travel the world or work from anywhere, but don\'t know how to start a business or make real money online. They dream of financial and location freedom but have tried things before and failed.',
    programName: 'Code On Fire University',
    transformation: 'Go from zero to signing $3k-$10k/month smart website clients in 90 days using Dan\'s proven Code On Fire method — no coding degree required',
    price: '2,997',
    bonuses: `Done-For-You Website Templates (builds sites in hours, not weeks) — $997 value
1-on-1 Kickoff Strategy Call with Dan — $500 value  
Private Code On Fire Community (weekly Q&A, accountability) — $197/mo value
Client Acquisition Scripts & Email Templates — $297 value
The "First Client in 30 Days" Fast-Track Module — $497 value`,
    strategyCall: '30-minute "Website Business Blueprint" call where Dan personally reviews your situation, shows you exactly which niche to target, gives you a custom 90-day action plan, and maps out your first 3-5 client outreach targets. No fluff. Pure strategy.',
    colorScheme: 'modern-dark',
};

const AIWebinarPanel: React.FC<AIWebinarPanelProps> = ({ onSlidesGenerated }) => {
    const [form, setForm] = useState(DAN_DEFAULTS);
    const [status, setStatus] = useState('');
    const [progress, setProgress] = useState(0);
    const [generating, setGenerating] = useState(false);

    const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

    const generate = async () => {
        const apiKey = (import.meta as any).env.VITE_OPENAI_API_KEY;
        if (!apiKey) { setStatus('⚠️ No OpenAI API key in .env'); return; }
        if (!form.programName || !form.audience || !form.transformation) {
            setStatus('⚠️ Fill in at least: Target Audience, Program Name, and Transformation'); return;
        }

        setGenerating(true);
        setStatus('Starting webinar generation...');
        setProgress(5);

        const danStory = `
HOST BACKSTORY (weave this throughout naturally):
Dan Plants grew up in America — had the house, the car, the "dream life" on paper. But he felt deeply unfulfilled. So he sold everything, packed one backpack, and started traveling the world. He meditated in temples in Thailand, watched sunrises in Bali, hiked through the mountains of Mexico. The lifestyle is funded entirely by his "Code On Fire method" — building and selling smart websites to local and online businesses. Now he coaches others to do exactly the same: start a website business from their laptop, work from anywhere, and design their own life. Dan has helped hundreds of students land their first clients and achieve location freedom.

PROGRAM CONTEXT:
Code On Fire University teaches people to build and sell professional websites to businesses using Dan's simplified method (no coding degree needed). Students learn client acquisition, website builds using templates and tools, and how to package and price their services. The core offer leads to a free "Website Business Blueprint" strategy call.`;

        const sections = [
            { name: 'PRE-WEBINAR & HOOK', target: 12, desc: `Slides 1-12: Countdown screen, welcome with high energy, Dan's relatable "sold everything to travel" hook, the big promise ("by end of this you'll have a clear roadmap to your first $3k-$10k website client"), commitment question, set expectations, agenda overview, ask attendees where they're joining from in chat.` },
            { name: 'PROBLEM DEEP DIVE', target: 14, desc: `Slides 13-26: Paint vivid "before" state — stuck in the 9-5, trading time for money, watching others travel, scrolling Instagram thinking "must be nice". Dan's vulnerable story of feeling unfulfilled despite having the "perfect life". 5 mistakes people make trying to make money online. The REAL cost of staying stuck. Agitation: "Most people will be in the exact same place 12 months from now..."` },
            { name: 'PROMISE & POSSIBILITY', target: 14, desc: `Slides 27-40: Dan's breakthrough moment (selling his first website client from a café in Bali). ONE detailed case study of a student who went from stuck to freedom using Code On Fire. The Code On Fire Framework revealed (3-5 steps). What the "after" picture looks like — working from anywhere, laptop lifestyle, picking up clients on demand, traveling while earning.` },
            { name: 'SOLUTION REVEALED', target: 14, desc: `Slides 41-54: Introduction of Code On Fire University. Walk through the modules/phases. Highlight features that solve each pain point. Dan's credentials — developer, world traveler, built websites for hundreds of businesses. What makes COF different: speed (get a client in 30 days), simplicity, the done-for-you templates, and the community support. The "secret sauce" is the client acquisition system.` },
            { name: 'SOCIAL PROOF & OBJECTIONS', target: 12, desc: `Slides 55-66: 2-3 student transformation stories (specific numbers, backgrounds). Handle objections: "I have no tech skills" (you don't need them), "I don't have time" (this is how you BUY back time), "I can't afford it" (cost of staying stuck), "What if it doesn't work" (guarantee + support), "I need to think about it" (thinking keeps you stuck).` },
            { name: 'THE OFFER & CTA', target: 14, desc: `Slides 67-80: What's included in Code On Fire University. Bonuses reveal one by one. Value stack ($2,988+). Reveal the actual investment. Payment plan options. Scarcity (limited strategy call spots). Strategy call pitch — "click the link, pick a time, I'll personally build your blueprint". Instructions to book. Testimonial social proof ticker.` },
            { name: 'URGENCY & CLOSE', target: 10, desc: `Slides 81-90: Timer on screen. "Here's who this is NOT for" (people who want quick fixes without effort). Final emotional appeal — "The only thing between you and the life you want is a decision you make today." Celebrate early bookers. Final scarcity. Warmth, gratitude close. Replay instructions. Coaching Dan — "I'll be on for questions."` },
        ];

        const allSlides: any[] = [];
        let slideNumber = 1;

        for (let si = 0; si < sections.length; si++) {
            const sec = sections[si];
            setStatus(`Generating Section ${si + 1}/7: ${sec.name}...`);
            setProgress(Math.round(10 + (si / sections.length) * 80));

            const prompt = `You are an expert high-ticket webinar script writer specializing in lifestyle and business coaching webinars.

${danStory}

WEBINAR DETAILS:
- Host: ${form.hostName}
- Program: ${form.programName}
- Target Audience: ${form.audience}
- Core Transformation: ${form.transformation}
- Price: $${form.price || '2,997'}
- Bonuses: ${form.bonuses}
- Strategy Call: ${form.strategyCall}

SECTION TO GENERATE: "${sec.name}"
SECTION INSTRUCTIONS: ${sec.desc}

Starting at slide number ${slideNumber}.

Return ONLY a valid JSON object with this exact format:
{"slides": [array of slide objects]}

Each slide object:
{
  "slideNum": number,
  "type": "title"|"content"|"bullet"|"testimonial"|"offer"|"social-proof"|"cta",
  "section": "${sec.name}",
  "title": "compelling, specific headline",
  "bullets": ["point 1 with specific detail", "point 2", "point 3"],
  "speakerNote": "Exact word-for-word script the host delivers on this slide. 2-4 natural, conversational sentences. Include Dan's personality — warm, real, slightly vulnerable.",
  "timing": "MM:SS-MM:SS"
}

Generate exactly ${sec.target} slides. Make content HIGHLY specific to Code On Fire University and Dan's travel/lifestyle story. Speaker notes must feel authentic — like Dan is actually speaking, not reading bullet points. Use emotional storytelling and high-ticket sales psychology.`;

            try {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                    body: JSON.stringify({
                        model: 'gpt-4o-mini',
                        messages: [{ role: 'user', content: prompt }],
                        max_tokens: 3500,
                        temperature: 0.82,
                        response_format: { type: 'json_object' },
                    }),
                });

                if (!response.ok) throw new Error(`API ${response.status}`);
                const data = await response.json();
                const parsed = JSON.parse(data.choices[0].message.content);

                const rawSlides: any[] = Array.isArray(parsed)
                    ? parsed
                    : Array.isArray(parsed.slides)
                        ? parsed.slides
                        : (Object.values(parsed).find((v: any) => Array.isArray(v)) as any[]) ?? [];

                rawSlides.forEach((s: any) => {
                    allSlides.push({
                        id: slideNumber - 1,
                        slideNum: slideNumber,
                        type: s.type || 'content',
                        section: sec.name,
                        title: s.title || `Slide ${slideNumber}`,
                        bullets: Array.isArray(s.bullets) ? s.bullets : [],
                        content: Array.isArray(s.bullets) ? s.bullets.join('\n') : (s.content || ''),
                        speakerNote: s.speakerNote || '',
                        timing: s.timing || '',
                    });
                    slideNumber++;
                });

            } catch (err) {
                console.error('Section error:', err);
                for (let p = 0; p < sec.target; p++) {
                    allSlides.push({ id: slideNumber - 1, slideNum: slideNumber, type: 'content', section: sec.name, title: sec.name, bullets: [], content: '', speakerNote: '' });
                    slideNumber++;
                }
            }
        }

        setProgress(95);
        setStatus(`✅ ${allSlides.length} slides generated! Loading presentation...`);
        onSlidesGenerated(allSlides);
        setProgress(100);
        setStatus(`🎤 Webinar ready! ${allSlides.length} slides. Hit "Download PPTX" to export.`);
        setGenerating(false);
    };

    return (
        <div className="wg-ai-panel">
            <div className="wg-ai-header">
                <Sparkles size={18} />
                <h3>AI Webinar Generator</h3>
            </div>
            <p className="wg-ai-sub">Pre-filled with your Code On Fire University story. Edit any field, then generate 80–100 slides with full speaker notes.</p>

            <div className="wg-scroll-content">
                <div className="wg-section">
                    <div className="wg-section-title">Your Details</div>

                    <div className="wg-input-group">
                        <label className="wg-label">Host Name</label>
                        <input className="wg-input" value={form.hostName} onChange={e => set('hostName', e.target.value)} />
                    </div>

                    <div className="wg-input-group">
                        <label className="wg-label">Target Audience</label>
                        <textarea className="wg-textarea" rows={4} value={form.audience} onChange={e => set('audience', e.target.value)} />
                    </div>

                    <div className="wg-input-group">
                        <label className="wg-label">Program Name</label>
                        <input className="wg-input" value={form.programName} onChange={e => set('programName', e.target.value)} />
                    </div>

                    <div className="wg-input-group">
                        <label className="wg-label">Core Transformation</label>
                        <input className="wg-input" value={form.transformation} onChange={e => set('transformation', e.target.value)} />
                    </div>

                    <div className="wg-input-group">
                        <label className="wg-label">Price ($)</label>
                        <input className="wg-input" value={form.price} onChange={e => set('price', e.target.value)} />
                    </div>

                    <div className="wg-input-group">
                        <label className="wg-label">Bonuses <span className="wg-hint">(one per line)</span></label>
                        <textarea className="wg-textarea" rows={5} value={form.bonuses} onChange={e => set('bonuses', e.target.value)} />
                    </div>

                    <div className="wg-input-group">
                        <label className="wg-label">Strategy Call Details</label>
                        <textarea className="wg-textarea" rows={3} value={form.strategyCall} onChange={e => set('strategyCall', e.target.value)} />
                    </div>

                    <div className="wg-input-group">
                        <label className="wg-label">Color Scheme</label>
                        <select className="wg-select" value={form.colorScheme} onChange={e => set('colorScheme', e.target.value)}>
                            <option value="modern-dark">Modern Dark</option>
                            <option value="corporate-blue">Corporate Blue</option>
                            <option value="vibrant-orange">Vibrant Orange</option>
                            <option value="luxury-gold">Luxury Gold</option>
                        </select>
                    </div>
                </div>

                {status && (
                    <div className={`wg-status ${status.startsWith('⚠️') ? 'warn' : (status.startsWith('✅') || status.startsWith('🎤')) ? 'success' : 'info'}`}>
                        {generating && <Loader2 size={14} className="spin" />}
                        {status}
                    </div>
                )}

                {generating && (
                    <div className="wg-progress-track">
                        <div className="wg-progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                )}

                <button className="wg-btn wg-ai-generate-btn" onClick={generate} disabled={generating}>
                    {generating ? (
                        <><Loader2 size={16} className="spin" /> Generating... {progress}%</>
                    ) : (
                        <><Sparkles size={16} /> Generate Full Webinar (80–100 Slides)</>
                    )}
                </button>
            </div>
        </div>
    );
};

export default AIWebinarPanel;
