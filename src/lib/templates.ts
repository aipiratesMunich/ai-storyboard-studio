export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  scenes: {
    title: string;
    cameraMovement: string;
    style: string;
    duration: number;
    notes: string;
  }[];
}

export const templates: ProjectTemplate[] = [
  {
    id: 'produktvideo',
    name: 'Produktvideo (30s)',
    description: '6 Szenen: Hook, Problem, Lösung, Features, Social Proof, CTA',
    scenes: [
      { title: 'Hook / Attention Grabber', cameraMovement: 'dolly', style: 'cinematic', duration: 5, notes: 'Emotionaler Einstieg, Problem andeuten' },
      { title: 'Problem / Pain Point', cameraMovement: 'handheld', style: 'cinematic', duration: 5, notes: 'Frustation zeigen, relatable Situation' },
      { title: 'Lösung / Produkteinführung', cameraMovement: 'tracking', style: 'werbefotografie', duration: 5, notes: 'Produkt erscheint, Hero Shot' },
      { title: 'Features / Vorteile', cameraMovement: 'orbit', style: 'werbefotografie', duration: 5, notes: 'Nahaufnahmen, Detail-Shots' },
      { title: 'Social Proof / Ergebnis', cameraMovement: 'statisch', style: 'cinematic', duration: 5, notes: 'Zufriedene Nutzer, Vorher/Nachher' },
      { title: 'CTA / Abschluss', cameraMovement: 'dolly-zoom', style: 'cinematic', duration: 5, notes: 'Logo, Call-to-Action, URL' },
    ],
  },
  {
    id: 'imagefilm',
    name: 'Imagefilm (60s)',
    description: '8 Szenen: Establishing, Story, Team, Werte, Kunden, Vision',
    scenes: [
      { title: 'Establishing / Ort', cameraMovement: 'drohne', style: 'cinematic', duration: 8, notes: 'Drohne, Gebäude/Stadt, episch' },
      { title: 'Einleitung / Wer sind wir', cameraMovement: 'tracking', style: 'cinematic', duration: 8, notes: 'Büro, Team, Atmosphäre' },
      { title: 'Gründer / Protagonist', cameraMovement: 'dolly', style: 'cinematic', duration: 8, notes: 'Interview-Feeling, Close-Up' },
      { title: 'Arbeitsprozess', cameraMovement: 'handheld', style: 'cinematic', duration: 7, notes: 'Arbeit in Action, authentisch' },
      { title: 'Team / Kultur', cameraMovement: 'orbit', style: 'cinematic', duration: 7, notes: 'Team-Momente, Zusammenarbeit' },
      { title: 'Kunden / Ergebnisse', cameraMovement: 'statisch', style: 'cinematic', duration: 7, notes: 'Zufriedene Kunden, Projekte' },
      { title: 'Vision / Zukunft', cameraMovement: 'crane', style: 'cinematic', duration: 8, notes: 'Inspirierend, nach vorne blickend' },
      { title: 'Abschluss / Logo', cameraMovement: 'dolly-zoom', style: 'cinematic', duration: 7, notes: 'Logo-Reveal, Slogan, URL' },
    ],
  },
  {
    id: 'social-reel',
    name: 'Social Reel (15s)',
    description: '4 Szenen: Hook, Content, Twist, CTA — vertikal 9:16',
    scenes: [
      { title: 'Hook (erste 2 Sek)', cameraMovement: 'dolly-zoom', style: 'cinematic', duration: 3, notes: 'STOP-Moment, Neugier wecken' },
      { title: 'Content / Message', cameraMovement: 'tracking', style: 'cinematic', duration: 5, notes: 'Hauptbotschaft, schnelle Cuts' },
      { title: 'Twist / Aha-Moment', cameraMovement: 'handheld', style: 'cinematic', duration: 4, notes: 'Überraschung, Emotion' },
      { title: 'CTA / Follow', cameraMovement: 'statisch', style: 'cinematic', duration: 3, notes: 'Aufforderung, Logo, @handle' },
    ],
  },
  {
    id: 'erklaervideo',
    name: 'Erklärvideo (45s)',
    description: '6 Szenen: Problem, Lösung, Wie es funktioniert, Vorteile, Beweis, CTA',
    scenes: [
      { title: 'Problem darstellen', cameraMovement: 'statisch', style: 'illustration', duration: 8, notes: 'Alltagssituation, relatables Problem' },
      { title: 'Lösung vorstellen', cameraMovement: 'dolly', style: 'illustration', duration: 7, notes: 'Produkt/Service als Held' },
      { title: 'So funktioniert es (1)', cameraMovement: 'tracking', style: 'illustration', duration: 8, notes: 'Schritt 1-2 erklären' },
      { title: 'So funktioniert es (2)', cameraMovement: 'pan', style: 'illustration', duration: 7, notes: 'Schritt 3-4 erklären' },
      { title: 'Vorteile / Ergebnis', cameraMovement: 'orbit', style: 'illustration', duration: 8, notes: 'Zahlen, Fakten, Vorher/Nachher' },
      { title: 'CTA / Jetzt starten', cameraMovement: 'dolly-zoom', style: 'illustration', duration: 7, notes: 'Klarer Call-to-Action' },
    ],
  },
  {
    id: 'testimonial',
    name: 'Testimonial Video (30s)',
    description: '5 Szenen: Vorstellung, Problem, Lösung, Ergebnis, Empfehlung',
    scenes: [
      { title: 'Vorstellung / Wer spricht', cameraMovement: 'statisch', style: 'cinematic', duration: 5, notes: 'Name, Rolle, Unternehmen' },
      { title: 'Ausgangssituation / Problem', cameraMovement: 'dolly', style: 'cinematic', duration: 7, notes: 'Was war vorher, Herausforderung' },
      { title: 'Wie geholfen wurde', cameraMovement: 'tracking', style: 'cinematic', duration: 6, notes: 'Zusammenarbeit, Prozess' },
      { title: 'Ergebnis / Zahlen', cameraMovement: 'statisch', style: 'cinematic', duration: 7, notes: 'Konkretes Ergebnis, Metriken' },
      { title: 'Empfehlung / Abschluss', cameraMovement: 'dolly', style: 'cinematic', duration: 5, notes: 'Persönliche Empfehlung, Emotion' },
    ],
  },
];
