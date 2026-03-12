import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
} from '@xyflow/react';
import useWorkflowStore from '../../store/useWorkflowStore';
import useDragAndDrop from '../../hooks/useDragAndDrop';
import { nodeTypeMap } from '../CustomNodes/nodeTypeMap';
import { NODE_TYPES } from '../../constants/nodeTypes';

function miniMapNodeColor(node) {
  const typeDef = NODE_TYPES[node.type];
  return typeDef ? typeDef.color : '#999';
}

export default function WorkflowCanvas() {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const onNodesChange = useWorkflowStore((s) => s.onNodesChange);
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange);
  const onConnect = useWorkflowStore((s) => s.onConnect);
  const selectNode = useWorkflowStore((s) => s.selectNode);
  const deleteNode = useWorkflowStore((s) => s.deleteNode);
  const { onDragOver, onDrop } = useDragAndDrop();
  const canvasRef = useRef(null);

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  const onNodeClick = useCallback(
    (_event, node) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const onKeyDown = useCallback(
    (event) => {
      if ((event.key === 'Delete' || event.key === 'Backspace') && document.activeElement === event.target) {
        const selectedNodeId = useWorkflowStore.getState().selectedNodeId;
        if (selectedNodeId) {
          deleteNode(selectedNodeId);
        }
      }
    },
    [deleteNode]
  );

  return (
    <div ref={canvasRef} className="h-full w-full" id="workflow-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onPaneClick={onPaneClick}
        onNodeClick={onNodeClick}
        onKeyDown={onKeyDown}
        nodeTypes={nodeTypeMap}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { strokeWidth: 2, stroke: '#94a3b8' },
        }}
        fitView
        proOptions={{ hideAttribution: true }}
        className="bg-gray-50"
      >
        <Background variant="dots" gap={20} size={1} color="#d1d5db" />
        <Controls position="bottom-right" />
        <MiniMap
          nodeColor={miniMapNodeColor}
          nodeStrokeWidth={2}
          pannable
          zoomable
          position="bottom-right"
          style={{ marginBottom: 50 }}
        />
      </ReactFlow>
    </div>
  );
}
