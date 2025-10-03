import { initCard } from './ultilities/startUp';
import * as glbLoader from "./ultilities/loaderGlb";
import * as customMat from './ultilities/customMaterial'
import * as fbxLoader from "./ultilities/loaderFbx";
import * as THREE from "three";


const clock = new THREE.Clock();

async function init() {
  const cardObjs = await initCard();//console.log(cardObjs);  
  /*
  try {
    const gltf = await glbLoader.FetchGLB(
      `https://client-resource.marvyco.com/seaBank/myTamCard/mira/mira.glb`,
      0.0025,
      true
    );
    if (gltf != null) {
      cardObjs.threeObjs.root.add(gltf.scene);
      if (gltf.animations.length > 0) {//console.log("Available animations:", gltf.animations.map(a => a.name));
        let mixer = new THREE.AnimationMixer(gltf.scene);
        const action = mixer.clipAction(gltf.animations[0]);// play first animation
        action.play();

        cardObjs.onUpdates.push(() => {
          const delta = clock.getDelta();
          mixer.update(delta);
        });
      }
      console.log("Loaded glb:", gltf.scene);
    }    
  }
  catch (err) { console.error("Failed to load GLB:", err); }
  */
  try {
    const fbx = await fbxLoader.FetchFBX(
      `https://client-resource.marvyco.com/seaBank/myTamCard/heart_ref.fbx`,
      0.25,
      true
    );
    if (fbx != null) {
      cardObjs.threeObjs.root.add(fbx);
      console.log("Loaded glb:", typeof(fbx.children[0]));
      
      if (fbx.children[0] instanceof THREE.Mesh) {
        fbx.children[0].material.dispose();
        fbx.children[0].material = customMat.createRubyMaterial();
        fbx.children[0].material.needsUpdate = true;
      }
    }    
  }
  catch (err) { console.error("Failed to load FBX:", err); }

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5),
    customMat.createFresnelOpacityMaterial(0x00ff00)//customMat.getGlowMaterial(0x0000ff)
  );
  sphere.renderOrder = 999;
  cardObjs.threeObjs.root.add(sphere);
};

init();