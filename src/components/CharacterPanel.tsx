'use client';

import { useRef } from 'react';
import type { Character } from '@/lib/types';

interface CharacterPanelProps {
  characters: Character[];
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<Character>) => void;
  onDelete: (id: string) => void;
}

export default function CharacterPanel({ characters, onAdd, onUpdate, onDelete }: CharacterPanelProps) {
  return (
    <div className="border border-border rounded-lg bg-surface overflow-hidden">
      <div className="px-4 py-2 border-b border-border bg-surface-hover flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Charaktere</h3>
          <p className="text-[10px] text-muted">Einmal definieren → wird in jeden Szenen-Prompt injiziert</p>
        </div>
        <button
          onClick={onAdd}
          className="text-xs px-2.5 py-1 rounded bg-accent hover:bg-accent-hover text-white font-medium"
        >
          + Charakter
        </button>
      </div>

      {characters.length === 0 ? (
        <div className="px-4 py-3 text-xs text-muted">
          Keine Charaktere definiert. Erstelle einen, damit alle Szenen konsistent bleiben.
        </div>
      ) : (
        <div className="divide-y divide-border">
          {characters.map((char) => (
            <CharacterRow key={char.id} character={char} onUpdate={onUpdate} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

function CharacterRow({ character, onUpdate, onDelete }: { character: Character; onUpdate: (id: string, updates: Partial<Character>) => void; onDelete: (id: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onUpdate(character.id, { referenceImageUrl: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex gap-3 p-3">
      {/* Reference image */}
      <div
        className="w-16 h-16 shrink-0 rounded bg-background border border-border flex items-center justify-center cursor-pointer relative group overflow-hidden"
        onClick={() => fileRef.current?.click()}
      >
        {character.referenceImageUrl ? (
          <>
            <img src={character.referenceImageUrl} alt={character.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[9px] text-white">
              Tauschen
            </div>
          </>
        ) : (
          <span className="text-[10px] text-muted/50 text-center px-1">Ref Bild</span>
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
      </div>

      {/* Fields */}
      <div className="flex-1 space-y-1.5">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={character.name}
            onChange={(e) => onUpdate(character.id, { name: e.target.value })}
            placeholder="Name (z.B. Ritter Marcus)"
            className="flex-1 bg-background border border-border rounded px-2 py-1 text-xs text-foreground placeholder:text-muted/40 outline-none focus:border-accent"
          />
          <button
            onClick={() => onDelete(character.id)}
            className="text-danger/60 hover:text-danger text-xs px-1"
          >
            x
          </button>
        </div>
        <textarea
          value={character.description}
          onChange={(e) => onUpdate(character.id, { description: e.target.value })}
          placeholder="EXAKTE englische Beschreibung: A 35-year-old Caucasian man with short brown hair, strong jawline, muscular build, wearing weathered steel plate armor with a red cross emblem..."
          rows={2}
          className="w-full bg-background border border-border rounded px-2 py-1 text-xs text-foreground placeholder:text-muted/40 outline-none focus:border-accent resize-none"
        />
        {/* Additional reference images */}
        {character.referenceImageUrl && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] text-muted">Weitere Winkel (optimal: 3-6 Bilder total)</span>
              <label className="text-[9px] text-accent cursor-pointer hover:text-accent-hover">
                + Winkel
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      const refs = [...(character.additionalRefs || []), reader.result as string];
                      onUpdate(character.id, { additionalRefs: refs });
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
            </div>
            {(character.additionalRefs || []).length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {(character.additionalRefs || []).map((ref, i) => (
                  <div key={i} className="w-10 h-10 rounded bg-surface overflow-hidden relative group shrink-0">
                    <img src={ref} alt={`Ref ${i + 2}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => {
                        const refs = (character.additionalRefs || []).filter((_, j) => j !== i);
                        onUpdate(character.id, { additionalRefs: refs });
                      }}
                      className="absolute top-0 right-0 text-[8px] text-white bg-black/60 px-1 opacity-0 group-hover:opacity-100"
                    >x</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
