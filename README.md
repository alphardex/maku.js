<h1 align="center">Welcome to maku.js 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
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
npm i maku.js three --save
```

## Usage

1. Define some images in your HTML

```html
<div class="image-plane fixed z-0 w-screen h-screen pointer-events-none"></div>
<div class="bg-black">
  <div class="h-20"></div>
  <div class="gallery">
    <img
      class="gallery-item"
      src="https://i.loli.net/2021/10/09/UwaE61hgctofAFL.jpg"
      crossorigin="anonymous"
      alt=""
    />
    ...
  </div>
  <div class="h-20"></div>
</div>
```

2. Use `Maku` Class to sync HTML with WebGL

```js
// define your scene, camera, renderer, etc.
const scene = new THREE.Scene();
...

// Select all the images you want to render in WebGL
const images = [...document.querySelectorAll("img")];

// Your own vertex shader
const imagePlaneMainVertexShader = `
varying vec2 vUv;

void main(){
    vec4 modelPosition=modelMatrix*vec4(position,1.);
    vec4 viewPosition=viewMatrix*modelPosition;
    vec4 projectedPosition=projectionMatrix*viewPosition;
    gl_Position=projectedPosition;

    vUv=uv;
}
`;

// Your own fragment shader
const imagePlaneMainFragmentShader = `
uniform sampler2D uTexture;

varying vec2 vUv;

void main(){
    vec4 texture=texture2D(uTexture,vUv);
    vec3 color=texture.rgb;
    gl_FragColor=vec4(color,1.);
}
`;

// Create a ShaderMaterial
const imagePlaneMaterial = new THREE.ShaderMaterial({
  vertexShader: imagePlaneMainVertexShader,
  fragmentShader: imagePlaneMainFragmentShader,
  side: THREE.DoubleSide,
  uniforms:
    uTexture: {
      value: null,
    },
  },
});

// Make a MakuGroup that contains all the makus!
const makuGroup = new MakuGroup();
const makus = images.map(
  (image) => new Maku(image, imagePlaneMaterial, scene)
);
makuGroup.addMultiple(makus);

// Sync images positions
makuGroup.setPositions();

// And the basic setup is done!
// For more, you should visit demos below.
```

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
