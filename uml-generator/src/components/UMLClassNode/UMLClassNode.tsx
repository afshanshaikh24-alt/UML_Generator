import React, { memo, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ClassModel } from '../../models';
import { VISIBILITY_SYMBOLS } from '../../utils/helpers';
import { useDiagramStore } from '../../store/diagramStore';

interface UMLNodeData {
  classModel: ClassModel;
}

const UMLClassNode: React.FC<NodeProps<UMLNodeData>> = ({ data, selected }) => {
  const { classModel } = data;
  const { selectClass } = useDiagramStore();

  const handleClick = useCallback(() => {
    selectClass(classModel.id);
  }, [classModel.id, selectClass]);

  const isDark = document.documentElement.classList.contains('dark') ||
    localStorage.getItem('uml-dark-mode') === 'true';

  const bgClass = isDark ? 'bg-[#1e2235]' : 'bg-white';
  const borderClass = isDark ? 'border-[#2d3148]' : 'border-[#cbd5e1]';
  const headerBg = isDark ? 'bg-[#252836]' : 'bg-[#f8fafc]';
  const sectionBg = isDark ? 'bg-[#1a1d27]' : 'bg-[#f1f5f9]';
  const textPrimary = isDark ? 'text-[#e2e8f0]' : 'text-[#0f172a]';
  const textSecondary = isDark ? 'text-[#94a3b8]' : 'text-[#64748b]';

  return (
    <div
      className={`uml-node ${bgClass} border ${borderClass} rounded-lg shadow-lg min-w-[200px] max-w-[280px] cursor-pointer transition-all duration-150 ${selected ? 'uml-node-selected' : ''}`}
      onClick={handleClick}
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      {/* Handles */}
      <Handle type="source" position={Position.Top} id="top" style={{ top: -5 }} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ bottom: -5 }} />
      <Handle type="source" position={Position.Left} id="left" style={{ left: -5 }} />
      <Handle type="source" position={Position.Right} id="right" style={{ right: -5 }} />
      <Handle type="target" position={Position.Top} id="top-t" style={{ top: -5 }} />
      <Handle type="target" position={Position.Bottom} id="bottom-t" style={{ bottom: -5 }} />
      <Handle type="target" position={Position.Left} id="left-t" style={{ left: -5 }} />
      <Handle type="target" position={Position.Right} id="right-t" style={{ right: -5 }} />

      {/* Class Name Header */}
      <div className={`${headerBg} px-3 py-2 rounded-t-lg border-b ${borderClass} text-center`}>
        {classModel.isAbstract && (
          <div className={`text-[10px] italic ${textSecondary}`}>«abstract»</div>
        )}
        {classModel.isInterface && (
          <div className={`text-[10px] italic ${textSecondary}`}>«interface»</div>
        )}
        <div className={`font-semibold text-[13px] ${classModel.isAbstract ? 'italic' : ''} ${textPrimary}`}>
          {classModel.name}
        </div>
        {classModel.packageName && (
          <div className={`text-[9px] ${textSecondary} mt-0.5`}>{classModel.packageName}</div>
        )}
      </div>

      {/* Attributes */}
      <div className={`${sectionBg} px-3 py-1.5 border-b ${borderClass} min-h-[24px]`}>
        {classModel.attributes.length === 0 ? (
          <div className={`text-[10px] italic ${textSecondary} text-center py-0.5`}>no attributes</div>
        ) : (
          classModel.attributes.map((attr) => (
            <div key={attr.id} className={`text-[11px] ${textPrimary} leading-5`}>
              <span className="text-indigo-400">{VISIBILITY_SYMBOLS[attr.visibility]}</span>{' '}
              {attr.isStatic ? <u className="underline">{attr.name}</u> : attr.name}
              {' : '}
              <span className="text-teal-400">{attr.type}</span>
              {attr.isFinal && <span className={`text-[9px] ml-1 ${textSecondary}`}>{'{final}'}</span>}
            </div>
          ))
        )}
      </div>

      {/* Methods */}
      <div className={`${bgClass} px-3 py-1.5 rounded-b-lg min-h-[24px]`}>
        {classModel.methods.length === 0 ? (
          <div className={`text-[10px] italic ${textSecondary} text-center py-0.5`}>no methods</div>
        ) : (
          classModel.methods.map((method) => (
            <div key={method.id} className={`text-[11px] ${textPrimary} leading-5`}>
              <span className="text-indigo-400">{VISIBILITY_SYMBOLS[method.visibility]}</span>{' '}
              {method.isStatic ? <u>{method.name}</u> : method.name}
              {'('}
              <span className={`text-[10px] ${textSecondary}`}>
                {method.parameters.map((p) => `${p.name}:${p.type}`).join(', ')}
              </span>
              {')'}
              {' : '}
              <span className="text-teal-400">{method.returnType}</span>
              {method.isAbstract && <span className={`text-[9px] ml-1 ${textSecondary}`}>{'{abstract}'}</span>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default memo(UMLClassNode);
