'use client';

import type { Scene, Character } from '@/lib/types';
import { buildImagePrompt, buildVeoPrompt, buildSeedancePrompt } from '@/lib/prompt-generator';
import { stylePresets, cameraPresets } from '@/lib/vault';

interface PdfExportProps {
  projectName: string;
  scenes: Scene[];
  characters: Character[];
}

export default function PdfExport({ projectName, scenes, characters }: PdfExportProps) {
  const handlePrint = () => {
    const totalDuration = scenes.reduce((s, sc) => s + sc.duration, 0);

    const html = `<!DOCTYPE html>
<html><head>
<meta charset="utf-8">
<title>${projectName} — Storyboard</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a1a; padding: 40px; font-size: 11px; }
  h1 { font-size: 20px; margin-bottom: 4px; }
  .meta { color: #666; font-size: 10px; margin-bottom: 24px; }
  .characters { margin-bottom: 24px; padding: 12px; background: #f5f5f5; border-radius: 6px; }
  .characters h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #888; margin-bottom: 8px; }
  .char { display: flex; gap: 8px; margin-bottom: 6px; align-items: center; }
  .char img { width: 32px; height: 32px; border-radius: 4px; object-fit: cover; }
  .char-name { font-weight: 600; }
  .char-desc { color: #555; font-size: 9px; }
  .scene { page-break-inside: avoid; margin-bottom: 20px; border: 1px solid #e0e0e0; border-radius: 6px; overflow: hidden; }
  .scene-header { background: #f5f5f5; padding: 8px 12px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e0e0e0; }
  .scene-num { font-weight: 700; color: #888; font-size: 10px; }
  .scene-title { font-weight: 600; font-size: 13px; }
  .scene-tags { display: flex; gap: 4px; }
  .tag { font-size: 8px; padding: 2px 6px; border-radius: 3px; background: #e8e8e8; color: #555; }
  .scene-body { display: flex; gap: 0; }
  .scene-img { width: 200px; min-height: 130px; background: #f0f0f0; flex-shrink: 0; }
  .scene-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .scene-fields { flex: 1; padding: 10px 12px; }
  .field-label { font-size: 8px; text-transform: uppercase; letter-spacing: 0.5px; color: #999; margin-bottom: 2px; margin-top: 6px; }
  .field-label:first-child { margin-top: 0; }
  .field-value { font-size: 10px; color: #333; line-height: 1.4; }
  .prompt { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 9px; color: #444; background: #fafafa; padding: 6px 8px; border-radius: 3px; border: 1px solid #eee; margin-top: 2px; }
  .row { display: flex; gap: 12px; }
  .row > div { flex: 1; }
  .voiceover { color: #c2410c; font-style: italic; }
  .footer { margin-top: 32px; text-align: center; font-size: 9px; color: #aaa; border-top: 1px solid #e0e0e0; padding-top: 12px; }
  @media print { body { padding: 20px; } .scene { break-inside: avoid; } }
</style>
</head><body>
<h1>${projectName}</h1>
<div class="meta">${scenes.length} Szenen / ${totalDuration}s Gesamtdauer / ${Math.ceil(totalDuration / 60)} min</div>

${characters.length > 0 ? `
<div class="characters">
  <h3>Charaktere</h3>
  ${characters.map(c => `
    <div class="char">
      ${c.referenceImageUrl ? `<img src="${c.referenceImageUrl}" alt="${c.name}">` : ''}
      <div>
        <div class="char-name">${c.name || 'Unnamed'}</div>
        <div class="char-desc">${c.description || ''}</div>
      </div>
    </div>
  `).join('')}
</div>
` : ''}

${scenes.map((scene, i) => {
  const cam = cameraPresets[scene.cameraMovement]?.label || scene.cameraMovement;
  const style = stylePresets[scene.style]?.label || scene.style;
  return `
<div class="scene">
  <div class="scene-header">
    <div>
      <span class="scene-num">#${i + 1}</span>
      <span class="scene-title">${scene.title || `Szene ${i + 1}`}</span>
    </div>
    <div class="scene-tags">
      ${scene.filmStock ? `<span class="tag">${scene.filmStock}</span>` : ''}
      ${scene.lens ? `<span class="tag">${scene.lens}</span>` : ''}
      ${scene.cinematicStyle ? `<span class="tag">${scene.cinematicStyle}</span>` : ''}
      <span class="tag">${cam}</span>
      <span class="tag">${scene.duration}s</span>
    </div>
  </div>
  <div class="scene-body">
    <div class="scene-img">
      ${scene.imageUrl ? `<img src="${scene.imageUrl}" alt="Scene ${i + 1}">` : '<div style="display:flex;align-items:center;justify-content:center;height:130px;color:#ccc;font-size:10px;">Kein Bild</div>'}
    </div>
    <div class="scene-fields">
      <div class="field-label">Image Prompt</div>
      <div class="prompt">${scene.imagePrompt || '—'}</div>

      <div class="row">
        <div><div class="field-label">Style</div><div class="field-value">${style}</div></div>
        <div><div class="field-label">Kamera</div><div class="field-value">${cam}</div></div>
        <div><div class="field-label">Mood</div><div class="field-value">${scene.mood || '—'}</div></div>
      </div>

      ${scene.voiceover ? `<div class="field-label">Voiceover</div><div class="field-value voiceover">"${scene.voiceover}"</div>` : ''}
      ${scene.notes ? `<div class="field-label">Notizen</div><div class="field-value">${scene.notes}</div>` : ''}

      <div class="field-label">Veo 3.1</div>
      <div class="prompt">${scene.veoPrompt || buildVeoPrompt(scene, characters)}</div>

      <div class="field-label">Seedance 2.0</div>
      <div class="prompt">${scene.seedancePrompt || buildSeedancePrompt(scene, characters)}</div>
    </div>
  </div>
</div>`;
}).join('')}

<div class="footer">Storyboard Cockpit — generiert am ${new Date().toLocaleDateString('de-DE')}</div>
</body></html>`;

    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
      setTimeout(() => win.print(), 500);
    }
  };

  return (
    <button
      onClick={handlePrint}
      disabled={scenes.length === 0}
      className="text-xs px-3 py-1.5 rounded bg-surface-hover hover:bg-border text-muted hover:text-foreground font-medium border border-border disabled:opacity-30"
    >
      PDF Export
    </button>
  );
}
