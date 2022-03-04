import * as THREE from "three";
import { HTMLIVCElement, MakuConfig, Scroll, Segments } from "../types/types";

// 用于同步HTML元素与WebGL的平面元素
class Maku {
  el: HTMLIVCElement; // 元素
  rect: DOMRect; // 元素矩阵
  mesh: THREE.Mesh | THREE.Points; // 网格
  scene: THREE.Scene; // 所属场景
  segments: Segments; // 细分数
  constructor(
    el: HTMLIVCElement,
    material: THREE.ShaderMaterial,
    scene: THREE.Scene,
    config: MakuConfig = {}
  ) {
    const {
      meshType = "mesh",
      meshSizeType = "size",
      segments = {
        width: 64,
        height: 64,
      },
      textureUniform = "uTexture",
      useTextureLoader = true,
    } = config;

    this.el = el;
    this.scene = scene;
    this.segments = segments;

    // 创建贴图，将其设为材质的uniform
    // 这里为什么优先用TextureLoader？
    // 因为three.js自v135起用了texStorage2D
    // texStorage2D只接受固定尺寸的图片，用CSS缩放大小的图片则不受支持
    // Github的issue地址：https://github.com/mrdoob/three.js/issues/23164
    // 用TextureLoader只是一时之举，希望官方能早日想出更好的修复方案
    const texture =
      useTextureLoader && !(el instanceof HTMLCanvasElement)
        ? new THREE.TextureLoader().load(el.src)
        : new THREE.Texture(el);
    texture.needsUpdate = true;
    const materialCopy = material.clone();
    materialCopy.uniforms[textureUniform].value = texture;

    // 获取图片的DOM矩阵，包含了长宽等信息
    const rect = el.getBoundingClientRect();
    const { width, height } = rect;
    this.rect = rect;

    // 几何体分为2种：
    // 1. 长宽跟DOM矩阵一致（默认）
    // 2. 长宽为单位1，创建为网格后再缩放至原大小
    const geometryMap = {
      size: new THREE.PlaneBufferGeometry(
        width,
        height,
        segments.width,
        segments.height
      ),
      scale: new THREE.PlaneBufferGeometry(
        1,
        1,
        segments.width,
        segments.height
      ),
    };
    const geometry = geometryMap[meshSizeType];

    // 网格分为2种：
    // 1. 点阵网格
    // 2. 普通网格（默认）
    const meshMap = {
      points: new THREE.Points(geometry, materialCopy),
      mesh: new THREE.Mesh(geometry, materialCopy),
    };
    const mesh = meshMap[meshType];
    if (meshSizeType === "scale") {
      mesh.scale.set(width, height, 1);
    }
    scene.add(mesh);
    this.mesh = mesh;
  }
  // 同步位置
  setPosition(deltaY = window.scrollY) {
    const { mesh, rect } = this;
    const { top, left, width, height } = rect;
    const x = left + width / 2 - window.innerWidth / 2;
    const y = -(top + height / 2 - window.innerHeight / 2) + deltaY;
    mesh.position.set(x, y, 0);
  }
  // 消除
  destroy() {
    this.scene.remove(this.mesh);
  }
}

// 同步元素的集合
class MakuGroup {
  makus: Maku[];
  constructor() {
    this.makus = [];
  }
  // 添加元素
  add(maku: Maku) {
    this.makus.push(maku);
    return maku;
  }
  // 批量添加元素
  addMultiple(makus: Maku[]) {
    makus.forEach((maku) => {
      this.add(maku);
    });
  }
  // 批量同步元素位置
  setPositions(deltaY = window.scrollY) {
    const { makus } = this;
    makus.forEach((obj) => {
      obj.setPosition(deltaY);
    });
  }
  // 清空所有元素
  clear() {
    this.makus.forEach((maku) => maku.destroy());
  }
}

// 滚动监听器
class Scroller {
  scroll: Scroll;
  constructor() {
    this.scroll = {
      current: 0,
      target: 0,
      ease: 0.05,
      last: 0,
      delta: 0,
      direction: "",
    };
  }
  // 监听滚动
  listenForScroll() {
    window.addEventListener("scroll", () => {
      const oldScrollY = this.scroll.target;
      const newScrollY = window.scrollY;
      const scrollYDelta = newScrollY - oldScrollY;
      this.scroll.target += scrollYDelta;
    });
  }
  // 同步滚动的数据
  syncScroll() {
    this.scroll.current = THREE.MathUtils.lerp(
      this.scroll.current,
      this.scroll.target,
      this.scroll.ease
    );
    this.scroll.delta = this.scroll.current - this.scroll.last;
    this.scroll.direction = this.scroll.delta > 0 ? "down" : "up";
    this.scroll.last = this.scroll.current;
  }
}

// 获取跟屏幕同像素的fov角度
const getScreenFov = (z: number) => {
  return THREE.MathUtils.radToDeg(2 * Math.atan(window.innerHeight / 2 / z));
};

export { Maku, MakuGroup, Scroller, getScreenFov };
