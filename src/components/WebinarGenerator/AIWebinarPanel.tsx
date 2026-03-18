import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import './WebinarGen.css';

interface AIWebinarPanelProps {
    onSlidesGenerated: (slides: any[]) => void;
}

const AIWebinarPanel: React.FC<AIWebinarPanelProps> = ({ onSlidesGenerated }) => {
    const [form, setForm] = useState({
        audience: '',
        programName: '',
        transformation: '',
        price: '',
        bonuses: '',
        strategyCall: '',
        hostName: '',
        colorScheme: 'modern-dark',
    });
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
        setStatus('Generating slide outlines...');
        setProgress(5);

        // We generate 7 sections sequentially, ~12-15 slides each = 85-100 total
        const sections = [
            { name: 'PRE-WEBINAR & HOOK', target: 12, desc: 'Slides 1-12: Countdown/welcome, host intro, big promise, commitment question, set expectations, relatable story, authority credentials, what attends will learn (3 slides), chat engagement, agenda overview.' },
            { name: 'PROBLEM DEEP DIVE', target: 14, desc: 'Slides 13-26: Paint the "before" state, struggle story, 5 common mistakes people make, the hidden cost of inaction, agitation statements, emotional pain points, the frustration cycle.' },
            { name: 'PROMISE & POSSIBILITY', target: 14, desc: 'Slides 27-40: The breakthrough moment, ONE detailed case study (before/after), framework introduction (3-5 steps), more case study proof points, imagine the "after" state.' },
            { name: 'SOLUTION REVEALED', target: 14, desc: 'Slides 41-54: Program introduction, program modules/phases walkthrough, feature highlights tied to pain points, host credentials/story, what makes this different, the secret sauce.' },
            { name: 'SOCIAL PROOF & OBJECTIONS', target: 12, desc: 'Slides 55-66: 2-3 more testimonials/case studies, handle 5 objections (time, money, thinking, doubt, DIY), reframe each objection powerfully.' },
            { name: 'THE OFFER & CTA', dest: true, target: 14, desc: 'Slides 67-80: What is included, bonuses reveal (one per slide), value stack total, reveal price, payment plan, scarcity elements, strategy call pitch, step-by-step booking instructions, what happens on the call.' },
            { name: 'URGENCY & CLOSE', target: 10, desc: 'Slides 81-90: Timer on screen, who this is NOT for (exclusivity), final emotional appeal, live Q&A slide, celebrate those who booked, final scarcity reminder, gratitude close, replay instructions, music fade.' },
        ];

        const allSlides: any[] = [];
        let slideNumber = 1;

        for (let si = 0; si < sections.length; si++) {
            const sec = sections[si];
            setStatus(`Generating Section ${si + 1}/7: ${sec.name}...`);
            setProgress(Math.round(10 + (si / sections.length) * 80));

            const prompt = `You are an expert high-ticket webinar script writer. Generate exactly ${sec.target} presentation slides for the section "${sec.name}".

WEBINAR DETAILS:
- Host: ${form.hostName || 'Host'}
- Program: ${form.programName}
- Target Audience: ${form.audience}
- Core Transformation: ${form.transformation}
- Price: $${form.price || 'X,XXX'}
- Bonuses: ${form.bonuses || 'Bonus 1, Bonus 2, Bonus 3'}
- Strategy Call: ${form.strategyCall || '30-min custom blueprint session'}

SECTION INSTRUCTIONS:
${sec.desc}

Starting at slide number ${slideNumber}.

Return ONLY a JSON array of exactly ${sec.target} slide objects. Each object must have:
{
  "slideNum": number,
  "type": "title"|"content"|"bullet"|"testimonial"|"offer"|"social-proof"|"cta",
  "section": "${sec.name}",
  "title": "compelling headline for this slide",
  "bullets": ["point 1", "point 2", "point 3"],
  "speakerNote": "exact word-for-word script (2-4 sentences) the host says on this slide",
  "timing": "MM:SS-MM:SS estimated timing"
}

Make the content HIGHLY specific to the program details given. Speaker notes should be emotionally compelling, conversational, and 100% ready to deliver. Use modern high-ticket sales psychology throughout.`;

            try {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                    body: JSON.stringify({
                        model: 'gpt-4o-mini',
                        messages: [{ role: 'user', content: prompt }],
                        max_tokens: 3500,
                        temperature: 0.8,
                        response_format: { type: 'json_object' },
                    }),
                });

                if (!response.ok) throw new Error(`API error ${response.status}`);
                const data = await response.json();
                const text = data.choices[0].message.content;

                let parsed: any;
                try {
                    parsed = JSON.parse(text);
                } catch {
                    parsed = { slides: [] };
                }

                // Accept array or {slides:[...]} or first array-valued key
                const rawSlides: any[] = Array.isArray(parsed)
                    ? parsed
                    : Array.isArray(parsed.slides)
                        ? parsed.slides
                        : Object.values(parsed).find((v: any) => Array.isArray(v)) as any[] ?? [];

                rawSlides.forEach((s: any) => {
                    allSlides.push({
                        id: slideNumber - 1,
                        slideNum: slideNumber,
                        type: s.type || 'content',
                        section: sec.name,
                        title: s.title || `Slide ${slideNumber}`,
                        bullets: s.bullets || [],
                        content: Array.isArray(s.bullets) ? s.bullets.join('\n') : (s.content || ''),
                        speakerNote: s.speakerNote || '',
                        timing: s.timing || '',
                    });
                    slideNumber++;
                });

            } catch (err) {
                console.error('Section generation error:', err);
                // Add placeholder slides for this section
                for (let p = 0; p < sec.target; p++) {
                    allSlides.push({ id: slideNumber - 1, slideNum: slideNumber, type: 'content', section: sec.name, title: `Section: ${sec.name}`, bullets: [], content: '', speakerNote: '' });
                    slideNumber++;
                }
            }
        }

        setProgress(95);
        setStatus(`✅ Generated ${allSlides.length} slides! Loading...`);
        onSlidesGenerated(allSlides);
        setProgress(100);
        setStatus(`🎤 Webinar ready! ${allSlides.length} slides generated.`);
        setGenerating(false);
    };

    return (
        <div className="wg-ai-panel">
            <div className="wg-ai-header">
                <Sparkles size={18} />
                <h3>AI Webinar Generator</h3>
            </div>
            <p className="wg-ai-sub">Fill in your details → AI builds 80–100 slides with full speaker notes using the PAS framework</p>

            <div className="wg-scroll-content">
                <div className="wg-section">
                    <div className="wg-section-title">Your Details</div>

                    <div className="wg-input-group">
                        <label className="wg-label">Host Name *</label>
                        <input className="wg-input" value={form.hostName} onChange={e => set('hostName', e.target.value)} placeholder="e.g. Dan Plants" />
                    </div>

                    <div className="wg-input-group">
                        <label className="wg-label">Target Audience * <span className="wg-hint">be specific</span></label>
                        <textarea className="wg-textarea" rows={3} value={form.audience} onChange={e => set('audience', e.target.value)}
                            placeholder="e.g. 25-45 year old 9-5 workers making $40-80k who want to quit their job and make $10k+/month online but have tried other programs and failed..." />
                    </div>

                    <div className="wg-input-group">
                        <label className="wg-label">Program Name *</label>
                        <input className="wg-input" value={form.programName} onChange={e => set('programName', e.target.value)} placeholder="e.g. Code On Fire" />
                    </div>

                    <div className="wg-input-group">
                        <label className="wg-label">Core Transformation *</label>
                        <input className="wg-input" value={form.transformation} onChange={e => set('transformation', e.target.value)}
                            placeholder="e.g. Go from $0 to $10k/month online in 90 days using our proven system" />
                    </div>

                    <div className="wg-input-group">
                        <label className="wg-label">Price</label>
                        <input className="wg-input" value={form.price} onChange={e => set('price', e.target.value)} placeholder="e.g. 3,997" />
                    </div>

                    <div className="wg-input-group">
                        <label className="wg-label">Bonuses (one per line)</label>
                        <textarea className="wg-textarea" rows={4} value={form.bonuses} onChange={e => set('bonuses', e.target.value)}
                            placeholder={"1-on-1 Kickoff Strategy Call ($500 value)\nDone-For-You Templates ($297 value)\nPrivate Mastermind Community ($197/mo value)\nWeekly Live Q&A Calls ($1,000 value)"} />
                    </div>

                    <div className="wg-input-group">
                        <label className="wg-label">Strategy Call Details</label>
                        <textarea className="wg-textarea" rows={3} value={form.strategyCall} onChange={e => set('strategyCall', e.target.value)}
                            placeholder="e.g. 30-minute custom blueprint session where we map out your income plan, identify your top 3 leverage points, and build a 90-day roadmap specific to your situation." />
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
                    <div className={`wg-status ${status.startsWith('⚠️') ? 'warn' : status.startsWith('✅') || status.startsWith('🎤') ? 'success' : 'info'}`}>
                        {generating && <Loader2 size={14} className="spin" />}
                        {status}
                    </div>
                )}

                {generating && (
                    <div className="wg-progress-track">
                        <div className="wg-progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                )}

                <button
                    className="wg-btn wg-ai-generate-btn"
                    onClick={generate}
                    disabled={generating}
                >
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
