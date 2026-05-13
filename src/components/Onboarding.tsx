'use client';

import { useState } from 'react';

const STORAGE_KEY = 'storyboard-cockpit-onboarding-done';

const steps = [
  {
    title: 'Willkommen im Storyboard Studio',
    content: 'Dein AI-Storyboard-Tool: Von der Idee zum fertigen Video. In wenigen Schritten erstellst du professionelle Storyboards mit KI-generierten Bildern und Videos.',
    highlight: 'Dieses Onboarding zeigt dir den kompletten Workflow.',
  },
  {
    title: '1. Projekt erstellen',
    content: 'Klick oben links auf "+ New Project". Du kannst ein leeres Projekt starten oder ein Template wählen:',
    highlight: 'Templates: Produktvideo (30s), Imagefilm (60s), Social Reel (15s), Erklärvideo (45s), Testimonial (30s) — jeweils mit vordefinierten Szenen.',
  },
  {
    title: '2. Charaktere definieren',
    content: 'Oben im Board: Klick "+ Charakter" und beschreibe deinen Charakter EXAKT auf Englisch. Z.B.: "A 35-year-old man with short brown hair, blue eyes, strong jawline, wearing a dark blue suit."',
    highlight: 'Wichtig: Die Beschreibung wird in JEDEN Prompt injiziert. Je genauer, desto konsistenter der Charakter über alle Szenen. Optimal: 3-6 Referenzbilder aus verschiedenen Winkeln hochladen.',
  },
  {
    title: '3. Idee eingeben + Recherche',
    content: 'Schreib deine Video-Idee auf Deutsch ins Textfeld. Dann hast du zwei Optionen:',
    highlight: '"Research" — KI sucht im Web nach Referenzen, brainstormt Visual Direction, schlägt Film-Stocks und Stile vor. Du kannst den Text bearbeiten.\n\n"Skip → Generate" — Überspringt die Recherche und erstellt sofort das Storyboard.',
  },
  {
    title: '4. Storyboard bearbeiten',
    content: 'Jede Szene hat: Image Prompt (EN), Style, Kamera, Film Stock, Lens, Cinematic Style, Mood, Voiceover, Notizen.',
    highlight: '"KI verbessern" — GPT optimiert deinen Prompt mit professionellen Bild-Regeln.\n\n"Copy (mit Style)" — Kopiert den Prompt MIT Film Stock, Lens und Style-Keywords.\n\n"dup" — Dupliziert eine Szene mit allen Feldern.',
  },
  {
    title: '5. Bilder generieren',
    content: 'Links bei jeder Szene: Wähle ein Modell (Standard: Nano Banana Pro) und klick "Bild generieren". Oder lade ein Bild manuell hoch.',
    highlight: '11 Modelle verfügbar: Nano Banana Pro (Google), Imagen 4, Recraft V3, Flux Pro, u.v.m.\n\nKosten stehen im Dropdown. Charakter-Referenzbilder werden automatisch mitgeschickt.\n\nHover über ein Bild: "Als Charakter-Referenz" setzt es für alle weiteren Generierungen.',
  },
  {
    title: '6. Zusätzliche Shots',
    content: 'Klick "+ Shot" unter einer Szene für weitere Kamera-Perspektiven: Close-Up, Over-the-Shoulder, Detail, Gegenschuss.',
    highlight: 'Jeder Shot hat eigenen Prompt und Kamera-Einstellung. "Generieren" erstellt das Bild mit dem gleichen Charakter und Szenen-Kontext.',
  },
  {
    title: '7. Videos generieren',
    content: 'Links unter dem Bild: Wähle ein Video-Modell und klick "Video generieren".',
    highlight: '10 Modelle: Seedance 2.0 (mit Audio!), Veo 3.1, Kling 2.6 Pro, WAN 2.7 u.v.m.\n\nStart/End Frame: Wähle welches Bild als Anfang und welches als Ende des Videos dient. Standard: eigenes Bild → nächste Szene.\n\nSeedance 2.0, Veo 3.1 und Kling 2.6 nutzen End-Frames automatisch für flüssige Übergänge.',
  },
  {
    title: '8. Export + Video zusammenfügen',
    content: 'Wechsle zum "Export" Tab:',
    highlight: 'Video zusammenfügen — Alle generierten Videos werden im Browser (ffmpeg.wasm) zu einem Clip verbunden. Download als MP4.\n\nPrompts kopieren — Alle Veo/Seedance Prompts auf einen Blick, einzeln oder alle kopieren.\n\nPDF Export — Oben im Header: Formatiertes Storyboard mit Bildern, Prompts, Notizen als PDF für Team/Kunden.',
  },
  {
    title: '9. Tipps',
    content: 'So holst du das Beste raus:',
    highlight: 'Charakter-Konsistenz: Erst Szene 1 generieren, als Referenz setzen, dann weitere Szenen. Je mehr Winkel, desto besser.\n\nKostenrechner: Klick auf "Kosten: ~$X.XX" im Header für die Aufschlüsselung.\n\nDark/Light Mode: Toggle oben links in der Sidebar.\n\nTimeline: Zeigt alle Szenen als Filmstreifen mit Gesamtdauer.',
  },
];

export default function Onboarding() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !localStorage.getItem(STORAGE_KEY);
  });
  const [step, setStep] = useState(0);

  if (!visible) return null;

  const current = steps[step];
  const isLast = step === steps.length - 1;

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={handleClose}>
      <div
        className="bg-surface border border-border rounded-2xl w-[520px] max-h-[80vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress */}
        <div className="px-5 pt-4 flex items-center gap-1">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-accent' : 'bg-border'}`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <h2 className="text-base font-bold text-foreground">{current.title}</h2>
          <p className="text-sm text-foreground/80 leading-relaxed">{current.content}</p>
          <div className="bg-background border border-border rounded-xl p-3.5 text-xs text-foreground/70 leading-relaxed whitespace-pre-line">
            {current.highlight}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-4 flex items-center justify-between">
          <div className="text-[10px] text-muted">{step + 1} / {steps.length}</div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              className="text-xs px-3 py-1.5 rounded-lg text-muted hover:text-foreground"
            >
              Überspringen
            </button>
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="text-xs px-3 py-1.5 rounded-lg bg-surface-hover hover:bg-border text-foreground border border-border"
              >
                Zurück
              </button>
            )}
            {isLast ? (
              <button
                onClick={handleClose}
                className="text-xs px-4 py-1.5 rounded-lg btn-gradient text-white font-semibold"
              >
                Los geht's!
              </button>
            ) : (
              <button
                onClick={() => setStep(step + 1)}
                className="text-xs px-4 py-1.5 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium"
              >
                Weiter
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Help button to re-show onboarding
export function HelpButton() {
  const handleShow = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  return (
    <button
      onClick={handleShow}
      className="text-[10px] px-2 py-1 rounded-lg bg-surface-hover hover:bg-border text-muted"
      title="Onboarding nochmal anzeigen"
    >
      ?
    </button>
  );
}
