import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { NODE_TYPES } from '../constants/nodeTypes';
import { generateId } from '../utils/idGenerator';
import useWorkflowStore from '../store/useWorkflowStore';

export default function useDragAndDrop() {
  const { screenToFlowPosition } = useReactFlow();
  const addNode = useWorkflowStore((s) => s.addNode);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const nodeType = event.dataTransfer.getData('application/workflow-node-type');
      if (!nodeType || !NODE_TYPES[nodeType]) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: generateId(),
        type: nodeType,
        position,
        data: { ...NODE_TYPES[nodeType].defaultData },
      };

      addNode(newNode);
    },
    [screenToFlowPosition, addNode]
  );

  return { onDragOver, onDrop };
}
