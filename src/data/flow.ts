import type { NodeModel, ConnectorModel } from "@/utils/types";

const nodes: NodeModel[] = [
  {
    id: 1,
    x: 80,
    y: 80,
  },
  {
    id: 2,
    x: 400,
    y: 200,
  },
  {
    id: 3,
    x: 800,
    y: 150,
  },
  {
    id: 4,
    x: 700,
    y: 450,
  },
];

const connectors: ConnectorModel[] = [
  {
    id: 1,
    sourceId: 1,
    targetId: 2,
  },
  {
    id: 2,
    sourceId: 2,
    targetId: 3,
  },
  {
    id: 3,
    sourceId: 3,
    targetId: 4,
  },
];

export default { nodes, connectors };
