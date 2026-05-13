import { nanoBanana, veo, seedance, stylePresets, cameraPresets } from './vault';
import { filmStocks, cinematicStyles, lensPresets } from './presets';
import type { Scene, Character, ProductRef } from './types';

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function getFilmStockSnippet(name: string): string {
  const fs = filmStocks.find((f) => f.title === name);
  return fs ? fs.prompt : '';
}

function getLensSnippet(name: string): string {
  const lp = lensPresets.find((l) => l.title === name);
  return lp ? lp.prompt : '';
}

function getCinematicStyleSnippet(name: string): string {
  const cs = cinematicStyles.find((c) => c.title === name);
  return cs ? cs.prompt : '';
}

// Build character injection string
function buildCharacterBlock(characters: Character[]): string {
  if (!characters || characters.length === 0) return '';
  return characters
    .filter((c) => c.description.trim())
    .map((c) => c.description.trim())
    .join('. ');
}

// Build product injection string
function buildProductBlock(productRefs: ProductRef[]): string {
  if (!productRefs || productRefs.length === 0) return '';
  return productRefs
    .filter((p) => p.description.trim())
    .map((p) => p.description.trim())
    .join('. ');
}

export function buildImagePrompt(scene: Scene, characters: Character[] = [], productRefs: ProductRef[] = []): string {
  const parts: string[] = [];

  const charBlock = buildCharacterBlock(characters);
  if (charBlock) parts.push(charBlock);

  const prodBlock = buildProductBlock(productRefs);
  if (prodBlock) parts.push(prodBlock);

  if (scene.imagePrompt) {
    parts.push(scene.imagePrompt);
  }

  // Preset enrichments
  if (scene.filmStock) {
    const snippet = getFilmStockSnippet(scene.filmStock);
    if (snippet && !scene.imagePrompt.toLowerCase().includes(scene.filmStock.toLowerCase())) {
      parts.push(snippet);
    }
  }

  if (scene.lens) {
    const snippet = getLensSnippet(scene.lens);
    if (snippet && !scene.imagePrompt.toLowerCase().includes(scene.lens.toLowerCase())) {
      parts.push(snippet);
    }
  }

  if (scene.cinematicStyle) {
    const snippet = getCinematicStyleSnippet(scene.cinematicStyle);
    if (snippet && !scene.imagePrompt.toLowerCase().includes(scene.cinematicStyle.toLowerCase())) {
      parts.push(snippet);
    }
  }

  if (scene.mood && !scene.imagePrompt.toLowerCase().includes(scene.mood.toLowerCase())) {
    parts.push(scene.mood);
  }

  return parts.join('. ').replace(/\.\./g, '.').trim();
}

export function buildVeoPrompt(scene: Scene, characters: Character[] = [], productRefs: ProductRef[] = []): string {
  const cam = cameraPresets[scene.cameraMovement];
  const style = stylePresets[scene.style];

  const parts: string[] = [];

  const charBlock = buildCharacterBlock(characters);
  if (charBlock) parts.push(charBlock);

  const prodBlock = buildProductBlock(productRefs);
  if (prodBlock) parts.push(prodBlock);

  if (scene.imagePrompt) {
    parts.push(scene.imagePrompt);
  }

  if (cam) {
    parts.push(cam.keywords.split(',')[0].trim());
  }

  if (style) {
    parts.push(style.keywords.split(',').slice(0, 2).join(', ').trim());
  }

  if (scene.filmStock) {
    parts.push(getFilmStockSnippet(scene.filmStock).split('.')[0]);
  }

  if (scene.mood) {
    parts.push(scene.mood);
  }

  return parts.join('. ').replace(/\.\./g, '.').trim() + '.';
}

export function buildSeedancePrompt(scene: Scene, characters: Character[] = [], productRefs: ProductRef[] = []): string {
  const cam = cameraPresets[scene.cameraMovement];

  const parts: string[] = [];

  const charBlock = buildCharacterBlock(characters);
  if (charBlock) parts.push(charBlock);

  const prodBlock = buildProductBlock(productRefs);
  if (prodBlock) parts.push(prodBlock);

  if (scene.imagePrompt) {
    parts.push(scene.imagePrompt);
  }

  if (cam) {
    parts.push(cam.keywords.split(',')[0].trim());
  }

  const styleMood: string[] = [];
  if (scene.cinematicStyle) styleMood.push(scene.cinematicStyle);
  else if (stylePresets[scene.style]) styleMood.push(stylePresets[scene.style].label);
  if (scene.mood) styleMood.push(scene.mood);
  if (styleMood.length) parts.push(styleMood.join(', '));

  return parts.join(', ').trim();
}

export function getWordCount(text: string): number {
  return countWords(text);
}

// Cost estimation
export interface CostEstimate {
  // fal.ai
  imageCount: number;
  videoCount: number;
  imageCostUsd: number;
  videoCostUsd: number;
  // OpenAI GPT-4o
  gptResearchCalls: number;
  gptGenerateCalls: number;
  gptCostUsd: number;
  // Total
  totalUsd: number;
}

// fal.ai pricing (approximate)
const COST_PER_IMAGE_NANO_BANANA = 0.04;
const COST_PER_IMAGE_IMAGEN4 = 0.05;
const COST_PER_IMAGE_FLUX = 0.05;
const COST_PER_IMAGE_RECRAFT = 0.08;
const COST_PER_VIDEO_5S = 0.10;
const COST_PER_VIDEO_10S = 0.20;

// OpenAI GPT-4o pricing
// Input: $2.50/1M tokens, Output: $10/1M tokens
// Research call: ~2000 input + ~1500 output tokens ≈ $0.02
// Generate call: ~3000 input + ~3000 output tokens ≈ $0.04
const COST_GPT_RESEARCH = 0.02;
const COST_GPT_GENERATE = 0.04;

export function estimateCost(scenes: Scene[], hasResearch: boolean = true): CostEstimate {
  const imageCount = scenes.length;
  const videoCount = scenes.length;
  const imageCostUsd = imageCount * COST_PER_IMAGE_NANO_BANANA;
  const videoCostUsd = scenes.reduce((sum, s) => sum + (s.duration <= 5 ? COST_PER_VIDEO_5S : COST_PER_VIDEO_10S), 0);

  const gptResearchCalls = hasResearch ? 1 : 0;
  const gptGenerateCalls = 1;
  const gptCostUsd = (gptResearchCalls * COST_GPT_RESEARCH) + (gptGenerateCalls * COST_GPT_GENERATE);

  return {
    imageCount,
    videoCount,
    imageCostUsd: Math.round(imageCostUsd * 100) / 100,
    videoCostUsd: Math.round(videoCostUsd * 100) / 100,
    gptResearchCalls,
    gptGenerateCalls,
    gptCostUsd: Math.round(gptCostUsd * 100) / 100,
    totalUsd: Math.round((imageCostUsd + videoCostUsd + gptCostUsd) * 100) / 100,
  };
}
