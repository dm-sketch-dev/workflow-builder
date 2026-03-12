import { Handle, Position } from '@xyflow/react';
import { User, Database } from 'lucide-react';
import { getIcon } from '../../utils/iconMap';
import useWorkflowStore from '../../store/useWorkflowStore';

const autonomyLabels = {
  full: 'Full Auto',
  supervised: 'Supervised',
  'human-in-loop': 'Human-in-Loop',
  manual: 'Manual',
};

const riskColors = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
  critical: 'bg-red-200 text-red-900',
};

export default function BaseNode({ id, data, selected, nodeTypeDef }) {
  const selectNode = useWorkflowStore((s) => s.selectNode);
  const Icon = getIcon(nodeTypeDef.icon);
  const { handleConfig } = nodeTypeDef;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        selectNode(id);
      }}
      className="relative"
      style={{ minWidth: 200 }}
    >
      {handleConfig.targets > 0 && (
        <Handle
          type="target"
          position={Position.Top}
          className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white"
        />
      )}

      <div
        className="rounded-lg shadow-sm transition-shadow"
        style={{
          backgroundColor: nodeTypeDef.bgColor,
          border: `2px solid ${selected ? '#3b82f6' : nodeTypeDef.borderColor}`,
          boxShadow: selected ? '0 0 0 2px rgba(59, 130, 246, 0.3)' : undefined,
        }}
      >
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-t-md"
          style={{ backgroundColor: nodeTypeDef.color + '20' }}
        >
          <Icon
            size={18}
            style={{ color: nodeTypeDef.color }}
            strokeWidth={2.5}
          />
          <span className="font-semibold text-sm text-gray-900 truncate">
            {data.label}
          </span>
        </div>

        <div className="px-3 py-2 space-y-1">
          {data.owner && (
            <div className="text-xs text-gray-500 truncate">
              <User size={11} className="inline mr-1" />
              {data.owner}
            </div>
          )}

          <div className="flex items-center gap-1.5 flex-wrap">
            {data.riskTag && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${riskColors[data.riskTag]}`}
              >
                {data.riskTag}
              </span>
            )}
            {data.autonomyLevel && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">
                {autonomyLabels[data.autonomyLevel]}
              </span>
            )}
            {data.humanApprovalRequired && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 font-medium">
                Approval
              </span>
            )}
            {(data.monitoringEnabled || data.loggingEnabled) && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">
                Logged
              </span>
            )}
          </div>

          {data.datasetIds && data.datasetIds.length > 0 && (
            <div className="text-[10px] text-cyan-700 truncate">
              <Database size={10} className="inline mr-1" />
              {data.datasetIds.length} dataset(s)
            </div>
          )}
        </div>
      </div>

      {handleConfig.sources === 1 && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white"
        />
      )}

      {handleConfig.sources === 2 && (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            id="a"
            className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white"
            style={{ left: '30%' }}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="b"
            className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white"
            style={{ left: '70%' }}
          />
        </>
      )}
    </div>
  );
}
