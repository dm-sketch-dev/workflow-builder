import { Settings, Trash2 } from 'lucide-react';
import useWorkflowStore from '../../store/useWorkflowStore';
import { NODE_TYPES } from '../../constants/nodeTypes';
import { DATASETS } from '../../constants/datasets';

export default function ConfigPanel() {
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);
  const nodes = useWorkflowStore((s) => s.nodes);
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const deleteNode = useWorkflowStore((s) => s.deleteNode);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 px-6">
        <Settings size={32} className="mb-3" />
        <p className="text-sm text-center">
          Select a node on the canvas to configure its properties
        </p>
      </div>
    );
  }

  const typeDef = NODE_TYPES[selectedNode.type];
  const data = selectedNode.data;

  const update = (field, value) => {
    updateNodeData(selectedNodeId, { [field]: value });
  };

  const toggleDataset = (datasetId) => {
    const current = data.datasetIds || [];
    const next = current.includes(datasetId)
      ? current.filter((id) => id !== datasetId)
      : [...current, datasetId];
    update('datasetIds', next);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: typeDef?.color }}
        />
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {typeDef?.label}
        </span>
      </div>

      {/* Node Name */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Node Name
        </label>
        <input
          type="text"
          value={data.label}
          onChange={(e) => update('label', e.target.value)}
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none"
        />
      </div>

      {/* Owner */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Responsible Owner
        </label>
        <input
          type="text"
          value={data.owner}
          onChange={(e) => update('owner', e.target.value)}
          placeholder="e.g., Data Science Team"
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none"
        />
      </div>

      {/* Purpose */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Purpose
        </label>
        <textarea
          value={data.purpose}
          onChange={(e) => update('purpose', e.target.value)}
          placeholder="What does this step accomplish?"
          rows={2}
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none resize-none"
        />
      </div>

      {/* Input Description */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Input Description
        </label>
        <input
          type="text"
          value={data.inputDescription}
          onChange={(e) => update('inputDescription', e.target.value)}
          placeholder="What data enters this step?"
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none"
        />
      </div>

      {/* Output Description */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Output Description
        </label>
        <input
          type="text"
          value={data.outputDescription}
          onChange={(e) => update('outputDescription', e.target.value)}
          placeholder="What does this step produce?"
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none"
        />
      </div>

      {/* Autonomy Level */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Autonomy Level
        </label>
        <select
          value={data.autonomyLevel}
          onChange={(e) => update('autonomyLevel', e.target.value)}
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none bg-white"
        >
          <option value="full">Full Autonomy</option>
          <option value="supervised">Supervised</option>
          <option value="human-in-loop">Human-in-the-Loop</option>
          <option value="manual">Manual</option>
        </select>
      </div>

      {/* Risk Tag */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Risk Tag
        </label>
        <select
          value={data.riskTag}
          onChange={(e) => update('riskTag', e.target.value)}
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none bg-white"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      {/* Datasets */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Datasets Used
        </label>
        <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2 space-y-1">
          {DATASETS.map((ds) => (
            <label
              key={ds.id}
              className="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-50 p-1 rounded"
            >
              <input
                type="checkbox"
                checked={(data.datasetIds || []).includes(ds.id)}
                onChange={() => toggleDataset(ds.id)}
                className="rounded text-blue-600"
              />
              <span className="truncate">{ds.name}</span>
              <span
                className="ml-auto text-[10px] px-1 rounded"
                style={{
                  backgroundColor:
                    ds.sensitivityLevel >= 4
                      ? '#fef2f2'
                      : ds.sensitivityLevel >= 3
                      ? '#fffbeb'
                      : '#f0fdf4',
                  color:
                    ds.sensitivityLevel >= 4
                      ? '#991b1b'
                      : ds.sensitivityLevel >= 3
                      ? '#92400e'
                      : '#166534',
                }}
              >
                L{ds.sensitivityLevel}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={data.humanApprovalRequired}
            onChange={(e) => update('humanApprovalRequired', e.target.checked)}
            className="rounded text-blue-600"
          />
          <span className="text-gray-700">Human Approval Required</span>
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={data.monitoringEnabled}
            onChange={(e) => update('monitoringEnabled', e.target.checked)}
            className="rounded text-blue-600"
          />
          <span className="text-gray-700">Monitoring Enabled</span>
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={data.loggingEnabled}
            onChange={(e) => update('loggingEnabled', e.target.checked)}
            className="rounded text-blue-600"
          />
          <span className="text-gray-700">Logging Enabled</span>
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={data.rollbackAvailable}
            onChange={(e) => update('rollbackAvailable', e.target.checked)}
            className="rounded text-blue-600"
          />
          <span className="text-gray-700">Rollback Available</span>
        </label>
      </div>

      {/* Escalation Destination */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Escalation Destination
        </label>
        <input
          type="text"
          value={data.escalationDestination}
          onChange={(e) => update('escalationDestination', e.target.value)}
          placeholder="e.g., Senior Manager, Compliance Team"
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none"
        />
      </div>

      {/* Delete */}
      <button
        onClick={() => deleteNode(selectedNodeId)}
        className="flex items-center gap-1.5 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors border border-red-200"
      >
        <Trash2 size={14} />
        Delete Node
      </button>
    </div>
  );
}
