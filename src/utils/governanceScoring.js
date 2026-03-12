import { DATASETS } from '../constants/datasets';

const autonomyWeights = {
  full: 100,
  supervised: 66,
  'human-in-loop': 33,
  manual: 0,
};

export function computeGovernanceProfile(nodes, edges) {
  if (nodes.length === 0) {
    return {
      autonomyLevel: 0,
      oversightStrength: 0,
      dataSensitivity: 0,
      resilience: 0,
      auditability: 0,
    };
  }

  // 1. Autonomy Level (0-100, higher = more autonomous)
  const avgAutonomy =
    nodes.reduce(
      (sum, n) => sum + (autonomyWeights[n.data?.autonomyLevel] ?? 50),
      0
    ) / nodes.length;

  // 2. Oversight Strength (0-100)
  const oversightNodes = nodes.filter(
    (n) => n.type === 'humanReview' || n.type === 'monitoringLogging'
  ).length;
  const nonTerminalNodes = Math.max(nodes.length - 2, 1);
  const oversightStrength = Math.min(
    (oversightNodes / nonTerminalNodes) * 100,
    100
  );

  // 3. Data Sensitivity (0-5)
  const allDatasetIds = nodes.flatMap((n) => n.data?.datasetIds || []);
  const uniqueDatasetIds = [...new Set(allDatasetIds)];
  let dataSensitivity = 0;
  for (const id of uniqueDatasetIds) {
    const ds = DATASETS.find((d) => d.id === id);
    if (ds && ds.sensitivityLevel > dataSensitivity) {
      dataSensitivity = ds.sensitivityLevel;
    }
  }

  // 4. Resilience (0-100)
  const hasEscalation = nodes.some((n) => n.type === 'escalation');
  const hasRollback = nodes.some((n) => n.type === 'stopRollback');
  const hasDecision = nodes.some((n) => n.type === 'decisionGate');
  const resilience =
    (hasEscalation ? 40 : 0) + (hasRollback ? 40 : 0) + (hasDecision ? 20 : 0);

  // 5. Auditability (0-100)
  const monitoredNodes = nodes.filter(
    (n) => n.data?.monitoringEnabled || n.data?.loggingEnabled
  ).length;
  const auditability = (monitoredNodes / nodes.length) * 100;

  return {
    autonomyLevel: Math.round(avgAutonomy),
    oversightStrength: Math.round(oversightStrength),
    dataSensitivity,
    resilience: Math.round(resilience),
    auditability: Math.round(auditability),
  };
}
