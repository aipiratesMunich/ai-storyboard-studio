'use client';

import { useState } from 'react';
import type { Scene } from '@/lib/types';
import { buildVeoPrompt, buildSeedancePrompt, getWordCount } from '@/lib/prompt-generator';
import { veo, seedance } from '@/lib/vault';

interface ExportViewProps {
  scenes: Scene[];
}

function CopyAll({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="text-xs px-3 py-1.5 rounded bg-accent hover:bg-accent-hover text-white font-medium"
    >
      {copied ? 'Kopiert!' : label}
    </button>
  );
}

export default function ExportView({ scenes }: ExportViewProps) {
  const [platform, setPlatform] = useState<'veo' | 'seedance'>('veo');

  if (scenes.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted text-sm">
        Keine Szenen zum Exportieren.
      </div>
    );
  }

  const config = platform === 'veo' ? veo : seedance;
  const buildPrompt = platform === 'veo' ? buildVeoPrompt : buildSeedancePrompt;
  const maxWords = config.maxRecommendedWords;

  const allPrompts = scenes.map((s, i) => {
    const prompt = buildPrompt(s);
    return `--- Scene ${i + 1}: ${s.title || 'Untitled'} (${s.duration}s) ---\n${prompt}`;
  }).join('\n\n');

  return (
    <div className="space-y-6">
      {/* Platform toggle */}
      <div className="flex items-center gap-4">
        <div className="flex rounded overflow-hidden border border-border">
          <button
            onClick={() => setPlatform('veo')}
            className={`px-4 py-1.5 text-xs font-medium ${platform === 'veo' ? 'bg-blue-500/20 text-blue-400' : 'bg-surface text-muted hover:text-foreground'}`}
          >
            Veo 3.1
          </button>
          <button
            onClick={() => setPlatform('seedance')}
            className={`px-4 py-1.5 text-xs font-medium ${platform === 'seedance' ? 'bg-green-500/20 text-green-400' : 'bg-surface text-muted hover:text-foreground'}`}
          >
            Seedance 2.0
          </button>
        </div>
        <CopyAll text={allPrompts} label="Alle Prompts kopieren" />
      </div>

      {/* Rules reminder */}
      <div className="bg-surface border border-border rounded p-3">
        <h3 className="text-[10px] uppercase tracking-wide text-muted mb-2">{config.label} — Regeln</h3>
        <div className="text-xs text-foreground/60 space-y-1">
          {config.systemRules.slice(0, 5).map((rule, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-muted shrink-0">{i + 1}.</span>
              <span>{rule}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted mt-2">Struktur: {config.promptStructure}</p>
      </div>

      {/* Per-scene prompts */}
      <div className="space-y-3">
        {scenes.map((scene, i) => {
          const prompt = buildPrompt(scene);
          const words = getWordCount(prompt);
          const over = words > maxWords;

          return (
            <div key={scene.id} className="border border-border rounded overflow-hidden">
              <div className="flex items-center gap-3 px-3 py-2 bg-surface-hover border-b border-border">
                <div className="w-10 h-10 rounded bg-background overflow-hidden shrink-0">
                  {scene.imageUrl ? (
                    <img src={scene.imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-muted">#{i + 1}</div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{scene.title || `Szene ${i + 1}`}</div>
                  <div className="text-[10px] text-muted">{scene.duration}s</div>
                </div>
                <span className={`text-[10px] font-mono ${over ? 'text-danger' : 'text-muted'}`}>
                  {words}/{maxWords}
                </span>
                <CopyAll text={prompt} label="Copy" />
              </div>
              <div className="p-3">
                <p className="text-sm font-mono text-foreground/80 leading-relaxed">{prompt}</p>
              </div>
              {/* Start/End frame hint */}
              {i > 0 && (
                <div className="px-3 pb-2 text-[10px] text-accent">
                  Start-Frame: Bild Szene #{i} / End-Frame: Bild Szene #{i + 1}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
