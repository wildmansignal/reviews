/**
 * pptxExport.ts — Converts webinar slide data to a downloadable .pptx file
 * Uses pptxgenjs under the hood.
 */

import pptxgen from 'pptxgenjs';

type ColorScheme = 'modern-dark' | 'corporate-blue' | 'vibrant-orange' | 'luxury-gold';

interface SchemeColors {
    bg: string;
    text: string;
    accent: string;
    bullet: string;
}

const SCHEMES: Record<ColorScheme, SchemeColors> = {
    'modern-dark': { bg: '0f0f1a', text: 'f1f5f9', accent: 'a78bfa', bullet: '7c3aed' },
    'corporate-blue': { bg: '1e3a8a', text: 'f0f9ff', accent: '60a5fa', bullet: '2563eb' },
    'vibrant-orange': { bg: '7c2d12', text: 'fff7ed', accent: 'fb923c', bullet: 'ea580c' },
    'luxury-gold': { bg: '000000', text: 'fbbf24', accent: 'f59e0b', bullet: 'd97706' },
};

export async function exportWebinarToPptx(
    slides: any[],
    config: any,
    travelPics: string[] = []
): Promise<void> {
    const pptx = new pptxgen();

    // Layout: 16:9 widescreen
    pptx.layout = 'LAYOUT_WIDE';
    pptx.author = config.general?.host || 'Dan Plants';
    pptx.title = config.general?.title || 'Code On Fire University Webinar';
    pptx.subject = 'High-Ticket Webinar Script';

    const schemeName: ColorScheme = (config.style?.colorScheme as ColorScheme) ?? 'modern-dark';
    const scheme = SCHEMES[schemeName] ?? SCHEMES['modern-dark'];

    // Track which travel pic to use
    let travelPicIdx = 0;
    const nextPic = () => travelPics.length ? travelPics[travelPicIdx++ % travelPics.length] : null;

    const filledSlides = slides.filter(s => s && s.type !== 'empty');

    for (const slide of filledSlides) {
        const pSlide = pptx.addSlide();

        // Background
        pSlide.background = { color: scheme.bg };

        // Section label (top-left)
        if (slide.section) {
            pSlide.addText(slide.section.toUpperCase(), {
                x: 0.4, y: 0.2, w: 8, h: 0.3,
                fontSize: 9,
                color: scheme.accent,
                bold: true,
                charSpacing: 3,
            });
        }

        // Timing (top-right)
        if (slide.timing) {
            pSlide.addText(slide.timing, {
                x: 8.5, y: 0.2, w: 2, h: 0.3,
                fontSize: 9,
                color: scheme.text,
                align: 'right',
            });
        }

        // Decide if this slide gets a travel pic (every ~7th content slide, or photo/story slides)
        const isTravelSlide =
            travelPics.length > 0 &&
            (slide.type === 'social-proof' ||
                (slide.section?.includes('PROBLEM') && travelPicIdx % 3 === 0) ||
                (slide.section?.includes('SOLUTION') && travelPicIdx % 4 === 0) ||
                slide.title?.toLowerCase().includes('story') ||
                slide.title?.toLowerCase().includes('travel') ||
                slide.title?.toLowerCase().includes('lifestyle'));

        if (isTravelSlide) {
            const pic = nextPic();
            if (pic) {
                try {
                    // Right-side image panel
                    pSlide.addImage({ path: pic, x: 6.5, y: 0.6, w: 3, h: 5.2, sizing: { type: 'cover', w: 3, h: 5.2 } });
                    // Title (left side)
                    pSlide.addText(slide.title || '', {
                        x: 0.4, y: 0.7, w: 5.8, h: 1.4,
                        fontSize: 26,
                        bold: true,
                        color: scheme.text,
                        wrap: true,
                    });
                    // Bullets (left side)
                    if (slide.bullets?.length) {
                        const bulletItems = slide.bullets.map((b: string) => ({
                            text: b,
                            options: { bullet: { type: 'number' }, color: scheme.text, fontSize: 14, paraSpaceAfter: 10 }
                        }));
                        pSlide.addText(bulletItems, { x: 0.4, y: 2.4, w: 5.8, h: 3.4 });
                    }
                } catch {
                    // Fall back to full-width if image fails
                    addFullWidthSlide(pSlide, slide, scheme);
                }
            } else {
                addFullWidthSlide(pSlide, slide, scheme);
            }
        } else {
            addFullWidthSlide(pSlide, slide, scheme);
        }

        // Speaker notes
        if (slide.speakerNote) {
            pSlide.addNotes(slide.speakerNote);
        }

        // Slide number footer
        pSlide.addText(`Slide ${slide.slideNum ?? ''}  •  ${config.style?.footerText || '© 2026 Code On Fire University'}`, {
            x: 0.4, y: 6.8, w: 12.2, h: 0.25,
            fontSize: 8,
            color: scheme.text,
            transparency: 60,
        });
    }

    await pptx.writeFile({ fileName: `${(config.general?.title || 'Webinar').replace(/\s+/g, '_')}.pptx` });
}

function addFullWidthSlide(pSlide: any, slide: any, scheme: SchemeColors) {
    // Big title
    pSlide.addText(slide.title || 'Untitled', {
        x: 0.5, y: 0.7, w: 12, h: slide.bullets?.length ? 1.6 : 4,
        fontSize: slide.bullets?.length ? 30 : 42,
        bold: true,
        color: scheme.text,
        wrap: true,
        lineSpacingMultiple: 1.1,
    });

    // Bullets
    if (slide.bullets?.length) {
        // Colored bullet dots
        const dotItems = slide.bullets.map((b: string) => ({
            text: `● ${b}`,
            options: { fontSize: 17, color: scheme.text, paraSpaceAfter: 14, bullet: false }
        }));

        pSlide.addText(dotItems, {
            x: 0.5, y: 2.6, w: 12, h: 3.8,
            color: scheme.text,
            fontSize: 17,
            wrap: true,
            lineSpacingMultiple: 1.3,
        });
    }

    // CTA button look for offer slides
    if (slide.type === 'offer' || slide.type === 'cta') {
        pSlide.addShape('roundRect', {
            x: 3.5, y: 5.8, w: 6, h: 0.7,
            fill: { color: scheme.accent },
            line: { color: scheme.accent },
        });
        pSlide.addText('Book Your Free Strategy Call →', {
            x: 3.5, y: 5.8, w: 6, h: 0.7,
            fontSize: 16,
            bold: true,
            color: '000000',
            align: 'center',
        });
    }
}
