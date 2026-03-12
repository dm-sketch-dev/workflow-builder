export const SCENARIOS = [
  {
    id: 'customer-service-triage',
    title: 'AI Triage of Customer Service Requests',
    shortTitle: 'Customer Service Triage',
    description:
      'An AI system classifies incoming customer service tickets by urgency, topic, and sentiment, then routes them to appropriate teams or auto-responds to simple queries.',
    icon: 'Headphones',
    suggestedDatasets: ['customer-tickets', 'customer-profiles', 'product-catalog'],
    complexity: 'moderate',
    keyRisks: [
      'Misclassification of urgent issues',
      'Bias in routing decisions',
      'PII exposure in auto-responses',
    ],
    learningObjectives: [
      'Design appropriate human oversight for AI classification',
      'Build escalation paths for edge cases',
      'Implement monitoring for classification accuracy',
    ],
  },
  {
    id: 'management-summaries',
    title: 'AI Generation of Internal Management Summaries',
    shortTitle: 'Management Summaries',
    description:
      'An AI system reads internal reports, meeting notes, and performance data to generate weekly executive summaries for senior leadership.',
    icon: 'FileText',
    suggestedDatasets: ['internal-reports', 'meeting-notes', 'performance-metrics'],
    complexity: 'low',
    keyRisks: [
      'Hallucinated statistics',
      'Loss of nuance in summarization',
      'Confidential data leakage to wrong audience',
    ],
    learningObjectives: [
      'Balance automation with accuracy verification',
      'Protect confidential data in summarization',
      'Design review workflows for generated content',
    ],
  },
  {
    id: 'invoice-review',
    title: 'AI Review of Invoices and Expense Reports',
    shortTitle: 'Invoice & Expense Review',
    description:
      'An AI system scans invoices and expense reports for policy compliance, flags anomalies, and routes approvals based on amount thresholds.',
    icon: 'Receipt',
    suggestedDatasets: ['invoices', 'expense-policies', 'vendor-database', 'employee-records'],
    complexity: 'moderate',
    keyRisks: [
      'Fraud false negatives',
      'Incorrect policy application',
      'Financial data exposure',
    ],
    learningObjectives: [
      'Design threshold-based escalation',
      'Implement audit trails for financial processes',
      'Balance efficiency with fraud detection accuracy',
    ],
  },
  {
    id: 'employee-onboarding',
    title: 'AI Support for Employee Onboarding',
    shortTitle: 'Employee Onboarding',
    description:
      'An AI assistant guides new employees through onboarding tasks, answers HR policy questions, schedules training, and personalizes the onboarding experience.',
    icon: 'UserPlus',
    suggestedDatasets: ['hr-policies', 'training-catalog', 'employee-records', 'benefits-data'],
    complexity: 'low',
    keyRisks: [
      'Incorrect policy guidance',
      'PII mishandling of employee data',
      'Incomplete onboarding steps',
    ],
    learningObjectives: [
      'Design safeguards for HR information accuracy',
      'Build feedback loops into AI interactions',
      'Handle sensitive employee data appropriately',
    ],
  },
  {
    id: 'suspicious-transactions',
    title: 'AI Identification of Suspicious Transactions',
    shortTitle: 'Suspicious Transaction Detection',
    description:
      'An AI system monitors financial transactions in real-time, flags suspicious patterns, and triggers investigation workflows for potential fraud or money laundering.',
    icon: 'ShieldAlert',
    suggestedDatasets: ['transaction-logs', 'customer-profiles', 'watchlists', 'regulatory-rules'],
    complexity: 'high',
    keyRisks: [
      'False negatives allowing fraud',
      'Regulatory non-compliance',
      'Discriminatory flagging patterns',
    ],
    learningObjectives: [
      'Design high-stakes escalation and rollback procedures',
      'Implement regulatory compliance checkpoints',
      'Balance false positive rate with risk tolerance',
    ],
  },
];
