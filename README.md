<h1 align="center">Welcome to maku.js 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/npm/v/maku.js.svg" />
  <a href="https://github.com/alphardex/maku.js/blob/main/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://twitter.com/alphardex007" target="_blank">
    <img alt="Twitter: alphardex007" src="https://img.shields.io/twitter/follow/alphardex007.svg?style=social" />
  </a>
</p>

> A bridge between HTML and WebGL(three.js).

![](https://i.loli.net/2021/10/15/oAHf84UvLmztTyO.gif)

## Install

```sh
npm i maku.js
```

## Usage

1. Define some images in your HTML, and make them transparent

```html
<canvas id="sketch"></canvas>
<div class="gallery-container">
  <ul class="gallery">
    <li class="gallery-item">
      <img
        src="https://s2.loli.net/2023/12/26/U9i6aQ7c1Wfd4th.jpg"
        class="gallery-item-img"
        alt=""
      />
      <div class="gallery-item-text">Image one</div>
    </li>
    <!-- ... -->
  </ul>
</div>
```

```css
img {
  opacity: 0;
}
```

2. Use `Maku` Class to sync HTML with WebGL

```js
import * as THREE from "three";
import Lenis from "@studio-freight/lenis";
import { getScreenFov, Maku, MakuGroup } from "maku.js";

const width = window.innerWidth,
  height = window.innerHeight;

const z = 600;
const fov = getScreenFov(z, height);
const camera = new THREE.PerspectiveCamera(fov, width / height, 100, 2000);
camera.position.z = z;

// Create scene
const scene = new THREE.Scene();

// Create renderer
const canvas = document.querySelector("#sketch");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
renderer.setAnimationLoop(animation);

// Create clock
const clock = new THREE.Clock();

// Create main objects
const textureLoader = new THREE.TextureLoader();

const material = new THREE.ShaderMaterial({
  vertexShader: /* glsl */ `
uniform float iTime;
uniform vec2 iResolution;

varying vec2 vUv;

void main(){
    vec3 p=position;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
    
    vUv=uv;
}
  `,
  fragmentShader: /* glsl */ `
varying vec2 vUv;

uniform sampler2D iChannel0;

void main(){
    vec2 uv=vUv;
    vec4 tex=texture(iChannel0,uv);
    vec3 col=tex.xyz;
    gl_FragColor=vec4(col,1.);
}
  `,
  uniforms: {
    iChannel0: {
      value: null,
    },
    iTime: {
      value: clock.getElapsedTime(),
    },
    iResolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight),
    },
  },
});
const elList = [...document.querySelectorAll(".gallery-item-img")];
const makuGroup = new MakuGroup();
const makus = elList.map(
  (image) =>
    new Maku(image, material, scene, {
      meshSizeType: "scale",
      textureUniform: "iChannel0",
      textureLoader,
    })
);
makuGroup.addMultiple(makus);

makuGroup.syncPositions();

// Create scroller
const lenis = new Lenis({
  smoothTouch: true,
  syncTouch: true,
});

// Handle animation
function animation(time) {
  lenis.raf(time);

  makuGroup.makus.forEach((maku) => {
    const { mesh } = maku;
    mesh.material.uniforms.iTime.value = clock.getElapsedTime();
    mesh.material.uniforms.iResolution.value = new THREE.Vector2(
      window.innerWidth,
      window.innerHeight
    );
  });
  makuGroup.syncPositions();

  renderer.render(scene, camera);
}

// Handle resize
function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));

  if (camera instanceof THREE.PerspectiveCamera) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.fov = getScreenFov(camera.position.z, window.innerHeight);
    camera.updateProjectionMatrix();
  }

  makuGroup.syncPositions();
  makuGroup.syncScales();
}

window.addEventListener("resize", resize);

// And the basic setup is done!
// For more, you should visit demos below.
// https://codepen.io/collection/xKGjro
```

Link for this setup: [Click Me](https://codepen.io/alphardex/pen/bGrVzvO)

## Demos

[Click Me](https://codepen.io/collection/xKGjro)

## Author

👤 **alphardex**

- Website: https://alphardex.netlify.app/#/
- Twitter: [@alphardex007](https://twitter.com/alphardex007)
- Github: [@alphardex](https://github.com/alphardex)

## Show your support

Give a ⭐️ if this project helped you!

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
