import { GripVertical } from 'lucide-react';
import { NODE_TYPES, NODE_TYPE_KEYS } from '../../constants/nodeTypes';
import NodeLibraryItem from './NodeLibraryItem';

export default function NodeLibrary() {
  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="px-3 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <GripVertical size={16} className="text-gray-400" />
          Node Library
        </div>
        <p className="text-[11px] text-gray-400 mt-1">
          Drag nodes onto the canvas
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {NODE_TYPE_KEYS.map((key) => (
          <NodeLibraryItem key={key} nodeTypeDef={NODE_TYPES[key]} />
        ))}
      </div>
    </div>
  );
}
