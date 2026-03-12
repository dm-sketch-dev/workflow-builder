import {
  AlertOctagon,
  AlertTriangle,
  Info,
  Lightbulb,
  ShieldCheck,
} from 'lucide-react';
import useValidationStore from '../../store/useValidationStore';
import useWorkflowStore from '../../store/useWorkflowStore';
import useValidation from '../../hooks/useValidation';

const severityConfig = {
  critical: {
    icon: AlertOctagon,
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    badge: 'bg-red-100 text-red-800',
    label: 'Critical',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-700',
    badge: 'bg-yellow-100 text-yellow-800',
    label: 'Warning',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-800',
    label: 'Info',
  },
  suggestion: {
    icon: Lightbulb,
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    badge: 'bg-green-100 text-green-800',
    label: 'Suggestion',
  },
};

export default function ValidationPanel() {
  // Run validation hook
  useValidation();

  const messages = useValidationStore((s) => s.messages);
  const selectNode = useWorkflowStore((s) => s.selectNode);
  const nodes = useWorkflowStore((s) => s.nodes);

  const counts = {
    critical: messages.filter((m) => m.severity === 'critical').length,
    warning: messages.filter((m) => m.severity === 'warning').length,
    info: messages.filter((m) => m.severity === 'info').length,
    suggestion: messages.filter((m) => m.severity === 'suggestion').length,
  };

  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        <ShieldCheck size={18} className="mr-2" />
        Add nodes to the canvas to see governance feedback
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-green-600 text-sm">
        <ShieldCheck size={18} className="mr-2" />
        No governance issues detected
      </div>
    );
  }

  return (
    <div className="p-3">
      {/* Summary Badges */}
      <div className="flex gap-2 mb-3">
        {Object.entries(counts).map(
          ([severity, count]) =>
            count > 0 && (
              <span
                key={severity}
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${severityConfig[severity].badge}`}
              >
                {count} {severityConfig[severity].label}
              </span>
            )
        )}
      </div>

      {/* Messages */}
      <div className="space-y-2">
        {messages.map((msg, i) => {
          const config = severityConfig[msg.severity];
          const Icon = config.icon;
          return (
            <div
              key={`${msg.ruleId}-${i}`}
              className={`flex items-start gap-2.5 p-2.5 rounded-md border ${config.bg} ${config.border} cursor-pointer hover:opacity-90 transition-opacity`}
              onClick={() => {
                if (msg.affectedNodeIds?.length > 0) {
                  selectNode(msg.affectedNodeIds[0]);
                }
              }}
            >
              <Icon size={16} className={`${config.text} mt-0.5 shrink-0`} />
              <div>
                <div className={`text-sm font-medium ${config.text}`}>
                  {msg.title}
                </div>
                <div className="text-xs text-gray-600 mt-0.5">
                  {msg.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
