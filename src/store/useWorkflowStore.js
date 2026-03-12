import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';

const useWorkflowStore = create((set, get) => ({
  // App State
  currentScreen: 'scenarioSelection',
  selectedScenarioId: null,

  // React Flow State
  nodes: [],
  edges: [],

  // Selection
  selectedNodeId: null,

  // Panel State
  activeRightPanel: 'config',
  activeBottomPanel: 'validation',
  bottomPanelExpanded: true,

  // Navigation
  selectScenario: (scenarioId) =>
    set({
      selectedScenarioId: scenarioId,
      currentScreen: 'builder',
      nodes: [],
      edges: [],
      selectedNodeId: null,
    }),

  returnToScenarios: () =>
    set({
      currentScreen: 'scenarioSelection',
      selectedScenarioId: null,
      nodes: [],
      edges: [],
      selectedNodeId: null,
      rationale: '',
      reflection: '',
    }),

  // React Flow Handlers
  onNodesChange: (changes) =>
    set({ nodes: applyNodeChanges(changes, get().nodes) }),

  onEdgesChange: (changes) =>
    set({ edges: applyEdgeChanges(changes, get().edges) }),

  onConnect: (connection) =>
    set({
      edges: addEdge(
        { ...connection, type: 'smoothstep', animated: true },
        get().edges
      ),
    }),

  // Node Management
  addNode: (node) => set({ nodes: [...get().nodes, node] }),

  selectNode: (nodeId) =>
    set({
      selectedNodeId: nodeId,
      activeRightPanel: nodeId ? 'config' : get().activeRightPanel,
    }),

  updateNodeData: (nodeId, dataUpdate) =>
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...dataUpdate } }
          : node
      ),
    }),

  deleteNode: (nodeId) =>
    set({
      nodes: get().nodes.filter((n) => n.id !== nodeId),
      edges: get().edges.filter(
        (e) => e.source !== nodeId && e.target !== nodeId
      ),
      selectedNodeId:
        get().selectedNodeId === nodeId ? null : get().selectedNodeId,
    }),

  // Templates
  loadTemplate: (template) =>
    set({
      nodes: template.nodes.map((n) => ({ ...n, data: { ...n.data } })),
      edges: template.edges.map((e) => ({ ...e })),
      selectedNodeId: null,
    }),

  clearWorkflow: () =>
    set({ nodes: [], edges: [], selectedNodeId: null }),

  // Panel Management
  setActiveRightPanel: (panel) => set({ activeRightPanel: panel }),
  setActiveBottomPanel: (panel) => set({ activeBottomPanel: panel }),
  toggleBottomPanel: () =>
    set({ bottomPanelExpanded: !get().bottomPanelExpanded }),

  // Submission
  rationale: '',
  reflection: '',
  setRationale: (text) => set({ rationale: text }),
  setReflection: (text) => set({ reflection: text }),
}));

export default useWorkflowStore;
