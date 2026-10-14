import React, { useState, useRef } from 'react';
import { useDiagramStore } from '../../store/diagramStore';
import {
  Plus, Save, Upload, Download, Undo2, Redo2, Sun, Moon, Search,
  Maximize2, GitBranch, Trash2, Copy, FileJson, FolderOpen, PanelRight,
  BookOpen
} from 'lucide-react';
import { saveDiagram } from '../../utils/storage';
import { downloadJson, importDiagramFromJson } from '../../utils/export';
import toast from 'react-hot-toast';

interface SidebarProps {
  onAddClass: () => void;
  showProperties: boolean;
  setShowProperties: (v: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onAddClass, showProperties, setShowProperties }) => {
  const {
    diagram,
    isDarkMode,
    selectedClassId,
    toggleDarkMode,
    undo,
    redo,
    history,
    historyIndex,
    addClass,
    deleteClass,
    duplicateClass,
    setDiagram,
    setSearchQuery,
    searchQuery,
  } = useDiagramStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [relDialogOpen, setRelDialogOpen] = useState(false);

  const handleSave = () => {
    saveDiagram(diagram);
    toast.success('Diagram saved');
  };

  const handleExportJson = () => {
    downloadJson(diagram);
    toast.success('JSON exported');
  };

  const handleImportJson = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      const { diagram: imported, errors } = importDiagramFromJson(content);
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

  const handleFitView = () => {
    window.dispatchEvent(new Event('uml-fit-view'));
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const selectedClass = diagram.classes.find((c) => c.id === selectedClassId);

  const toolBtn = "flex flex-col items-center gap-1 p-2 rounded-lg transition-all text-[#64748b] hover:bg-[#252836] hover:text-white w-full";
  const toolBtnActive = "flex flex-col items-center gap-1 p-2 rounded-lg transition-all text-indigo-400 bg-indigo-600/10 hover:bg-indigo-600/20 w-full";

  const sections = [
    {
      title: 'Create',
      tools: [
        {
          icon: <Plus size={18} />,
          label: 'Add Class',
          action: onAddClass,
          active: false,
        },
      ],
    },
    {
      title: 'Selected',
      tools: [
        {
          icon: <Copy size={18} />,
          label: 'Duplicate',
          action: () => {
            if (!selectedClassId) { toast.error('Select a class first'); return; }
            duplicateClass(selectedClassId);
            toast.success('Class duplicated');
          },
          active: false,
          disabled: !selectedClassId,
        },
        {
          icon: <Trash2 size={18} />,
          label: 'Delete',
          action: () => {
            if (!selectedClassId) { toast.error('Select a class first'); return; }
            deleteClass(selectedClassId);
            toast.success('Class deleted');
          },
          active: false,
          disabled: !selectedClassId,
          danger: true,
        },
      ],
    },
    {
      title: 'History',
      tools: [
        {
          icon: <Undo2 size={18} />,
          label: 'Undo',
          action: () => { undo(); },
          active: false,
          disabled: !canUndo,
        },
        {
          icon: <Redo2 size={18} />,
          label: 'Redo',
          action: () => { redo(); },
          active: false,
          disabled: !canRedo,
        },
      ],
    },
    {
      title: 'File',
      tools: [
        {
          icon: <Save size={18} />,
          label: 'Save',
          action: handleSave,
          active: false,
        },
        {
          icon: <FileJson size={18} />,
          label: 'Export JSON',
          action: handleExportJson,
          active: false,
        },
        {
          icon: <Upload size={18} />,
          label: 'Import JSON',
          action: handleImportJson,
          active: false,
        },
      ],
    },
    {
      title: 'View',
      tools: [
        {
          icon: <Maximize2 size={18} />,
          label: 'Fit View',
          action: handleFitView,
          active: false,
        },
        {
          icon: <PanelRight size={18} />,
          label: showProperties ? 'Hide Props' : 'Show Props',
          action: () => setShowProperties(!showProperties),
          active: showProperties,
        },
        {
          icon: isDarkMode ? <Sun size={18} /> : <Moon size={18} />,
          label: isDarkMode ? 'Light Mode' : 'Dark Mode',
          action: toggleDarkMode,
          active: false,
        },
      ],
    },
  ];

  return (
    <div className="w-16 bg-[#1a1d27] border-r border-[#2d3148] flex flex-col items-center py-2 overflow-y-auto flex-shrink-0">
      <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleFileChange} />

      {/* Search */}
      <div className="w-full px-1.5 mb-2">
        <button
          className={toolBtn}
          onClick={() => {
            const q = prompt('Search classes, attributes, or methods:');
            if (q !== null) setSearchQuery(q);
          }}
          title="Search"
        >
          <Search size={18} />
          <span className="text-[10px]">Search</span>
        </button>
      </div>

      <div className="w-8 h-px bg-[#2d3148] mb-2" />

      {sections.map((section) => (
        <div key={section.title} className="w-full px-1.5 mb-1">
          <div className="text-[8px] text-[#3d4166] uppercase tracking-wider text-center mb-1">{section.title}</div>
          {section.tools.map((tool) => (
            <button
              key={tool.label}
              onClick={tool.action}
              disabled={(tool as { disabled?: boolean }).disabled}
              className={`${
                (tool as { danger?: boolean }).danger
                  ? 'flex flex-col items-center gap-1 p-2 rounded-lg transition-all text-red-500 hover:bg-red-500/10 w-full disabled:opacity-30'
                  : (tool as { active?: boolean }).active
                  ? toolBtnActive
                  : toolBtn
              } disabled:opacity-30 disabled:cursor-not-allowed`}
              title={tool.label}
            >
              {tool.icon}
              <span className="text-[10px] leading-tight text-center">{tool.label}</span>
            </button>
          ))}
          <div className="w-8 h-px bg-[#2d3148] mx-auto my-1" />
        </div>
      ))}

      {/* Class count */}
      <div className="mt-auto pt-2 text-center">
        <div className="text-[10px] text-[#3d4166]">{diagram.classes.length}</div>
        <div className="text-[9px] text-[#2d3148]">classes</div>
      </div>
    </div>
  );
};

export default Sidebar;
