import React, { useState } from 'react';
import { RelationshipType } from '../../models';
import { useDiagramStore } from '../../store/diagramStore';
import { X } from 'lucide-react';

interface RelationshipDialogProps {
  sourceId: string;
  targetId: string;
  onSave: (type: RelationshipType, label: string, sourceMultiplicity: string, targetMultiplicity: string) => void;
  onClose: () => void;
}

const RELATIONSHIP_TYPES: { value: RelationshipType; label: string; description: string; color: string }[] = [
  { value: 'association', label: 'Association', description: 'General relationship', color: '#94a3b8' },
  { value: 'directed-association', label: 'Directed Association', description: 'One-way relationship', color: '#94a3b8' },
  { value: 'inheritance', label: 'Inheritance', description: 'Extends (is-a relationship)', color: '#6366f1' },
  { value: 'aggregation', label: 'Aggregation', description: 'Has-a (weak ownership)', color: '#60a5fa' },
  { value: 'composition', label: 'Composition', description: 'Contains (strong ownership)', color: '#10b981' },
  { value: 'dependency', label: 'Dependency', description: 'Uses (weak dependency)', color: '#f59e0b' },
  { value: 'realization', label: 'Realization', description: 'Implements interface', color: '#a78bfa' },
];

const MULTIPLICITY_OPTIONS = ['', '1', '0..1', '*', '0..*', '1..*', '1..n', 'n'];

const RelationshipDialog: React.FC<RelationshipDialogProps> = ({ sourceId, targetId, onSave, onClose }) => {
  const { diagram } = useDiagramStore();
  const [type, setType] = useState<RelationshipType>('association');
  const [label, setLabel] = useState('');
  const [sourceMultiplicity, setSourceMultiplicity] = useState('');
  const [targetMultiplicity, setTargetMultiplicity] = useState('');

  const sourceClass = diagram.classes.find((c) => c.id === sourceId);
  const targetClass = diagram.classes.find((c) => c.id === targetId);

  const handleSave = () => {
    onSave(type, label, sourceMultiplicity, targetMultiplicity);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1a1d27] border border-[#2d3148] rounded-xl shadow-2xl w-[480px] max-h-[90vh] overflow-y-auto animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2d3148]">
          <div>
            <h2 className="text-white font-semibold text-base">Add Relationship</h2>
            <p className="text-[#64748b] text-xs mt-0.5">
              {sourceClass?.name ?? 'Source'} → {targetClass?.name ?? 'Target'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#64748b] hover:text-white transition-colors p-1 rounded"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Relationship Type */}
          <div>
            <label className="block text-xs font-medium text-[#94a3b8] mb-2">Relationship Type</label>
            <div className="grid grid-cols-1 gap-1.5">
              {RELATIONSHIP_TYPES.map((rt) => (
                <button
                  key={rt.value}
                  onClick={() => setType(rt.value)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg border text-left transition-all ${
                    type === rt.value
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-[#2d3148] bg-[#252836] hover:border-[#3d4166]'
                  }`}
                >
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: rt.color }} />
                  <div>
                    <div className="text-sm font-medium text-white">{rt.label}</div>
                    <div className="text-xs text-[#64748b]">{rt.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Label */}
          <div>
            <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">
              Label <span className="text-[#64748b]">(optional)</span>
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., places, contains, extends..."
              className="w-full px-3 py-2 bg-[#252836] border border-[#2d3148] rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder-[#4a5568]"
            />
          </div>

          {/* Multiplicities */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">
                Source Multiplicity
              </label>
              <select
                value={sourceMultiplicity}
                onChange={(e) => setSourceMultiplicity(e.target.value)}
                className="w-full px-3 py-2 bg-[#252836] border border-[#2d3148] rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
              >
                {MULTIPLICITY_OPTIONS.map((m) => (
                  <option key={m} value={m}>{m || '(none)'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">
                Target Multiplicity
              </label>
              <select
                value={targetMultiplicity}
                onChange={(e) => setTargetMultiplicity(e.target.value)}
                className="w-full px-3 py-2 bg-[#252836] border border-[#2d3148] rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
              >
                {MULTIPLICITY_OPTIONS.map((m) => (
                  <option key={m} value={m}>{m || '(none)'}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 py-4 border-t border-[#2d3148]">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-[#252836] border border-[#2d3148] text-[#94a3b8] rounded-lg text-sm hover:bg-[#2d3148] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-500 transition-colors"
          >
            Add Relationship
          </button>
        </div>
      </div>
    </div>
  );
};

export default RelationshipDialog;
