import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, FolderOpen, BookOpen, Trash2, Copy, Clock, Box, Cpu, ArrowRight,
  Code2, LayoutDashboard, Layers
} from 'lucide-react';
import { getAllDiagrams, saveDiagram, deleteDiagramFromStorage, duplicateDiagramInStorage } from '../utils/storage';
import { createLibraryManagementExample, createStudentManagementExample } from '../utils/examples';
import { useDiagramStore } from '../store/diagramStore';
import { DiagramModel } from '../models';
import { generateId } from '../utils/helpers';
import toast from 'react-hot-toast';

const TEMPLATE_CARDS = [
  { id: 'library', name: 'Library Management System', desc: '5 classes, 4 relationships', icon: '📚', classes: 5, rels: 4 },
  { id: 'student', name: 'Student Management System', desc: '4 classes, 4 relationships', icon: '🎓', classes: 4, rels: 4 },
];

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString();
  } catch { return iso; }
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { setDiagram } = useDiagramStore();
  const [diagrams, setDiagrams] = useState<DiagramModel[]>([]);

  const refresh = useCallback(() => {
    setDiagrams(getAllDiagrams());
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const handleNew = () => {
    const fresh: DiagramModel = {
      id: generateId(),
      name: 'Untitled Diagram',
      version: '1.0',
      classes: [],
      relationships: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDiagram(fresh);
    navigate('/editor');
  };

  const handleOpen = (diag: DiagramModel) => {
    setDiagram(diag);
    navigate('/editor');
  };

  const handleDelete = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Delete "${name}"?`)) return;
    deleteDiagramFromStorage(id);
    refresh();
    toast.success('Diagram deleted');
  };

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const copy = duplicateDiagramInStorage(id);
    if (copy) {
      refresh();
      toast.success('Diagram duplicated');
    }
  };

  const handleLoadExample = (id: string) => {
    const diag = id === 'library' ? createLibraryManagementExample() : createStudentManagementExample();
    saveDiagram(diag);
    setDiagram(diag);
    navigate('/editor');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target?.result as string);
          if (!parsed.classes || !parsed.relationships) {
            toast.error('Invalid diagram file');
            return;
          }
          if (!parsed.id) parsed.id = generateId();
          saveDiagram(parsed);
          setDiagram(parsed);
          navigate('/editor');
        } catch {
          toast.error('Failed to parse JSON file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      {/* Nav */}
      <nav className="border-b border-[#2d3148] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Box size={16} className="text-white" />
          </div>
          <div>
            <span className="text-white font-bold text-base">UML Generator</span>
            <span className="text-[#64748b] text-xs ml-2">v1.0</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/about')}
            className="text-[#64748b] hover:text-white text-sm transition-colors px-3 py-1.5"
          >
            About
          </button>
          <button
            onClick={handleNew}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={15} /> New Diagram
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="px-6 py-16 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-600/10 border border-indigo-600/20 rounded-full px-4 py-1.5 text-indigo-400 text-xs font-medium mb-6">
          <Cpu size={12} /> Visual UML → Java Code Generator
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
          Design UML Diagrams,<br />
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Generate Java Code
          </span>
        </h1>
        <p className="text-[#94a3b8] text-lg mb-10 max-w-2xl mx-auto">
          Visually design software architecture and automatically generate production-ready Java classes — no API keys, no backend, completely offline.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={handleNew}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all hover:scale-105 shadow-lg shadow-indigo-600/20"
          >
            <Plus size={16} /> Create New Diagram
          </button>
          <button
            onClick={handleImport}
            className="flex items-center gap-2 px-6 py-3 bg-[#1a1d27] border border-[#2d3148] hover:border-[#3d4166] text-white rounded-xl font-semibold transition-all hover:scale-105"
          >
            <FolderOpen size={16} /> Open Diagram
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="px-6 py-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[
            { icon: <Layers size={20} />, title: 'Visual Editor', desc: 'Drag & drop class design' },
            { icon: <Code2 size={20} />, title: 'Java Generator', desc: 'Production-ready code' },
            { icon: <LayoutDashboard size={20} />, title: 'IDE-Style UI', desc: 'Professional interface' },
            { icon: <Box size={20} />, title: 'Offline First', desc: 'No internet required' },
          ].map((f) => (
            <div key={f.title} className="bg-[#1a1d27] border border-[#2d3148] rounded-xl p-4 hover:border-indigo-500/30 transition-colors group">
              <div className="text-indigo-400 mb-2 group-hover:text-indigo-300">{f.icon}</div>
              <div className="text-white font-medium text-sm">{f.title}</div>
              <div className="text-[#64748b] text-xs mt-0.5">{f.desc}</div>
            </div>
          ))}
        </div>

        {/* Example templates */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={16} className="text-indigo-400" />
            <h2 className="text-white font-semibold">Example Diagrams</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TEMPLATE_CARDS.map((t) => (
              <button
                key={t.id}
                onClick={() => handleLoadExample(t.id)}
                className="flex items-center gap-4 bg-[#1a1d27] border border-[#2d3148] rounded-xl p-4 hover:border-indigo-500/40 hover:bg-[#1e2235] transition-all text-left group"
              >
                <div className="text-3xl">{t.icon}</div>
                <div className="flex-1">
                  <div className="text-white font-medium text-sm">{t.name}</div>
                  <div className="text-[#64748b] text-xs mt-0.5">{t.desc}</div>
                </div>
                <ArrowRight size={16} className="text-[#3d4166] group-hover:text-indigo-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Recent diagrams */}
        {diagrams.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock size={16} className="text-indigo-400" />
              <h2 className="text-white font-semibold">Recent Diagrams</h2>
              <span className="text-[#64748b] text-xs">({diagrams.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {diagrams.slice(0, 9).map((diag) => (
                <div
                  key={diag.id}
                  onClick={() => handleOpen(diag)}
                  className="bg-[#1a1d27] border border-[#2d3148] rounded-xl p-4 cursor-pointer hover:border-indigo-500/40 hover:bg-[#1e2235] transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Box size={14} className="text-indigo-400" />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleDuplicate(diag.id, e)}
                        className="p-1 text-[#64748b] hover:text-white rounded transition-colors"
                        title="Duplicate"
                      >
                        <Copy size={13} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(diag.id, diag.name, e)}
                        className="p-1 text-[#64748b] hover:text-red-400 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <div className="text-white font-medium text-sm truncate">{diag.name}</div>
                  <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#64748b]">
                    <span>{diag.classes.length} classes</span>
                    <span>·</span>
                    <span>{diag.relationships.length} relations</span>
                  </div>
                  <div className="text-[10px] text-[#3d4166] mt-1.5">{formatDate(diag.updatedAt)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {diagrams.length === 0 && (
          <div className="text-center py-12 bg-[#1a1d27] border border-dashed border-[#2d3148] rounded-xl">
            <div className="text-4xl mb-3 opacity-30">📋</div>
            <p className="text-[#64748b] text-sm">No saved diagrams yet. Create one to get started!</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-[#2d3148] px-6 py-6 mt-8 text-center">
        <p className="text-[#3d4166] text-xs">
          UML Class Diagram Generator · Built with React, TypeScript, React Flow · Open Source
        </p>
      </footer>
    </div>
  );
};

export default Home;
