import * as THREE from 'three';


export function createRubyMaterial(envMap?: THREE.Texture) {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xaa0000),//deep red
    roughness: 0.08,
    metalness: 0.0,
    transmission: 0.5,//glassy
    ior: 1.77,//ruby-ish
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    envMap: envMap || null,
    envMapIntensity: 1.0,
    transparent: true,
    opacity: 1.0,
    depthWrite: true,// <-- crucial: don't write depth so background can show through
    depthTest: true,// <-- keep depth test so nearer opaque objects still occlude
    side: THREE.FrontSide,// avoid double-side overdraw; use DoubleSide only if geometry needs it
  });
}

export function createFresnelOpacityMaterial(color: THREE.ColorRepresentation = 0x00ff00) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uRimPower: { value: 2.0 },
      uOpacity: { value: 1.0 },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewDir = normalize(-mvPosition.xyz);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uRimPower;
      uniform float uOpacity;
      varying vec3 vNormal;
      varying vec3 vViewDir;

      void main() {
        float fresnel = 1.0 - max(0.0, dot(normalize(vNormal), normalize(vViewDir)));
        fresnel = pow(fresnel, uRimPower);

        float alpha = fresnel * uOpacity;

        if (alpha < 0.01) discard;

        gl_FragColor = vec4(uColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,          // 🔑 without this, alpha won’t show background
    depthTest: true,
    blending: THREE.AdditiveBlending, // standard alpha blend
    side: THREE.FrontSide,
  });
}

export function getGlowMaterial(color: THREE.ColorRepresentation = 0x00ff00){
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uStrength: { value: 1.5 },
      uOpacityRate: { value: 0.1 },
      uPower: { value: 2.0 },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        vViewDir = normalize(-mvPos.xyz);
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uStrength;
      uniform float uPower;
      uniform float uOpacityRate;
      varying vec3 vNormal;
      varying vec3 vViewDir;

      void main() {
        float rim = max(0.0, dot(normalize(vNormal), normalize(vViewDir)));
        rim = pow(rim, uPower) * uStrength;

        vec3 glow = uColor * rim;
        gl_FragColor = vec4(glow, rim * uOpacityRate);

        if (gl_FragColor.a < 0.01) discard;
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.FrontSide,
  });
}