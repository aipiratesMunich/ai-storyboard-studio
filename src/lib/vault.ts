import type { PlatformConfig, StylePreset, CameraPreset } from './types';

export const nanoBanana: PlatformConfig = {
  id: 'nano-banana',
  label: 'Nano Banana (Freepik/Imagen)',
  type: 'image',
  systemRules: [
    'Vollständige, beschreibende Sätze — KEINE Keyword-Listen.',
    '"A majestic snow leopard on a rocky cliff at dawn, golden hour light, 8K wildlife photography" ist BESSER als "snow leopard, cliff, golden, 8K".',
    'Nano Banana versteht natürliche, konversationelle Sprache wie ein erfahrener Art Director.',
    'HEX-Farbcodes funktionieren für exaktes Farb-Matching (z.B. "product in color #E63946").',
    'Nano Banana Pro ist Marktführer bei lesbarem Text in Bildern — mehrsprachig.',
    'Für Text: Schriftart, Größe und Platzierung explizit beschreiben.',
    'Negative Konzepte positiv formulieren: statt "keine Menschen" → "leere Straße ohne Fußgänger".',
    'Referenzbilder nutzen mit expliziter Rollenzuweisung: "strict style reference", "character reference", "brand color palette".',
    'Stil-Umwandlung: "Change this image to [style]. Ensure composition and position remain exactly the same."',
    'Maximal 120 Wörter für optimale Ergebnisse.',
  ],
  promptStructure: '[Subject] + [Action/State] + [Environment/Setting] + [Art Style/Medium] + [Lighting] + [Detail/Mood]',
  maxRecommendedWords: 120,
  cameraMovements: [],
  tips: [
    'Vollständige Sätze statt Keyword-Listen',
    'Marktführer für mehrsprachigen Text in Bildern',
    'HEX-Farbcodes für exakte Markenfarben',
    'Referenzbilder mit Rollenzuweisung für Brand-Konsistenz',
  ],
  parameters: [
    { param: 'model', description: 'Modellwahl', example: 'Flux / Mystic auf Freepik' },
    { param: 'Reference Images', description: 'Bis zu 14 Referenzbilder', example: '@logo, @palette, @product' },
  ],
};

export const veo: PlatformConfig = {
  id: 'veo',
  label: 'Veo 3.1',
  type: 'video',
  systemRules: [
    'Verwende technische Kino-Sprache — Veo versteht sie am besten.',
    'Halte Kern-Prompts unter 30 Wörter — technische Qualifier können ergänzt werden.',
    'NUR EINE Kamerabewegung pro Shot — kombinierte Bewegungen senken Erfolgsrate drastisch.',
    'Statische Shots: ~81% Erfolg. Pan: ~73%. Dolly: ~58%. Kombination: nur ~42-53%.',
    'Verwende Brennweiten-Sprache: 24mm wide-angle, 50mm standard, 85mm portrait, 135mm telephoto.',
    'Beschreibe Licht-Setups präzise: "three-point lighting, warm key from upper left, cool fill, rim light".',
    'Veo 3.1: Audio als SEPARATE Prompt-Ebene, nicht inline mit Video-Beschreibung.',
    'Veo 3.1 "first and last frame" Feature für natürliche Video-Brücke mit synchronisiertem Audio.',
    'Charakter-Beschreibung WORTGENAU wiederholen über alle Shots für Multi-Prompt Storytelling.',
    'Maximal 50 Wörter für den Kern-Prompt.',
  ],
  promptStructure: '[Shot type] of [subject] [action]. [Lens]. [Camera movement]. [Lighting setup]. [Style reference].',
  maxRecommendedWords: 50,
  cameraMovements: [
    'static', 'locked tripod', 'pan left', 'pan right',
    'tilt up', 'tilt down', 'dolly in', 'dolly out',
    'truck left', 'truck right', 'crane up', 'crane down',
    'aerial', 'drone', 'handheld', 'shaky cam',
    'whip pan', 'zoom in', 'zoom out', 'tracking shot',
  ],
  tips: [
    'Technische Kino-Sprache liefert beste Ergebnisse',
    'Nur EINE Kamerabewegung pro Shot — Kombination senkt Erfolgsrate',
    'Brennweiten angeben: 24mm, 50mm, 85mm, 135mm',
    'Veo 3.1: Audio separat prompten, nicht in Video-Beschreibung',
    'Unter 30 Kern-Wörter für optimale Befolgung',
  ],
  parameters: [
    { param: 'Audio (Veo 3.1)', description: 'Separate Audio-Beschreibung', example: 'Audio: Rolling thunder, crashing waves' },
    { param: 'First/Last Frame', description: 'Keyframe-Brücke', example: 'Upload start + end image' },
  ],
};

export const seedance: PlatformConfig = {
  id: 'seedance',
  label: 'Seedance 2.0',
  type: 'video',
  systemRules: [
    'Halte Prompts unter 80 Wörter — knapp und präzise.',
    'Struktur: Subject + Action + Scene + Camera + Style.',
    'NUR EINE Kamerabewegung pro Shot — mehrere erzeugen Jitter.',
    'Sequentielle Bewegungen: Subject 1 + Movement 1 + Movement 2.',
    'Seedance 2.0 nutzt @Mention-System für Referenz-Assets: @character1, @video1, @audio1.',
    'Kamerabewegung muss der Subjekt-Aktion DIENEN, nicht mit ihr konkurrieren.',
    'Für Choreografie: Referenzvideo hochladen und "@video1 for camera movement reference" nutzen.',
    'Seedance 2.0 kann Audio-Visual synchronisieren — Musik-Datei hochladen und Rhythmus beschreiben.',
    'Weniger, gut gewählte Referenzen sind besser als viele widersprüchliche.',
    'Beschreibe Hintergrund-Bewegung separat vom Subjekt.',
  ],
  promptStructure: '[subject] [motion], [background] [motion], [camera movement], [style/mood]',
  maxRecommendedWords: 80,
  cameraMovements: [
    'orbit', 'aerial', 'zoom in', 'zoom out', 'pan left', 'pan right',
    'tilt up', 'tilt down', 'tracking shot', 'handheld', 'dolly in',
    'dolly out', 'crane shot', 'dolly zoom', 'whip pan', 'camera switching',
  ],
  tips: [
    'Eine Kamerabewegung pro Shot — mehrere erzeugen Artefakte',
    '@Mention-System für professionelle Ergebnisse nutzen',
    'Referenzvideo für Kamerastil hochladen statt beschreiben',
    'Audio-Sync: Musikdatei hochladen und Beat-Alignment beschreiben',
    'Hintergrund- und Subjekt-Bewegung separat beschreiben',
  ],
  parameters: [
    { param: '@mention', description: 'Referenz-Assets zuweisen', example: '@character1 as the main performer' },
    { param: 'Duration', description: 'Clip-Länge', example: '5-10 Sekunden' },
  ],
};

export const stylePresets: Record<string, StylePreset> = {
  fotorealistisch: { label: 'Fotorealistisch', keywords: 'photorealistic, hyperrealistic, DSLR, RAW photo, ultra-detailed' },
  illustration: { label: 'Illustration', keywords: 'digital illustration, vector art, clean lines, editorial illustration' },
  '3d-render': { label: '3D Render', keywords: '3D render, octane render, subsurface scattering, ray tracing, Cinema 4D' },
  anime: { label: 'Anime', keywords: 'anime style, cel shading, vibrant colors, manga illustration' },
  'concept-art': { label: 'Concept Art', keywords: 'concept art, matte painting, ArtStation trending, detailed environment' },
  aquarell: { label: 'Aquarell', keywords: 'watercolor painting, soft edges, paper texture, translucent washes' },
  werbefotografie: { label: 'Werbefotografie', keywords: 'commercial photography, product shot, clean background, professional lighting' },
  abstrakt: { label: 'Abstrakt', keywords: 'abstract art, generative, geometric shapes, bold composition' },
  cinematic: { label: 'Cinematic', keywords: 'cinematic photography, movie still, anamorphic lens, cinematic color grading, shallow depth of field' },
};

export const cameraPresets: Record<string, CameraPreset> = {
  statisch: { label: 'Statisch', keywords: 'static camera, locked tripod, fixed position' },
  pan: { label: 'Pan', keywords: 'pan left/right, horizontal camera rotation' },
  tilt: { label: 'Tilt', keywords: 'tilt up/down, vertical camera rotation' },
  dolly: { label: 'Dolly', keywords: 'dolly in/out, camera moves forward/backward' },
  tracking: { label: 'Tracking', keywords: 'tracking shot, camera follows subject movement' },
  orbit: { label: 'Orbit', keywords: 'orbit around subject, revolving shot, 360 degree' },
  drohne: { label: 'Drohne', keywords: 'aerial shot, drone footage, bird\'s eye view' },
  handheld: { label: 'Handheld', keywords: 'handheld camera, documentary feel, slight shake' },
  crane: { label: 'Crane', keywords: 'crane shot, jib shot, sweeping arc movement' },
  'dolly-zoom': { label: 'Dolly Zoom', keywords: 'dolly zoom, Hitchcock zoom, vertigo effect' },
};

export const platforms = { 'nano-banana': nanoBanana, veo, seedance };
