import { create } from 'zustand';
import { ClassModel, Relationship, DiagramModel, Attribute, Method, Parameter, RelationshipType } from '../models';
import { generateId } from '../utils/helpers';
import { saveDiagram } from '../utils/storage';

interface HistoryEntry {
  classes: ClassModel[];
  relationships: Relationship[];
}

interface DiagramState {
  diagram: DiagramModel;
  selectedClassId: string | null;
  selectedRelationshipId: string | null;
  isDarkMode: boolean;
  history: HistoryEntry[];
  historyIndex: number;
  searchQuery: string;

  // Diagram actions
  setDiagram: (diagram: DiagramModel) => void;
  setDiagramName: (name: string) => void;
  selectClass: (id: string | null) => void;
  selectRelationship: (id: string | null) => void;
  toggleDarkMode: () => void;
  setSearchQuery: (q: string) => void;

  // Class actions
  addClass: () => ClassModel;
  updateClass: (id: string, updates: Partial<ClassModel>) => void;
  deleteClass: (id: string) => void;
  duplicateClass: (id: string) => ClassModel | null;
  updateClassPosition: (id: string, x: number, y: number) => void;

  // Attribute actions
  addAttribute: (classId: string) => void;
  updateAttribute: (classId: string, attrId: string, updates: Partial<Attribute>) => void;
  deleteAttribute: (classId: string, attrId: string) => void;
  moveAttribute: (classId: string, attrId: string, direction: 'up' | 'down') => void;

  // Method actions
  addMethod: (classId: string) => void;
  updateMethod: (classId: string, methodId: string, updates: Partial<Method>) => void;
  deleteMethod: (classId: string, methodId: string) => void;

  // Parameter actions
  addParameter: (classId: string, methodId: string) => void;
  updateParameter: (classId: string, methodId: string, paramId: string, updates: Partial<Parameter>) => void;
  deleteParameter: (classId: string, methodId: string, paramId: string) => void;

  // Relationship actions
  addRelationship: (rel: Omit<Relationship, 'id'>) => Relationship;
  updateRelationship: (id: string, updates: Partial<Relationship>) => void;
  deleteRelationship: (id: string) => void;

  // Undo/Redo
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
}

function createEmptyDiagram(): DiagramModel {
  return {
    id: generateId(),
    name: 'Untitled Diagram',
    version: '1.0',
    classes: [],
    relationships: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export const useDiagramStore = create<DiagramState>((set, get) => ({
  diagram: createEmptyDiagram(),
  selectedClassId: null,
  selectedRelationshipId: null,
  isDarkMode: localStorage.getItem('uml-dark-mode') === 'true',
  history: [],
  historyIndex: -1,
  searchQuery: '',

  setDiagram: (diagram) => {
    set({ diagram, selectedClassId: null, selectedRelationshipId: null, history: [], historyIndex: -1 });
  },

  setDiagramName: (name) => {
    set((state) => ({
      diagram: { ...state.diagram, name, updatedAt: new Date().toISOString() },
    }));
  },

  selectClass: (id) => set({ selectedClassId: id, selectedRelationshipId: null }),
  selectRelationship: (id) => set({ selectedRelationshipId: id, selectedClassId: null }),

  toggleDarkMode: () => {
    const next = !get().isDarkMode;
    localStorage.setItem('uml-dark-mode', String(next));
    set({ isDarkMode: next });
  },

  setSearchQuery: (q) => set({ searchQuery: q }),

  pushHistory: () => {
    const { diagram, history, historyIndex } = get();
    const entry: HistoryEntry = {
      classes: JSON.parse(JSON.stringify(diagram.classes)),
      relationships: JSON.parse(JSON.stringify(diagram.relationships)),
    };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(entry);
    if (newHistory.length > 50) newHistory.shift();
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  undo: () => {
    const { history, historyIndex, diagram } = get();
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    const entry = history[newIndex];
    set({
      historyIndex: newIndex,
      diagram: {
        ...diagram,
        classes: JSON.parse(JSON.stringify(entry.classes)),
        relationships: JSON.parse(JSON.stringify(entry.relationships)),
        updatedAt: new Date().toISOString(),
      },
    });
  },

  redo: () => {
    const { history, historyIndex, diagram } = get();
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    const entry = history[newIndex];
    set({
      historyIndex: newIndex,
      diagram: {
        ...diagram,
        classes: JSON.parse(JSON.stringify(entry.classes)),
        relationships: JSON.parse(JSON.stringify(entry.relationships)),
        updatedAt: new Date().toISOString(),
      },
    });
  },

  addClass: () => {
    get().pushHistory();
    const newClass: ClassModel = {
      id: generateId(),
      name: 'NewClass',
      packageName: '',
      isAbstract: false,
      isFinal: false,
      isInterface: false,
      extendsClass: '',
      implementsInterfaces: [],
      attributes: [
        {
          id: generateId(),
          name: 'id',
          type: 'int',
          visibility: 'private',
          isStatic: false,
          isFinal: false,
          defaultValue: '',
        },
      ],
      methods: [
        {
          id: generateId(),
          name: 'getId',
          returnType: 'int',
          visibility: 'public',
          isStatic: false,
          isAbstract: false,
          isFinal: false,
          parameters: [],
        },
      ],
      position: { x: 100 + Math.random() * 300, y: 100 + Math.random() * 200 },
    };
    set((state) => ({
      diagram: {
        ...state.diagram,
        classes: [...state.diagram.classes, newClass],
        updatedAt: new Date().toISOString(),
      },
      selectedClassId: newClass.id,
    }));
    return newClass;
  },

  updateClass: (id, updates) => {
    set((state) => ({
      diagram: {
        ...state.diagram,
        classes: state.diagram.classes.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        ),
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  deleteClass: (id) => {
    get().pushHistory();
    set((state) => ({
      diagram: {
        ...state.diagram,
        classes: state.diagram.classes.filter((c) => c.id !== id),
        relationships: state.diagram.relationships.filter(
          (r) => r.sourceId !== id && r.targetId !== id
        ),
        updatedAt: new Date().toISOString(),
      },
      selectedClassId: state.selectedClassId === id ? null : state.selectedClassId,
    }));
  },

  duplicateClass: (id) => {
    get().pushHistory();
    const { diagram } = get();
    const original = diagram.classes.find((c) => c.id === id);
    if (!original) return null;
    const copy: ClassModel = {
      ...JSON.parse(JSON.stringify(original)),
      id: generateId(),
      name: original.name + 'Copy',
      position: { x: original.position.x + 40, y: original.position.y + 40 },
      attributes: original.attributes.map((a) => ({ ...a, id: generateId() })),
      methods: original.methods.map((m) => ({
        ...m,
        id: generateId(),
        parameters: m.parameters.map((p) => ({ ...p, id: generateId() })),
      })),
    };
    set((state) => ({
      diagram: {
        ...state.diagram,
        classes: [...state.diagram.classes, copy],
        updatedAt: new Date().toISOString(),
      },
      selectedClassId: copy.id,
    }));
    return copy;
  },

  updateClassPosition: (id, x, y) => {
    set((state) => ({
      diagram: {
        ...state.diagram,
        classes: state.diagram.classes.map((c) =>
          c.id === id ? { ...c, position: { x, y } } : c
        ),
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  addAttribute: (classId) => {
    get().pushHistory();
    const newAttr: Attribute = {
      id: generateId(),
      name: 'attribute',
      type: 'String',
      visibility: 'private',
      isStatic: false,
      isFinal: false,
      defaultValue: '',
    };
    set((state) => ({
      diagram: {
        ...state.diagram,
        classes: state.diagram.classes.map((c) =>
          c.id === classId
            ? { ...c, attributes: [...c.attributes, newAttr] }
            : c
        ),
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  updateAttribute: (classId, attrId, updates) => {
    set((state) => ({
      diagram: {
        ...state.diagram,
        classes: state.diagram.classes.map((c) =>
          c.id === classId
            ? {
                ...c,
                attributes: c.attributes.map((a) =>
                  a.id === attrId ? { ...a, ...updates } : a
                ),
              }
            : c
        ),
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  deleteAttribute: (classId, attrId) => {
    get().pushHistory();
    set((state) => ({
      diagram: {
        ...state.diagram,
        classes: state.diagram.classes.map((c) =>
          c.id === classId
            ? { ...c, attributes: c.attributes.filter((a) => a.id !== attrId) }
            : c
        ),
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  moveAttribute: (classId, attrId, direction) => {
    set((state) => ({
      diagram: {
        ...state.diagram,
        classes: state.diagram.classes.map((c) => {
          if (c.id !== classId) return c;
          const attrs = [...c.attributes];
          const idx = attrs.findIndex((a) => a.id === attrId);
          if (idx === -1) return c;
          if (direction === 'up' && idx > 0) {
            [attrs[idx - 1], attrs[idx]] = [attrs[idx], attrs[idx - 1]];
          } else if (direction === 'down' && idx < attrs.length - 1) {
            [attrs[idx], attrs[idx + 1]] = [attrs[idx + 1], attrs[idx]];
          }
          return { ...c, attributes: attrs };
        }),
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  addMethod: (classId) => {
    get().pushHistory();
    const newMethod: Method = {
      id: generateId(),
      name: 'newMethod',
      returnType: 'void',
      visibility: 'public',
      isStatic: false,
      isAbstract: false,
      isFinal: false,
      parameters: [],
    };
    set((state) => ({
      diagram: {
        ...state.diagram,
        classes: state.diagram.classes.map((c) =>
          c.id === classId
            ? { ...c, methods: [...c.methods, newMethod] }
            : c
        ),
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  updateMethod: (classId, methodId, updates) => {
    set((state) => ({
      diagram: {
        ...state.diagram,
        classes: state.diagram.classes.map((c) =>
          c.id === classId
            ? {
                ...c,
                methods: c.methods.map((m) =>
                  m.id === methodId ? { ...m, ...updates } : m
                ),
              }
            : c
        ),
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  deleteMethod: (classId, methodId) => {
    get().pushHistory();
    set((state) => ({
      diagram: {
        ...state.diagram,
        classes: state.diagram.classes.map((c) =>
          c.id === classId
            ? { ...c, methods: c.methods.filter((m) => m.id !== methodId) }
            : c
        ),
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  addParameter: (classId, methodId) => {
    const newParam: Parameter = {
      id: generateId(),
      name: 'param',
      type: 'String',
    };
    set((state) => ({
      diagram: {
        ...state.diagram,
        classes: state.diagram.classes.map((c) =>
          c.id === classId
            ? {
                ...c,
                methods: c.methods.map((m) =>
                  m.id === methodId
                    ? { ...m, parameters: [...m.parameters, newParam] }
                    : m
                ),
              }
            : c
        ),
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  updateParameter: (classId, methodId, paramId, updates) => {
    set((state) => ({
      diagram: {
        ...state.diagram,
        classes: state.diagram.classes.map((c) =>
          c.id === classId
            ? {
                ...c,
                methods: c.methods.map((m) =>
                  m.id === methodId
                    ? {
                        ...m,
                        parameters: m.parameters.map((p) =>
                          p.id === paramId ? { ...p, ...updates } : p
                        ),
                      }
                    : m
                ),
              }
            : c
        ),
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  deleteParameter: (classId, methodId, paramId) => {
    set((state) => ({
      diagram: {
        ...state.diagram,
        classes: state.diagram.classes.map((c) =>
          c.id === classId
            ? {
                ...c,
                methods: c.methods.map((m) =>
                  m.id === methodId
                    ? { ...m, parameters: m.parameters.filter((p) => p.id !== paramId) }
                    : m
                ),
              }
            : c
        ),
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  addRelationship: (rel) => {
    get().pushHistory();
    const newRel: Relationship = { ...rel, id: generateId() };
    set((state) => ({
      diagram: {
        ...state.diagram,
        relationships: [...state.diagram.relationships, newRel],
        updatedAt: new Date().toISOString(),
      },
    }));
    return newRel;
  },

  updateRelationship: (id, updates) => {
    set((state) => ({
      diagram: {
        ...state.diagram,
        relationships: state.diagram.relationships.map((r) =>
          r.id === id ? { ...r, ...updates } : r
        ),
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  deleteRelationship: (id) => {
    get().pushHistory();
    set((state) => ({
      diagram: {
        ...state.diagram,
        relationships: state.diagram.relationships.filter((r) => r.id !== id),
        updatedAt: new Date().toISOString(),
      },
      selectedRelationshipId:
        state.selectedRelationshipId === id ? null : state.selectedRelationshipId,
    }));
  },
}));
