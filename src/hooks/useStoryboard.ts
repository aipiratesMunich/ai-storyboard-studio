'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Project, Scene, Character, ProductRef, AspectRatio } from '@/lib/types';

const STORAGE_KEY = 'storyboard-cockpit-projects';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function loadProjects(): Project[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveProjects(projects: Project[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function useStoryboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const p = loadProjects();
    setProjects(p);
    if (p.length > 0) setActiveProjectId(p[0].id);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveProjects(projects);
  }, [projects, loaded]);

  const activeProject = projects.find((p) => p.id === activeProjectId) ?? null;

  const createProject = useCallback((name: string) => {
    const project: Project = {
      id: generateId(),
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      characters: [],
      productRefs: [],
      scenes: [],
      aspectRatio: '16:9',
    };
    setProjects((prev) => [project, ...prev]);
    setActiveProjectId(project.id);
    return project;
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setActiveProjectId((curr) => (curr === id ? null : curr));
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<Pick<Project, 'name'>>) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      )
    );
  }, []);

  const addScene = useCallback((projectId: string) => {
    const scene: Scene = {
      id: generateId(),
      order: 0,
      title: '',
      imagePrompt: '',
      imageUrl: null,
      cameraMovement: 'statisch',
      style: 'cinematic',
      mood: '',
      duration: 5,
      notes: '',
      veoPrompt: '',
      seedancePrompt: '',
      filmStock: '',
      cinematicStyle: '',
      lens: '',
      shots: [],
      voiceover: '',
      audioUrl: null,
      startFrameSceneId: null,
    };
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const scenes = [...p.scenes, { ...scene, order: p.scenes.length }];
        return { ...p, scenes, updatedAt: new Date().toISOString() };
      })
    );
    return scene;
  }, []);

  const updateScene = useCallback((projectId: string, sceneId: string, updates: Partial<Scene>) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const scenes = p.scenes.map((s) => (s.id === sceneId ? { ...s, ...updates } : s));
        return { ...p, scenes, updatedAt: new Date().toISOString() };
      })
    );
  }, []);

  const duplicateScene = useCallback((projectId: string, sceneId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const idx = p.scenes.findIndex((s) => s.id === sceneId);
        if (idx === -1) return p;
        const original = p.scenes[idx];
        const copy: Scene = {
          ...original,
          id: generateId(),
          title: `${original.title} (Kopie)`,
          imageUrl: original.imageUrl,
          shots: original.shots.map((s) => ({ ...s, id: generateId() })),
        };
        const scenes = [...p.scenes];
        scenes.splice(idx + 1, 0, copy);
        return { ...p, scenes: scenes.map((s, i) => ({ ...s, order: i })), updatedAt: new Date().toISOString() };
      })
    );
  }, []);

  const deleteScene = useCallback((projectId: string, sceneId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const scenes = p.scenes
          .filter((s) => s.id !== sceneId)
          .map((s, i) => ({ ...s, order: i }));
        return { ...p, scenes, updatedAt: new Date().toISOString() };
      })
    );
  }, []);

  const importScenes = useCallback((projectId: string, generatedScenes: Omit<Scene, 'id' | 'order' | 'imageUrl' | 'startFrameSceneId'>[]) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const newScenes: Scene[] = generatedScenes.map((gs, i) => ({
          id: generateId(),
          order: p.scenes.length + i,
          imageUrl: null,
          startFrameSceneId: null,
          title: gs.title || '',
          imagePrompt: gs.imagePrompt || '',
          cameraMovement: gs.cameraMovement || 'statisch',
          style: gs.style || 'cinematic',
          mood: gs.mood || '',
          duration: gs.duration || 5,
          notes: gs.notes || '',
          veoPrompt: gs.veoPrompt || '',
          seedancePrompt: gs.seedancePrompt || '',
          filmStock: gs.filmStock || '',
          cinematicStyle: gs.cinematicStyle || '',
          lens: gs.lens || '',
          shots: [],
          voiceover: '',
          audioUrl: null,
        }));
        return {
          ...p,
          scenes: [...p.scenes, ...newScenes],
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const replaceScenes = useCallback((projectId: string, generatedScenes: Omit<Scene, 'id' | 'order' | 'imageUrl' | 'startFrameSceneId'>[]) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const newScenes: Scene[] = generatedScenes.map((gs, i) => ({
          id: generateId(),
          order: i,
          imageUrl: null,
          startFrameSceneId: null,
          title: gs.title || '',
          imagePrompt: gs.imagePrompt || '',
          cameraMovement: gs.cameraMovement || 'statisch',
          style: gs.style || 'cinematic',
          mood: gs.mood || '',
          duration: gs.duration || 5,
          notes: gs.notes || '',
          veoPrompt: gs.veoPrompt || '',
          seedancePrompt: gs.seedancePrompt || '',
          filmStock: gs.filmStock || '',
          cinematicStyle: gs.cinematicStyle || '',
          lens: gs.lens || '',
          shots: [],
          voiceover: '',
          audioUrl: null,
        }));
        return { ...p, scenes: newScenes, updatedAt: new Date().toISOString() };
      })
    );
  }, []);

  const reorderScenes = useCallback((projectId: string, fromIndex: number, toIndex: number) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const scenes = [...p.scenes];
        const [moved] = scenes.splice(fromIndex, 1);
        scenes.splice(toIndex, 0, moved);
        return {
          ...p,
          scenes: scenes.map((s, i) => ({ ...s, order: i })),
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const addCharacter = useCallback((projectId: string) => {
    const char: Character = { id: generateId(), name: '', description: '', referenceImageUrl: null, additionalRefs: [] };
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, characters: [...(p.characters || []), char], updatedAt: new Date().toISOString() }
          : p
      )
    );
    return char;
  }, []);

  const updateCharacter = useCallback((projectId: string, charId: string, updates: Partial<Character>) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, characters: (p.characters || []).map((c) => (c.id === charId ? { ...c, ...updates } : c)), updatedAt: new Date().toISOString() }
          : p
      )
    );
  }, []);

  const deleteCharacter = useCallback((projectId: string, charId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, characters: (p.characters || []).filter((c) => c.id !== charId), updatedAt: new Date().toISOString() }
          : p
      )
    );
  }, []);

  const updateAspectRatio = useCallback((projectId: string, aspectRatio: AspectRatio) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, aspectRatio, updatedAt: new Date().toISOString() }
          : p
      )
    );
  }, []);

  const addProductRef = useCallback((projectId: string) => {
    const ref: ProductRef = { id: generateId(), name: '', description: '', referenceImageUrl: null, additionalRefs: [] };
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, productRefs: [...(p.productRefs || []), ref], updatedAt: new Date().toISOString() }
          : p
      )
    );
    return ref;
  }, []);

  const updateProductRef = useCallback((projectId: string, refId: string, updates: Partial<ProductRef>) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, productRefs: (p.productRefs || []).map((r) => (r.id === refId ? { ...r, ...updates } : r)), updatedAt: new Date().toISOString() }
          : p
      )
    );
  }, []);

  const deleteProductRef = useCallback((projectId: string, refId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, productRefs: (p.productRefs || []).filter((r) => r.id !== refId), updatedAt: new Date().toISOString() }
          : p
      )
    );
  }, []);

  return {
    projects,
    activeProject,
    activeProjectId,
    setActiveProjectId,
    createProject,
    deleteProject,
    updateProject,
    addScene,
    updateScene,
    deleteScene,
    reorderScenes,
    importScenes,
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
  };
}
