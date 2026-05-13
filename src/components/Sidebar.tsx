'use client';

import { useState, useEffect } from 'react';
import type { Project } from '@/lib/types';
import { HelpButton } from './Onboarding';

interface SidebarProps {
  projects: Project[];
  activeProjectId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
}

function LogoIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <rect width="48" height="48" rx="12" fill="#0d0d24"/>
      <rect x="2" y="2" width="44" height="44" rx="10" stroke="url(#lg)" strokeWidth="1.5" fill="none"/>
      <rect x="8" y="12" width="32" height="24" rx="3" fill="#151535" stroke="#6366F1" strokeWidth="1"/>
      <circle cx="11" cy="16" r="1" fill="#6366F1" opacity="0.5"/>
      <circle cx="11" cy="20" r="1" fill="#6366F1" opacity="0.5"/>
      <circle cx="11" cy="24" r="1" fill="#6366F1" opacity="0.5"/>
      <circle cx="11" cy="28" r="1" fill="#6366F1" opacity="0.5"/>
      <circle cx="11" cy="32" r="1" fill="#6366F1" opacity="0.5"/>
      <circle cx="37" cy="16" r="1" fill="#6366F1" opacity="0.5"/>
      <circle cx="37" cy="20" r="1" fill="#6366F1" opacity="0.5"/>
      <circle cx="37" cy="24" r="1" fill="#6366F1" opacity="0.5"/>
      <circle cx="37" cy="28" r="1" fill="#6366F1" opacity="0.5"/>
      <circle cx="37" cy="32" r="1" fill="#6366F1" opacity="0.5"/>
      <rect x="14" y="15" width="8" height="6" rx="1" fill="#6366F1" opacity="0.25"/>
      <rect x="24" y="15" width="10" height="6" rx="1" fill="#8B5CF6" opacity="0.25"/>
      <rect x="14" y="23" width="10" height="6" rx="1" fill="#8B5CF6" opacity="0.25"/>
      <rect x="26" y="23" width="8" height="6" rx="1" fill="#6366F1" opacity="0.25"/>
      <path d="M30 18l1.5-3 1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5z" fill="#F59E0B" opacity="0.85"/>
      <path d="M18 26l1-2 1 2 2 1-2 1-1 2-1-2-2-1z" fill="#F59E0B" opacity="0.65"/>
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#6366F1"/>
          <stop offset="100%" stopColor="#8B5CF6"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Sidebar({ projects, activeProjectId, onSelect, onCreate, onDelete }: SidebarProps) {
  const [light, setLight] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('storyboard-theme');
    if (saved === 'light') { setLight(true); document.documentElement.classList.add('light'); }
  }, []);

  const toggleTheme = () => {
    const next = !light;
    setLight(next);
    document.documentElement.classList.toggle('light', next);
    localStorage.setItem('storyboard-theme', next ? 'light' : 'dark');
  };

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-surface flex flex-col h-full">
      {/* Brand header */}
      <div className="p-4 border-b border-border ambient-glow overflow-hidden">
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <LogoIcon />
          <div>
            <h1 className="text-sm font-bold tracking-wide text-foreground leading-tight">Storyboard</h1>
            <h1 className="text-sm font-bold tracking-wide text-foreground leading-tight">Studio</h1>
          </div>
        </div>
        <div className="flex items-center gap-1.5 relative z-10">
          <HelpButton />
          <button
            onClick={toggleTheme}
            className="text-[10px] px-2.5 py-1.5 rounded-lg bg-surface-hover hover:bg-border text-muted hover:text-foreground cursor-pointer"
            title={light ? 'Dark Mode' : 'Light Mode'}
          >
            {light ? '☀' : '☾'}
          </button>
          <button
            onClick={onCreate}
            className="flex-1 text-[11px] py-1.5 rounded-lg btn-gradient text-white font-semibold cursor-pointer"
          >
            + New Project
          </button>
        </div>
      </div>

      {/* Project list */}
      <nav className="flex-1 overflow-y-auto p-2.5 space-y-1">
        {projects.map((p) => {
          const isActive = p.id === activeProjectId;
          return (
            <div
              key={p.id}
              className={`group flex items-center justify-between rounded-xl px-3 py-2.5 cursor-pointer text-sm ${
                isActive
                  ? 'bg-accent/10 text-accent border border-accent/20 pulse-glow'
                  : 'hover:bg-surface-hover text-foreground/70 hover:text-foreground border border-transparent'
              }`}
              onClick={() => onSelect(p.id)}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-2 h-2 rounded-full shrink-0 ${isActive ? 'bg-accent' : 'bg-muted/30'}`} />
                <span className="truncate font-medium">{p.name}</span>
              </div>
              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100">
                <span className="text-[10px] text-muted font-mono">{p.scenes.length}s</span>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(p.id); }}
                  className="text-danger/50 hover:text-danger text-xs cursor-pointer"
                  title="Delete"
                >
                  x
                </button>
              </div>
            </div>
          );
        })}
        {projects.length === 0 && (
          <div className="text-center py-12 px-4">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-accent/10 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <line x1="2" y1="10" x2="22" y2="10"/>
                <line x1="8" y1="4" x2="8" y2="20"/>
              </svg>
            </div>
            <p className="text-xs text-muted font-medium">No projects yet</p>
            <p className="text-[10px] text-muted/50 mt-1">Click &quot;+ New Project&quot; to start.</p>
          </div>
        )}
      </nav>

      {/* Footer — AI Pirates retro badge */}
      <div className="px-3 py-3 border-t border-border">
        <a href="https://ai-pirates.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2.5 group">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 opacity-30 group-hover:opacity-60">
            {/* Skull */}
            <rect x="6" y="4" width="12" height="10" rx="4" stroke="currentColor" strokeWidth="1.2" className="text-purple"/>
            {/* Eyes — left eye, right is eyepatch */}
            <rect x="8.5" y="7.5" width="2" height="2" rx="0.5" fill="currentColor" className="text-purple"/>
            <line x1="13" y1="7" x2="16" y2="10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="text-purple"/>
            <line x1="16" y1="7" x2="13" y2="10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="text-purple"/>
            {/* Teeth */}
            <rect x="9" y="12" width="1.5" height="2" rx="0.3" fill="currentColor" className="text-purple" opacity="0.5"/>
            <rect x="11.25" y="12" width="1.5" height="2" rx="0.3" fill="currentColor" className="text-purple" opacity="0.5"/>
            <rect x="13.5" y="12" width="1.5" height="2" rx="0.3" fill="currentColor" className="text-purple" opacity="0.5"/>
            {/* Crossbones */}
            <line x1="4" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="text-purple" opacity="0.3"/>
            <line x1="4" y1="20" x2="20" y2="20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="text-purple" opacity="0.3"/>
          </svg>
          <div className="flex flex-col items-start">
            <span className="text-[8px] text-muted/30 group-hover:text-muted/50 tracking-[0.2em] uppercase leading-none">Developed by</span>
            <span className="text-[10px] text-purple/40 group-hover:text-purple font-bold tracking-[0.15em] uppercase leading-tight" style={{ fontFamily: 'var(--font-mono), monospace' }}>AI Pirates</span>
          </div>
        </a>
      </div>
    </aside>
  );
}
