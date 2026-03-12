import { getIcon } from '../../utils/iconMap';

export default function NodeLibraryItem({ nodeTypeDef }) {
  const Icon = getIcon(nodeTypeDef.icon);

  const onDragStart = (event) => {
    event.dataTransfer.setData('application/workflow-node-type', nodeTypeDef.key);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-grab active:cursor-grabbing hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
    >
      <div
        className="p-1.5 rounded"
        style={{ backgroundColor: nodeTypeDef.color + '20' }}
      >
        <Icon size={16} style={{ color: nodeTypeDef.color }} strokeWidth={2.5} />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium text-gray-800 leading-tight">
          {nodeTypeDef.label}
        </div>
        <div className="text-[11px] text-gray-500 leading-tight truncate">
          {nodeTypeDef.description}
        </div>
      </div>
    </div>
  );
}
