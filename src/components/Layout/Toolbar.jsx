import { ArrowLeft, Trash2, LayoutTemplate, Workflow } from 'lucide-react';
import { useState } from 'react';
import useWorkflowStore from '../../store/useWorkflowStore';
import { SCENARIOS } from '../../constants/scenarios';
import { TEMPLATES } from '../../constants/templates';

export default function Toolbar() {
  const selectedScenarioId = useWorkflowStore((s) => s.selectedScenarioId);
  const returnToScenarios = useWorkflowStore((s) => s.returnToScenarios);
  const clearWorkflow = useWorkflowStore((s) => s.clearWorkflow);
  const loadTemplate = useWorkflowStore((s) => s.loadTemplate);
  const [showTemplates, setShowTemplates] = useState(false);

  const scenario = SCENARIOS.find((s) => s.id === selectedScenarioId);

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3 z-10">
      <button
        onClick={returnToScenarios}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="h-6 w-px bg-gray-200" />

      <div className="flex items-center gap-2">
        <Workflow size={18} className="text-blue-600" />
        <span className="font-semibold text-gray-900 text-sm">
          {scenario?.shortTitle || 'Workflow Builder'}
        </span>
      </div>

      <div className="flex-1" />

      <div className="relative">
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LayoutTemplate size={16} />
          Templates
        </button>
        {showTemplates && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowTemplates(false)}
            />
            <div className="absolute right-0 top-full mt-1 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1">
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => {
                    loadTemplate(tpl);
                    setShowTemplates(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="text-sm font-medium text-gray-800">
                    {tpl.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {tpl.description}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <button
        onClick={clearWorkflow}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
      >
        <Trash2 size={16} />
        Clear
      </button>
    </div>
  );
}
