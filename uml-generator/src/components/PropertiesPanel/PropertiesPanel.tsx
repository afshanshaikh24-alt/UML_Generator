import React, { useState, useCallback } from 'react';
import { useDiagramStore } from '../../store/diagramStore';
import {
  Plus, Trash2, ChevronUp, ChevronDown, ChevronRight, ChevronDown as ChevronDownIcon
} from 'lucide-react';
import { Attribute, Method, Parameter, Visibility, RelationshipType } from '../../models';
import { COMMON_TYPES } from '../../utils/helpers';
import toast from 'react-hot-toast';

const VISIBILITY_OPTIONS: { value: Visibility; label: string; symbol: string }[] = [
  { value: 'public', label: 'Public', symbol: '+' },
  { value: 'private', label: 'Private', symbol: '-' },
  { value: 'protected', label: 'Protected', symbol: '#' },
  { value: 'package', label: 'Package', symbol: '~' },
];

interface FieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

const Field: React.FC<FieldProps> = ({ label, children, className = '' }) => (
  <div className={`space-y-1 ${className}`}>
    <label className="block text-[11px] font-medium text-[#64748b] uppercase tracking-wide">{label}</label>
    {children}
  </div>
);

const inputCls = "w-full px-2.5 py-1.5 bg-[#0f1117] border border-[#2d3148] rounded-md text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors placeholder-[#3d4166]";
const selectCls = "w-full px-2.5 py-1.5 bg-[#0f1117] border border-[#2d3148] rounded-md text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors";
const checkboxLabelCls = "flex items-center gap-1.5 text-xs text-[#94a3b8] cursor-pointer select-none";

interface AttributeRowProps {
  classId: string;
  attr: Attribute;
  index: number;
  total: number;
}

const AttributeRow: React.FC<AttributeRowProps> = ({ classId, attr, index, total }) => {
  const { updateAttribute, deleteAttribute, moveAttribute, pushHistory } = useDiagramStore();

  const update = useCallback((updates: Partial<Attribute>) => {
    updateAttribute(classId, attr.id, updates);
  }, [classId, attr.id, updateAttribute]);

  return (
    <div className="bg-[#0f1117] border border-[#2d3148] rounded-lg p-2.5 space-y-2 animate-fadeIn">
      <div className="flex items-center gap-1.5">
        <select
          value={attr.visibility}
          onChange={(e) => update({ visibility: e.target.value as Visibility })}
          className="w-20 px-2 py-1.5 bg-[#1a1d27] border border-[#2d3148] rounded text-indigo-400 text-xs focus:outline-none"
          title="Visibility"
        >
          {VISIBILITY_OPTIONS.map((v) => (
            <option key={v.value} value={v.value}>{v.symbol} {v.label}</option>
          ))}
        </select>
        <input
          value={attr.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="name"
          className="flex-1 px-2 py-1.5 bg-[#1a1d27] border border-[#2d3148] rounded text-white text-xs focus:outline-none focus:border-indigo-500"
        />
        <span className="text-[#64748b] text-xs">:</span>
        <input
          value={attr.type}
          onChange={(e) => update({ type: e.target.value })}
          placeholder="type"
          list={`types-${attr.id}`}
          className="w-24 px-2 py-1.5 bg-[#1a1d27] border border-[#2d3148] rounded text-teal-400 text-xs focus:outline-none focus:border-indigo-500"
        />
        <datalist id={`types-${attr.id}`}>
          {COMMON_TYPES.map((t) => <option key={t} value={t} />)}
        </datalist>
        <div className="flex gap-0.5">
          <button
            onClick={() => moveAttribute(classId, attr.id, 'up')}
            disabled={index === 0}
            className="p-1 text-[#64748b] hover:text-white disabled:opacity-30 transition-colors"
            title="Move Up"
          >
            <ChevronUp size={12} />
          </button>
          <button
            onClick={() => moveAttribute(classId, attr.id, 'down')}
            disabled={index === total - 1}
            className="p-1 text-[#64748b] hover:text-white disabled:opacity-30 transition-colors"
            title="Move Down"
          >
            <ChevronDown size={12} />
          </button>
          <button
            onClick={() => { pushHistory(); deleteAttribute(classId, attr.id); }}
            className="p-1 text-[#ef4444] hover:text-red-300 transition-colors"
            title="Delete Attribute"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-3 pl-1">
        <label className={checkboxLabelCls}>
          <input
            type="checkbox"
            checked={attr.isStatic}
            onChange={(e) => update({ isStatic: e.target.checked })}
            className="accent-indigo-500"
          />
          Static
        </label>
        <label className={checkboxLabelCls}>
          <input
            type="checkbox"
            checked={attr.isFinal}
            onChange={(e) => update({ isFinal: e.target.checked })}
            className="accent-indigo-500"
          />
          Final
        </label>
        <div className="flex items-center gap-1 flex-1">
          <span className="text-[11px] text-[#64748b]">Default:</span>
          <input
            value={attr.defaultValue}
            onChange={(e) => update({ defaultValue: e.target.value })}
            placeholder="value"
            className="flex-1 px-2 py-0.5 bg-[#1a1d27] border border-[#2d3148] rounded text-amber-400 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>
    </div>
  );
};

interface ParameterRowProps {
  classId: string;
  methodId: string;
  param: Parameter;
}

const ParameterRow: React.FC<ParameterRowProps> = ({ classId, methodId, param }) => {
  const { updateParameter, deleteParameter } = useDiagramStore();
  return (
    <div className="flex items-center gap-1.5 pl-4">
      <div className="w-1 h-1 rounded-full bg-[#4a5568] flex-shrink-0" />
      <input
        value={param.name}
        onChange={(e) => updateParameter(classId, methodId, param.id, { name: e.target.value })}
        placeholder="name"
        className="flex-1 px-2 py-1 bg-[#0f1117] border border-[#2d3148] rounded text-white text-xs focus:outline-none focus:border-indigo-500"
      />
      <span className="text-[#64748b] text-xs">:</span>
      <input
        value={param.type}
        onChange={(e) => updateParameter(classId, methodId, param.id, { type: e.target.value })}
        placeholder="type"
        list="common-types"
        className="w-24 px-2 py-1 bg-[#0f1117] border border-[#2d3148] rounded text-teal-400 text-xs focus:outline-none focus:border-indigo-500"
      />
      <button
        onClick={() => deleteParameter(classId, methodId, param.id)}
        className="p-0.5 text-[#ef4444] hover:text-red-300 transition-colors"
      >
        <Trash2 size={11} />
      </button>
    </div>
  );
};

interface MethodRowProps {
  classId: string;
  method: Method;
  isInterface: boolean;
}

const MethodRow: React.FC<MethodRowProps> = ({ classId, method, isInterface }) => {
  const { updateMethod, deleteMethod, addParameter, pushHistory } = useDiagramStore();
  const [expanded, setExpanded] = useState(false);

  const update = useCallback((updates: Partial<Method>) => {
    updateMethod(classId, method.id, updates);
  }, [classId, method.id, updateMethod]);

  return (
    <div className="bg-[#0f1117] border border-[#2d3148] rounded-lg p-2.5 space-y-2 animate-fadeIn">
      <div className="flex items-center gap-1.5">
        <select
          value={method.visibility}
          onChange={(e) => update({ visibility: e.target.value as Visibility })}
          className="w-20 px-2 py-1.5 bg-[#1a1d27] border border-[#2d3148] rounded text-indigo-400 text-xs focus:outline-none"
        >
          {VISIBILITY_OPTIONS.map((v) => (
            <option key={v.value} value={v.value}>{v.symbol} {v.label}</option>
          ))}
        </select>
        <input
          value={method.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="methodName"
          className="flex-1 px-2 py-1.5 bg-[#1a1d27] border border-[#2d3148] rounded text-white text-xs focus:outline-none focus:border-indigo-500"
        />
        <span className="text-[#64748b] text-xs">:</span>
        <input
          value={method.returnType}
          onChange={(e) => update({ returnType: e.target.value })}
          placeholder="return"
          list="common-types-ret"
          className="w-20 px-2 py-1.5 bg-[#1a1d27] border border-[#2d3148] rounded text-teal-400 text-xs focus:outline-none focus:border-indigo-500"
        />
        <datalist id="common-types-ret">
          <option value="void" /><option value="int" /><option value="String" /><option value="boolean" />
          <option value="double" /><option value="long" /><option value="List" /><option value="Object" />
        </datalist>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1 text-[#64748b] hover:text-white transition-colors"
          title="Expand/Collapse"
        >
          {expanded ? <ChevronDownIcon size={12} /> : <ChevronRight size={12} />}
        </button>
        <button
          onClick={() => { pushHistory(); deleteMethod(classId, method.id); }}
          className="p-1 text-[#ef4444] hover:text-red-300 transition-colors"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {expanded && (
        <div className="space-y-1.5 pt-1 border-t border-[#2d3148]">
          <div className="flex items-center gap-3 pl-1">
            <label className={checkboxLabelCls}>
              <input
                type="checkbox"
                checked={method.isStatic}
                onChange={(e) => update({ isStatic: e.target.checked })}
                className="accent-indigo-500"
              />
              Static
            </label>
            {!isInterface && (
              <label className={checkboxLabelCls}>
                <input
                  type="checkbox"
                  checked={method.isAbstract}
                  onChange={(e) => update({ isAbstract: e.target.checked })}
                  className="accent-indigo-500"
                />
                Abstract
              </label>
            )}
            <label className={checkboxLabelCls}>
              <input
                type="checkbox"
                checked={method.isFinal}
                onChange={(e) => update({ isFinal: e.target.checked })}
                className="accent-indigo-500"
              />
              Final
            </label>
          </div>

          {/* Parameters */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#64748b] uppercase tracking-wide">Parameters</span>
              <button
                onClick={() => addParameter(classId, method.id)}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <Plus size={10} /> Add Param
              </button>
            </div>
            {method.parameters.map((p) => (
              <ParameterRow key={p.id} classId={classId} methodId={method.id} param={p} />
            ))}
            {method.parameters.length === 0 && (
              <p className="text-[10px] text-[#4a5568] italic pl-4">No parameters</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const PropertiesPanel: React.FC = () => {
  const {
    diagram,
    selectedClassId,
    selectedRelationshipId,
    updateClass,
    addAttribute,
    addMethod,
    deleteClass,
    duplicateClass,
    deleteRelationship,
    updateRelationship,
    pushHistory,
  } = useDiagramStore();

  const [activeTab, setActiveTab] = useState<'class' | 'attrs' | 'methods'>('class');

  const selectedClass = diagram.classes.find((c) => c.id === selectedClassId);
  const selectedRel = diagram.relationships.find((r) => r.id === selectedRelationshipId);
  const sourceClass = selectedRel ? diagram.classes.find((c) => c.id === selectedRel.sourceId) : null;
  const targetClass = selectedRel ? diagram.classes.find((c) => c.id === selectedRel.targetId) : null;

  if (!selectedClass && !selectedRel) {
    return (
      <div className="w-72 bg-[#1a1d27] border-l border-[#2d3148] flex flex-col items-center justify-center text-center p-6">
        <div className="text-4xl mb-3 opacity-20">◻</div>
        <p className="text-[#64748b] text-sm">Select a class or relationship to edit its properties</p>
      </div>
    );
  }

  // Relationship properties
  if (selectedRel) {
    const relTypeOptions = [
      'association', 'directed-association', 'inheritance', 'aggregation',
      'composition', 'dependency', 'realization',
    ] as const;
    const multOptions = ['', '1', '0..1', '*', '0..*', '1..*'];
    return (
      <div className="w-72 bg-[#1a1d27] border-l border-[#2d3148] overflow-y-auto flex flex-col">
        <div className="px-4 py-3 border-b border-[#2d3148]">
          <h3 className="text-white font-semibold text-sm">Relationship</h3>
          <p className="text-[#64748b] text-xs">{sourceClass?.name} → {targetClass?.name}</p>
        </div>
        <div className="p-4 space-y-4">
          <Field label="Type">
            <select
              value={selectedRel.type}
              onChange={(e) => updateRelationship(selectedRel.id, { type: e.target.value as RelationshipType })}
              className={selectCls}
            >
              {relTypeOptions.map((t) => (
                <option key={t} value={t}>{t.replace('-', ' ')}</option>
              ))}
            </select>
          </Field>
          <Field label="Label">
            <input
              value={selectedRel.label}
              onChange={(e) => updateRelationship(selectedRel.id, { label: e.target.value })}
              placeholder="relationship label"
              className={inputCls}
            />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Source Mult.">
              <select
                value={selectedRel.sourceMultiplicity}
                onChange={(e) => updateRelationship(selectedRel.id, { sourceMultiplicity: e.target.value })}
                className={selectCls}
              >
                {multOptions.map((m) => <option key={m} value={m}>{m || '(none)'}</option>)}
              </select>
            </Field>
            <Field label="Target Mult.">
              <select
                value={selectedRel.targetMultiplicity}
                onChange={(e) => updateRelationship(selectedRel.id, { targetMultiplicity: e.target.value })}
                className={selectCls}
              >
                {multOptions.map((m) => <option key={m} value={m}>{m || '(none)'}</option>)}
              </select>
            </Field>
          </div>
          <button
            onClick={() => { deleteRelationship(selectedRel.id); toast.success('Relationship deleted'); }}
            className="w-full px-3 py-2 bg-red-600/20 border border-red-600/40 text-red-400 rounded-lg text-xs font-medium hover:bg-red-600/30 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 size={13} /> Delete Relationship
          </button>
        </div>
      </div>
    );
  }

  // Class properties
  if (!selectedClass) return null;

  const implementsStr = selectedClass.implementsInterfaces.join(', ');

  return (
    <div className="w-72 bg-[#1a1d27] border-l border-[#2d3148] flex flex-col overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-[#2d3148]">
        {(['class', 'attrs', 'methods'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
              activeTab === tab
                ? 'text-indigo-400 border-b-2 border-indigo-500'
                : 'text-[#64748b] hover:text-[#94a3b8]'
            }`}
          >
            {tab === 'class' ? 'Class' : tab === 'attrs' ? `Attrs (${selectedClass.attributes.length})` : `Methods (${selectedClass.methods.length})`}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Class Tab */}
        {activeTab === 'class' && (
          <div className="space-y-3 animate-slideIn">
            <Field label="Class Name">
              <input
                value={selectedClass.name}
                onChange={(e) => updateClass(selectedClass.id, { name: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Package">
              <input
                value={selectedClass.packageName}
                onChange={(e) => updateClass(selectedClass.id, { packageName: e.target.value })}
                placeholder="com.example.model"
                className={inputCls}
              />
            </Field>
            <Field label="Extends">
              <input
                value={selectedClass.extendsClass}
                onChange={(e) => updateClass(selectedClass.id, { extendsClass: e.target.value })}
                placeholder="ParentClass"
                className={inputCls}
              />
            </Field>
            <Field label="Implements">
              <input
                value={implementsStr}
                onChange={(e) => updateClass(selectedClass.id, {
                  implementsInterfaces: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                })}
                placeholder="Interface1, Interface2"
                className={inputCls}
              />
            </Field>
            <div className="space-y-2">
              <label className="block text-[11px] font-medium text-[#64748b] uppercase tracking-wide">Modifiers</label>
              <div className="space-y-1.5 bg-[#0f1117] rounded-lg p-2.5 border border-[#2d3148]">
                <label className={checkboxLabelCls}>
                  <input
                    type="checkbox"
                    checked={selectedClass.isAbstract}
                    onChange={(e) => updateClass(selectedClass.id, { isAbstract: e.target.checked })}
                    className="accent-indigo-500"
                  />
                  Abstract Class
                </label>
                <label className={checkboxLabelCls}>
                  <input
                    type="checkbox"
                    checked={selectedClass.isFinal}
                    onChange={(e) => updateClass(selectedClass.id, { isFinal: e.target.checked })}
                    className="accent-indigo-500"
                  />
                  Final Class
                </label>
                <label className={checkboxLabelCls}>
                  <input
                    type="checkbox"
                    checked={selectedClass.isInterface}
                    onChange={(e) => updateClass(selectedClass.id, { isInterface: e.target.checked })}
                    className="accent-indigo-500"
                  />
                  Interface
                </label>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => { duplicateClass(selectedClass.id); toast.success(`Duplicated ${selectedClass.name}`); }}
                className="flex-1 px-2 py-1.5 bg-[#252836] border border-[#2d3148] text-[#94a3b8] rounded text-xs hover:bg-[#2d3148] transition-colors"
              >
                Duplicate
              </button>
              <button
                onClick={() => { deleteClass(selectedClass.id); toast.success('Class deleted'); }}
                className="flex-1 px-2 py-1.5 bg-red-600/20 border border-red-600/40 text-red-400 rounded text-xs hover:bg-red-600/30 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Attributes Tab */}
        {activeTab === 'attrs' && (
          <div className="space-y-2 animate-slideIn">
            <button
              onClick={() => addAttribute(selectedClass.id)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600/20 border border-indigo-600/40 text-indigo-400 rounded-lg text-xs font-medium hover:bg-indigo-600/30 transition-colors"
            >
              <Plus size={13} /> Add Attribute
            </button>
            {selectedClass.attributes.map((attr, i) => (
              <AttributeRow
                key={attr.id}
                classId={selectedClass.id}
                attr={attr}
                index={i}
                total={selectedClass.attributes.length}
              />
            ))}
            {selectedClass.attributes.length === 0 && (
              <p className="text-center text-[#64748b] text-xs py-4 italic">No attributes yet</p>
            )}
          </div>
        )}

        {/* Methods Tab */}
        {activeTab === 'methods' && (
          <div className="space-y-2 animate-slideIn">
            <button
              onClick={() => addMethod(selectedClass.id)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600/20 border border-indigo-600/40 text-indigo-400 rounded-lg text-xs font-medium hover:bg-indigo-600/30 transition-colors"
            >
              <Plus size={13} /> Add Method
            </button>
            {selectedClass.methods.map((method) => (
              <MethodRow
                key={method.id}
                classId={selectedClass.id}
                method={method}
                isInterface={selectedClass.isInterface}
              />
            ))}
            {selectedClass.methods.length === 0 && (
              <p className="text-center text-[#64748b] text-xs py-4 italic">No methods yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPanel;
