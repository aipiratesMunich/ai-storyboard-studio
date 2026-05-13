'use client';

import { useRef, useState } from 'react';
import type { Scene, Shot, Character, ProductRef, AspectRatio } from '@/lib/types';
import { stylePresets, cameraPresets } from '@/lib/vault';
import { filmStocks, cinematicStyles, lensPresets } from '@/lib/presets';
import { buildImagePrompt, buildVeoPrompt, buildSeedancePrompt, getWordCount } from '@/lib/prompt-generator';
import { generateImage, generateVideo, imageModels, videoModels, type ImageModelId, type VideoModelId } from '@/lib/fal';

interface SceneCardProps {
  scene: Scene;
  index: number;
  characters: Character[];
  productRefs: ProductRef[];
  aspectRatio: AspectRatio;
  onChange: (updates: Partial<Scene>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onSetAsReference: (imageUrl: string) => void;
  nextSceneImageUrl?: string | null;
  allScenes: { id: string; title: string; imageUrl: string | null; order: number }[];
  onVideoGenerated?: (sceneId: string, videoUrl: string) => void;
  isFirst: boolean;
  isLast: boolean;
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={copy}
      disabled={!text}
      className="text-[10px] px-2 py-0.5 rounded bg-surface-hover hover:bg-border text-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
    >
      {copied ? 'Kopiert!' : label}
    </button>
  );
}

function ShotRow({ shot, scenePrompt, characters, productRefs, imageModel, aspectRatio, onUpdate, onDelete }: {
  shot: Shot;
  scenePrompt: string;
  characters: Character[];
  productRefs: ProductRef[];
  imageModel: ImageModelId;
  aspectRatio: AspectRatio;
  onUpdate: (updates: Partial<Shot>) => void;
  onDelete: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const shotPrompt = shot.imagePrompt
    ? `${shot.imagePrompt}. ${scenePrompt}`
    : `${shot.label} shot. ${scenePrompt}`;

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const charBlock = characters.filter((c) => c.description).map((c) => c.description).join('. ');
      const prodBlock = (productRefs || []).filter((p) => p.description).map((p) => p.description).join('. ');
      const allDescs = [charBlock, prodBlock].filter(Boolean).join('. ');
      const fullPrompt = allDescs ? `${allDescs}. ${shotPrompt}` : shotPrompt;
      const charWithRef = characters.find((c) => c.referenceImageUrl);
      const prodWithRef = (productRefs || []).find((p) => p.referenceImageUrl);
      const refImage = charWithRef?.referenceImageUrl || prodWithRef?.referenceImageUrl || null;
      const addRefs = [...(charWithRef?.additionalRefs || []), ...(prodWithRef?.additionalRefs || [])];
      const url = await generateImage(fullPrompt, imageModel, refImage, addRefs, aspectRatio);
      if (url) onUpdate({ imageUrl: url });
    } catch { /* ignore */ }
    setLoading(false);
  };

  return (
    <div className="flex gap-2 items-start bg-background rounded border border-border p-2">
      {/* Thumbnail */}
      <div className="w-20 shrink-0 space-y-1">
        <div className="w-20 h-14 rounded bg-surface overflow-hidden flex items-center justify-center relative group">
          {shot.imageUrl ? (
            <>
              <img src={shot.imageUrl} alt={shot.label} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                <a href={shot.imageUrl} download={`${shot.label}.png`} target="_blank" rel="noopener noreferrer" className="text-[8px] text-white hover:underline">
                  Download
                </a>
              </div>
            </>
          ) : (
            <span className="text-[8px] text-muted/40">{shot.label}</span>
          )}
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full text-[8px] px-1 py-0.5 rounded bg-accent/10 hover:bg-accent/20 text-accent disabled:opacity-30 flex items-center justify-center gap-0.5"
        >
          {loading ? <><div className="w-2 h-2 border border-accent border-t-transparent rounded-full animate-spin" /> Gen...</> : 'Generieren'}
        </button>
      </div>
      {/* Fields */}
      <div className="flex-1 space-y-1">
        <div className="flex gap-1.5">
          <input
            value={shot.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            className="w-24 bg-transparent border border-border rounded px-1.5 py-0.5 text-[10px] text-foreground outline-none focus:border-accent"
            placeholder="Shot-Typ"
          />
          <select
            value={shot.cameraMovement}
            onChange={(e) => onUpdate({ cameraMovement: e.target.value })}
            className="flex-1 bg-transparent border border-border rounded px-1 py-0.5 text-[10px] text-foreground outline-none"
          >
            {Object.entries(cameraPresets).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
          <button onClick={onDelete} className="text-danger/50 hover:text-danger text-[10px] px-1">x</button>
        </div>
        <input
          value={shot.imagePrompt}
          onChange={(e) => onUpdate({ imagePrompt: e.target.value })}
          placeholder="Shot-spezifischer Prompt (optional, Szene-Prompt wird angehaengt)..."
          className="w-full bg-transparent border border-border rounded px-1.5 py-0.5 text-[10px] text-foreground placeholder:text-muted/30 outline-none focus:border-accent"
        />
      </div>
    </div>
  );
}

export default function SceneCard({ scene, index, characters, productRefs, aspectRatio, onChange, onDelete, onDuplicate, onMoveUp, onMoveDown, onSetAsReference, nextSceneImageUrl, allScenes, onVideoGenerated, isFirst, isLast }: SceneCardProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [showExport, setShowExport] = useState(false);
  const [genImageLoading, setGenImageLoading] = useState(false);
  const [genVideoLoading, setGenVideoLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [genError, setGenError] = useState<string | null>(null);
  const [imageModel, setImageModel] = useState<ImageModelId>('fal-ai/nano-banana-pro');
  const [improving, setImproving] = useState(false);
  const [startFrameId, setStartFrameId] = useState<string>('self');
  const [endFrameId, setEndFrameId] = useState<string>('next');
  const [videoModel, setVideoModel] = useState<VideoModelId>('fal-ai/kling-video/v2/master/image-to-video');

  const veoPrompt = scene.veoPrompt || buildVeoPrompt(scene, characters, productRefs);
  const seedancePrompt = scene.seedancePrompt || buildSeedancePrompt(scene, characters, productRefs);
  const enrichedImagePrompt = buildImagePrompt(scene, characters, productRefs);
  const imageWords = getWordCount(scene.imagePrompt);
  const enrichedWords = getWordCount(enrichedImagePrompt);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange({ imageUrl: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleGenerateImage = async () => {
    if (!scene.imagePrompt.trim()) return;
    setGenImageLoading(true);
    setGenError(null);
    try {
      // Find first character or product with reference image
      const charWithRef = characters.find((c) => c.referenceImageUrl);
      const prodWithRef = (productRefs || []).find((p) => p.referenceImageUrl);
      const refImage = charWithRef?.referenceImageUrl || prodWithRef?.referenceImageUrl || null;
      const addRefs = [
        ...(charWithRef?.additionalRefs || []),
        ...(prodWithRef?.additionalRefs || []),
      ];
      const url = await generateImage(enrichedImagePrompt, imageModel, refImage, addRefs, aspectRatio);
      if (url) onChange({ imageUrl: url });
      else setGenError('Kein Bild erhalten');
    } catch (err: unknown) {
      setGenError(err instanceof Error ? err.message : 'Bild-Generierung fehlgeschlagen');
    } finally {
      setGenImageLoading(false);
    }
  };

  const getStartFrame = (): string | null => {
    if (startFrameId === 'self') return scene.imageUrl;
    const s = allScenes.find((sc) => sc.id === startFrameId);
    return s?.imageUrl || scene.imageUrl;
  };

  const getEndFrame = (): string | null => {
    if (endFrameId === 'none') return null;
    if (endFrameId === 'next') return nextSceneImageUrl || null;
    const s = allScenes.find((sc) => sc.id === endFrameId);
    return s?.imageUrl || null;
  };

  const handleGenerateVideo = async () => {
    const selectedModel = videoModels.find((m) => m.id === videoModel);
    const isT2V = selectedModel?.type === 't2v';
    const isFLF = selectedModel?.type === 'flf';
    const startFrame = getStartFrame();
    const endFrame = selectedModel?.supportsEndFrame ? getEndFrame() : null;
    if (!isT2V && !isFLF && !startFrame) return;
    if (isFLF && !startFrame) return;
    // Use model-specific prompt: Seedance → seedancePrompt, Veo/others → veoPrompt
    const videoPrompt = videoModel.includes('seedance') ? seedancePrompt : veoPrompt;
    if (!videoPrompt) return;
    setGenVideoLoading(true);
    setGenError(null);
    try {
      const url = await generateVideo(
        videoPrompt,
        String(scene.duration),
        videoModel,
        isT2V ? null : startFrame,
        endFrame,
        aspectRatio
      );
      if (url) {
        setVideoUrl(url);
        onVideoGenerated?.(scene.id, url);
      } else {
        setGenError('Kein Video erhalten');
      }
    } catch (err: unknown) {
      setGenError(err instanceof Error ? err.message : 'Video-Generierung fehlgeschlagen');
    } finally {
      setGenVideoLoading(false);
    }
  };

  const handleImprovePrompt = async () => {
    if (!scene.imagePrompt.trim()) return;
    setImproving(true);
    try {
      const res = await fetch('/api/improve-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: scene.imagePrompt,
          filmStock: scene.filmStock,
          lens: scene.lens,
          cinematicStyle: scene.cinematicStyle,
          mood: scene.mood,
        }),
      });
      if (res.ok) {
        const { improved } = await res.json();
        onChange({ imagePrompt: improved });
      }
    } catch { /* ignore */ }
    setImproving(false);
  };

  return (
    <div className="border border-border rounded-lg bg-surface overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-surface-hover border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted">#{index + 1}</span>
          <input
            type="text"
            value={scene.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder={`Szene ${index + 1}`}
            className="bg-transparent text-sm font-medium text-foreground placeholder:text-muted/50 outline-none w-48"
          />
          {/* Tags */}
          {scene.filmStock && <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400">{scene.filmStock}</span>}
          {scene.lens && <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-400">{scene.lens}</span>}
          {scene.cinematicStyle && <span className="text-[9px] px-1.5 py-0.5 rounded bg-pink-500/15 text-pink-400">{scene.cinematicStyle}</span>}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onDuplicate} className="text-muted hover:text-foreground text-[10px] px-1" title="Duplizieren">dup</button>
          <button onClick={onMoveUp} disabled={isFirst} className="text-muted hover:text-foreground disabled:opacity-20 text-xs px-1">^</button>
          <button onClick={onMoveDown} disabled={isLast} className="text-muted hover:text-foreground disabled:opacity-20 text-xs px-1">v</button>
          <button onClick={onDelete} className="text-danger/60 hover:text-danger text-xs px-1 ml-1">x</button>
        </div>
      </div>

      {/* Error */}
      {genError && <div className="px-3 py-1 text-xs text-danger bg-danger/5 border-b border-border">{genError}</div>}

      <div className="flex gap-0">
        {/* Image area */}
        <div className="w-52 shrink-0 bg-background border-r border-border flex flex-col">
          <div className="h-36 relative group">
            {scene.imageUrl ? (
              <>
                <img src={scene.imageUrl} alt={scene.title || 'Scene'} className="w-full h-full object-cover" />
                <div className="absolute inset-0 z-10 bg-black/60 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto flex flex-col items-center justify-center gap-2">
                  <a
                    href={scene.imageUrl}
                    download={`${scene.title || `scene-${index + 1}`}.png`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] px-3 py-1.5 rounded bg-white/20 text-white hover:bg-white/40 cursor-pointer"
                  >
                    Bild herunterladen
                  </a>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="text-[10px] px-3 py-1.5 rounded bg-white/20 text-white hover:bg-white/40 cursor-pointer"
                  >
                    Bild tauschen
                  </button>
                  <button
                    onClick={() => onSetAsReference(scene.imageUrl!)}
                    className="text-[10px] px-3 py-1.5 rounded bg-accent text-white hover:bg-accent-hover cursor-pointer"
                  >
                    Als Charakter-Referenz
                  </button>
                </div>
              </>
            ) : (
              <div
                className="w-full h-full flex items-center justify-center cursor-pointer"
                onClick={() => fileRef.current?.click()}
              >
                <div className="text-center text-xs text-muted/50 px-4">
                  <div className="text-2xl mb-1">+</div>
                  Bild hochladen
                </div>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>
          {/* AI Generate buttons */}
          <div className="p-1.5 space-y-1 border-t border-border">
            {/* Image model + generate */}
            <select
              value={imageModel}
              onChange={(e) => setImageModel(e.target.value as ImageModelId)}
              className="w-full bg-background border border-border rounded px-1.5 py-0.5 text-[10px] text-foreground outline-none"
            >
              {imageModels.map((m) => (
                <option key={m.id} value={m.id}>{m.label} ~${m.cost}</option>
              ))}
            </select>
            <button
              onClick={handleGenerateImage}
              disabled={genImageLoading || !scene.imagePrompt.trim()}
              className="w-full text-[10px] px-2 py-1.5 rounded bg-accent/10 hover:bg-accent/20 text-accent font-medium disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-1"
            >
              {genImageLoading ? (
                <><div className="w-2.5 h-2.5 border border-accent border-t-transparent rounded-full animate-spin" /> Generiere...</>
              ) : (
                'Bild generieren'
              )}
            </button>
            {/* Video model + generate */}
            <select
              value={videoModel}
              onChange={(e) => setVideoModel(e.target.value as VideoModelId)}
              className="w-full bg-background border border-border rounded px-1.5 py-0.5 text-[10px] text-foreground outline-none mt-1"
            >
              {videoModels.map((m) => (
                <option key={m.id} value={m.id}>{m.label} ~${m.cost}</option>
              ))}
            </select>
            {/* Start / End Frame */}
            <div className="flex gap-1 mt-1">
              <div className="flex-1">
                <label className="text-[8px] uppercase text-muted block mb-0.5">Start-Frame</label>
                <select
                  value={startFrameId}
                  onChange={(e) => setStartFrameId(e.target.value)}
                  className="w-full bg-background border border-border rounded px-1 py-0.5 text-[9px] text-foreground outline-none"
                >
                  <option value="self">Diese Szene</option>
                  {allScenes.filter((s) => s.imageUrl && s.id !== scene.id).map((s) => (
                    <option key={s.id} value={s.id}>#{s.order + 1} {s.title || `Szene ${s.order + 1}`}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-[8px] uppercase text-muted block mb-0.5">End-Frame</label>
                <select
                  value={endFrameId}
                  onChange={(e) => setEndFrameId(e.target.value)}
                  className="w-full bg-background border border-border rounded px-1 py-0.5 text-[9px] text-foreground outline-none"
                >
                  <option value="none">— kein —</option>
                  <option value="next">Naechste Szene</option>
                  {allScenes.filter((s) => s.imageUrl && s.id !== scene.id).map((s) => (
                    <option key={s.id} value={s.id}>#{s.order + 1} {s.title || `Szene ${s.order + 1}`}</option>
                  ))}
                </select>
              </div>
            </div>
            {/* Frame preview */}
            {(getStartFrame() || getEndFrame()) && (
              <div className="flex gap-1 mt-1">
                {getStartFrame() && (
                  <div className="flex-1 flex items-center gap-1">
                    <div className="w-8 h-5 rounded overflow-hidden bg-background shrink-0">
                      <img src={getStartFrame()!} alt="Start" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[8px] text-muted">Start</span>
                  </div>
                )}
                {getEndFrame() && (
                  <div className="flex-1 flex items-center gap-1">
                    <div className="w-8 h-5 rounded overflow-hidden bg-background shrink-0">
                      <img src={getEndFrame()!} alt="End" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[8px] text-muted">End</span>
                  </div>
                )}
              </div>
            )}
            <button
              onClick={handleGenerateVideo}
              disabled={genVideoLoading || (!getStartFrame() && videoModels.find((m) => m.id === videoModel)?.type === 'i2v')}
              className="w-full text-[10px] px-2 py-1.5 rounded bg-green-500/10 hover:bg-green-500/20 text-green-400 font-medium disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-1 mt-1"
            >
              {genVideoLoading ? (
                <><div className="w-2.5 h-2.5 border border-green-400 border-t-transparent rounded-full animate-spin" /> Generiere...</>
              ) : (
                'Video generieren'
              )}
            </button>
          </div>
          {/* Video preview */}
          {videoUrl && (
            <div className="border-t border-border">
              <video src={videoUrl} controls className="w-full" />
              <div className="flex justify-center gap-2 py-1">
                <a href={videoUrl} download={`${scene.title || `scene-${index + 1}`}.mp4`} target="_blank" rel="noopener noreferrer" className="text-[10px] text-accent hover:underline">
                  Video herunterladen
                </a>
                <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-muted hover:text-foreground">
                  Im Tab oeffnen
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Fields */}
        <div className="flex-1 p-3 space-y-2">
          {/* Prompt */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] uppercase tracking-wide text-muted">Image Prompt (EN)</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleImprovePrompt}
                  disabled={improving || !scene.imagePrompt.trim()}
                  className="text-[10px] px-2 py-0.5 rounded bg-green-500/10 hover:bg-green-500/20 text-green-400 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {improving ? 'Verbessere...' : 'KI verbessern'}
                </button>
                <CopyButton text={enrichedImagePrompt} label="Copy (mit Style)" />
                <CopyButton text={scene.imagePrompt} label="Copy (roh)" />
                <span className={`text-[10px] font-mono ${enrichedWords > 120 ? 'text-danger' : imageWords !== enrichedWords ? 'text-accent' : 'text-muted'}`}>
                  {imageWords}{enrichedWords !== imageWords ? ` → ${enrichedWords}` : ''}/120
                </span>
              </div>
            </div>
            <textarea
              value={scene.imagePrompt}
              onChange={(e) => onChange({ imagePrompt: e.target.value })}
              placeholder="A cinematic close-up of a weathered hand reaching for a glowing crystal..."
              rows={3}
              className="w-full bg-background border border-border rounded px-2.5 py-1.5 text-sm text-foreground placeholder:text-muted/40 outline-none focus:border-accent resize-none"
            />
          </div>

          {/* Row 1: Style + Camera + Duration */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-[10px] uppercase tracking-wide text-muted block mb-1">Style</label>
              <select
                value={scene.style}
                onChange={(e) => onChange({ style: e.target.value })}
                className="w-full bg-background border border-border rounded px-2 py-1 text-xs text-foreground outline-none focus:border-accent"
              >
                {Object.entries(stylePresets).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-[10px] uppercase tracking-wide text-muted block mb-1">Kamera</label>
              <select
                value={scene.cameraMovement}
                onChange={(e) => onChange({ cameraMovement: e.target.value })}
                className="w-full bg-background border border-border rounded px-2 py-1 text-xs text-foreground outline-none focus:border-accent"
              >
                {Object.entries(cameraPresets).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
            <div className="w-16">
              <label className="text-[10px] uppercase tracking-wide text-muted block mb-1">Sek.</label>
              <input
                type="number"
                min={1}
                max={30}
                value={scene.duration}
                onChange={(e) => onChange({ duration: parseInt(e.target.value) || 5 })}
                className="w-full bg-background border border-border rounded px-2 py-1 text-xs text-foreground outline-none focus:border-accent text-center"
              />
            </div>
          </div>

          {/* Row 2: Film Stock + Lens + Cinematic Style */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-[10px] uppercase tracking-wide text-amber-400/70 block mb-1">Film Stock</label>
              <select
                value={scene.filmStock}
                onChange={(e) => onChange({ filmStock: e.target.value })}
                className="w-full bg-background border border-border rounded px-2 py-1 text-xs text-foreground outline-none focus:border-amber-500/50"
              >
                <option value="">— keiner —</option>
                {filmStocks.map((fs) => (
                  <option key={fs.title} value={fs.title}>{fs.title}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-[10px] uppercase tracking-wide text-purple-400/70 block mb-1">Lens/Camera</label>
              <select
                value={scene.lens}
                onChange={(e) => onChange({ lens: e.target.value })}
                className="w-full bg-background border border-border rounded px-2 py-1 text-xs text-foreground outline-none focus:border-purple-500/50"
              >
                <option value="">— keiner —</option>
                {lensPresets.map((lp) => (
                  <option key={lp.title} value={lp.title}>{lp.title}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-[10px] uppercase tracking-wide text-pink-400/70 block mb-1">Cinematic Style</label>
              <select
                value={scene.cinematicStyle}
                onChange={(e) => onChange({ cinematicStyle: e.target.value })}
                className="w-full bg-background border border-border rounded px-2 py-1 text-xs text-foreground outline-none focus:border-pink-500/50"
              >
                <option value="">— keiner —</option>
                {cinematicStyles.map((cs) => (
                  <option key={cs.title} value={cs.title}>{cs.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Mood + Notes */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-[10px] uppercase tracking-wide text-muted block mb-1">Mood</label>
              <input
                type="text"
                value={scene.mood}
                onChange={(e) => onChange({ mood: e.target.value })}
                placeholder="dramatic tension, warm nostalgia..."
                className="w-full bg-background border border-border rounded px-2 py-1 text-xs text-foreground placeholder:text-muted/40 outline-none focus:border-accent"
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] uppercase tracking-wide text-muted block mb-1">Notizen</label>
              <input
                type="text"
                value={scene.notes}
                onChange={(e) => onChange({ notes: e.target.value })}
                placeholder="Transition zu Szene 3..."
                className="w-full bg-background border border-border rounded px-2 py-1 text-xs text-foreground placeholder:text-muted/40 outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Voiceover / Audio */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-[10px] uppercase tracking-wide text-orange-400/70 block mb-1">Voiceover / Dialog</label>
              <textarea
                value={scene.voiceover || ''}
                onChange={(e) => onChange({ voiceover: e.target.value })}
                placeholder="Sprechtext oder Dialog für diese Szene..."
                rows={2}
                className="w-full bg-background border border-border rounded px-2 py-1 text-xs text-foreground placeholder:text-muted/40 outline-none focus:border-orange-500/50 resize-none"
              />
            </div>
          </div>

          {/* Sub-Shots */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase tracking-wide text-muted">Zusätzliche Shots</label>
              <button
                onClick={() => {
                  const shots = [...(scene.shots || []), {
                    id: Date.now().toString(36),
                    label: ['Close-Up', 'Over-the-Shoulder', 'Detail', 'Gegenschuss', 'Wide'][Math.min((scene.shots || []).length, 4)],
                    imagePrompt: '',
                    imageUrl: null,
                    cameraMovement: 'statisch',
                  }];
                  onChange({ shots });
                }}
                className="text-[10px] text-accent hover:text-accent-hover"
              >
                + Shot
              </button>
            </div>
            {(scene.shots || []).length > 0 && (
              <div className="mt-1.5 space-y-1.5">
                {(scene.shots || []).map((shot, si) => (
                  <ShotRow
                    key={shot.id}
                    shot={shot}
                    scenePrompt={scene.imagePrompt}
                    characters={characters}
                    productRefs={productRefs}
                    imageModel={imageModel}
                    aspectRatio={aspectRatio}
                    onUpdate={(updates) => {
                      const shots = [...(scene.shots || [])];
                      shots[si] = { ...shots[si], ...updates };
                      onChange({ shots });
                    }}
                    onDelete={() => {
                      const shots = (scene.shots || []).filter((_, i) => i !== si);
                      onChange({ shots });
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* End-Frame Indicator */}
          {nextSceneImageUrl && (
            <div className="flex items-center gap-2 text-[10px] text-green-400/70">
              <div className="w-8 h-5 rounded overflow-hidden bg-surface shrink-0">
                <img src={nextSceneImageUrl} alt="End frame" className="w-full h-full object-cover" />
              </div>
              End-Frame: Bild nächste Szene (Seedance 2.0 / Veo 3.1 / Kling 2.6)
            </div>
          )}

          {/* Export toggle */}
          <div>
            <button
              onClick={() => setShowExport(!showExport)}
              className="text-[10px] text-accent hover:text-accent-hover"
            >
              {showExport ? '- Video-Prompts ausblenden' : '+ Video-Prompts anzeigen'}
            </button>
            {showExport && (
              <div className="mt-2 space-y-2">
                {/* Veo */}
                <div className="bg-background rounded border border-border p-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase tracking-wide text-blue-400">Veo 3.1</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono ${getWordCount(veoPrompt) > 50 ? 'text-danger' : 'text-muted'}`}>
                        {getWordCount(veoPrompt)}/50
                      </span>
                      <CopyButton text={veoPrompt} label="Copy Veo" />
                    </div>
                  </div>
                  <textarea
                    value={scene.veoPrompt}
                    onChange={(e) => onChange({ veoPrompt: e.target.value })}
                    placeholder={buildVeoPrompt(scene) || 'Veo prompt...'}
                    rows={2}
                    className="w-full bg-transparent text-xs text-foreground/70 font-mono leading-relaxed outline-none resize-none placeholder:text-muted/30"
                  />
                </div>
                {/* Seedance */}
                <div className="bg-background rounded border border-border p-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase tracking-wide text-green-400">Seedance 2.0</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono ${getWordCount(seedancePrompt) > 80 ? 'text-danger' : 'text-muted'}`}>
                        {getWordCount(seedancePrompt)}/80
                      </span>
                      <CopyButton text={seedancePrompt} label="Copy Seedance" />
                    </div>
                  </div>
                  <textarea
                    value={scene.seedancePrompt}
                    onChange={(e) => onChange({ seedancePrompt: e.target.value })}
                    placeholder={buildSeedancePrompt(scene) || 'Seedance prompt...'}
                    rows={2}
                    className="w-full bg-transparent text-xs text-foreground/70 font-mono leading-relaxed outline-none resize-none placeholder:text-muted/30"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
