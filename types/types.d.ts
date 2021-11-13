export type HTMLIVCElement =
  | HTMLImageElement
  | HTMLVideoElement
  | HTMLCanvasElement;

export type MeshType = "mesh" | "points";

export type MeshSizeType = "size" | "scale";

export interface Scroll {
  current: number;
  target: number;
  ease: number;
  last: number;
  delta: number;
  direction: "up" | "down" | "";
}

export interface Segments {
  width: number;
  height: number;
}
