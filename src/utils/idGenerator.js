let id = 0;

export const generateId = () => `node_${++id}_${Date.now().toString(36)}`;

export const generateEdgeId = () => `edge_${++id}_${Date.now().toString(36)}`;
