'use client';

import { fal } from '@fal-ai/client';

fal.config({ proxyUrl: '/api/fal/proxy' });

// ── Image Models ──
export const imageModels = [
  { id: 'fal-ai/nano-banana-pro', label: 'Nano Banana Pro (Google)', cost: 0.04 },
  { id: 'fal-ai/imagen4/preview', label: 'Imagen 4 (Google)', cost: 0.05 },
  { id: 'fal-ai/imagen4/preview/fast', label: 'Imagen 4 Fast', cost: 0.03 },
  { id: 'fal-ai/imagen4/preview/ultra', label: 'Imagen 4 Ultra', cost: 0.08 },
  { id: 'fal-ai/recraft-v3', label: 'Recraft V3', cost: 0.08 },
  { id: 'fal-ai/flux-pro/v1.1', label: 'Flux Pro 1.1', cost: 0.04 },
  { id: 'fal-ai/flux-2-flex', label: 'Flux 2 Flex', cost: 0.04 },
  { id: 'fal-ai/flux/dev', label: 'Flux Dev (guenstig)', cost: 0.01 },
  { id: 'fal-ai/flux/schnell', label: 'Flux Schnell (schnell)', cost: 0.005 },
  { id: 'fal-ai/stable-diffusion-v35-large', label: 'SD 3.5 Large', cost: 0.03 },
  { id: 'fal-ai/stable-diffusion-v3-medium', label: 'SD 3 Medium', cost: 0.02 },
] as const;

// ── Video Models ──
export const videoModels = [
  // Image-to-Video
  { id: 'bytedance/seedance-2.0/fast/image-to-video', label: 'Seedance 2.0 (I2V, End-Frame, Audio)', type: 'i2v' as const, supportsEndFrame: true, cost: 0.12 },
  { id: 'fal-ai/veo3.1/fast/first-last-frame-to-video', label: 'Veo 3.1 (Start+End Frame)', type: 'flf' as const, supportsEndFrame: true, cost: 0.15 },
  { id: 'fal-ai/kling-video/v2.6/pro/image-to-video', label: 'Kling 2.6 Pro (I2V)', type: 'i2v' as const, supportsEndFrame: true, cost: 0.15 },
  { id: 'fal-ai/kling-video/v2.1/pro/image-to-video', label: 'Kling 2.1 Pro (I2V)', type: 'i2v' as const, supportsEndFrame: false, cost: 0.12 },
  { id: 'fal-ai/kling-video/v2/master/image-to-video', label: 'Kling V2 Master (I2V)', type: 'i2v' as const, supportsEndFrame: false, cost: 0.10 },
  { id: 'fal-ai/bytedance/seedance/v1/pro/image-to-video', label: 'Seedance 1.0 Pro (I2V)', type: 'i2v' as const, supportsEndFrame: false, cost: 0.10 },
  { id: 'fal-ai/wan/v2.1/image-to-video', label: 'WAN 2.1 (I2V)', type: 'i2v' as const, supportsEndFrame: false, cost: 0.05 },
  { id: 'fal-ai/ltx-video-13b-distilled/image-to-video', label: 'LTX 13B (I2V)', type: 'i2v' as const, supportsEndFrame: false, cost: 0.04 },
  // Text-to-Video
  { id: 'fal-ai/wan/v2.7/text-to-video', label: 'WAN 2.7 (T2V + Audio)', type: 't2v' as const, supportsEndFrame: false, cost: 0.06 },
  { id: 'fal-ai/kling-video/v2.6/pro/text-to-video', label: 'Kling 2.6 Pro (T2V)', type: 't2v' as const, supportsEndFrame: false, cost: 0.15 },
] as const;

export type ImageModelId = typeof imageModels[number]['id'];
export type VideoModelId = typeof videoModels[number]['id'];

// Nano Banana Pro identity lock prefix
const NB_IDENTITY_LOCK = 'Maintain the exact same facial features as the reference image — same eyes, nose shape, jawline contour, skin texture, hair style and color, body build. The character must be immediately recognizable as the same person.';

// ── Aspect Ratio Mapping ──
import type { AspectRatio } from './types';

const recraftSizeMap: Record<AspectRatio, string> = {
  '16:9': 'landscape_16_9',
  '9:16': 'portrait_9_16',
  '1:1': 'square',
  '4:5': 'portrait_4_5',
  '4:3': 'landscape_4_3',
};

const fluxSizeMap: Record<AspectRatio, string> = {
  '16:9': 'landscape_16_9',
  '9:16': 'portrait_16_9',
  '1:1': 'square_hd',
  '4:5': 'portrait_4_3',
  '4:3': 'landscape_4_3',
};

// ── Image Generation ──
export async function generateImage(
  prompt: string,
  modelId: ImageModelId = 'fal-ai/nano-banana-pro',
  referenceImageUrl?: string | null,
  additionalRefs?: string[],
  aspectRatio: AspectRatio = '16:9'
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let input: any;

  if (modelId === 'fal-ai/nano-banana-pro') {
    input = { prompt, aspect_ratio: aspectRatio, resolution: '2K' };
    if (referenceImageUrl) {
      input.image_url = referenceImageUrl;
      input.prompt = `${NB_IDENTITY_LOCK} ${prompt}`;
      if (additionalRefs && additionalRefs.length > 0) {
        input.image_urls = [referenceImageUrl, ...additionalRefs.slice(0, 13)];
      }
    }
  } else if (modelId.includes('imagen4')) {
    input = { prompt, aspect_ratio: aspectRatio };
  } else if (modelId === 'fal-ai/recraft-v3') {
    input = { prompt, style: 'realistic_image', size: recraftSizeMap[aspectRatio] };
  } else if (modelId.includes('stable-diffusion')) {
    input = { prompt, image_size: fluxSizeMap[aspectRatio], num_images: 1 };
  } else {
    input = { prompt, image_size: fluxSizeMap[aspectRatio], num_images: 1 };
    if (referenceImageUrl && (modelId.includes('flux-pro') || modelId.includes('flux/dev'))) {
      input.image_url = referenceImageUrl;
      input.strength = 0.65;
    }
  }

  const result = await fal.subscribe(modelId, { input, logs: false });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = result.data as any;
  return data?.images?.[0]?.url || data?.[0]?.url || null;
}

// ── Video Generation with Start/End Frame ──
export async function generateVideo(
  prompt: string,
  duration: string = '5',
  modelId: VideoModelId = 'bytedance/seedance-2.0/fast/image-to-video',
  startImageUrl?: string | null,
  endImageUrl?: string | null,
  aspectRatio: AspectRatio = '16:9'
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let input: any = { prompt };

  const model = videoModels.find((m) => m.id === modelId);

  if (model?.type === 'flf') {
    if (!startImageUrl) throw new Error('Veo 3.1 braucht ein Start-Frame');
    input = {
      prompt,
      first_frame_url: startImageUrl,
      aspect_ratio: aspectRatio,
    };
    if (endImageUrl) input.last_frame_url = endImageUrl;
  } else if (model?.type === 'i2v') {
    if (!startImageUrl) throw new Error('Image-to-Video braucht ein Bild');

    if (modelId.includes('seedance-2.0')) {
      input = {
        prompt,
        image_url: startImageUrl,
        duration: duration || 'auto',
        resolution: '720p',
        aspect_ratio: aspectRatio,
        generate_audio: true,
      };
      if (endImageUrl) input.end_image_url = endImageUrl;
    } else if (modelId.includes('kling')) {
      if (modelId.includes('v2.6')) {
        input = { prompt, start_image_url: startImageUrl, duration, aspect_ratio: aspectRatio };
        if (endImageUrl) input.tail_image_url = endImageUrl;
      } else {
        input = { prompt, image_url: startImageUrl, duration };
        if (endImageUrl && modelId.includes('v2.1')) input.tail_image_url = endImageUrl;
      }
    } else if (modelId.includes('seedance') && modelId.includes('v1')) {
      input = { prompt, image_url: startImageUrl };
    } else if (modelId.includes('ltx')) {
      input = { prompt, image_url: startImageUrl, resolution: '720p', num_frames: parseInt(duration) <= 5 ? 121 : 241 };
    } else {
      // WAN
      input = { prompt, image_url: startImageUrl, resolution: '720p', num_inference_steps: 40 };
    }
  } else {
    // Text-to-Video
    if (modelId.includes('wan')) {
      input = { prompt, resolution: '720p', aspect_ratio: aspectRatio, audio: true };
    } else {
      input = { prompt, duration, aspect_ratio: aspectRatio };
    }
  }

  const result = await fal.subscribe(modelId, { input, logs: false });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = result.data as any;
  return data?.video?.url || data?.video_url || null;
}

export { fal };
