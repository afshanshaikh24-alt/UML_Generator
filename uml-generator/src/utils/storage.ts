import { DiagramModel } from '../models';
import { generateId } from './helpers';

const STORAGE_KEY = 'uml-generator-diagrams';
const CURRENT_KEY = 'uml-generator-current';

export function getAllDiagrams(): DiagramModel[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveDiagram(diagram: DiagramModel): void {
  const diagrams = getAllDiagrams();
  const idx = diagrams.findIndex((d) => d.id === diagram.id);
  const updated = { ...diagram, updatedAt: new Date().toISOString() };
  if (idx >= 0) {
    diagrams[idx] = updated;
  } else {
    diagrams.unshift(updated);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(diagrams));
}

export function loadDiagram(id: string): DiagramModel | null {
  const diagrams = getAllDiagrams();
  return diagrams.find((d) => d.id === id) ?? null;
}

export function deleteDiagramFromStorage(id: string): void {
  const diagrams = getAllDiagrams().filter((d) => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(diagrams));
}

export function duplicateDiagramInStorage(id: string): DiagramModel | null {
  const original = loadDiagram(id);
  if (!original) return null;
  const copy: DiagramModel = {
    ...JSON.parse(JSON.stringify(original)),
    id: generateId(),
    name: original.name + ' (Copy)',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveDiagram(copy);
  return copy;
}

export function saveCurrentDiagram(diagram: DiagramModel): void {
  localStorage.setItem(CURRENT_KEY, JSON.stringify(diagram));
}

export function loadCurrentDiagram(): DiagramModel | null {
  try {
    const raw = localStorage.getItem(CURRENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
