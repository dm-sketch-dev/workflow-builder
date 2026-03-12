import { useState } from 'react';
import { Database, Shield, AlertCircle, Eye } from 'lucide-react';
import { DATASETS, DATASET_CATEGORIES } from '../../constants/datasets';
import useWorkflowStore from '../../store/useWorkflowStore';

const sensitivityBars = [1, 2, 3, 4, 5];

function DatasetCard({ dataset, onAttach, canAttach }) {
  const category = DATASET_CATEGORIES[dataset.category];

  return (
    <div className="border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between mb-1.5">
        <h4 className="text-sm font-medium text-gray-800">{dataset.name}</h4>
        <span
          className="text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ml-2"
          style={{
            backgroundColor: category.color + '20',
            color: category.color,
          }}
        >
          {category.label}
        </span>
      </div>

      <p className="text-xs text-gray-500 mb-2 leading-relaxed">
        {dataset.description}
      </p>

      {/* Sensitivity Bar */}
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-[10px] text-gray-500 w-16">Sensitivity</span>
        <div className="flex gap-0.5">
          {sensitivityBars.map((level) => (
            <div
              key={level}
              className="w-4 h-1.5 rounded-full"
              style={{
                backgroundColor:
                  level <= dataset.sensitivityLevel
                    ? dataset.sensitivityLevel >= 4
                      ? '#ef4444'
                      : dataset.sensitivityLevel >= 3
                      ? '#f59e0b'
                      : '#22c55e'
                    : '#e5e7eb',
              }}
            />
          ))}
        </div>
        <span className="text-[10px] text-gray-400">
          Level {dataset.sensitivityLevel}
        </span>
      </div>

      {/* Restrictions */}
      <div className="text-[10px] text-gray-500 mb-1.5 flex items-start gap-1">
        <Shield size={10} className="mt-0.5 shrink-0" />
        {dataset.restrictions}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1 mb-2">
        {dataset.humanReviewRequired && (
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 font-medium">
            Human Review Required
          </span>
        )}
        {dataset.monitoringExpected && (
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">
            Monitoring Expected
          </span>
        )}
      </div>

      {/* Example Fields */}
      <div className="text-[10px] text-gray-400 mb-2">
        Fields: {dataset.exampleFields.join(', ')}
      </div>

      {/* Attach Button */}
      {canAttach && (
        <button
          onClick={() => onAttach(dataset.id)}
          className="w-full text-xs py-1.5 border border-blue-200 text-blue-600 rounded hover:bg-blue-50 transition-colors font-medium"
        >
          Attach to Selected Node
        </button>
      )}
    </div>
  );
}

export default function DatasetLibrary() {
  const [filter, setFilter] = useState('all');
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);
  const nodes = useWorkflowStore((s) => s.nodes);
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const filtered =
    filter === 'all'
      ? DATASETS
      : DATASETS.filter((d) => d.category === filter);

  const handleAttach = (datasetId) => {
    if (!selectedNode) return;
    const current = selectedNode.data.datasetIds || [];
    if (!current.includes(datasetId)) {
      updateNodeData(selectedNodeId, {
        datasetIds: [...current, datasetId],
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1 p-3 border-b border-gray-100">
        {[
          { key: 'all', label: 'All' },
          ...Object.entries(DATASET_CATEGORIES).map(([key, cat]) => ({
            key,
            label: cat.label,
          })),
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`text-[11px] px-2 py-1 rounded-full font-medium transition-colors ${
              filter === key
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Instructions */}
      {!selectedNode && (
        <div className="px-3 py-2 bg-yellow-50 text-yellow-700 text-[11px] border-b border-yellow-100">
          <AlertCircle size={12} className="inline mr-1" />
          Select a node on the canvas to attach datasets
        </div>
      )}

      {/* Dataset Cards */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {filtered.map((dataset) => (
          <DatasetCard
            key={dataset.id}
            dataset={dataset}
            onAttach={handleAttach}
            canAttach={!!selectedNode}
          />
        ))}
      </div>
    </div>
  );
}
