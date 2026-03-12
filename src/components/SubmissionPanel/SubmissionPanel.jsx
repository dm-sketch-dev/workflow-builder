import { useState } from 'react';
import { Download, BarChart3, FileText } from 'lucide-react';
import { toPng } from 'html-to-image';
import useWorkflowStore from '../../store/useWorkflowStore';
import { computeGovernanceProfile } from '../../utils/governanceScoring';

const sensitivityLabels = ['None', 'Public', 'Internal', 'Confidential', 'PII', 'Regulated'];
const sensitivityColors = ['#9ca3af', '#22c55e', '#3b82f6', '#f59e0b', '#f97316', '#ef4444'];

function MetricBar({ label, value, max = 100, color = '#3b82f6' }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="space-y-0.5">
      <div className="flex justify-between text-[11px]">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-800">{value}/{max}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function SubmissionPanel() {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const rationale = useWorkflowStore((s) => s.rationale);
  const reflection = useWorkflowStore((s) => s.reflection);
  const setRationale = useWorkflowStore((s) => s.setRationale);
  const setReflection = useWorkflowStore((s) => s.setReflection);
  const selectedScenarioId = useWorkflowStore((s) => s.selectedScenarioId);
  const [exporting, setExporting] = useState(false);

  const profile = computeGovernanceProfile(nodes, edges);

  const handleExport = async () => {
    const canvasEl = document.querySelector('.react-flow');
    if (!canvasEl) return;

    setExporting(true);
    try {
      const dataUrl = await toPng(canvasEl, {
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        filter: (node) => {
          // Exclude controls and minimap from export
          const className = node?.className || '';
          if (typeof className === 'string') {
            return (
              !className.includes('react-flow__controls') &&
              !className.includes('react-flow__minimap')
            );
          }
          return true;
        },
      });
      const link = document.createElement('a');
      link.download = `workflow-${selectedScenarioId || 'diagram'}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex gap-6 p-4 h-full">
      {/* Export */}
      <div className="w-48 shrink-0 space-y-3">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
          <Download size={14} />
          Export
        </h3>
        <button
          onClick={handleExport}
          disabled={exporting || nodes.length === 0}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Download size={16} />
          {exporting ? 'Exporting...' : 'Export as PNG'}
        </button>
        <p className="text-[10px] text-gray-400">
          Downloads your workflow diagram as a high-resolution image.
        </p>
      </div>

      {/* Written Rationale */}
      <div className="flex-1 space-y-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
          <FileText size={14} />
          Written Rationale
        </h3>
        <textarea
          value={rationale}
          onChange={(e) => setRationale(e.target.value)}
          placeholder="Explain your governance design choices. Why did you structure the workflow this way? What tradeoffs did you consider? (minimum 100 characters)"
          rows={3}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none resize-none"
        />
        <div className="flex justify-between text-[10px] text-gray-400">
          <span>Required (min. 100 characters)</span>
          <span className={rationale.length >= 100 ? 'text-green-600' : ''}>
            {rationale.length} / 100
          </span>
        </div>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="(Optional) Reflect on key tradeoffs in your workflow design."
          rows={2}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none resize-none"
        />
      </div>

      {/* Governance Profile */}
      <div className="w-56 shrink-0 space-y-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
          <BarChart3 size={14} />
          Governance Profile
        </h3>
        <div className="space-y-2.5">
          <MetricBar
            label="Autonomy Level"
            value={profile.autonomyLevel}
            color={profile.autonomyLevel > 70 ? '#ef4444' : profile.autonomyLevel > 40 ? '#f59e0b' : '#22c55e'}
          />
          <MetricBar
            label="Oversight Strength"
            value={profile.oversightStrength}
            color={profile.oversightStrength > 50 ? '#22c55e' : profile.oversightStrength > 25 ? '#f59e0b' : '#ef4444'}
          />
          <div className="space-y-0.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-gray-600">Data Sensitivity</span>
              <span
                className="font-medium"
                style={{ color: sensitivityColors[profile.dataSensitivity] }}
              >
                {sensitivityLabels[profile.dataSensitivity]}
              </span>
            </div>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className="flex-1 h-2 rounded-full"
                  style={{
                    backgroundColor:
                      level <= profile.dataSensitivity
                        ? sensitivityColors[profile.dataSensitivity]
                        : '#e5e7eb',
                  }}
                />
              ))}
            </div>
          </div>
          <MetricBar
            label="Resilience"
            value={profile.resilience}
            color={profile.resilience > 60 ? '#22c55e' : profile.resilience > 30 ? '#f59e0b' : '#ef4444'}
          />
          <MetricBar
            label="Auditability"
            value={profile.auditability}
            color={profile.auditability > 50 ? '#22c55e' : profile.auditability > 25 ? '#f59e0b' : '#ef4444'}
          />
        </div>
      </div>
    </div>
  );
}
