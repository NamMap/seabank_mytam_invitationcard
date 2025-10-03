import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { convertMaterialsToPhysical } from "./convertMaterial";


export async function loadFBX(url: string): Promise<THREE.Group> {//Promise-based FBX loader
  const loader = new FBXLoader();

  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (object) => { resolve(object); },
      (xhr) => { console.log(Math.round((xhr.loaded / xhr.total) * 100) + "% loaded"); },
      (error) => reject(error)
    );
  });
}

export async function FetchFBX(
  url: string,
  scale: number = 1,
  isConvert: boolean = false
): Promise<THREE.Group | null> {
  try {
    const fbx = await loadFBX(url);
    fbx.scale.set(scale, scale, scale);
    if (isConvert) { convertMaterialsToPhysical(fbx); }
    return fbx;
  }
  catch (err) { return null; }//console.error("❌ Failed to load FBX:", err);
}