import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

export async function loadGLB(url: string): Promise<GLTF> {
  const loader = new GLTFLoader();

  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (gltf) => {
        /*
        const scene = gltf.scene;
        scene.scale.set(scale, scale, scale);
        
        let mixer: THREE.AnimationMixer | null = null;

        if (gltf.animations && gltf.animations.length > 0) {
            console.log(gltf.animations);
          mixer = new THREE.AnimationMixer(scene);
          const action = mixer.clipAction(gltf.animations[0]); // play first anim
          action.play();
        }
        */
        resolve(gltf);
      },
      (xhr) => {
        console.log(Math.round((xhr.loaded / xhr.total) * 100) + "% loaded");
      },
      (error) => reject(error)
    );
  });
}
