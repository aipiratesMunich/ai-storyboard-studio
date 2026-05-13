// Community Presets — open-source examples
// Add your own presets by extending the arrays below.

export interface Preset {
  title: string;
  prompt: string;
}

export const filmStocks: Preset[] = [
  { title: 'Kodak Portra 400', prompt: 'shot on Kodak Portra 400 film stock. Soft pastel color palette with muted tones. Creamy skin rendering with subtle warmth. Visible authentic film grain. Lifted shadows, gentle highlight rolloff.' },
  { title: 'Cinestill 800T', prompt: 'shot on Cinestill 800T tungsten film. Strong cyan-teal shadows, warm orange highlights. Distinctive red halation glow around bright lights. Heavy visible grain.' },
];

export const cinematicStyles: Preset[] = [
  { title: 'Neon Noir', prompt: 'neon noir aesthetic, vibrant pink and cyan lighting, rain-slicked surfaces, strong atmospheric haze, cyberpunk color palette, high contrast shadows' },
  { title: 'Teal & Orange', prompt: 'teal-orange color grade, strong complementary color contrast, warm skin tones, cool shadows, modern Hollywood aesthetic' },
];

export const lensPresets: Preset[] = [
  { title: 'ARRI Alexa 35', prompt: 'shot on ARRI Alexa 35 cinema camera. Exceptional dynamic range, natural organic color science, beautiful skin tones, film-like texture with subtle grain' },
  { title: 'Anamorphic Flare', prompt: 'anamorphic lens, single horizontal blue lens flare streak, oval bokeh shapes, 2.39:1 widescreen feel, cinematic blockbuster look' },
];

export const multishotSequences: Preset[] = [
  { title: 'Handheld Raw', prompt: 'Wide shot, camera finds the subject, slight searching movement. CUT. Medium shot, camera adjusts framing mid-shot. CUT. Close-up, intimate handheld proximity, subtle shake.' },
  { title: 'Slow Burn', prompt: 'Wide static shot, subject enters frame slowly. SLOW DISSOLVE. Medium shot, imperceptible slow zoom in. MATCH CUT. Extreme close-up, completely static, tension holds.' },
];

export const cameraMovements: Preset[] = [
  { title: 'Smooth Dolly In', prompt: 'smooth dolly-in, camera steadily moves forward toward the subject, gradual approach, cinematic reveal' },
  { title: 'Orbiting Subject', prompt: '360-degree orbit around the subject, smooth gimbal rotation, dynamic all-angle view' },
];

export const videoFX: Preset[] = [
  { title: 'Speed Ramping', prompt: 'speed ramping, dynamic tempo changes - slow motion on key moments, real-time on transitions' },
  { title: 'Slow Motion', prompt: 'slow motion, dramatic time dilation, smooth fluid movement, every detail visible' },
];

export const colorGrading: Preset[] = [
  { title: 'Blockbuster Grade', prompt: 'blockbuster Hollywood color grade, strong teal in shadows, orange in highlights, crushed blacks' },
  { title: 'Documentary Natural', prompt: 'documentary natural color, neutral accurate colors, realistic skin tones, journalistic integrity' },
];

// All presets grouped for UI
export const presetCategories = {
  'Film Stock': filmStocks,
  'Cinematic Style': cinematicStyles,
  'Lens/Camera': lensPresets,
  'Multishot Sequence': multishotSequences,
  'Camera Movement': cameraMovements,
  'Video FX': videoFX,
  'Color Grading': colorGrading,
} as const;

export type PresetCategory = keyof typeof presetCategories;
