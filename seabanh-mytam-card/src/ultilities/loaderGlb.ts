import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { convertMaterialsToPhysical } from "./convertMaterial";


export async function loadGLB(url: string): Promise<GLTF> {
  const loader = new GLTFLoader();

  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (gltf) => { resolve(gltf); },
      (xhr) => { console.log(Math.round((xhr.loaded / xhr.total) * 100) + "% loaded"); },
      (error) => reject(error)
    );
  });
}

export async function FetchGLB(
  url: string,
  scale: number = 1,
  isConvert: boolean = false,
): Promise<GLTF | null> {
  try {
    const gltf = await loadGLB(url);
    gltf.scene.scale.set(scale,scale,scale);//console.log(gltf.scene,scale);
    if (isConvert) { convertMaterialsToPhysical(gltf.scene); }    
    return gltf;
  }
  catch(err) { return null; }//console.error("Failed to load GLB:", err);
}