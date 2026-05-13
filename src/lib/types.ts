export interface Shot {
  id: string;
  label: string; // e.g. "Wide", "Close-Up", "OTS"
  imagePrompt: string;
  imageUrl: string | null;
  cameraMovement: string;
}

export interface Scene {
  id: string;
  order: number;
  title: string;
  imagePrompt: string;
  imageUrl: string | null;
  cameraMovement: string;
  style: string;
  mood: string;
  duration: number; // seconds
  notes: string;
  veoPrompt: string;
  seedancePrompt: string;
  filmStock: string;
  cinematicStyle: string;
  lens: string;
  shots: Shot[];
  voiceover: string; // voiceover/dialogue text for the scene
  audioUrl: string | null; // uploaded audio file
  startFrameSceneId: string | null;
}

export interface Character {
  id: string;
  name: string;
  description: string; // EN — exact visual description
  referenceImageUrl: string | null; // primary reference
  additionalRefs: string[]; // additional angle references (up to 5 more)
}

export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:5' | '4:3';

export interface ProductRef {
  id: string;
  name: string;
  description: string; // EN — exact visual description of the product
  referenceImageUrl: string | null;
  additionalRefs: string[];
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  characters: Character[];
  productRefs: ProductRef[];
  scenes: Scene[];
  aspectRatio: AspectRatio;
}

export type ViewMode = 'board' | 'timeline' | 'export' | 'product-studio';

export interface PlatformConfig {
  id: string;
  label: string;
  type: 'image' | 'video';
  systemRules: string[];
  promptStructure: string;
  maxRecommendedWords: number;
  cameraMovements: string[];
  tips: string[];
  parameters: { param: string; description: string; example: string }[];
}

export interface StylePreset {
  label: string;
  keywords: string;
}

export interface CameraPreset {
  label: string;
  keywords: string;
}
