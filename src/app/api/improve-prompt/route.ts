import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `Du bist ein Experte für KI-Bildgenerierung-Prompts, spezialisiert auf Nano Banana Pro (Google Imagen).

Der User gibt dir einen existierenden Bild-Prompt. Verbessere ihn nach diesen Regeln:

NANO BANANA PRO REGELN:
- Vollständige, beschreibende Sätze — KEINE Keyword-Listen
- Natürliche, konversationelle Sprache
- Maximal 120 Wörter
- Negative Konzepte positiv formulieren

VERBESSERUNGEN:
- Füge präzise Licht-Beschreibung hinzu wenn fehlend
- Füge Tiefe hinzu: Vordergrund, Mittelgrund, Hintergrund
- Füge Textur und Material-Details hinzu
- Füge Atmosphäre und Stimmung hinzu
- Füge Kamera/Lens-Beschreibung hinzu wenn passend
- Behalte den Kern-Inhalt bei, aber mache ihn visuell reicher

Antworte NUR mit dem verbesserten Prompt auf Englisch. Kein anderer Text.`;

export async function POST(request: Request) {
  try {
    const { prompt, filmStock, lens, cinematicStyle, mood } = await request.json();

    let userMsg = `Verbessere diesen Bild-Prompt:\n\n"${prompt}"`;

    if (filmStock) userMsg += `\n\nGewünschter Film-Stock: ${filmStock}`;
    if (lens) userMsg += `\nGewünschte Linse: ${lens}`;
    if (cinematicStyle) userMsg += `\nGewünschter Stil: ${cinematicStyle}`;
    if (mood) userMsg += `\nGewünschte Stimmung: ${mood}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMsg },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const improved = completion.choices[0]?.message?.content?.trim() || prompt;

    return NextResponse.json({ improved });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Fehler';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
