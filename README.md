<p align="center">
  <img src="https://www.ai-pirates.com/assets/images/logo-white-v2.png" width="200" alt="AI Pirates" />
</p>

<p align="center">
  <img src="public/logo.svg" width="64" height="64" alt="AI Storyboard Studio" />
</p>

<h1 align="center">AI Storyboard Studio</h1>

<p align="center">
  <strong>From idea to video storyboard in seconds — powered by AI.</strong><br/>
  <em>Von der Idee zum Video-Storyboard in Sekunden — KI-gestützt.</em>
</p>

<p align="center">
  <a href="#features">Features</a> &bull;
  <a href="#quick-start">Quick Start</a> &bull;
  <a href="#bring-your-own-key">BYOK</a> &bull;
  <a href="#all-models">All Models</a> &bull;
  <a href="#presets">Presets</a> &bull;
  <a href="#project-structure">Structure</a> &bull;
  <a href="#license">License</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License" />
  <img src="https://img.shields.io/badge/BYOK-Bring_Your_Own_Key-F59E0B" alt="BYOK" />
</p>

---

## What is this?

AI Storyboard Studio is an open-source tool that turns a single video idea into a complete, production-ready storyboard. It generates optimized prompts for 21 AI models, creates images and videos directly in the app, and stitches everything together in your browser.

**No database. No backend. No subscription.** Just clone, add your API keys, and go.

> **Was ist das?** Ein Open-Source-Tool, das aus einer einzigen Video-Idee ein komplettes, produktionsreifes Storyboard erstellt. Es generiert optimierte Prompts für 21 KI-Modelle, erstellt Bilder und Videos direkt in der App und fügt alles im Browser zusammen. Keine Datenbank, kein Backend, kein Abo.

---

## Features

### Idea → Research → Storyboard

Write your video concept in plain language. The AI researches the web for context, brainstorms visual direction, suggests film stocks and cinematic styles, then generates a complete multi-scene storyboard with optimized prompts for every platform.

> Schreib deine Video-Idee in natürlicher Sprache. Die KI recherchiert im Web, brainstormt Visual Direction, schlägt Film-Stocks und Stile vor, und generiert ein komplettes Storyboard mit optimierten Prompts für jede Plattform.

### 21 AI Models (11 Image + 10 Video)

Generate images and videos directly inside the app — all powered by [fal.ai](https://fal.ai). One API key, 21 models.

> Bilder und Videos direkt in der App generieren — alles über [fal.ai](https://fal.ai). Ein API-Key, 21 Modelle.

### Character Consistency

Define characters with exact visual descriptions and reference images. The identity lock prompt is injected into every single scene automatically. Upload up to 14 reference images per character — sweet spot is 3-6 from different angles.

> Charaktere mit exakten Beschreibungen und Referenzbildern definieren. Der Identity-Lock-Prompt wird automatisch in jede Szene injiziert. Bis zu 14 Referenzbilder pro Charakter — optimal sind 3-6 aus verschiedenen Winkeln.

### Product References

Add product shots with descriptions and reference images for consistent brand placement across all scenes. Perfect for commercial storyboards.

> Produktfotos mit Beschreibungen und Referenzbildern für konsistente Markenplatzierung über alle Szenen hinweg.

### Multi-Shot Scenes

Add Close-Up, Over-the-Shoulder, Detail, and Reverse shots to any scene. Each shot has its own prompt, camera setting, and image generation.

> Close-Up, Over-the-Shoulder, Detail und Gegenschuss-Shots zu jeder Szene hinzufügen. Jeder Shot hat eigenen Prompt, Kamera und Bildgenerierung.

### Professional Prompt System

Curated preset vault with Film Stocks (Kodak Portra 400, Cinestill 800T, ...), Cinematic Styles (Neon Noir, Teal & Orange, ...), Lens Presets (ARRI Alexa 35, Anamorphic, ...), Camera Movements, Video FX, Color Grading, and Multishot Sequences.

AI-powered prompt improvement via GPT-4o-mini takes your rough prompts and makes them production-grade.

> Kuratierte Preset-Bibliothek mit Film-Stocks, Cinematic Styles, Lens-Presets, Kamerabewegungen, Video-FX, Color Grading und Multishot-Sequenzen. KI-gestützte Prompt-Verbesserung macht aus groben Ideen produktionsreife Prompts.

### Platform-Aware Prompts

Built-in rules for Nano Banana Pro, Veo 3.1, and Seedance 2.0. Prompts are automatically optimized for each platform's strengths, limits, and syntax. The system knows that Veo prefers technical cinema language under 30 words, Seedance needs separated subject/background motion, and Nano Banana excels with full sentences.

> Eingebaute Regeln für Nano Banana Pro, Veo 3.1 und Seedance 2.0. Prompts werden automatisch für die Stärken, Grenzen und Syntax jeder Plattform optimiert.

### In-Browser Video Stitching

Combine all generated clips into a single video using ffmpeg.wasm. No server upload, no cloud processing — everything stays on your machine. Download as MP4.

> Alle generierten Clips im Browser zu einem Video zusammenfügen mit ffmpeg.wasm. Kein Upload, keine Cloud — alles bleibt auf deinem Rechner.

### Export

- **PDF Export** — Formatted storyboard with images, prompts, and director notes for your team
- **Copy Prompts** — All Veo/Seedance prompts at a glance, copy individually or all at once for external tools
- **Voiceover** — Text field per scene for dialogue and narration

> PDF-Export mit Bildern, Prompts und Regie-Notizen. Alle Prompts kopierbar für externe Tools. Voiceover-Textfeld pro Szene.

### Project Templates

5 built-in templates to get started fast:

| Template | Duration | Scenes | Use Case |
|----------|----------|--------|----------|
| Produktvideo | 30s | 6 | Hook → Problem → Solution → Features → Proof → CTA |
| Imagefilm | 60s | 8 | Establishing → Story → Team → Values → Vision |
| Social Reel | 15s | 4 | Hook → Content → Twist → CTA (9:16) |
| Erklärvideo | 45s | 6 | Problem → Solution → How it works → Benefits → CTA |
| Testimonial | 30s | 5 | Introduction → Problem → Solution → Result → Recommendation |

### More

- **Dark/Light Mode** — Toggle in sidebar
- **Cost Tracker** — Real-time cost estimation for GPT calls, images, and videos
- **Aspect Ratios** — 16:9, 9:16, 1:1, 4:5, 4:3
- **Scene Reordering** — Move scenes up/down, duplicate, delete
- **Start/End Frames** — Select which image starts and ends each video clip for seamless transitions
- **10-Step Onboarding** — Interactive walkthrough for new users
- **localStorage** — No database needed, everything persists in your browser

---

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/aipiratesMunich/ai-storyboard-studio.git
cd ai-storyboard-studio
npm install
```

### 2. Get your API keys

Create `.env.local` in the project root:

```env
OPENAI_API_KEY=sk-proj-your-key-here
FAL_KEY=your-fal-key-here
AUTH_PASSWORD=choose-a-password
```

| Key | Where to get it | What it does |
|-----|----------------|--------------|
| `OPENAI_API_KEY` | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) | Storyboard generation (GPT-4o), research agent, prompt improvement (GPT-4o-mini) |
| `FAL_KEY` | [fal.ai/dashboard/keys](https://fal.ai/dashboard/keys) | Image + video generation — one key for all 21 models |
| `AUTH_PASSWORD` | Your choice | Optional password gate for deployed instances |

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Bring Your Own Key

This project is **100% BYOK** (Bring Your Own Key). You pay only for what you use, directly to OpenAI and fal.ai. No middleman, no subscription, no hidden costs.

**Why fal.ai?** One API key gives you access to 21 image and video models. No need to sign up for separate services. Fair pay-per-use pricing.

> **Warum fal.ai?** Ein API-Key gibt dir Zugang zu 21 Bild- und Video-Modellen. Keine separaten Anmeldungen nötig. Faire Pay-per-Use-Preise.

### Cost per storyboard (estimated)

| Action | Cost |
|--------|------|
| Research + Generation (GPT-4o) | ~$0.06 |
| 8 images (Nano Banana Pro) | ~$0.32 |
| 8 videos (5s each) | ~$0.80 |
| **Total** | **~$1.18** |

---

## All Models

### Image Models (via fal.ai)

| Model | Quality | Speed | Cost/image |
|-------|---------|-------|------------|
| **Nano Banana Pro** (Google) | Best | Medium | ~$0.04 |
| Imagen 4 Standard | High | Medium | ~$0.05 |
| Imagen 4 Fast | Good | Fast | ~$0.03 |
| Imagen 4 Ultra | Highest | Slow | ~$0.08 |
| Recraft V3 | High | Medium | ~$0.08 |
| Flux Pro | High | Medium | ~$0.05 |
| Flux Dev | Good | Fast | ~$0.03 |
| Flux Schnell | Decent | Fastest | ~$0.01 |
| Stable Diffusion 3.5 | Good | Fast | ~$0.03 |
| Stable Diffusion 3 | Good | Fast | ~$0.03 |

### Video Models (via fal.ai)

| Model | Features | Duration | Cost/clip |
|-------|----------|----------|-----------|
| **Seedance 2.0** | Audio sync, end frame, @mentions | 5-10s | ~$0.10-0.20 |
| **Veo 3.1** | First/last frame, audio layer | 5-8s | ~$0.15 |
| Kling 2.6 Pro | End frame support | 5-10s | ~$0.15 |
| Kling 2.1 | Good quality | 5s | ~$0.10 |
| Kling V2 Pro | High quality | 5-10s | ~$0.15 |
| WAN 2.7 | Fast | 5s | ~$0.08 |
| WAN 2.1 | Fast | 5s | ~$0.05 |
| LTX 13B | Budget | 5s | ~$0.03 |

---

## Deploy

### Vercel (recommended)

```bash
vercel --prod
```

Set environment variables on Vercel:
- `OPENAI_API_KEY`
- `FAL_KEY`
- `AUTH_PASSWORD`

### Any Node.js host

```bash
npm run build
npm start
```

---

## Presets

The app ships with community presets. Add your own by editing `src/lib/presets.ts`:

```ts
export const filmStocks: Preset[] = [
  { title: 'Kodak Portra 400', prompt: 'shot on Kodak Portra 400...' },
  { title: 'Your Custom Stock', prompt: 'your custom film look...' },
];
```

**Available categories:** Film Stock, Cinematic Style, Lens/Camera, Multishot Sequence, Camera Movement, Video FX, Color Grading.

---

## Project Structure

```
src/
  app/
    api/
      auth/            — Optional password gate
      generate/        — GPT-4o storyboard generation
      improve-prompt/  — GPT-4o-mini prompt enhancement
      research/        — Web search + AI research agent
      fal/proxy/       — fal.ai server proxy
    page.tsx           — Main application
    globals.css        — Design system (dark/light mode)
  components/          — SceneCard, Timeline, Sidebar, Export, Onboarding, ...
  hooks/
    useStoryboard.ts   — State management (localStorage)
  lib/
    presets.ts          — Community prompt presets
    vault.ts            — Platform configs (Nano Banana, Veo, Seedance)
    prompt-generator.ts — Prompt assembly engine
    fal.ts              — fal.ai model registry + generation
    templates.ts        — Project templates
    types.ts            — TypeScript interfaces
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript 5 |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| AI Text | [OpenAI GPT-4o / GPT-4o-mini](https://platform.openai.com) |
| AI Image/Video | [fal.ai](https://fal.ai) (21 models, one API key) |
| Video Stitching | [ffmpeg.wasm](https://ffmpegwasm.netlify.app) (in-browser) |
| Storage | localStorage (no database) |

---

## License

MIT — use it, fork it, build on it.

---

<p align="center">
  <a href="https://ai-pirates.com"><img src="https://www.ai-pirates.com/assets/images/logo-white-v2.png" width="120" alt="AI Pirates" /></a>
</p>
<p align="center">
  Developed by <a href="https://ai-pirates.com"><strong>AI Pirates</strong></a> &bull; Munich, Germany
</p>
