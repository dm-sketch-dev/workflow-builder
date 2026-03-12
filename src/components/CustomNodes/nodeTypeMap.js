import StartTriggerNode from './StartTriggerNode';
import AIActionNode from './AIActionNode';
import HumanReviewNode from './HumanReviewNode';
import DecisionGateNode from './DecisionGateNode';
import DataAccessNode from './DataAccessNode';
import MonitoringLoggingNode from './MonitoringLoggingNode';
import EscalationNode from './EscalationNode';
import StopRollbackNode from './StopRollbackNode';
import OutputEndNode from './OutputEndNode';

// Defined at module level to prevent React Flow from re-registering on every render
export const nodeTypeMap = {
  startTrigger: StartTriggerNode,
  aiAction: AIActionNode,
  humanReview: HumanReviewNode,
  decisionGate: DecisionGateNode,
  dataAccess: DataAccessNode,
  monitoringLogging: MonitoringLoggingNode,
  escalation: EscalationNode,
  stopRollback: StopRollbackNode,
  outputEnd: OutputEndNode,
};
