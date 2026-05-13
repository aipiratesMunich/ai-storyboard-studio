import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Web search via DuckDuckGo (no API key needed)
async function webSearch(query: string): Promise<string[]> {
  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
    });
    const html = await res.text();

    // Extract result snippets
    const snippets: string[] = [];
    const regex = /<a class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g;
    let match;
    while ((match = regex.exec(html)) !== null && snippets.length < 8) {
      const text = match[1].replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").trim();
      if (text.length > 20) snippets.push(text);
    }

    // Fallback: extract from result__a titles
    if (snippets.length === 0) {
      const titleRegex = /<a class="result__a"[^>]*>([\s\S]*?)<\/a>/g;
      while ((match = titleRegex.exec(html)) !== null && snippets.length < 8) {
        const text = match[1].replace(/<[^>]*>/g, '').trim();
        if (text.length > 5) snippets.push(text);
      }
    }

    return snippets;
  } catch (err) {
    console.error('Web search failed:', err);
    return [];
  }
}

const RESEARCH_PROMPT = `Du bist ein Recherche-Agent für ein Storyboard-Studio.

Der User hat eine Video-Idee. Deine Aufgabe:

1. **Kontext-Recherche**: Analysiere die Idee und identifiziere, was recherchiert werden muss
   - Historische/kulturelle Fakten wenn relevant
   - Visuelle Referenzen (Filme, Fotografie, Kunst)
   - Technische Details (Architektur, Kleidung, Umgebung)

2. **Brainstorming**: Erweitere die Idee kreativ
   - Schlage konkrete visuelle Szenen vor
   - Denke in filmischen Begriffen (Einstellungsgrößen, Licht, Stimmung)
   - Identifiziere Key Moments für dramatische Wirkung

3. **Visual Direction**: Schlage vor
   - Passende Film-Stocks (z.B. Cinestill 800T für Nacht, Portra 400 für warm)
   - Passende Linsen/Kameras (z.B. ARRI Alexa für Kino, Anamorphic für Epic)
   - Passende Cinematic Styles (z.B. Neon Noir für Cyberpunk, Nordic Noir für Krimi)
   - Farbpalette und Licht-Konzept

4. **Charakter-Konsistenz**: Wenn Personen vorkommen
   - Definiere EXAKTE Charakter-Beschreibung (Alter, Hautfarbe, Haare, Kleidung, Körperbau)
   - Diese Beschreibung muss in JEDEM Bild-Prompt identisch sein

Antworte auf DEUTSCH in klarer Struktur mit Markdown-Überschriften.
Wenn Web-Suchergebnisse mitgeliefert werden, nutze sie als Fakten-Grundlage.`;

export async function POST(request: Request) {
  try {
    const { idea } = await request.json();

    if (!idea?.trim()) {
      return NextResponse.json({ error: 'Keine Idee angegeben' }, { status: 400 });
    }

    // Step 1: Web search for context
    const searchQueries = [
      idea,
      `${idea} cinematic visual reference`,
      `${idea} photography style mood`,
    ];

    const searchResults = await Promise.all(searchQueries.map(q => webSearch(q)));
    const allSnippets = searchResults.flat();

    // Step 2: GPT brainstorm with search context
    let userMessage = `Video-Idee: "${idea}"`;

    if (allSnippets.length > 0) {
      userMessage += `\n\nWeb-Recherche-Ergebnisse:\n${allSnippets.map((s, i) => `${i + 1}. ${s}`).join('\n')}`;
    }

    userMessage += `\n\nBitte analysiere die Idee, recherchiere den Kontext, und erstelle eine kreative Visual Direction als Grundlage für das Storyboard.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: RESEARCH_PROMPT },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.9,
      max_tokens: 2000,
    });

    const research = completion.choices[0]?.message?.content?.trim() || '';

    return NextResponse.json({
      research,
      searchResults: allSnippets,
      searchQueries,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unbekannter Fehler';
    console.error('Research error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
