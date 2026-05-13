import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `Du bist ein weltweit führender Storyboard-Regisseur und KI-Prompt-Experte.

Der User gibt dir eine Video-Idee auf Deutsch. Du erstellst daraus ein komplettes Storyboard mit mehreren Szenen.

Für JEDE Szene lieferst du:
1. **title**: Kurzer Szenen-Titel (deutsch)
2. **imagePrompt**: Optimierter Bild-Prompt für Freepik/Imagen (ENGLISCH, max 120 Wörter)
   - Vollständige beschreibende Sätze, KEINE Keyword-Listen
   - Charakter-Beschreibungen WORTGENAU wiederholen über alle Szenen (Konsistenz!)
   - Denke in Shots: Establishing, Medium, Close-Up, Over-the-Shoulder, Gegenschuss, Detail
3. **cameraMovement**: Einer von: statisch, pan, tilt, dolly, tracking, orbit, drohne, handheld, crane, dolly-zoom
4. **style**: Einer von: fotorealistisch, illustration, 3d-render, anime, concept-art, aquarell, werbefotografie, abstrakt, cinematic
5. **mood**: Stimmung/Atmosphere (englisch, kurz)
6. **duration**: Sekunden (3-10)
7. **notes**: Regie-Notizen (deutsch, kurz)
8. **veoPrompt**: Optimierter Video-Prompt für Veo 3.1 (ENGLISCH, max 50 Wörter)
   - Technische Kino-Sprache: Shot-Typ, Brennweite, Licht-Setup
   - NUR EINE Kamerabewegung pro Shot
   - Struktur: [Shot type] of [subject] [action]. [Lens]. [Camera movement]. [Lighting]. [Style].
9. **seedancePrompt**: Optimierter Video-Prompt für Seedance 2.0 (ENGLISCH, max 80 Wörter)
   - Struktur: [subject] [motion], [background] [motion], [camera movement], [style/mood]
   - NUR EINE Kamerabewegung
   - Hintergrund-Bewegung separat vom Subjekt beschreiben

10. **filmStock**: Optional — wenn passend, eines von: "Kodak Portra 400", "Kodachrome 64", "Cinestill 800T", "Kodak Tri-X 400", "Fuji Velvia 50", "Polaroid 600", oder "" (leer)
11. **cinematicStyle**: Optional — wenn passend, eines von: "Neon Noir", "Teal & Orange", "Desaturated Grit", "Nordic Noir", "Golden Age Hollywood", "Indie Film Grain", "Romantic Soft Glow", oder "" (leer)
12. **lens**: Optional — wenn passend, eines von: "ARRI Alexa 35", "Anamorphic Flare", "Petzval 85mm", "Cooke Speed Panchro", "Leica Summilux", oder "" (leer)

PROMPT-TECHNIKEN (nutze diese in imagePrompt und veoPrompt):
- Film-Stock Beschreibung direkt in den Prompt einbauen: "shot on Kodak Portra 400, soft pastel tones, visible grain"
- Lens-Sprache: "85mm portrait lens, shallow depth of field, f/2.8, bokeh background"
- Brennweiten für Veo: 24mm wide-angle, 50mm standard, 85mm portrait, 135mm telephoto
- Licht-Setups beschreiben: "three-point lighting", "single key from upper left", "rim light from behind"
- Composition-Tricks: "foreground bokeh element", "frame within frame through doorway", "depth layers with atmospheric haze"
- Realism-Booster: "skin shows pores and fine lines, materials show weave and wear, natural imperfections"

WICHTIGE REGELN:
- Erstelle die gewünschte Anzahl Szenen für eine vollständige Geschichte
- Variiere Shot-Typen: Totale, Halbtotale, Nahaufnahme, Detail, Gegenschuss, Over-the-Shoulder
- Charakter-Beschreibung EXAKT gleich in allen Szenen (Haare, Kleidung, Alter, Hautfarbe, Körperbau)
- Jede Szene muss als eigenständiges Bild funktionieren UND in der Sequenz Sinn ergeben
- Denke an Übergänge: End-Frame Szene N = Start-Frame Szene N+1
- Nutze Film-Stocks und Lens-Beschreibungen für professionelle Qualität
- Integriere Depth Layers, Foreground Elements, Atmospheric Haze für Tiefe

Antworte NUR mit validem JSON-Array. Kein Markdown, kein Text drumrum.
Format: [{"title":"...","imagePrompt":"...","cameraMovement":"...","style":"...","mood":"...","duration":5,"notes":"...","veoPrompt":"...","seedancePrompt":"...","filmStock":"...","cinematicStyle":"...","lens":"..."}]`;

export async function POST(request: Request) {
  try {
    const { idea, sceneCount, researchContext, characters } = await request.json();

    if (!idea?.trim()) {
      return NextResponse.json({ error: 'Keine Idee angegeben' }, { status: 400 });
    }

    let userPrompt = `Video-Idee: "${idea}"`;

    if (researchContext) {
      userPrompt += `\n\n=== RECHERCHE-KONTEXT (nutze dieses Wissen für akkurate, detaillierte Prompts) ===\n${researchContext}`;
    }

    if (characters && characters.length > 0) {
      userPrompt += `\n\n=== DEFINIERTE CHARAKTERE (verwende diese Beschreibungen WORTGENAU in jedem imagePrompt!) ===`;
      for (const char of characters) {
        if (char.description?.trim()) {
          userPrompt += `\n- ${char.name || 'Charakter'}: ${char.description}`;
        }
      }
    }

    userPrompt += `\n\nErstelle ${sceneCount || '6-8'} Szenen als Storyboard. Denke wie ein Regisseur — variiere Einstellungsgrößen, Perspektiven und Kamerabewegungen für maximale filmische Wirkung.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 4000,
    });

    const content = completion.choices[0]?.message?.content?.trim() || '[]';

    // Parse — handle markdown code blocks
    let cleaned = content;
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const scenes = JSON.parse(cleaned);

    return NextResponse.json({ scenes });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unbekannter Fehler';
    console.error('Generate error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
