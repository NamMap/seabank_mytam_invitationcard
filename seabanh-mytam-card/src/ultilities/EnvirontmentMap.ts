import * as THREE from "three";

export function applyEnvMapFromPNG(
    scene: THREE.Scene,
    renderer: THREE.WebGLRenderer,
    path: string,
    tone: number = 1.2,
    bgColor: number | null = null
) {
  const loader = new THREE.TextureLoader();
  loader.load(path, (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;

    scene.environment = texture;  // reflections
    

    if (bgColor !== null) {
      scene.background = new THREE.Color(bgColor);
    }
    else{
      scene.background = null;      // keep AR camera visible      
    }

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = tone;
  });
}