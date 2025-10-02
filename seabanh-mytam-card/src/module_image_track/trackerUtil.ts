import * as THREE from "three";


export function injectStyles(container: HTMLElement) {//Inject CSS for video & canvas
  document.body.appendChild(container);
  container.id = "ar-container";
  container.style.position = "relative";
  container.style.width = "100%";
  container.style.height = "100%";
  const id = container.id;// || "mindar-container";

  if (document.getElementById(`style-${id}`)) return;
  const style = document.createElement("style");
  style.id = `style-${id}`;
  style.textContent = `
    #${id} video {
      position: absolute !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
      width: 100% !important;
      height: 100% !important;
      object-fit: cover !important;
      z-index: 0 !important;
    }
    #${id} canvas {      
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
    }
  `;
  document.head.appendChild(style);
}

export function lerpMatrix(
  m1: THREE.Matrix4,
  m2: THREE.Matrix4,
  alpha: number
): THREE.Matrix4 {//Interpolate two matrices (position + rotation + scale)
  const pos1 = new THREE.Vector3(), pos2 = new THREE.Vector3();
  const quat1 = new THREE.Quaternion(), quat2 = new THREE.Quaternion();
  const scale1 = new THREE.Vector3(), scale2 = new THREE.Vector3();

  m1.decompose(pos1, quat1, scale1);
  m2.decompose(pos2, quat2, scale2);

  const pos = pos1.lerp(pos2, alpha);
  const quat = quat1.slerp(quat2, alpha);
  const scale = scale1.lerp(scale2, alpha);

  return new THREE.Matrix4().compose(pos, quat, scale);
}

export function smoothAnchor(
  anchorGroup: THREE.Object3D,
  smoothedGroup: THREE.Group,
  lastMatrix: THREE.Matrix4,
  smoothingFactor: number
): THREE.Matrix4 {//Smooth anchor transform into smoothedGroup
  if (!anchorGroup.visible) {
    smoothedGroup.visible = false;
    return lastMatrix;
  }

  smoothedGroup.visible = true;

  const currentMatrix = anchorGroup.matrixWorld.clone();
  const newMatrix = lerpMatrix(lastMatrix, currentMatrix, smoothingFactor);

  smoothedGroup.matrix.copy(newMatrix);
  smoothedGroup.matrix.decompose(
    smoothedGroup.position,
    smoothedGroup.quaternion,
    smoothedGroup.scale
  );

  return newMatrix;
}

export function creategizmo(): THREE.Group {
  const group = new THREE.Group();
  for (let i=0;i<3;i++) { group.add(createMeshBox(i)); }
  return group;
}

function createMeshBox(id: number = 0): THREE.Mesh {
  id = Math.min(2,Math.max(0,id));
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),  
    new THREE.MeshBasicMaterial({ 
      color: id == 0 ? 0xff0000 : (id == 1 ? 0x00ff00 : 0x0000ff),
      transparent: true,
      opacity: 0.25,
      wireframe: false
    })    
  );
  cube.scale.set(id == 0 ? 1.0 : 0.1, id == 1 ? 1.0 : 0.1, id == 2 ? 1.0 : 0.1);
  cube.position.set(id == 0 ? 0.5 : 0, id == 1 ? 0.5 : 0, id == 2 ? 0.5 : 0);
  return cube;
}