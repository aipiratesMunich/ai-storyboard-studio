'use client';

import { useState, useRef } from 'react';
import type { Scene } from '@/lib/types';

interface VideoStitcherProps {
  scenes: Scene[];
  videoUrls: Record<string, string>; // sceneId → videoUrl
}

export default function VideoStitcher({ scenes, videoUrls }: VideoStitcherProps) {
  const [stitching, setStitching] = useState(false);
  const [progress, setProgress] = useState('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const ffmpegRef = useRef<any>(null);

  const availableVideos = scenes.filter((s) => videoUrls[s.id]);

  if (availableVideos.length < 2) return null;

  const handleStitch = async () => {
    setStitching(true);
    setError(null);
    setProgress('ffmpeg laden...');

    try {
      // Dynamic import to avoid SSR issues
      const { FFmpeg } = await import('@ffmpeg/ffmpeg');
      const { fetchFile } = await import('@ffmpeg/util');

      const ffmpeg = new FFmpeg();
      ffmpegRef.current = ffmpeg;

      ffmpeg.on('progress', ({ progress: p }) => {
        setProgress(`Verarbeite... ${Math.round(p * 100)}%`);
      });

      setProgress('ffmpeg initialisieren...');
      await ffmpeg.load({
        coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.js',
        wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.wasm',
      });

      // Download and write each video
      const fileList: string[] = [];
      for (let i = 0; i < availableVideos.length; i++) {
        const scene = availableVideos[i];
        const url = videoUrls[scene.id];
        setProgress(`Video ${i + 1}/${availableVideos.length} laden...`);

        const data = await fetchFile(url);
        const filename = `input${i}.mp4`;
        await ffmpeg.writeFile(filename, data);
        fileList.push(filename);
      }

      // Create concat file
      const concatContent = fileList.map((f) => `file '${f}'`).join('\n');
      await ffmpeg.writeFile('concat.txt', new TextEncoder().encode(concatContent));

      // Stitch
      setProgress('Videos zusammenfügen...');
      await ffmpeg.exec([
        '-f', 'concat',
        '-safe', '0',
        '-i', 'concat.txt',
        '-c', 'copy',
        '-movflags', '+faststart',
        'output.mp4',
      ]);

      // Read result
      const outputData = await ffmpeg.readFile('output.mp4');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const buffer = outputData as any;
      const blob = new Blob([buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)], { type: 'video/mp4' });
      const resultUrl = URL.createObjectURL(blob);
      setResultUrl(resultUrl);
      setProgress('Fertig!');

      // Cleanup
      for (const f of fileList) {
        await ffmpeg.deleteFile(f);
      }
      await ffmpeg.deleteFile('concat.txt');
      await ffmpeg.deleteFile('output.mp4');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Stitching fehlgeschlagen');
      setProgress('');
    } finally {
      setStitching(false);
    }
  };

  return (
    <div className="border border-border rounded-lg bg-surface overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-surface-hover flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Video zusammenfügen</h3>
          <p className="text-[10px] text-muted">{availableVideos.length} Videos verfügbar</p>
        </div>
        {!resultUrl && (
          <button
            onClick={handleStitch}
            disabled={stitching}
            className="text-xs px-3 py-1.5 rounded bg-green-600 hover:bg-green-700 text-white font-medium disabled:opacity-40"
          >
            {stitching ? progress : 'Alle Videos zusammenfügen'}
          </button>
        )}
      </div>

      {/* Progress */}
      {stitching && (
        <div className="px-4 py-3 flex items-center gap-2 text-xs text-accent">
          <div className="w-3 h-3 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          {progress}
        </div>
      )}

      {/* Error */}
      {error && <div className="px-4 py-2 text-xs text-danger">{error}</div>}

      {/* Result */}
      {resultUrl && (
        <div className="p-4 space-y-3">
          <video src={resultUrl} controls className="w-full rounded border border-border" />
          <div className="flex gap-2">
            <a
              href={resultUrl}
              download="storyboard-final.mp4"
              className="flex-1 text-center text-xs px-3 py-2 rounded bg-accent hover:bg-accent-hover text-white font-medium"
            >
              Fertiges Video herunterladen
            </a>
            <button
              onClick={() => { setResultUrl(null); setProgress(''); }}
              className="text-xs px-3 py-2 rounded bg-surface-hover hover:bg-border text-muted border border-border"
            >
              Nochmal
            </button>
          </div>
        </div>
      )}

      {/* Scene list */}
      {!resultUrl && !stitching && (
        <div className="px-4 py-2 space-y-1">
          {availableVideos.map((scene, i) => (
            <div key={scene.id} className="flex items-center gap-2 text-[10px] text-muted">
              <span className="font-mono w-5">#{scene.order + 1}</span>
              <span className="flex-1 truncate text-foreground/70">{scene.title || `Szene ${scene.order + 1}`}</span>
              <span>{scene.duration}s</span>
            </div>
          ))}
          <div className="text-[10px] text-muted pt-1 border-t border-border mt-1">
            Gesamtdauer: {availableVideos.reduce((s, sc) => s + sc.duration, 0)}s
          </div>
        </div>
      )}
    </div>
  );
}
