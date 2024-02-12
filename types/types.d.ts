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

export interface MakuConfig {
  meshType?: MeshType;
  meshSizeType?: MeshSizeType;
  segments?: Segments;
  textureUniform?: string;
  useTextureLoader?: boolean;
  textureLoader?: THREE.TextureLoader;
  isRectAutoRefreshed?: boolean;
}
