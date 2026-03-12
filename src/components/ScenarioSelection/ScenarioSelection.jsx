import { Workflow } from 'lucide-react';
import { SCENARIOS } from '../../constants/scenarios';
import useWorkflowStore from '../../store/useWorkflowStore';
import ScenarioCard from './ScenarioCard';

export default function ScenarioSelection() {
  const selectScenario = useWorkflowStore((s) => s.selectScenario);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-6 overflow-auto">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl text-white">
              <Workflow size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Workflow & Escalation Builder
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Design an AI-enabled operational workflow with appropriate governance,
            oversight, and escalation structures. Select a scenario to begin.
          </p>
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-sm text-blue-800 leading-relaxed">
              Your goal is to build a workflow that is not just operationally
              functional, but also appropriately governed, risk-aware,
              monitorable, auditable, and capable of escalation or interruption
              when necessary.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SCENARIOS.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              onSelect={selectScenario}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
