import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, ArrowLeft, Code2, Layers, GitBranch, Database, Monitor, Zap } from 'lucide-react';

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      {/* Nav */}
      <nav className="border-b border-[#2d3148] px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[#64748b] hover:text-white transition-colors text-sm"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Box size={14} className="text-white" />
          </div>
          <span className="text-white font-bold text-sm">UML Generator</span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-600/30">
            <Box size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">UML Class Diagram Generator</h1>
          <p className="text-[#94a3b8] text-lg">
            Visually design software architecture and automatically generate Java source code.
          </p>
        </div>

        {/* Purpose */}
        <div className="bg-[#1a1d27] border border-[#2d3148] rounded-2xl p-6 mb-6">
          <h2 className="text-white font-semibold text-base mb-3">Purpose</h2>
          <p className="text-[#94a3b8] text-sm leading-relaxed">
            This application bridges the gap between software design and implementation.
            Engineers can visually create UML class diagrams — specifying classes, attributes, methods,
            and relationships — and instantly generate corresponding Java source code with proper modifiers,
            constructors, getters, setters, and inheritance structures.
          </p>
        </div>

        {/* Tech Stack */}
        <div className="bg-[#1a1d27] border border-[#2d3148] rounded-2xl p-6 mb-6">
          <h2 className="text-white font-semibold text-base mb-4">Technology Stack</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { icon: <Code2 size={16} />, name: 'React 18', desc: 'UI Framework' },
              { icon: <Zap size={16} />, name: 'TypeScript', desc: 'Type Safety' },
              { icon: <Monitor size={16} />, name: 'Vite', desc: 'Build Tool' },
              { icon: <Layers size={16} />, name: 'React Flow', desc: 'Diagram Canvas' },
              { icon: <GitBranch size={16} />, name: 'Zustand', desc: 'State Management' },
              { icon: <Database size={16} />, name: 'LocalStorage', desc: 'Persistence' },
            ].map((tech) => (
              <div key={tech.name} className="flex items-center gap-3 bg-[#252836] rounded-xl p-3">
                <div className="text-indigo-400">{tech.icon}</div>
                <div>
                  <div className="text-white text-sm font-medium">{tech.name}</div>
                  <div className="text-[#64748b] text-xs">{tech.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="bg-[#1a1d27] border border-[#2d3148] rounded-2xl p-6 mb-6">
          <h2 className="text-white font-semibold text-base mb-4">Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              'Visual UML class diagram editor',
              'Drag-and-drop class positioning',
              'Add attributes with types & modifiers',
              'Add methods with parameters',
              '7 UML relationship types',
              'Automatic Java code generation',
              'Constructors & getters/setters',
              'Download Java files & ZIP',
              'JSON export & import',
              'LocalStorage persistence',
              'Undo & redo history',
              'Dark mode',
              'Keyboard shortcuts',
              'Duplicate classes',
              'Relationship labels & multiplicities',
              'Example diagrams included',
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-[#94a3b8]">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="bg-[#1a1d27] border border-[#2d3148] rounded-2xl p-6 mb-6">
          <h2 className="text-white font-semibold text-base mb-4">Keyboard Shortcuts</h2>
          <div className="space-y-2">
            {[
              { keys: 'Ctrl + S', action: 'Save diagram' },
              { keys: 'Ctrl + Z', action: 'Undo' },
              { keys: 'Ctrl + Y', action: 'Redo' },
              { keys: 'Ctrl + D', action: 'Duplicate selected class' },
              { keys: 'Delete', action: 'Delete selected class or relationship' },
              { keys: 'Escape', action: 'Deselect' },
            ].map((sc) => (
              <div key={sc.keys} className="flex items-center justify-between text-sm">
                <span className="text-[#94a3b8]">{sc.action}</span>
                <kbd className="bg-[#252836] border border-[#2d3148] rounded px-2 py-0.5 text-xs text-white font-mono">{sc.keys}</kbd>
              </div>
            ))}
          </div>
        </div>

        {/* Installation */}
        <div className="bg-[#1a1d27] border border-[#2d3148] rounded-2xl p-6">
          <h2 className="text-white font-semibold text-base mb-4">Running Locally</h2>
          <div className="space-y-2">
            {['npm install', 'npm run dev', 'npm run build'].map((cmd) => (
              <div key={cmd} className="bg-[#0f1117] rounded-lg px-4 py-2.5 font-mono text-sm text-emerald-400 border border-[#2d3148]">
                $ {cmd}
              </div>
            ))}
          </div>
          <p className="text-[#64748b] text-xs mt-3">Requires Node.js 18+ and npm.</p>
        </div>

        <div className="text-center mt-10 text-[#3d4166] text-xs">
          Open Source · No backend required · Works completely offline
        </div>
      </div>
    </div>
  );
};

export default About;
