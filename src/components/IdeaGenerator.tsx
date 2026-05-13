'use client';

import { useState } from 'react';

interface GeneratedScene {
  title: string;
  imagePrompt: string;
  cameraMovement: string;
  style: string;
  mood: string;
  duration: number;
  notes: string;
  veoPrompt: string;
  seedancePrompt: string;
  filmStock?: string;
  cinematicStyle?: string;
  lens?: string;
}

interface IdeaGeneratorProps {
  onGenerate: (scenes: GeneratedScene[]) => void;
  characters?: { name: string; description: string }[];
}

type Step = 'idea' | 'researching' | 'research-done' | 'generating';

export default function IdeaGenerator({ onGenerate, characters }: IdeaGeneratorProps) {
  const [idea, setIdea] = useState('');
  const [sceneCount, setSceneCount] = useState('6-8');
  const [step, setStep] = useState<Step>('idea');
  const [research, setResearch] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  const handleResearch = async () => {
    if (!idea.trim()) return;
    setStep('researching');
    setError(null);

    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: idea.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setResearch(data.research);
      setSearchResults(data.searchResults || []);
      setStep('research-done');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Recherche fehlgeschlagen');
      setStep('idea');
    }
  };

  const handleGenerate = async () => {
    if (!idea.trim()) return;
    setStep('generating');
    setError(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: idea.trim(),
          sceneCount,
          researchContext: research || undefined,
          characters: characters?.filter((c) => c.description?.trim()) || [],
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const { scenes } = await res.json();
      onGenerate(scenes);
      setCollapsed(true);
      setStep('idea');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Generierung fehlgeschlagen');
      setStep('research-done');
    }
  };

  const handleDirectGenerate = async () => {
    if (!idea.trim()) return;
    setStep('generating');
    setError(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: idea.trim(), sceneCount, characters: characters?.filter((c) => c.description?.trim()) || [] }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const { scenes } = await res.json();
      onGenerate(scenes);
      setCollapsed(true);
      setStep('idea');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Generierung fehlgeschlagen');
      setStep('idea');
    }
  };

  if (collapsed) {
    return (
      <div className="border border-border rounded-xl bg-surface px-5 py-3.5 flex items-center justify-between card-glow">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold">{idea}</h3>
            {research && <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/10 text-success inline-block mt-0.5">Researched</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCollapsed(false)}
            className="text-xs text-accent hover:text-accent-hover font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => { setCollapsed(false); setResearch(''); setStep('idea'); }}
            className="text-xs text-muted hover:text-foreground"
          >
            New idea
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-xl bg-surface overflow-hidden card-glow">
      <div className="px-5 py-4 border-b border-border surface-gradient">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8 5.8 21.3l2.4-7.4L2 9.4h7.6L12 2z" fill="currentColor"/>
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold">Idea &rarr; Research &rarr; Storyboard</h3>
            <p className="text-[10px] text-muted mt-0.5">
              Describe your concept, AI researches the web, then generates a complete storyboard
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Idea input */}
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="z.B. Ein Kreuzritter reitet durch die Wueste, findet eine verlassene Oase, entdeckt ein leuchtendes Artefakt unter dem Sand. Episch, cinematic, Ridley Scott Stil..."
          rows={3}
          disabled={step === 'researching' || step === 'generating'}
          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted/40 outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] resize-none disabled:opacity-50"
        />

        {/* Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-[10px] uppercase tracking-widest text-muted font-medium">Scenes</label>
            <select
              value={sceneCount}
              onChange={(e) => setSceneCount(e.target.value)}
              disabled={step === 'researching' || step === 'generating'}
              className="bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-accent disabled:opacity-50"
            >
              <option value="3-4">3-4 (short)</option>
              <option value="5-6">5-6 (medium)</option>
              <option value="6-8">6-8 (standard)</option>
              <option value="8-12">8-12 (long)</option>
            </select>
          </div>

          <div className="flex-1 flex gap-2">
            {step === 'idea' && (
              <>
                <button
                  onClick={handleResearch}
                  disabled={!idea.trim()}
                  className="flex-1 text-sm px-4 py-2.5 rounded-xl bg-success hover:bg-success/90 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-success/20"
                >
                  1. Research
                </button>
                <button
                  onClick={handleDirectGenerate}
                  disabled={!idea.trim()}
                  className="text-sm px-4 py-2.5 rounded-xl bg-surface-hover hover:bg-border text-muted hover:text-foreground font-medium disabled:opacity-40 disabled:cursor-not-allowed border border-border"
                >
                  Skip &rarr; Generate
                </button>
              </>
            )}

            {step === 'researching' && (
              <div className="flex-1 flex items-center gap-2.5 px-4 py-2.5 text-sm text-success">
                <div className="w-3.5 h-3.5 border-2 border-success border-t-transparent rounded-full animate-spin" />
                Researching the web + brainstorming...
              </div>
            )}

            {step === 'research-done' && (
              <button
                onClick={handleGenerate}
                disabled={!idea.trim()}
                className="flex-1 text-sm px-4 py-2.5 rounded-xl btn-gradient text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                2. Generate Storyboard
              </button>
            )}

            {step === 'generating' && (
              <div className="flex-1 flex items-center gap-2.5 px-4 py-2.5 text-sm text-accent">
                <div className="w-3.5 h-3.5 border-2 border-accent border-t-transparent rounded-full animate-spin sparkle" />
                Generating scenes + prompts...
              </div>
            )}
          </div>
        </div>

        {/* Error */}
        {error && <p className="text-xs text-danger">{error}</p>}

        {/* Research results */}
        {research && step === 'research-done' && (
          <div className="space-y-2">
            {/* Web search snippets */}
            {searchResults.length > 0 && (
              <div className="bg-background rounded border border-border p-3">
                <h4 className="text-[10px] uppercase tracking-wide text-green-400 mb-2">Web-Recherche ({searchResults.length} Ergebnisse)</h4>
                <div className="space-y-1 max-h-24 overflow-y-auto">
                  {searchResults.map((s, i) => (
                    <p key={i} className="text-[11px] text-muted leading-tight">{s}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Research / Brainstorm */}
            <div className="bg-background rounded border border-border p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[10px] uppercase tracking-wide text-accent">KI-Recherche & Visual Direction</h4>
                <button
                  onClick={() => setResearch('')}
                  className="text-[10px] text-muted hover:text-foreground"
                >
                  Verwerfen
                </button>
              </div>
              <textarea
                value={research}
                onChange={(e) => setResearch(e.target.value)}
                rows={10}
                className="w-full bg-transparent text-xs text-foreground/80 leading-relaxed outline-none resize-none"
              />
              <p className="text-[10px] text-muted mt-1">
                Du kannst den Text bearbeiten bevor du das Storyboard generierst. Die KI nutzt diesen Kontext.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
