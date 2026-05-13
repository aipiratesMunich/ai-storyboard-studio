'use client';

import type { Scene } from '@/lib/types';
import { cameraPresets, stylePresets } from '@/lib/vault';

interface TimelineProps {
  scenes: Scene[];
}

export default function Timeline({ scenes }: TimelineProps) {
  const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);

  if (scenes.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted text-sm">
        Noch keine Szenen. Wechsle zum Board und erstelle welche.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="flex gap-6 text-xs text-muted">
        <span>{scenes.length} Szenen</span>
        <span>{totalDuration}s Gesamtdauer</span>
        <span>~{Math.ceil(totalDuration / 60)}min</span>
      </div>

      {/* Filmstrip */}
      <div className="flex gap-1 overflow-x-auto pb-2">
        {scenes.map((scene, i) => {
          const widthPx = Math.max(80, scene.duration * 20);
          return (
            <div
              key={scene.id}
              className="shrink-0 border border-border rounded overflow-hidden bg-surface"
              style={{ width: widthPx }}
            >
              {/* Thumbnail */}
              <div className="h-16 bg-background flex items-center justify-center">
                {scene.imageUrl ? (
                  <img src={scene.imageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] text-muted/40">#{i + 1}</span>
                )}
              </div>
              {/* Info */}
              <div className="px-1.5 py-1">
                <div className="text-[10px] text-foreground truncate">
                  {scene.title || `Szene ${i + 1}`}
                </div>
                <div className="text-[9px] text-muted flex justify-between">
                  <span>{cameraPresets[scene.cameraMovement]?.label || scene.cameraMovement}</span>
                  <span>{scene.duration}s</span>
                </div>
              </div>
              {/* Transition indicator */}
              {i < scenes.length - 1 && (
                <div className="h-0.5 bg-accent/30" />
              )}
            </div>
          );
        })}
      </div>

      {/* Scene list */}
      <div className="space-y-1">
        {scenes.map((scene, i) => (
          <div key={scene.id} className="flex items-center gap-3 px-3 py-2 rounded bg-surface-hover text-xs">
            <span className="font-mono text-muted w-6">#{i + 1}</span>
            <div className="w-8 h-8 rounded bg-background overflow-hidden shrink-0">
              {scene.imageUrl && <img src={scene.imageUrl} alt="" className="w-full h-full object-cover" />}
            </div>
            <span className="flex-1 truncate text-foreground">{scene.title || scene.imagePrompt?.slice(0, 50) || 'Untitled'}</span>
            <span className="text-muted">{cameraPresets[scene.cameraMovement]?.label}</span>
            <span className="text-muted">{stylePresets[scene.style]?.label}</span>
            <span className="text-muted font-mono w-8 text-right">{scene.duration}s</span>
          </div>
        ))}
      </div>
    </div>
  );
}
