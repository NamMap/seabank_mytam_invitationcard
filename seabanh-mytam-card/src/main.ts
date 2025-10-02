import { initCard } from './ultilities/startUp';
//import { loadFBX } from "./ultilities/loaderFbx";
import { loadGLB } from "./ultilities/loaderGlb";
import { convertMaterialsToPhysical } from "./ultilities/convertMaterial";
import * as THREE from "three";

const clock = new THREE.Clock();

(async () => {
  const cardObjs = await initCard();
  console.log(cardObjs);

  try {
      const gltf = await loadGLB("https://client-resource.marvyco.com/seaBank/myTamCard/mira/mira.glb");
      gltf.scene.scale.set(0.0025,0.0025,0.0025);
      convertMaterialsToPhysical(gltf.scene);
      const clock = new THREE.Clock();
      cardObjs.threeObjs.root.add(gltf.scene);

      if (gltf.animations.length > 0) {
        let mixer = new THREE.AnimationMixer(gltf.scene);

        // play first animation
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();

        //console.log("Available animations:", gltf.animations.map(a => a.name));

        cardObjs.onUpdate.push(() => {
          const delta = clock.getDelta();
          mixer.update(delta);
        });
      }
      console.log("Loaded FBX:", gltf.scene);
    }
    catch (err) { console.error("Failed to load FBX:", err); }
})();