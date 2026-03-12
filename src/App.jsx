import { ReactFlowProvider } from '@xyflow/react';
import useWorkflowStore from './store/useWorkflowStore';
import ScenarioSelection from './components/ScenarioSelection/ScenarioSelection';
import AppLayout from './components/Layout/AppLayout';

export default function App() {
  const currentScreen = useWorkflowStore((s) => s.currentScreen);

  return (
    <ReactFlowProvider>
      {currentScreen === 'scenarioSelection' ? (
        <ScenarioSelection />
      ) : (
        <AppLayout />
      )}
    </ReactFlowProvider>
  );
}
