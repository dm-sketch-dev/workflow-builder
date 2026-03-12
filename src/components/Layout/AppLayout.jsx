import useWorkflowStore from '../../store/useWorkflowStore';
import Toolbar from './Toolbar';
import NodeLibrary from '../NodeLibrary/NodeLibrary';
import WorkflowCanvas from '../Canvas/WorkflowCanvas';
import ConfigPanel from '../ConfigPanel/ConfigPanel';
import DatasetLibrary from '../DatasetLibrary/DatasetLibrary';
import ValidationPanel from '../ValidationPanel/ValidationPanel';
import SubmissionPanel from '../SubmissionPanel/SubmissionPanel';
import {
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Send,
  Database,
  Settings,
} from 'lucide-react';

export default function AppLayout() {
  const activeRightPanel = useWorkflowStore((s) => s.activeRightPanel);
  const activeBottomPanel = useWorkflowStore((s) => s.activeBottomPanel);
  const bottomPanelExpanded = useWorkflowStore((s) => s.bottomPanelExpanded);
  const setActiveRightPanel = useWorkflowStore((s) => s.setActiveRightPanel);
  const setActiveBottomPanel = useWorkflowStore((s) => s.setActiveBottomPanel);
  const toggleBottomPanel = useWorkflowStore((s) => s.toggleBottomPanel);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50">
      {/* Toolbar */}
      <Toolbar />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Node Library */}
        <div className="w-[220px] shrink-0">
          <NodeLibrary />
        </div>

        {/* Center - Canvas + Bottom Panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Canvas */}
          <div className="flex-1 overflow-hidden">
            <WorkflowCanvas />
          </div>

          {/* Bottom Panel */}
          <div
            className="bg-white border-t border-gray-200 flex flex-col"
            style={{ height: bottomPanelExpanded ? 220 : 40 }}
          >
            {/* Bottom Tab Bar */}
            <div className="flex items-center border-b border-gray-100 px-2 h-10 shrink-0">
              <button
                onClick={() => setActiveBottomPanel('validation')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  activeBottomPanel === 'validation'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <ShieldCheck size={14} />
                Governance Feedback
              </button>
              <button
                onClick={() => setActiveBottomPanel('submission')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  activeBottomPanel === 'submission'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Send size={14} />
                Submit & Export
              </button>
              <div className="flex-1" />
              <button
                onClick={toggleBottomPanel}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                {bottomPanelExpanded ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronUp size={16} />
                )}
              </button>
            </div>

            {/* Bottom Content */}
            {bottomPanelExpanded && (
              <div className="flex-1 overflow-auto">
                {activeBottomPanel === 'validation' ? (
                  <ValidationPanel />
                ) : (
                  <SubmissionPanel />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-[320px] shrink-0 bg-white border-l border-gray-200 flex flex-col">
          {/* Right Tab Bar */}
          <div className="flex border-b border-gray-100 px-2 py-1">
            <button
              onClick={() => setActiveRightPanel('config')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeRightPanel === 'config'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Settings size={14} />
              Node Config
            </button>
            <button
              onClick={() => setActiveRightPanel('datasets')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeRightPanel === 'datasets'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Database size={14} />
              Datasets
            </button>
          </div>

          {/* Right Panel Content */}
          <div className="flex-1 overflow-auto">
            {activeRightPanel === 'config' ? (
              <ConfigPanel />
            ) : (
              <DatasetLibrary />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
