import { NODE_TYPES } from './nodeTypes';

function makeData(typeKey, overrides = {}) {
  return { ...NODE_TYPES[typeKey].defaultData, ...overrides };
}

export const TEMPLATES = [
  {
    id: 'low-risk-internal',
    name: 'Low-Risk Internal Workflow',
    description:
      'Simple AI-assisted internal process with basic monitoring. Good starting point for document processing or summarization.',
    complexity: 'low',
    nodes: [
      {
        id: 'tpl1-1',
        type: 'startTrigger',
        position: { x: 300, y: 50 },
        data: makeData('startTrigger', { label: 'Trigger: New Report Available' }),
      },
      {
        id: 'tpl1-2',
        type: 'dataAccess',
        position: { x: 300, y: 180 },
        data: makeData('dataAccess', {
          label: 'Fetch Report Data',
          datasetIds: ['internal-reports'],
          purpose: 'Retrieve internal reports for summarization',
        }),
      },
      {
        id: 'tpl1-3',
        type: 'aiAction',
        position: { x: 300, y: 310 },
        data: makeData('aiAction', {
          label: 'AI Summarization',
          purpose: 'Generate executive summary from report data',
          autonomyLevel: 'supervised',
          riskTag: 'low',
        }),
      },
      {
        id: 'tpl1-4',
        type: 'monitoringLogging',
        position: { x: 300, y: 440 },
        data: makeData('monitoringLogging', {
          label: 'Log Summary Output',
          purpose: 'Record summary generation for audit trail',
        }),
      },
      {
        id: 'tpl1-5',
        type: 'outputEnd',
        position: { x: 300, y: 570 },
        data: makeData('outputEnd', {
          label: 'Deliver Summary',
          purpose: 'Send completed summary to requestor',
        }),
      },
    ],
    edges: [
      { id: 'tpl1-e1', source: 'tpl1-1', target: 'tpl1-2', type: 'smoothstep' },
      { id: 'tpl1-e2', source: 'tpl1-2', target: 'tpl1-3', type: 'smoothstep' },
      { id: 'tpl1-e3', source: 'tpl1-3', target: 'tpl1-4', type: 'smoothstep' },
      { id: 'tpl1-e4', source: 'tpl1-4', target: 'tpl1-5', type: 'smoothstep' },
    ],
  },
  {
    id: 'moderate-risk-customer',
    name: 'Moderate-Risk Customer-Facing Workflow',
    description:
      'AI processes customer data with human review checkpoint and decision branching. Suitable for customer service or onboarding.',
    complexity: 'moderate',
    nodes: [
      {
        id: 'tpl2-1',
        type: 'startTrigger',
        position: { x: 300, y: 50 },
        data: makeData('startTrigger', { label: 'Trigger: Customer Request Received' }),
      },
      {
        id: 'tpl2-2',
        type: 'dataAccess',
        position: { x: 300, y: 170 },
        data: makeData('dataAccess', {
          label: 'Fetch Customer Data',
          datasetIds: ['customer-profiles'],
          purpose: 'Retrieve customer profile and history',
        }),
      },
      {
        id: 'tpl2-3',
        type: 'aiAction',
        position: { x: 300, y: 290 },
        data: makeData('aiAction', {
          label: 'AI Classification',
          purpose: 'Classify request urgency and category',
          autonomyLevel: 'supervised',
          riskTag: 'medium',
        }),
      },
      {
        id: 'tpl2-4',
        type: 'monitoringLogging',
        position: { x: 560, y: 290 },
        data: makeData('monitoringLogging', {
          label: 'Log Classification',
          purpose: 'Record AI classification decision and confidence',
        }),
      },
      {
        id: 'tpl2-5',
        type: 'decisionGate',
        position: { x: 300, y: 420 },
        data: makeData('decisionGate', {
          label: 'Confidence Check',
          purpose: 'Route based on AI confidence level',
        }),
      },
      {
        id: 'tpl2-6',
        type: 'humanReview',
        position: { x: 120, y: 550 },
        data: makeData('humanReview', {
          label: 'Agent Review (Low Confidence)',
          purpose: 'Human reviews low-confidence or complex cases',
        }),
      },
      {
        id: 'tpl2-7',
        type: 'escalation',
        position: { x: 500, y: 550 },
        data: makeData('escalation', {
          label: 'Escalate to Supervisor',
          purpose: 'Route flagged or sensitive cases to supervisor',
          escalationDestination: 'Customer Service Supervisor',
        }),
      },
      {
        id: 'tpl2-8',
        type: 'outputEnd',
        position: { x: 300, y: 700 },
        data: makeData('outputEnd', {
          label: 'Send Response to Customer',
          purpose: 'Deliver resolution to customer',
        }),
      },
    ],
    edges: [
      { id: 'tpl2-e1', source: 'tpl2-1', target: 'tpl2-2', type: 'smoothstep' },
      { id: 'tpl2-e2', source: 'tpl2-2', target: 'tpl2-3', type: 'smoothstep' },
      { id: 'tpl2-e3', source: 'tpl2-3', target: 'tpl2-4', type: 'smoothstep' },
      { id: 'tpl2-e4', source: 'tpl2-3', target: 'tpl2-5', type: 'smoothstep' },
      { id: 'tpl2-e5', source: 'tpl2-5', target: 'tpl2-6', type: 'smoothstep', label: 'Low Confidence' },
      { id: 'tpl2-e6', source: 'tpl2-5', target: 'tpl2-7', type: 'smoothstep', label: 'Flagged' },
      { id: 'tpl2-e7', source: 'tpl2-6', target: 'tpl2-8', type: 'smoothstep' },
      { id: 'tpl2-e8', source: 'tpl2-7', target: 'tpl2-8', type: 'smoothstep' },
    ],
  },
  {
    id: 'high-risk-sensitive',
    name: 'High-Risk Sensitive Data Workflow',
    description:
      'Full governance structure with escalation, rollback, and multiple review stages. For financial, regulatory, or PII-heavy processes.',
    complexity: 'high',
    nodes: [
      {
        id: 'tpl3-1',
        type: 'startTrigger',
        position: { x: 350, y: 30 },
        data: makeData('startTrigger', { label: 'Trigger: Transaction Alert' }),
      },
      {
        id: 'tpl3-2',
        type: 'dataAccess',
        position: { x: 350, y: 140 },
        data: makeData('dataAccess', {
          label: 'Fetch Transaction Data',
          datasetIds: ['transaction-logs', 'watchlists'],
          purpose: 'Retrieve transaction details and screening lists',
          riskTag: 'high',
        }),
      },
      {
        id: 'tpl3-3',
        type: 'aiAction',
        position: { x: 350, y: 260 },
        data: makeData('aiAction', {
          label: 'AI Risk Scoring',
          purpose: 'Score transaction risk and flag anomalies',
          autonomyLevel: 'human-in-loop',
          riskTag: 'high',
        }),
      },
      {
        id: 'tpl3-4',
        type: 'monitoringLogging',
        position: { x: 620, y: 260 },
        data: makeData('monitoringLogging', {
          label: 'Log Risk Score',
          purpose: 'Record risk scoring for regulatory audit trail',
        }),
      },
      {
        id: 'tpl3-5',
        type: 'decisionGate',
        position: { x: 350, y: 390 },
        data: makeData('decisionGate', {
          label: 'Risk Level Gate',
          purpose: 'Route based on risk score threshold',
          riskTag: 'high',
        }),
      },
      {
        id: 'tpl3-6',
        type: 'humanReview',
        position: { x: 120, y: 520 },
        data: makeData('humanReview', {
          label: 'Analyst Review',
          purpose: 'Human analyst reviews flagged transactions',
          owner: 'Compliance Analyst',
        }),
      },
      {
        id: 'tpl3-7',
        type: 'escalation',
        position: { x: 580, y: 520 },
        data: makeData('escalation', {
          label: 'Escalate to Compliance',
          purpose: 'Route high-risk cases to compliance officer',
          escalationDestination: 'Chief Compliance Officer',
        }),
      },
      {
        id: 'tpl3-8',
        type: 'humanReview',
        position: { x: 580, y: 650 },
        data: makeData('humanReview', {
          label: 'Compliance Officer Review',
          purpose: 'Senior review of escalated cases',
          owner: 'Chief Compliance Officer',
        }),
      },
      {
        id: 'tpl3-9',
        type: 'stopRollback',
        position: { x: 750, y: 650 },
        data: makeData('stopRollback', {
          label: 'Block Transaction',
          purpose: 'Halt and reverse suspicious transaction',
        }),
      },
      {
        id: 'tpl3-10',
        type: 'monitoringLogging',
        position: { x: 120, y: 650 },
        data: makeData('monitoringLogging', {
          label: 'Log Review Decision',
          purpose: 'Record analyst decision for audit trail',
        }),
      },
      {
        id: 'tpl3-11',
        type: 'outputEnd',
        position: { x: 350, y: 780 },
        data: makeData('outputEnd', {
          label: 'Process Complete',
          purpose: 'Transaction cleared or blocked; case closed',
        }),
      },
    ],
    edges: [
      { id: 'tpl3-e1', source: 'tpl3-1', target: 'tpl3-2', type: 'smoothstep' },
      { id: 'tpl3-e2', source: 'tpl3-2', target: 'tpl3-3', type: 'smoothstep' },
      { id: 'tpl3-e3', source: 'tpl3-3', target: 'tpl3-4', type: 'smoothstep' },
      { id: 'tpl3-e4', source: 'tpl3-3', target: 'tpl3-5', type: 'smoothstep' },
      { id: 'tpl3-e5', source: 'tpl3-5', target: 'tpl3-6', type: 'smoothstep', label: 'Medium Risk' },
      { id: 'tpl3-e6', source: 'tpl3-5', target: 'tpl3-7', type: 'smoothstep', label: 'High Risk' },
      { id: 'tpl3-e7', source: 'tpl3-6', target: 'tpl3-10', type: 'smoothstep' },
      { id: 'tpl3-e8', source: 'tpl3-10', target: 'tpl3-11', type: 'smoothstep' },
      { id: 'tpl3-e9', source: 'tpl3-7', target: 'tpl3-8', type: 'smoothstep' },
      { id: 'tpl3-e10', source: 'tpl3-8', target: 'tpl3-11', type: 'smoothstep', label: 'Cleared' },
      { id: 'tpl3-e11', source: 'tpl3-8', target: 'tpl3-9', type: 'smoothstep', label: 'Block' },
    ],
  },
];
