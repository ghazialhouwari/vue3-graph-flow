export interface NodeModel {
  id: number;
  x: number;
  y: number;
}
export interface ConnectorModel {
  id: number;
  sourceId: number;
  targetId: number;
}
export interface Stub {
  x: number;
  y: number;
}

type Angle = 0 | 1;
export interface Segment {
  x: number;
  y: number;
  key: "M" | "L" | "A"; // move, line, arc
  angle?: Angle;
}

export interface Rect {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
  x?: number;
  y?: number;
}
export interface Position {
  top: number;
  left: number;
}
export interface Offset {
  x: number;
  y: number;
}

export interface PanCallback {
  onScale: Function;
  onPanDrag: Function;
}
