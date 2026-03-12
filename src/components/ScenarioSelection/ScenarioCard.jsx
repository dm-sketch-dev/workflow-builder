import { AlertCircle, Target } from 'lucide-react';
import { getIcon } from '../../utils/iconMap';

const complexityColors = {
  low: 'bg-green-100 text-green-800',
  moderate: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

export default function ScenarioCard({ scenario, onSelect }) {
  const Icon = getIcon(scenario.icon);

  return (
    <button
      onClick={() => onSelect(scenario.id)}
      className="text-left bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
          <Icon size={28} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight">
            {scenario.shortTitle}
          </h3>
          <span
            className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${complexityColors[scenario.complexity]}`}
          >
            {scenario.complexity} complexity
          </span>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
        {scenario.description}
      </p>

      <div className="mb-3">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          Key Risks
        </h4>
        <ul className="space-y-1">
          {scenario.keyRisks.map((risk, i) => (
            <li key={i} className="text-sm text-red-700 flex items-start gap-1.5">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              {risk}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          Learning Objectives
        </h4>
        <ul className="space-y-1">
          {scenario.learningObjectives.map((obj, i) => (
            <li key={i} className="text-sm text-gray-600 flex items-start gap-1.5">
              <Target size={14} className="mt-0.5 shrink-0 text-blue-500" />
              {obj}
            </li>
          ))}
        </ul>
      </div>
    </button>
  );
}
