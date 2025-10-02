import * as THREE from "three";

export function convertMaterialsToPhysical(root: THREE.Object3D) {
  root.traverse((child: any) => {
    if (child.isMesh && child.material) {
      const oldMat = child.material;
      const newMat = new THREE.MeshPhysicalMaterial({
        map: oldMat.map || null,
        normalMap: oldMat.normalMap || null,
        roughnessMap: oldMat.roughnessMap || null,
        metalnessMap: oldMat.metalnessMap || null,
        emissiveMap: oldMat.emissiveMap || null,
        aoMap: oldMat.aoMap || null,
        envMap: oldMat.envMap || null,

        color: oldMat.color ? oldMat.color.clone() : new THREE.Color(0xffffff),
        roughness: oldMat.roughness !== undefined ? oldMat.roughness : 1,
        metalness: oldMat.metalness !== undefined ? oldMat.metalness : 0,

        transparent: oldMat.transparent || false,
        opacity: oldMat.opacity !== undefined ? oldMat.opacity : 1.0,

        side: THREE.FrontSide, // ✅ fix backface issue
      });

      child.material = newMat;
      child.material.needsUpdate = true;
    }
  });
}
