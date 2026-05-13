'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'storyboard-cockpit-auth';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      verify(saved).then((ok) => {
        if (ok) setAuthed(true);
        else localStorage.removeItem(STORAGE_KEY);
        setChecking(false);
      });
    } else {
      setChecking(false);
    }
  }, []);

  async function verify(pw: string): Promise<boolean> {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const ok = await verify(password);
    if (ok) {
      localStorage.setItem(STORAGE_KEY, password);
      setAuthed(true);
    } else {
      setError(true);
    }
    setLoading(false);
  };

  if (checking) {
    return (
      <div className="h-full flex items-center justify-center text-muted text-sm">
        Lade...
      </div>
    );
  }

  if (authed) {
    return <>{children}</>;
  }

  return (
    <div className="h-full flex items-center justify-center bg-background">
      <form onSubmit={handleSubmit} className="w-80 space-y-4">
        <div className="text-center">
          <h1 className="text-lg font-semibold text-foreground">Storyboard Cockpit</h1>
          <p className="text-xs text-muted mt-1">Passwort eingeben</p>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Passwort"
          autoFocus
          className="w-full bg-surface border border-border rounded px-4 py-2.5 text-sm text-foreground placeholder:text-muted/40 outline-none focus:border-accent"
        />
        {error && <p className="text-xs text-danger text-center">Falsches Passwort</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="w-full text-sm px-4 py-2.5 rounded bg-accent hover:bg-accent-hover text-white font-medium disabled:opacity-40"
        >
          {loading ? 'Pruefe...' : 'Einloggen'}
        </button>
      </form>
    </div>
  );
}
