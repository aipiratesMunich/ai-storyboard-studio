'use client';

import { useState } from 'react';
import type { Scene } from '@/lib/types';
import { estimateCost } from '@/lib/prompt-generator';

interface CostTrackerProps {
  scenes: Scene[];
}

export default function CostTracker({ scenes }: CostTrackerProps) {
  const [expanded, setExpanded] = useState(false);

  if (scenes.length === 0) return null;

  const cost = estimateCost(scenes, true);

  return (
    <div className="mt-1">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-[10px] text-muted hover:text-foreground"
      >
        <span>Kosten: ~${cost.totalUsd.toFixed(2)}</span>
        <span className="text-muted/50">{expanded ? '[-]' : '[+]'}</span>
      </button>

      {expanded && (
        <div className="mt-2 bg-surface border border-border rounded p-3 text-xs space-y-2 max-w-md">
          <h4 className="text-[10px] uppercase tracking-wide text-muted font-medium">Kostenaufstellung (geschaetzt)</h4>

          {/* GPT-4o */}
          <div className="flex items-center justify-between py-1 border-b border-border">
            <div>
              <span className="text-foreground">OpenAI GPT-4o</span>
              <span className="text-muted ml-2">({cost.gptResearchCalls}x Recherche + {cost.gptGenerateCalls}x Storyboard)</span>
            </div>
            <span className="font-mono text-foreground">${cost.gptCostUsd.toFixed(2)}</span>
          </div>

          {/* Images */}
          <div className="flex items-center justify-between py-1 border-b border-border">
            <div>
              <span className="text-foreground">Bilder (fal.ai)</span>
              <span className="text-muted ml-2">({cost.imageCount}x Nano Banana Pro)</span>
            </div>
            <span className="font-mono text-foreground">${cost.imageCostUsd.toFixed(2)}</span>
          </div>

          {/* Videos */}
          <div className="flex items-center justify-between py-1 border-b border-border">
            <div>
              <span className="text-foreground">Videos (fal.ai)</span>
              <span className="text-muted ml-2">({cost.videoCount}x Kling V2)</span>
            </div>
            <span className="font-mono text-foreground">${cost.videoCostUsd.toFixed(2)}</span>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-foreground font-medium">Gesamt</span>
            <span className="font-mono text-accent font-medium">${cost.totalUsd.toFixed(2)}</span>
          </div>

          <p className="text-[9px] text-muted/60 pt-1">
            Preise sind Schaetzungen. Tatsaechliche Kosten variieren je nach Modell und Token-Verbrauch.
            Mehrfache Generierungen pro Szene erhoehen die Kosten.
          </p>
        </div>
      )}
    </div>
  );
}
