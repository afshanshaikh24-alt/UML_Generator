import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDiagramStore } from '../../store/diagramStore';
import { Save, FolderOpen, Home, Box, Cpu, Edit3, GitBranch } from 'lucide-react';
import { saveDiagram } from '../../utils/storage';
import { importDiagramFromJson, downloadJson } from '../../utils/export';
import toast from 'react-hot-toast';

const Header: React.FC = () => {
  const { diagram, setDiagram, setDiagramName, isDarkMode } = useDiagramStore();
  const navigate = useNavigate();
  const [editing, setEditing] = React.useState(false);
  const [nameInput, setNameInput] = React.useState(diagram.name);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setNameInput(diagram.name);
  }, [diagram.name]);

  const handleSave = () => {
    saveDiagram(diagram);
    toast.success('Diagram saved to local storage');
  };

  const handleNameSave = () => {
    setDiagramName(nameInput || 'Untitled Diagram');
    setEditing(false);
  };

  const handleImport = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const { diagram: imported, errors } = importDiagramFromJson(ev.target?.result as string);
      if (errors.length > 0) {
        toast.error('Import failed: ' + errors[0]);
        return;
      }
      if (imported) {
        setDiagram(imported);
        toast.success(`Loaded: ${imported.name}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="h-12 bg-[#1a1d27] border-b border-[#2d3148] flex items-center px-4 gap-3 flex-shrink-0 z-10">
      <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleFileChange} />

      {/* Logo */}
      <div className="flex items-center gap-2 mr-2">
        <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Box size={14} className="text-white" />
        </div>
        <span className="text-white font-bold text-sm hidden sm:block">UML Generator</span>
      </div>

      {/* Diagram name */}
      <div className="flex items-center gap-1">
        {editing ? (
          <input
            autoFocus
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onBlur={handleNameSave}
            onKeyDown={(e) => { if (e.key === 'Enter') handleNameSave(); if (e.key === 'Escape') { setNameInput(diagram.name); setEditing(false); } }}
            className="bg-[#0f1117] border border-indigo-500 rounded px-2 py-0.5 text-white text-sm focus:outline-none w-52"
          />
        ) : (
          <button
            onClick={() => { setEditing(true); setNameInput(diagram.name); }}
            className="flex items-center gap-1.5 text-[#94a3b8] hover:text-white text-sm transition-colors group"
            title="Click to rename"
          >
            <span>{diagram.name}</span>
            <Edit3 size={12} className="opacity-0 group-hover:opacity-70" />
          </button>
        )}
      </div>

      <div className="flex-1" />

      {/* Action buttons */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[#64748b] hover:text-white hover:bg-[#252836] rounded text-xs transition-colors"
          title="Go to Dashboard"
        >
          <Home size={13} />
          <span className="hidden md:block">Dashboard</span>
        </button>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#252836] border border-[#2d3148] text-[#94a3b8] hover:text-white hover:border-[#3d4166] rounded text-xs transition-colors"
          title="Save (Ctrl+S)"
        >
          <Save size={13} />
          <span className="hidden md:block">Save</span>
        </button>

        <button
          onClick={() => { downloadJson(diagram); toast.success('JSON exported'); }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#252836] border border-[#2d3148] text-[#94a3b8] hover:text-white hover:border-[#3d4166] rounded text-xs transition-colors"
          title="Export JSON"
        >
          <FolderOpen size={13} />
          <span className="hidden md:block">Export</span>
        </button>

        <button
          onClick={handleImport}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#252836] border border-[#2d3148] text-[#94a3b8] hover:text-white hover:border-[#3d4166] rounded text-xs transition-colors"
          title="Import JSON"
        >
          <GitBranch size={13} />
          <span className="hidden md:block">Import</span>
        </button>

        {/* Stats */}
        <div className="hidden md:flex items-center gap-2 ml-2 text-[10px] text-[#3d4166]">
          <span>{diagram.classes.length} classes</span>
          <span>·</span>
          <span>{diagram.relationships.length} relations</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
