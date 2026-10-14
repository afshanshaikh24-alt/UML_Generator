import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Connection,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  MarkerType,
  EdgeMarker,
  ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useDiagramStore } from '../../store/diagramStore';
import UMLClassNode from '../UMLClassNode/UMLClassNode';
import RelationshipDialog from '../RelationshipDialog/RelationshipDialog';
import { ClassModel, Relationship, RelationshipType } from '../../models';
import toast from 'react-hot-toast';

const nodeTypes = { umlClass: UMLClassNode };

function getEdgeStyle(type: RelationshipType): {
  style: React.CSSProperties;
  markerEnd?: EdgeMarker;
  markerStart?: EdgeMarker;
  animated?: boolean;
  label?: string;
} {
  const darkLine = '#6366f1';
  switch (type) {
    case 'inheritance':
      return {
        style: { stroke: darkLine, strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: darkLine },
      };
    case 'realization':
      return {
        style: { stroke: darkLine, strokeWidth: 2, strokeDasharray: '5 3' },
        markerEnd: { type: MarkerType.ArrowClosed, color: darkLine },
        animated: false,
      };
    case 'dependency':
      return {
        style: { stroke: '#f59e0b', strokeWidth: 1.5, strokeDasharray: '4 3' },
        markerEnd: { type: MarkerType.Arrow, color: '#f59e0b' },
      };
    case 'composition':
      return {
        style: { stroke: '#10b981', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
        markerStart: { type: MarkerType.ArrowClosed, color: '#10b981' },
      };
    case 'aggregation':
      return {
        style: { stroke: '#60a5fa', strokeWidth: 2 },
        markerEnd: { type: MarkerType.Arrow, color: '#60a5fa' },
      };
    case 'directed-association':
      return {
        style: { stroke: '#94a3b8', strokeWidth: 1.5 },
        markerEnd: { type: MarkerType.Arrow, color: '#94a3b8' },
      };
    case 'association':
    default:
      return {
        style: { stroke: '#94a3b8', strokeWidth: 1.5 },
      };
  }
}

function classesToNodes(classes: ClassModel[]): Node[] {
  return classes.map((cls) => ({
    id: cls.id,
    type: 'umlClass',
    position: cls.position,
    data: { classModel: cls },
    selected: false,
  }));
}

function relationshipsToEdges(relationships: Relationship[]): Edge[] {
  return relationships.map((rel) => {
    const edgeStyle = getEdgeStyle(rel.type);
    let labelText = '';
    if (rel.label) labelText += rel.label;
    if (rel.sourceMultiplicity || rel.targetMultiplicity) {
      labelText += labelText ? '\n' : '';
      if (rel.sourceMultiplicity) labelText += `[${rel.sourceMultiplicity}] `;
      if (rel.targetMultiplicity) labelText += `→ [${rel.targetMultiplicity}]`;
    }
    return {
      id: rel.id,
      source: rel.sourceId,
      target: rel.targetId,
      ...edgeStyle,
      label: labelText || undefined,
      labelStyle: { fill: '#94a3b8', fontSize: 11, fontFamily: 'Inter, sans-serif' },
      labelBgStyle: { fill: 'transparent' },
      data: { relationship: rel },
    };
  });
}

interface DiagramCanvasProps {
  onAddClass: () => void;
}

const DiagramCanvas: React.FC<DiagramCanvasProps> = ({ onAddClass }) => {
  const {
    diagram,
    selectedClassId,
    selectedRelationshipId,
    selectClass,
    selectRelationship,
    updateClassPosition,
    addRelationship,
    deleteRelationship,
    deleteClass,
  } = useDiagramStore();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [relDialog, setRelDialog] = useState<{ open: boolean; sourceId: string; targetId: string }>({
    open: false, sourceId: '', targetId: '',
  });
  const rfInstanceRef = useRef<ReactFlowInstance | null>(null);

  // Sync nodes from diagram
  useEffect(() => {
    setNodes(classesToNodes(diagram.classes));
  }, [diagram.classes]);

  // Sync edges from diagram
  useEffect(() => {
    setEdges(relationshipsToEdges(diagram.relationships));
  }, [diagram.relationships]);

  const onConnect = useCallback((connection: Connection) => {
    if (!connection.source || !connection.target) return;
    if (connection.source === connection.target) {
      toast.error('Cannot connect a class to itself');
      return;
    }
    setRelDialog({ open: true, sourceId: connection.source, targetId: connection.target });
  }, []);

  const onNodeDragStop = useCallback((_: React.MouseEvent, node: Node) => {
    updateClassPosition(node.id, node.position.x, node.position.y);
  }, [updateClassPosition]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    selectClass(node.id);
  }, [selectClass]);

  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    selectRelationship(edge.id);
  }, [selectRelationship]);

  const onPaneClick = useCallback(() => {
    selectClass(null);
    selectRelationship(null);
  }, [selectClass, selectRelationship]);

  const handleRelationshipSave = useCallback((
    type: RelationshipType,
    label: string,
    sourceMultiplicity: string,
    targetMultiplicity: string
  ) => {
    addRelationship({
      sourceId: relDialog.sourceId,
      targetId: relDialog.targetId,
      type,
      label,
      sourceMultiplicity,
      targetMultiplicity,
    });
    setRelDialog({ open: false, sourceId: '', targetId: '' });
    toast.success('Relationship added');
  }, [relDialog, addRelationship]);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (selectedClassId) {
        deleteClass(selectedClassId);
        toast.success('Class deleted');
      }
      if (selectedRelationshipId) {
        deleteRelationship(selectedRelationshipId);
        toast.success('Relationship deleted');
      }
    }
  }, [selectedClassId, selectedRelationshipId, deleteClass, deleteRelationship]);

  const onInit = useCallback((rf: ReactFlowInstance) => {
    rfInstanceRef.current = rf;
  }, []);

  const fitView = useCallback(() => {
    rfInstanceRef.current?.fitView({ padding: 0.1, duration: 400 });
  }, []);

  // Expose fitView through ref would require forwardRef; instead use a global event
  useEffect(() => {
    const handler = () => fitView();
    window.addEventListener('uml-fit-view', handler);
    return () => window.removeEventListener('uml-fit-view', handler);
  }, [fitView]);

  return (
    <div className="relative flex-1 h-full" tabIndex={0} onKeyDown={onKeyDown}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        onInit={onInit}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        deleteKeyCode={null}
        className="bg-[#0f1117]"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#2d3148" />
        <Controls className="!bottom-4 !left-4" />
        <MiniMap
          nodeColor="#252836"
          maskColor="rgba(15, 17, 23, 0.7)"
          className="!bottom-4 !right-4"
        />
      </ReactFlow>

      {/* Empty state overlay */}
      {diagram.classes.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-center animate-fadeIn">
            <div className="text-6xl mb-4 opacity-20">⬡</div>
            <p className="text-[#94a3b8] text-lg font-medium mb-2">Canvas is empty</p>
            <p className="text-[#64748b] text-sm">Click "+ Add Class" to start designing your diagram</p>
          </div>
        </div>
      )}

      {/* Relationship Dialog */}
      {relDialog.open && (
        <RelationshipDialog
          sourceId={relDialog.sourceId}
          targetId={relDialog.targetId}
          onSave={handleRelationshipSave}
          onClose={() => setRelDialog({ open: false, sourceId: '', targetId: '' })}
        />
      )}
    </div>
  );
};

export default DiagramCanvas;
