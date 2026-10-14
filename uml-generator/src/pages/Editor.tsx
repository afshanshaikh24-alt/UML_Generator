import React, { useEffect, useCallback, useState } from 'react';
import { useDiagramStore } from '../store/diagramStore';
import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import DiagramCanvas from '../components/DiagramCanvas/DiagramCanvas';
import PropertiesPanel from '../components/PropertiesPanel/PropertiesPanel';
import JavaCodePanel from '../components/JavaCodePanel/JavaCodePanel';
import { saveDiagram } from '../utils/storage';
import toast from 'react-hot-toast';

const Editor: React.FC = () => {
  const {
    diagram,
    addClass,
    undo,
    redo,
    deleteClass,
    duplicateClass,
    selectedClassId,
    history,
    historyIndex,
    pushHistory,
  } = useDiagramStore();

  const [showProperties, setShowProperties] = useState(true);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (diagram.classes.length > 0 || diagram.relationships.length > 0) {
        saveDiagram(diagram);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [diagram]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const ctrl = e.ctrlKey || e.metaKey;
    if (ctrl && e.key === 's') {
      e.preventDefault();
      saveDiagram(diagram);
      toast.success('Diagram saved');
    }
    if (ctrl && e.key === 'z') {
      e.preventDefault();
      undo();
    }
    if (ctrl && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) {
      e.preventDefault();
      redo();
    }
    if (ctrl && e.key === 'd') {
      e.preventDefault();
      if (selectedClassId) {
        duplicateClass(selectedClassId);
        toast.success('Class duplicated');
      }
    }
    if (e.key === 'Escape') {
      useDiagramStore.getState().selectClass(null);
      useDiagramStore.getState().selectRelationship(null);
    }
  }, [diagram, undo, redo, selectedClassId, duplicateClass]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleAddClass = useCallback(() => {
    const newClass = addClass();
    toast.success(`Class "${newClass.name}" created`);
    pushHistory();
  }, [addClass, pushHistory]);

  return (
    <div className="flex flex-col h-screen bg-[#0f1117] overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          onAddClass={handleAddClass}
          showProperties={showProperties}
          setShowProperties={setShowProperties}
        />
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-1 overflow-hidden">
            <DiagramCanvas onAddClass={handleAddClass} />
            {showProperties && <PropertiesPanel />}
          </div>
          <JavaCodePanel />
        </div>
      </div>

      {/* Status bar */}
      <div className="h-5 bg-[#252836] border-t border-[#2d3148] flex items-center px-3 gap-3 flex-shrink-0">
        <span className="text-[10px] text-[#3d4166]">{diagram.name}</span>
        <span className="text-[10px] text-[#3d4166]">·</span>
        <span className="text-[10px] text-[#3d4166]">{diagram.classes.length} classes</span>
        <span className="text-[10px] text-[#3d4166]">·</span>
        <span className="text-[10px] text-[#3d4166]">{diagram.relationships.length} relationships</span>
        <div className="flex-1" />
        <span className="text-[10px] text-[#3d4166]">
          Ctrl+S Save · Ctrl+Z Undo · Ctrl+D Duplicate · Del Delete
        </span>
      </div>
    </div>
  );
};

export default Editor;
