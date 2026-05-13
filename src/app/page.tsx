'use client';

import { useState } from 'react';
import { useStoryboard } from '@/hooks/useStoryboard';
import Sidebar from '@/components/Sidebar';
import SceneCard from '@/components/SceneCard';
import Timeline from '@/components/Timeline';
import ExportView from '@/components/ExportView';
import IdeaGenerator from '@/components/IdeaGenerator';
import CostTracker from '@/components/CostTracker';
import CharacterPanel from '@/components/CharacterPanel';
import ProductRefPanel from '@/components/ProductRefPanel';
import AuthGate from '@/components/AuthGate';
import PdfExport from '@/components/PdfExport';
import Onboarding from '@/components/Onboarding';
import VideoStitcher from '@/components/VideoStitcher';
import ProductStudio from '@/components/ProductStudio';
import { templates } from '@/lib/templates';
import type { ViewMode, AspectRatio } from '@/lib/types';

export default function Home() {
  const {
    projects,
    activeProject,
    activeProjectId,
    setActiveProjectId,
    createProject,
    deleteProject,
    addScene,
    updateScene,
    deleteScene,
    reorderScenes,
    replaceScenes,
    duplicateScene,
    addCharacter,
    updateCharacter,
    deleteCharacter,
    updateAspectRatio,
    addProductRef,
    updateProductRef,
    deleteProductRef,
    loaded,
  } = useStoryboard();

  const [view, setView] = useState<ViewMode>('board');
  const [videoUrls, setVideoUrls] = useState<Record<string, string>>({});

  const [showTemplates, setShowTemplates] = useState(false);

  const handleCreate = () => {
    setShowTemplates(true);
  };

  const handleCreateWithTemplate = (templateId?: string) => {
    const name = prompt('Projektname:');
    if (!name?.trim()) { setShowTemplates(false); return; }
    const project = createProject(name.trim());
    if (templateId) {
      const tpl = templates.find((t) => t.id === templateId);
      if (tpl) {
        const scenes = tpl.scenes.map((s) => ({
          title: s.title,
          imagePrompt: '',
          cameraMovement: s.cameraMovement,
          style: s.style,
          mood: '',
          duration: s.duration,
          notes: s.notes,
          veoPrompt: '',
          seedancePrompt: '',
          filmStock: '',
          cinematicStyle: '',
          lens: '',
          shots: [],
          voiceover: '',
          audioUrl: null,
        }));
        replaceScenes(project.id, scenes);
      }
    }
    setShowTemplates(false);
  };

  const handleGenerate = (scenes: { title: string; imagePrompt: string; cameraMovement: string; style: string; mood: string; duration: number; notes: string; veoPrompt: string; seedancePrompt: string; filmStock?: string; cinematicStyle?: string; lens?: string }[]) => {
    if (!activeProject) return;
    const hasExisting = activeProject.scenes.length > 0;
    if (hasExisting) {
      const confirmed = confirm(`${activeProject.scenes.length} bestehende Szenen ersetzen?`);
      if (!confirmed) return;
    }
    const normalized = scenes.map((s) => ({
      ...s,
      filmStock: s.filmStock || '',
      cinematicStyle: s.cinematicStyle || '',
      lens: s.lens || '',
      shots: [],
      voiceover: '',
      audioUrl: null,
    }));
    replaceScenes(activeProject.id, normalized);
  };

  if (!loaded) {
    return (
      <div className="h-full flex items-center justify-center text-muted text-sm">
        Lade...
      </div>
    );
  }

  return (
    <AuthGate>
    <Onboarding />
    <div className="h-full flex">
      <Sidebar
        projects={projects}
        activeProjectId={activeProjectId}
        onSelect={setActiveProjectId}
        onCreate={handleCreate}
        onDelete={deleteProject}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        {activeProject ? (
          <>
            {/* Header */}
            <header className="shrink-0 header-bar px-6 py-3.5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold tracking-tight">{activeProject.name}</h2>
                <div className="flex items-center gap-3 mt-0.5">
                  <p className="text-xs text-muted">
                    {activeProject.scenes.length} Szenen
                    {activeProject.scenes.length > 0 && (
                      <> &middot; {activeProject.scenes.reduce((s, sc) => s + sc.duration, 0)}s</>
                    )}
                  </p>
                  <CostTracker scenes={activeProject.scenes} />
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex gap-1 p-1 rounded-xl bg-surface border border-border">
                  {(['board', 'timeline', 'export', 'product-studio'] as ViewMode[]).map((v) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      className={`tab-btn ${view === v ? 'active' : ''}`}
                    >
                      {v === 'board' ? 'Board' : v === 'timeline' ? 'Timeline' : v === 'export' ? 'Export' : 'Studio'}
                    </button>
                  ))}
                </div>
                <select
                  value={activeProject.aspectRatio || '16:9'}
                  onChange={(e) => updateAspectRatio(activeProject.id, e.target.value as AspectRatio)}
                  className="bg-surface border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-accent"
                  title="Bildformat"
                >
                  <option value="16:9">16:9</option>
                  <option value="9:16">9:16</option>
                  <option value="1:1">1:1</option>
                  <option value="4:5">4:5</option>
                  <option value="4:3">4:3</option>
                </select>
                <PdfExport projectName={activeProject.name} scenes={activeProject.scenes} characters={activeProject.characters || []} />
                {view === 'board' && (
                  <button
                    onClick={() => addScene(activeProject.id)}
                    className="text-xs px-4 py-1.5 rounded-lg btn-gradient text-white font-semibold"
                  >
                    + Szene
                  </button>
                )}
              </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {view === 'board' && (
                <div className="space-y-4 w-full">
                  {/* Characters */}
                  <CharacterPanel
                    characters={activeProject.characters || []}
                    onAdd={() => addCharacter(activeProject.id)}
                    onUpdate={(charId, updates) => updateCharacter(activeProject.id, charId, updates)}
                    onDelete={(charId) => deleteCharacter(activeProject.id, charId)}
                  />

                  {/* Product References */}
                  <ProductRefPanel
                    productRefs={activeProject.productRefs || []}
                    onAdd={() => addProductRef(activeProject.id)}
                    onUpdate={(refId, updates) => updateProductRef(activeProject.id, refId, updates)}
                    onDelete={(refId) => deleteProductRef(activeProject.id, refId)}
                  />

                  {/* AI Generator */}
                  <IdeaGenerator onGenerate={handleGenerate} characters={activeProject.characters || []} />

                  {activeProject.scenes.length === 0 ? (
                    <div className="text-center py-8 text-muted text-xs">
                      Gib oben deine Idee ein und lass die KI das Storyboard erstellen.
                    </div>
                  ) : (
                    activeProject.scenes.map((scene, i) => (
                      <SceneCard
                        key={scene.id}
                        scene={scene}
                        index={i}
                        characters={activeProject.characters || []}
                        productRefs={activeProject.productRefs || []}
                        aspectRatio={activeProject.aspectRatio || '16:9'}
                        onChange={(updates) => updateScene(activeProject.id, scene.id, updates)}
                        onDelete={() => deleteScene(activeProject.id, scene.id)}
                        onDuplicate={() => duplicateScene(activeProject.id, scene.id)}
                        onMoveUp={() => i > 0 && reorderScenes(activeProject.id, i, i - 1)}
                        onMoveDown={() => i < activeProject.scenes.length - 1 && reorderScenes(activeProject.id, i, i + 1)}
                        nextSceneImageUrl={activeProject.scenes[i + 1]?.imageUrl || null}
                        allScenes={activeProject.scenes.map((s) => ({ id: s.id, title: s.title, imageUrl: s.imageUrl, order: s.order }))}
                        onSetAsReference={(imageUrl) => {
                          const chars = activeProject.characters || [];
                          if (chars.length === 0) {
                            const char = addCharacter(activeProject.id);
                            updateCharacter(activeProject.id, char.id, { name: scene.title || `Charakter ${i + 1}`, referenceImageUrl: imageUrl, additionalRefs: [] });
                          } else if (!chars[0].referenceImageUrl) {
                            updateCharacter(activeProject.id, chars[0].id, { referenceImageUrl: imageUrl });
                          } else {
                            // Already has primary → add as additional angle
                            const refs = [...(chars[0].additionalRefs || []), imageUrl].slice(0, 13);
                            updateCharacter(activeProject.id, chars[0].id, { additionalRefs: refs });
                          }
                        }}
                        onVideoGenerated={(sceneId, url) => setVideoUrls((prev) => ({ ...prev, [sceneId]: url }))}
                        isFirst={i === 0}
                        isLast={i === activeProject.scenes.length - 1}
                      />
                    ))
                  )}
                </div>
              )}
              {view === 'timeline' && <Timeline scenes={activeProject.scenes} />}
              {view === 'export' && (
                <div className="space-y-4 w-full">
                  <VideoStitcher scenes={activeProject.scenes} videoUrls={videoUrls} />
                  <ExportView scenes={activeProject.scenes} />
                </div>
              )}
              {view === 'product-studio' && <ProductStudio />}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent/10 flex items-center justify-center pulse-glow">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
                  <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">Ready to create</h3>
              <p className="text-sm text-muted">Select a project or create a new one to start building your storyboard.</p>
            </div>
          </div>
        )}
      </main>

      {/* Template Dialog */}
      {showTemplates && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center" onClick={() => setShowTemplates(false)}>
          <div className="bg-surface border border-border rounded-2xl w-[520px] max-h-[80vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-border">
              <h3 className="text-base font-bold">New Project</h3>
              <p className="text-xs text-muted mt-0.5">Choose a template or start blank</p>
            </div>
            <div className="p-4 space-y-2">
              <button
                onClick={() => handleCreateWithTemplate()}
                className="w-full text-left px-4 py-3 rounded-xl border border-border hover:border-accent/30 hover:bg-surface-hover group"
              >
                <span className="font-semibold text-sm text-foreground group-hover:text-accent">Blank Project</span>
                <span className="text-[11px] text-muted block mt-0.5">Start from scratch without predefined scenes</span>
              </button>
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => handleCreateWithTemplate(tpl.id)}
                  className="w-full text-left px-4 py-3 rounded-xl border border-border hover:border-accent/30 hover:bg-surface-hover group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-foreground group-hover:text-accent">{tpl.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">{tpl.scenes.length} scenes</span>
                  </div>
                  <span className="text-[11px] text-muted block mt-0.5">{tpl.description}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
    </AuthGate>
  );
}
