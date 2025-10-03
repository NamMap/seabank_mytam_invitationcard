import * as THREE from "three";
import * as imgUtil from "./trackerUtil";
import type { threeObj } from "./mindar";

export class ImageTracker {
  private mindarThree: any;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private anchor: any;
  private smoothedGroup: THREE.Group;
  private lastMatrix: THREE.Matrix4 = new THREE.Matrix4();
  private smoothingFactor = 0.25;

  public onFound?: () => void;
  public onLost?: () => void;

  constructor(targetUrl: string) {
    const arContainer = document.createElement("div");//Create a dedicated AR container    
    imgUtil.injectStyles(arContainer);

    this.mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: arContainer,
      imageTargetSrc: targetUrl,
      uiLoading: false,
      uiScanning: false,
      uiError: false
    });

    this.scene = this.mindarThree.scene;
    this.camera = this.mindarThree.camera;
    this.renderer = this.mindarThree.renderer;
    this.renderer.sortObjects = true;//************************************ */
    this.anchor = this.mindarThree.addAnchor(0);
    this.smoothedGroup = new THREE.Group();
    this.scene.add(this.smoothedGroup);
    //this.smoothedGroup.add(imgUtil.creategizmo());//************************************ */

    this.anchor.onTargetFound = () => {
      this.lastMatrix.copy(this.anchor.group.matrixWorld); // avoid first-frame jump
      if (this.onFound) this.onFound();
    };
    this.anchor.onTargetLost = () => { if (this.onLost) this.onLost(); };
  }

  async start(): Promise<void> {
    await this.mindarThree.start();

    const resize = () => { this.renderer.setSize(window.innerWidth, window.innerHeight); };
    window.addEventListener("resize", resize);
    resize();

    this.renderer.setAnimationLoop(() => {
      this.lastMatrix = imgUtil.smoothAnchor(
        this.anchor.group,
        this.smoothedGroup,
        this.lastMatrix,
        this.smoothingFactor
      );
      this.renderer.render(this.scene, this.camera);
    });
  }

  stop(): void {
    this.mindarThree.stop();
    this.renderer.setAnimationLoop(null);
  }

  getThreeObjects(): threeObj {
    return { 
      scene: this.scene,
      cam: this.camera,
      root: this.smoothedGroup,
      renderer: this.renderer
    };
  }
}
