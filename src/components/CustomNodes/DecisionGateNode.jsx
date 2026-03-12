import BaseNode from './BaseNode';
import { NODE_TYPES } from '../../constants/nodeTypes';

export default function DecisionGateNode(props) {
  return <BaseNode {...props} nodeTypeDef={NODE_TYPES.decisionGate} />;
}
