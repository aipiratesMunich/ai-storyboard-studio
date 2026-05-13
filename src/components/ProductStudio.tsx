'use client';

import { useRef, useState } from 'react';
import { fal } from '@/lib/fal';

interface ProductVariant {
  id: string;
  label: string;
  description: string;
  bgPrompt: string;
  imageUrl: string | null;
  loading: boolean;
  videoUrl: string | null;
  videoLoading: boolean;
}

const ANIMATION_PRESETS = [
  { id: 'slow-orbit', label: 'Slow Orbit', prompt: 'Camera slowly orbits around the product in a smooth 360-degree arc, dramatic lighting shifts, premium product showcase' },
  { id: 'zoom-in', label: 'Zoom In', prompt: 'Camera slowly and smoothly zooms into the product revealing fine details and textures, cinematic focus pull' },
  { id: 'dolly-reveal', label: 'Dolly Reveal', prompt: 'Camera slowly dollies forward revealing the product from a wider scene, cinematic reveal, building anticipation' },
  { id: 'float', label: 'Floating / Levitate', prompt: 'The product gently floats and rotates in the air with subtle hovering motion, magical levitation effect, soft light shifts' },
  { id: 'light-sweep', label: 'Light Sweep', prompt: 'A beam of light slowly sweeps across the product surface, highlighting textures and materials, dramatic lighting change, product stays still' },
  { id: 'parallax', label: 'Parallax Depth', prompt: 'Subtle parallax camera movement creating depth between product and background, foreground and background shift at different speeds' },
  { id: 'sparkle', label: 'Sparkle / Particles', prompt: 'Tiny light particles and sparkles drift around the product, magical premium atmosphere, subtle glow effects, the product gleams' },
  { id: 'unbox', label: 'Unboxing Motion', prompt: 'Hands slowly lift the product from packaging, revealing it with care, premium unboxing moment, anticipation and satisfaction' },
];

// PresetCategory defined inline below

type PresetData = Omit<ProductVariant, 'imageUrl' | 'loading' | 'videoUrl' | 'videoLoading'>;

const PRESET_CATEGORIES: { label: string; presets: PresetData[] }[] = [
  {
    label: 'E-Commerce Basics',
    presets: [
      { id: 'white-bg', label: 'White Background', description: 'Amazon, Shopify ready', bgPrompt: 'Pure white seamless studio background with soft professional lighting and subtle shadow beneath the product' },
      { id: 'light-gray', label: 'Light Gray Studio', description: 'Clean, editorial', bgPrompt: 'Light gray seamless studio background, soft even lighting, subtle gradient, professional product photography' },
      { id: 'hero-dark', label: 'Hero Shot (Dark)', description: 'Premium, luxury', bgPrompt: 'Dark moody studio background with dramatic accent lighting, subtle rim light, luxury premium atmosphere, deep rich shadows' },
      { id: 'hero-gradient', label: 'Hero Gradient', description: 'Modern tech', bgPrompt: 'Sleek modern gradient background transitioning from dark navy to soft blue, subtle light reflections, clean premium tech aesthetic' },
      { id: 'shadow-play', label: 'Shadow Play', description: 'Hard shadows, graphic', bgPrompt: 'Clean white surface with strong directional sunlight casting dramatic hard geometric shadows, bold graphic look, high contrast' },
    ],
  },
  {
    label: 'Lifestyle / UGC',
    presets: [
      { id: 'lifestyle-table', label: 'Kitchen Table', description: 'Morning vibes', bgPrompt: 'Beautiful styled wooden kitchen table in a bright airy apartment, morning sunlight through window, coffee cup nearby, warm cozy lifestyle atmosphere' },
      { id: 'lifestyle-desk', label: 'Work Desk', description: 'Home office', bgPrompt: 'Modern clean home office desk with laptop, notebook, and plant in background, natural daylight, productive calm atmosphere, minimal workspace' },
      { id: 'lifestyle-outdoor', label: 'Outdoor Golden Hour', description: 'Warm, natural', bgPrompt: 'Beautiful outdoor natural setting with soft golden hour sunlight, blurred green nature in background, warm inviting atmosphere' },
      { id: 'lifestyle-cafe', label: 'Cafe Setting', description: 'Trendy, social', bgPrompt: 'Trendy cafe interior with warm ambient lighting, exposed brick wall blurred in background, wooden table surface, latte nearby, instagram-worthy' },
      { id: 'lifestyle-gym', label: 'Gym / Active', description: 'Fitness, energy', bgPrompt: 'Modern gym environment with clean equipment blurred in background, motivational energy, bright even lighting, athletic lifestyle' },
      { id: 'lifestyle-travel', label: 'Travel / Airport', description: 'On-the-go', bgPrompt: 'Airport lounge or travel setting, suitcase nearby, boarding pass, window with airplane view blurred, wanderlust lifestyle, bright natural light' },
      { id: 'ugc-hand', label: 'UGC: Held in Hand', description: 'Authentic, relatable', bgPrompt: 'Casual home environment with soft natural daylight, cozy blanket or sofa in background, authentic real-life feel, not overly styled' },
      { id: 'ugc-unboxing', label: 'UGC: Unboxing', description: 'First impression', bgPrompt: 'Unboxing scene on a bed or table, packaging tissue paper, excitement feel, warm overhead lighting, authentic unboxing moment' },
    ],
  },
  {
    label: 'Surfaces & Textures',
    presets: [
      { id: 'marble', label: 'Marble Surface', description: 'Luxury, clean', bgPrompt: 'Elegant white marble surface with subtle gray veining, soft diffused studio lighting, luxury minimalist aesthetic' },
      { id: 'concrete', label: 'Raw Concrete', description: 'Industrial, edgy', bgPrompt: 'Raw concrete surface with subtle texture, industrial minimal aesthetic, soft even lighting, urban modern feel' },
      { id: 'wood-dark', label: 'Dark Wood', description: 'Warm, premium', bgPrompt: 'Rich dark walnut wood surface with visible grain pattern, warm ambient lighting, premium craftsman aesthetic' },
      { id: 'linen', label: 'Natural Linen', description: 'Soft, organic', bgPrompt: 'Natural beige linen fabric texture as background, soft folds, diffused gentle lighting, organic clean aesthetic' },
      { id: 'terrazzo', label: 'Terrazzo', description: 'Trendy, playful', bgPrompt: 'Colorful terrazzo surface with small stone chips in pastel colors, modern trendy interior design aesthetic, even lighting' },
    ],
  },
  {
    label: 'Nature & Organic',
    presets: [
      { id: 'nature-minimal', label: 'Plants & Stone', description: 'Organic minimal', bgPrompt: 'Minimal natural setting with smooth stone surface, green plant leaves, soft diffused daylight, organic clean aesthetic' },
      { id: 'beach', label: 'Beach / Sand', description: 'Summer, fresh', bgPrompt: 'Sandy beach surface with soft ocean waves blurred in background, warm sunlight, seashells nearby, summer vacation atmosphere' },
      { id: 'forest-floor', label: 'Forest Floor', description: 'Earthy, moss', bgPrompt: 'Mossy forest floor with soft dappled sunlight filtering through trees, fern leaves, natural earthy tones, magical nature atmosphere' },
      { id: 'flowers', label: 'Flower Garden', description: 'Colorful, fresh', bgPrompt: 'Beautiful flower garden with soft pastel blooms surrounding the product, dreamy bokeh, romantic spring atmosphere, fresh and vibrant' },
      { id: 'water-splash', label: 'Water Splash', description: 'Fresh, dynamic', bgPrompt: 'Dynamic water splash and droplets frozen in mid-air, clean blue water on white background, freshness and purity, high-speed photography feel' },
    ],
  },
  {
    label: 'Creative & Bold',
    presets: [
      { id: 'neon', label: 'Neon Cyberpunk', description: 'Pink + cyan glow', bgPrompt: 'Futuristic neon-lit environment with pink and cyan neon light reflections, dark tech aesthetic, cyberpunk atmosphere, reflective wet surface' },
      { id: 'holographic', label: 'Holographic', description: 'Iridescent, future', bgPrompt: 'Holographic iridescent background with rainbow light refractions, futuristic chrome elements, prismatic light effects, premium tech aesthetic' },
      { id: 'paint-splash', label: 'Paint Splash', description: 'Artistic, bold', bgPrompt: 'Explosive colorful paint splashes surrounding the product, bold artistic expression, vibrant acrylic colors flying through air, creative energy' },
      { id: 'geometric', label: 'Geometric Shapes', description: 'Abstract, modern', bgPrompt: 'Abstract geometric 3D shapes in soft pastel colors floating in space, modern art direction, clean shadows, contemporary design aesthetic' },
      { id: 'smoke', label: 'Smoke & Fog', description: 'Mysterious, moody', bgPrompt: 'Atmospheric smoke and fog swirling around the product, dramatic moody lighting, dark background with colorful smoke wisps, mysterious cinematic feel' },
      { id: 'galaxy', label: 'Galaxy / Space', description: 'Cosmic, infinite', bgPrompt: 'Deep space galaxy background with nebula colors in purple and blue, stars scattered, cosmic infinite feel, the product floating in space' },
    ],
  },
  {
    label: 'Seasonal & Campaign',
    presets: [
      { id: 'seasonal-cozy', label: 'Winter / Cozy', description: 'Holiday warmth', bgPrompt: 'Cozy warm holiday setting with soft fairy lights, warm knit fabrics, candle glow, festive but elegant atmosphere, winter warmth' },
      { id: 'spring', label: 'Spring / Fresh', description: 'Cherry blossoms', bgPrompt: 'Fresh spring setting with cherry blossom petals falling softly, light pastel pink tones, bright natural daylight, renewal and freshness' },
      { id: 'summer', label: 'Summer / Tropical', description: 'Bright, vibrant', bgPrompt: 'Tropical summer setting with palm leaves, bright turquoise water reflection, strong warm sunlight, vibrant saturated colors, vacation energy' },
      { id: 'autumn', label: 'Autumn / Harvest', description: 'Warm, golden', bgPrompt: 'Autumn harvest scene with warm golden and orange fallen leaves, soft afternoon sunlight, rustic wooden surface, cozy fall atmosphere' },
      { id: 'valentines', label: 'Valentine / Romance', description: 'Love, soft pink', bgPrompt: 'Romantic Valentine setting with soft rose petals, warm pink tones, delicate candlelight, silk fabric, intimate luxury atmosphere' },
      { id: 'black-friday', label: 'Black Friday / Sale', description: 'Bold, urgent', bgPrompt: 'Bold black background with dramatic gold accent lighting, premium urgency feel, subtle sparkle effects, high-contrast luxury sale atmosphere' },
    ],
  },
  {
    label: 'UGC / People',
    presets: [
      { id: 'ugc-selfie', label: 'Selfie mit Produkt', description: 'Authentic, phone camera', bgPrompt: 'Person taking a selfie in a bright modern bathroom mirror, casual authentic vibe, natural smartphone lighting, real and relatable UGC feel' },
      { id: 'ugc-couch', label: 'Couch Unboxing', description: 'Relaxed at home', bgPrompt: 'Cozy living room couch scene, person sitting cross-legged unpacking a package, warm lamp light, blankets, relaxed authentic home atmosphere' },
      { id: 'ugc-kitchen-use', label: 'Using in Kitchen', description: 'Cooking, preparing', bgPrompt: 'Bright modern kitchen, person using the product while cooking, natural daylight from window, warm inviting home scene, authentic lifestyle moment' },
      { id: 'ugc-office', label: 'At the Office', description: 'Professional, daily use', bgPrompt: 'Modern open office environment, person at desk using the product, laptop and coffee nearby, natural office lighting, professional daily routine' },
      { id: 'ugc-car', label: 'In the Car', description: 'On-the-go lifestyle', bgPrompt: 'Inside a car, person in driver or passenger seat showing the product, natural daylight through windshield, casual on-the-go lifestyle moment' },
      { id: 'ugc-park', label: 'Park / Picnic', description: 'Outdoor, social', bgPrompt: 'Beautiful park setting on a sunny day, person sitting on a blanket on green grass, friends nearby blurred, picnic atmosphere, warm natural light' },
      { id: 'ugc-mirror', label: 'Mirror Selfie', description: 'Fashion, OOTD', bgPrompt: 'Full-length bedroom mirror selfie scene, stylish room decor visible, warm ambient lighting, fashion OOTD aesthetic, authentic influencer content' },
      { id: 'ugc-workout', label: 'Post-Workout', description: 'Fitness, sweaty glow', bgPrompt: 'Post-workout scene, person in athletic wear holding the product, gym or yoga mat in background, natural glow, healthy active lifestyle' },
      { id: 'ugc-bed', label: 'Morning in Bed', description: 'Lazy morning, cozy', bgPrompt: 'Cozy bed scene, person lounging in white sheets in morning sunlight, warm golden hour glow through curtains, lazy Sunday morning aesthetic' },
      { id: 'ugc-friends', label: 'With Friends', description: 'Social, fun', bgPrompt: 'Group of friends hanging out in a bright cafe or rooftop, laughing and socializing, one person showing the product, warm social atmosphere, authentic fun moment' },
      { id: 'ugc-commute', label: 'Daily Commute', description: 'Urban, subway/bus', bgPrompt: 'Urban commute scene, person sitting in subway or bus, wearing headphones, holding the product, city life atmosphere, natural indoor transit lighting' },
      { id: 'ugc-skincare', label: 'Skincare Routine', description: 'Beauty, self-care', bgPrompt: 'Clean bright bathroom, person doing their skincare routine with the product, mirror reflection, soft flattering lighting, self-care ritual, beauty content' },
    ],
  },
  {
    label: 'Influencer / Content Creator',
    presets: [
      { id: 'inf-ring-light', label: 'Ring Light Setup', description: 'Creator studio', bgPrompt: 'Content creator setup with ring light glow, clean minimal desk background, camera on tripod visible, professional yet authentic creator studio' },
      { id: 'inf-flat-lay-hand', label: 'Hand Flat Lay', description: 'Aesthetic arrangement', bgPrompt: 'Top-down flat lay with manicured hand reaching for the product, aesthetically arranged items on marble surface, soft natural light, curated influencer content' },
      { id: 'inf-aesthetic-shelf', label: 'Shelfie', description: 'Styled shelf display', bgPrompt: 'Beautifully styled shelf or bookcase, product displayed among curated decor items, plants, books, candles, warm ambient light, aspirational home aesthetic' },
      { id: 'inf-review', label: 'Review Setup', description: 'YouTube/TikTok review', bgPrompt: 'Clean desk with product unboxed, comparison items nearby, good overhead lighting, organized review setup, YouTube or TikTok product review aesthetic' },
      { id: 'inf-haul', label: 'Shopping Haul', description: 'Bags, tissue paper', bgPrompt: 'Shopping haul scene with multiple shopping bags, tissue paper, product revealed among other items on bed or floor, excited discovery moment, haul content aesthetic' },
      { id: 'inf-asmr', label: 'ASMR / Close-Up', description: 'Tactile, sensory', bgPrompt: 'Ultra close-up ASMR style, hands gently touching and exploring the product texture, soft pastel background, satisfying tactile moment, whisper-quiet intimate feel' },
    ],
  },
  {
    label: 'Studio Backdrops',
    presets: [
      { id: 'studio-peach', label: 'Peach / Coral', description: 'Warm, fashion', bgPrompt: 'Professional studio with warm soft peach or coral colored seamless paper backdrop, even studio lighting, fashion photography quality' },
      { id: 'studio-sage', label: 'Sage Green', description: 'Calming, organic', bgPrompt: 'Soft sage green studio backdrop, calming earthy tone, even diffused lighting, wellness and organic brand aesthetic' },
      { id: 'studio-navy', label: 'Deep Navy', description: 'Confident, premium', bgPrompt: 'Deep navy blue studio backdrop, confident and premium feel, subtle light gradient, corporate luxury aesthetic' },
      { id: 'studio-blush', label: 'Blush Pink', description: 'Feminine, beauty', bgPrompt: 'Soft blush pink studio backdrop, feminine beauty brand aesthetic, warm flattering light, cosmetics and skincare photography quality' },
      { id: 'studio-terracotta', label: 'Terracotta', description: 'Warm earth', bgPrompt: 'Warm terracotta studio backdrop, Mediterranean earth tone, warm golden lighting, artisan craft aesthetic' },
    ],
  },
];

// Background replacement via fal.ai Bria
async function replaceBackground(productImageUrl: string, bgPrompt: string): Promise<string | null> {
  const result = await fal.subscribe('fal-ai/bria/background/replace', {
    input: {
      image_url: productImageUrl,
      prompt: bgPrompt,
      refine_prompt: true,
      fast: true,
      num_images: 1,
    },
    logs: false,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = result.data as any;
  return data?.images?.[0]?.url || null;
}

// Animate a product shot via Image-to-Video
async function animateShot(imageUrl: string, motionPrompt: string): Promise<string | null> {
  const result = await fal.subscribe('fal-ai/kling-video/v2/master/image-to-video', {
    input: {
      image_url: imageUrl,
      prompt: motionPrompt,
      duration: '5',
    },
    logs: false,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = result.data as any;
  return data?.video?.url || null;
}

export default function ProductStudio() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [productImage, setProductImage] = useState<string | null>(null);
  const [productName, setProductName] = useState('');
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [generatingAll, setGeneratingAll] = useState(false);
  const [customBg, setCustomBg] = useState('');
  const [improving, setImproving] = useState(false);
  const [animationPreset, setAnimationPreset] = useState(ANIMATION_PRESETS[0].id);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProductImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set(['E-Commerce Basics', 'Lifestyle / UGC']));

  const handleToggleCategory = (label: string) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const handleBuildVariants = () => {
    const selected = PRESET_CATEGORIES
      .filter((c) => activeCategories.has(c.label))
      .flatMap((c) => c.presets);
    setVariants(selected.map((p) => ({ ...p, imageUrl: null, loading: false, videoUrl: null, videoLoading: false })));
  };

  const handleGenerate = async (variantId: string) => {
    if (!productImage) return;
    const idx = variants.findIndex((v) => v.id === variantId);
    if (idx === -1) return;

    setVariants((prev) => prev.map((v) => v.id === variantId ? { ...v, loading: true } : v));

    try {
      const url = await replaceBackground(productImage, variants[idx].bgPrompt);
      setVariants((prev) => prev.map((v) => v.id === variantId ? { ...v, imageUrl: url, loading: false } : v));
    } catch {
      setVariants((prev) => prev.map((v) => v.id === variantId ? { ...v, loading: false } : v));
    }
  };

  const handleGenerateAll = async () => {
    if (!productImage) return;
    setGeneratingAll(true);
    for (const variant of variants) {
      if (!variant.imageUrl) {
        await handleGenerate(variant.id);
      }
    }
    setGeneratingAll(false);
  };

  const handleImprovePrompt = async () => {
    if (!customBg.trim()) return;
    setImproving(true);
    try {
      const res = await fetch('/api/improve-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Background scene for product photography: ${customBg}`,
          mood: '',
          filmStock: '',
          lens: '',
          cinematicStyle: '',
        }),
      });
      if (res.ok) {
        const { improved } = await res.json();
        setCustomBg(improved);
      }
    } catch { /* ignore */ }
    setImproving(false);
  };

  const handleAnimate = async (variantId: string) => {
    const variant = variants.find((v) => v.id === variantId);
    if (!variant?.imageUrl) return;

    setVariants((prev) => prev.map((v) => v.id === variantId ? { ...v, videoLoading: true } : v));

    try {
      const preset = ANIMATION_PRESETS.find((p) => p.id === animationPreset) || ANIMATION_PRESETS[0];
      const url = await animateShot(variant.imageUrl, preset.prompt);
      setVariants((prev) => prev.map((v) => v.id === variantId ? { ...v, videoUrl: url, videoLoading: false } : v));
    } catch {
      setVariants((prev) => prev.map((v) => v.id === variantId ? { ...v, videoLoading: false } : v));
    }
  };

  const handleAddCustom = () => {
    if (!customBg.trim()) return;
    const id = `custom-${Date.now().toString(36)}`;
    setVariants((prev) => [...prev, {
      id,
      label: 'Custom',
      description: customBg.slice(0, 40),
      bgPrompt: customBg.trim(),
      imageUrl: null,
      loading: false,
      videoUrl: null,
      videoLoading: false,
    }]);
    setCustomBg('');
  };

  const generatedCount = variants.filter((v) => v.imageUrl).length;

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Product Input */}
      <div className="border border-border rounded-lg bg-surface overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-surface-hover">
          <h3 className="text-sm font-semibold">Product Studio</h3>
          <p className="text-[10px] text-muted mt-0.5">Upload product image → AI replaces background only. Product stays exactly the same.</p>
        </div>
        <div className="p-4">
          <div className="flex gap-4">
            {/* Product image */}
            <div
              className="w-32 h-32 shrink-0 rounded-lg bg-background border-2 border-dashed border-border flex items-center justify-center cursor-pointer relative group overflow-hidden"
              onClick={() => fileRef.current?.click()}
            >
              {productImage ? (
                <>
                  <img src={productImage} alt="Product" className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-white">
                    Change
                  </div>
                </>
              ) : (
                <div className="text-center text-xs text-muted/50 px-2">
                  <div className="text-2xl mb-1">+</div>
                  Product Image
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>

            {/* Controls */}
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Product name (for file naming)"
                className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground placeholder:text-muted/40 outline-none focus:border-accent"
              />
              {/* Category Selection */}
              <div className="flex flex-wrap gap-1.5">
                {PRESET_CATEGORIES.map((cat) => (
                  <button
                    key={cat.label}
                    onClick={() => handleToggleCategory(cat.label)}
                    className={`text-[10px] px-2 py-1 rounded border transition-all ${
                      activeCategories.has(cat.label)
                        ? 'bg-accent/15 border-accent/40 text-accent'
                        : 'bg-surface-hover border-border text-muted hover:text-foreground'
                    }`}
                  >
                    {cat.label} ({cat.presets.length})
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleBuildVariants}
                  disabled={!productImage || activeCategories.size === 0}
                  className="text-xs px-3 py-1.5 rounded bg-accent hover:bg-accent-hover text-white font-medium disabled:opacity-40"
                >
                  Build {PRESET_CATEGORIES.filter((c) => activeCategories.has(c.label)).reduce((s, c) => s + c.presets.length, 0)} Variants
                </button>
                {variants.length > 0 && (
                  <button
                    onClick={handleGenerateAll}
                    disabled={generatingAll || !productImage}
                    className="text-xs px-3 py-1.5 rounded bg-green-600 hover:bg-green-700 text-white font-medium disabled:opacity-40"
                  >
                    {generatingAll ? `Generating... (${generatedCount}/${variants.length})` : `Generate All (${variants.length - generatedCount} left)`}
                  </button>
                )}
              </div>
              {!productImage && (
                <p className="text-[10px] text-warning">Upload product image first. The product will be preserved exactly — only the background changes.</p>
              )}
              {/* Animation preset */}
              <div className="flex items-center gap-2">
                <label className="text-[9px] uppercase tracking-wide text-green-400/70 shrink-0">Animation</label>
                <select
                  value={animationPreset}
                  onChange={(e) => setAnimationPreset(e.target.value)}
                  className="flex-1 bg-background border border-border rounded px-2 py-1 text-[10px] text-foreground outline-none"
                >
                  {ANIMATION_PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div className="bg-background/50 rounded p-2 text-[10px] text-muted">
                <strong>Background:</strong> Bria (product stays pixel-perfect). <strong>Animation:</strong> Kling V2 (image-to-video with motion preset).
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Background */}
      {variants.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex gap-2">
            <input
              type="text"
              value={customBg}
              onChange={(e) => setCustomBg(e.target.value)}
              placeholder="Describe any background: underwater, Mars surface, luxury penthouse..."
              className="flex-1 bg-surface border border-border rounded px-3 py-1.5 text-xs text-foreground placeholder:text-muted/40 outline-none focus:border-accent"
            />
            <button
              onClick={handleImprovePrompt}
              disabled={improving || !customBg.trim()}
              className="text-xs px-3 py-1.5 rounded bg-green-500/10 hover:bg-green-500/20 text-green-400 font-medium border border-green-500/20 disabled:opacity-40"
            >
              {improving ? 'Improving...' : 'AI Improve'}
            </button>
            <button
              onClick={handleAddCustom}
              disabled={!customBg.trim()}
              className="text-xs px-3 py-1.5 rounded bg-accent hover:bg-accent-hover text-white font-medium disabled:opacity-40"
            >
              + Add
            </button>
          </div>
          <p className="text-[9px] text-muted px-1">Write a short idea → click "AI Improve" → GPT makes it into a detailed scene description → click "+ Add"</p>
        </div>
      )}

      {/* Variants Grid */}
      {variants.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {variants.map((variant) => (
            <div key={variant.id} className="border border-border rounded-lg bg-surface overflow-hidden">
              {/* Image */}
              <div className="aspect-video bg-background relative group flex items-center justify-center">
                {variant.imageUrl ? (
                  <>
                    <img src={variant.imageUrl} alt={variant.label} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 pointer-events-none group-hover:pointer-events-auto">
                      <a
                        href={variant.imageUrl}
                        download={`${productName || 'product'}-${variant.id}.png`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] px-3 py-1.5 rounded bg-white/20 text-white hover:bg-white/40 cursor-pointer"
                      >
                        Download
                      </a>
                      <button
                        onClick={() => {
                          setVariants((prev) => prev.map((v) => v.id === variant.id ? { ...v, imageUrl: null } : v));
                          setTimeout(() => handleGenerate(variant.id), 100);
                        }}
                        className="text-[10px] px-3 py-1.5 rounded bg-accent text-white hover:bg-accent-hover cursor-pointer"
                      >
                        Regenerate
                      </button>
                    </div>
                  </>
                ) : variant.loading ? (
                  <div className="flex items-center gap-2 text-xs text-accent">
                    <div className="w-3 h-3 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    Replacing background...
                  </div>
                ) : (
                  <button
                    onClick={() => handleGenerate(variant.id)}
                    disabled={!productImage}
                    className="text-xs text-muted hover:text-accent disabled:opacity-30"
                  >
                    Generate
                  </button>
                )}
              </div>
              {/* Info + Animate */}
              <div className="px-3 py-2 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-foreground">{variant.label}</div>
                    <div className="text-[10px] text-muted">{variant.description}</div>
                  </div>
                  {variant.imageUrl && !variant.videoUrl && (
                    <button
                      onClick={() => handleAnimate(variant.id)}
                      disabled={variant.videoLoading}
                      className="text-[10px] px-2 py-1 rounded bg-green-500/10 hover:bg-green-500/20 text-green-400 font-medium disabled:opacity-40 shrink-0"
                    >
                      {variant.videoLoading ? 'Animating...' : 'Animate'}
                    </button>
                  )}
                </div>
                {/* Video */}
                {variant.videoUrl && (
                  <div className="rounded overflow-hidden border border-border">
                    <video src={variant.videoUrl} controls className="w-full" />
                    <div className="flex justify-center gap-2 py-1 bg-background">
                      <a href={variant.videoUrl} download={`${productName || 'product'}-${variant.id}.mp4`} target="_blank" rel="noopener noreferrer" className="text-[9px] text-accent hover:underline">Download Video</a>
                      <button onClick={() => { setVariants((p) => p.map((v) => v.id === variant.id ? { ...v, videoUrl: null } : v)); setTimeout(() => handleAnimate(variant.id), 100); }} className="text-[9px] text-muted hover:text-foreground">Re-animate</button>
                    </div>
                  </div>
                )}
                {variant.videoLoading && (
                  <div className="flex items-center gap-1.5 text-[10px] text-green-400">
                    <div className="w-2.5 h-2.5 border border-green-400 border-t-transparent rounded-full animate-spin" />
                    Creating video...
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
