import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

// ✅ Promise-based FBX loader
export async function loadFBX(url: string, scale = 1): Promise<THREE.Group> {
  const loader = new FBXLoader();

  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (object) => {
        // FBX models are often big, scale down
        object.scale.set(scale, scale, scale);
/*
        // Traverse and check textures
        object.traverse((child: any) => {
          if (child.isMesh) {
            if (child.material.map) {
              console.log("Texture found for:", child.name);
            }
            else {
              console.warn("No texture for:", child.name);
            }
            child.material.side = THREE.DoubleSide;
            child.material.needsUpdate = true;
          }
        });
*/
        resolve(object);
      },
      (xhr) => {
        console.log(Math.round((xhr.loaded / xhr.total) * 100) + "% loaded");
      },
      (error) => reject(error)
    );
  });
}