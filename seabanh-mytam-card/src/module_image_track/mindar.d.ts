import * as THREE from 'three';

export {};

declare global {
  interface Window {
    MINDAR: any; // you can make this stricter if needed
  }
}

export type threeObj = {
  scene: THREE.Scene,
  cam: THREE.PerspectiveCamera,
  root: THREE.Group,
  renderer: THREE.WebGLRenderer
}