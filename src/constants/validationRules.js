import { DATASETS } from './datasets';

function getOutgoingEdges(nodeId, edges) {
  return edges.filter((e) => e.source === nodeId);
}

function getIncomingEdges(nodeId, edges) {
  return edges.filter((e) => e.target === nodeId);
}

function getDownstreamNodes(nodeId, nodes, edges, visited = new Set()) {
  if (visited.has(nodeId)) return [];
  visited.add(nodeId);
  const result = [];
  const outgoing = getOutgoingEdges(nodeId, edges);
  for (const edge of outgoing) {
    const targetNode = nodes.find((n) => n.id === edge.target);
    if (targetNode) {
      result.push(targetNode);
      result.push(...getDownstreamNodes(edge.target, nodes, edges, visited));
    }
  }
  return result;
}

function getUpstreamNodes(nodeId, nodes, edges, visited = new Set()) {
  if (visited.has(nodeId)) return [];
  visited.add(nodeId);
  const result = [];
  const incoming = getIncomingEdges(nodeId, edges);
  for (const edge of incoming) {
    const sourceNode = nodes.find((n) => n.id === edge.source);
    if (sourceNode) {
      result.push(sourceNode);
      result.push(...getUpstreamNodes(edge.source, nodes, edges, visited));
    }
  }
  return result;
}

function hasNodeTypeDownstream(nodeId, targetType, nodes, edges) {
  const downstream = getDownstreamNodes(nodeId, nodes, edges);
  return downstream.some((n) => n.type === targetType);
}

function hasNodeTypeUpstream(nodeId, targetType, nodes, edges) {
  const upstream = getUpstreamNodes(nodeId, nodes, edges);
  return upstream.some((n) => n.type === targetType);
}

function getMaxSensitivity(datasetIds) {
  if (!datasetIds || datasetIds.length === 0) return 0;
  return Math.max(
    ...datasetIds.map((id) => {
      const ds = DATASETS.find((d) => d.id === id);
      return ds ? ds.sensitivityLevel : 0;
    })
  );
}

export const VALIDATION_RULES = [
  {
    id: 'no-start-node',
    severity: 'critical',
    title: 'Missing Start Node',
    description: 'Workflow has no start/trigger node. Every workflow must begin with a defined trigger.',
    check: (nodes) => {
      const hasStart = nodes.some((n) => n.type === 'startTrigger');
      if (!hasStart && nodes.length > 0) {
        return [{ ruleId: 'no-start-node', affectedNodeIds: [] }];
      }
      return [];
    },
  },
  {
    id: 'no-end-node',
    severity: 'warning',
    title: 'Missing End Node',
    description: 'Workflow has no output/end node. Consider adding a defined endpoint.',
    check: (nodes) => {
      const hasEnd = nodes.some((n) => n.type === 'outputEnd');
      if (!hasEnd && nodes.length > 0) {
        return [{ ruleId: 'no-end-node', affectedNodeIds: [] }];
      }
      return [];
    },
  },
  {
    id: 'ai-output-no-monitoring',
    severity: 'critical',
    title: 'AI Output Without Monitoring',
    description:
      'An AI action produces output that reaches the end without passing through any monitoring or logging step.',
    check: (nodes, edges) => {
      const violations = [];
      const aiNodes = nodes.filter((n) => n.type === 'aiAction');
      for (const aiNode of aiNodes) {
        const hasMonitoring = hasNodeTypeDownstream(aiNode.id, 'monitoringLogging', nodes, edges);
        const hasEnd = hasNodeTypeDownstream(aiNode.id, 'outputEnd', nodes, edges);
        if (hasEnd && !hasMonitoring) {
          violations.push({
            ruleId: 'ai-output-no-monitoring',
            affectedNodeIds: [aiNode.id],
            detail: `"${aiNode.data.label}" output reaches end without monitoring.`,
          });
        }
      }
      return violations;
    },
  },
  {
    id: 'sensitive-data-no-review',
    severity: 'critical',
    title: 'Sensitive Data Without Human Review',
    description:
      'A node accesses sensitive data (sensitivity >= 4) but no human review exists downstream before output.',
    check: (nodes, edges) => {
      const violations = [];
      for (const node of nodes) {
        const maxSens = getMaxSensitivity(node.data?.datasetIds);
        if (maxSens >= 4) {
          const hasReview = hasNodeTypeDownstream(node.id, 'humanReview', nodes, edges);
          if (!hasReview) {
            violations.push({
              ruleId: 'sensitive-data-no-review',
              affectedNodeIds: [node.id],
              detail: `"${node.data.label}" accesses sensitive data but no human review follows.`,
            });
          }
        }
      }
      return violations;
    },
  },
  {
    id: 'high-risk-no-escalation',
    severity: 'critical',
    title: 'High-Risk Workflow Lacks Escalation',
    description:
      'The workflow contains high-risk or critical nodes but no escalation path exists.',
    check: (nodes) => {
      const highRiskNodes = nodes.filter(
        (n) => n.data?.riskTag === 'high' || n.data?.riskTag === 'critical'
      );
      const hasEscalation = nodes.some((n) => n.type === 'escalation');
      if (highRiskNodes.length > 0 && !hasEscalation) {
        return [
          {
            ruleId: 'high-risk-no-escalation',
            affectedNodeIds: highRiskNodes.map((n) => n.id),
            detail: `${highRiskNodes.length} high-risk node(s) but no escalation path.`,
          },
        ];
      }
      return [];
    },
  },
  {
    id: 'ai-action-no-owner',
    severity: 'warning',
    title: 'AI Action Without Responsible Owner',
    description: 'An AI action node has no responsible owner assigned.',
    check: (nodes) => {
      const violations = [];
      const aiNodes = nodes.filter((n) => n.type === 'aiAction');
      for (const aiNode of aiNodes) {
        if (!aiNode.data?.owner || aiNode.data.owner.trim() === '') {
          violations.push({
            ruleId: 'ai-action-no-owner',
            affectedNodeIds: [aiNode.id],
            detail: `"${aiNode.data.label}" has no responsible owner.`,
          });
        }
      }
      return violations;
    },
  },
  {
    id: 'external-output-no-approval',
    severity: 'warning',
    title: 'External Output Without Approval Gate',
    description:
      'An output node delivers results without a prior human review or decision gate upstream.',
    check: (nodes, edges) => {
      const violations = [];
      const outputNodes = nodes.filter((n) => n.type === 'outputEnd');
      for (const outputNode of outputNodes) {
        const hasReview = hasNodeTypeUpstream(outputNode.id, 'humanReview', nodes, edges);
        const hasGate = hasNodeTypeUpstream(outputNode.id, 'decisionGate', nodes, edges);
        if (!hasReview && !hasGate) {
          violations.push({
            ruleId: 'external-output-no-approval',
            affectedNodeIds: [outputNode.id],
            detail: `"${outputNode.data.label}" has no upstream approval or decision gate.`,
          });
        }
      }
      return violations;
    },
  },
  {
    id: 'decision-no-branching',
    severity: 'warning',
    title: 'Decision Node Without Branching',
    description: 'A decision/gate node has fewer than 2 outgoing connections.',
    check: (nodes, edges) => {
      const violations = [];
      const decisionNodes = nodes.filter((n) => n.type === 'decisionGate');
      for (const dn of decisionNodes) {
        const outgoing = getOutgoingEdges(dn.id, edges);
        if (outgoing.length < 2) {
          violations.push({
            ruleId: 'decision-no-branching',
            affectedNodeIds: [dn.id],
            detail: `"${dn.data.label}" has ${outgoing.length} outgoing path(s) instead of 2+.`,
          });
        }
      }
      return violations;
    },
  },
  {
    id: 'no-rollback-high-risk',
    severity: 'warning',
    title: 'No Rollback for High-Risk Process',
    description:
      'Workflow contains high-risk nodes but no stop/rollback mechanism is present.',
    check: (nodes) => {
      const highRiskNodes = nodes.filter(
        (n) => n.data?.riskTag === 'high' || n.data?.riskTag === 'critical'
      );
      const hasRollback = nodes.some((n) => n.type === 'stopRollback');
      if (highRiskNodes.length > 0 && !hasRollback) {
        return [
          {
            ruleId: 'no-rollback-high-risk',
            affectedNodeIds: highRiskNodes.map((n) => n.id),
            detail: 'High-risk process lacks a stop/rollback mechanism.',
          },
        ];
      }
      return [];
    },
  },
  {
    id: 'disconnected-nodes',
    severity: 'info',
    title: 'Disconnected Nodes',
    description: 'One or more nodes have no connections to other nodes.',
    check: (nodes, edges) => {
      const connectedIds = new Set();
      for (const edge of edges) {
        connectedIds.add(edge.source);
        connectedIds.add(edge.target);
      }
      const disconnected = nodes.filter((n) => !connectedIds.has(n.id));
      if (disconnected.length > 0) {
        return [
          {
            ruleId: 'disconnected-nodes',
            affectedNodeIds: disconnected.map((n) => n.id),
            detail: `${disconnected.length} node(s) are not connected to the workflow.`,
          },
        ];
      }
      return [];
    },
  },
  {
    id: 'consider-logging',
    severity: 'suggestion',
    title: 'Consider Adding Logging',
    description:
      'Workflow has AI actions but no monitoring/logging nodes. Consider adding audit trail.',
    check: (nodes) => {
      const hasAI = nodes.some((n) => n.type === 'aiAction');
      const hasMonitoring = nodes.some((n) => n.type === 'monitoringLogging');
      if (hasAI && !hasMonitoring) {
        return [{ ruleId: 'consider-logging', affectedNodeIds: [] }];
      }
      return [];
    },
  },
  {
    id: 'sensitive-data-no-monitoring',
    severity: 'warning',
    title: 'Sensitive Data Without Monitoring',
    description:
      'A node accesses sensitive data but no monitoring/logging node is present in the workflow.',
    check: (nodes) => {
      const hasSensitive = nodes.some((n) => getMaxSensitivity(n.data?.datasetIds) >= 3);
      const hasMonitoring = nodes.some((n) => n.type === 'monitoringLogging');
      if (hasSensitive && !hasMonitoring) {
        return [
          {
            ruleId: 'sensitive-data-no-monitoring',
            affectedNodeIds: [],
            detail: 'Sensitive data is accessed but no monitoring/logging exists.',
          },
        ];
      }
      return [];
    },
  },
];
