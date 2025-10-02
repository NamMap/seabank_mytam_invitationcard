import { ImageTracker } from "../module_image_track/tracker";
import * as EnvMap from './EnvirontmentMap';


const mindarScript = "https://cdn.jsdelivr.net/npm/mind-ar@1.1.5/dist/mindar-image-three.prod.js";//mindarScript;
let onFound = () => { console.log("onFound has yet implement"); }
let onLost = () => { console.log("onLost has yet implement"); }
let onUpdates: (()=>{})[] = [];
let time = { stamp: performance.now(), total: 0.0 }
let isTracking: boolean = false;

async function loadMindAR(): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = mindarScript;
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
    document.body.appendChild(script);
  });
}

export async function initCard(): Promise<cardInitObj> {

    await loadMindAR();
    
    const base = import.meta.env.BASE_URL;
    console.log(window.MINDAR.IMAGE.THREE.REVISION);
    const tracker = new ImageTracker(`${base}textures/card.mind`);

    const threeObj = tracker.getThreeObjects();
    tracker.onFound = () =>{
        
        isTracking = true;
        time.stamp = performance.now();
        time.total = 0.0;
        console.log(time,"+++++++++++++++++++")

        onFound();        
        requestAnimationFrame(updateComponent);
    };
    tracker.onLost = () => { 
        isTracking = false;
        onLost();
    };

    EnvMap.applyEnvMapFromPNG(
        threeObj.scene,
        threeObj.renderer,
        `${base}textures/test_HDRI.png`,
        0.75
    );
    await tracker.start();

    return {
        onFound: onFound,
        onLost: onLost,
        onUpdate: onUpdates,
        time: time,
        threeObjs: threeObj
    };
};


function updateComponent(): void {
  const now = performance.now();
  time.total += (now - time.stamp)/1000.0;
  time.stamp = now;
  console.log(time,"<<<<update")

  onUpdates.forEach(fn=>{ fn(); });
  if (isTracking) { requestAnimationFrame(updateComponent); }
}

type cardInitObj = {    
    onFound: ()=>void,
    onLost: ()=>void,
    onUpdate: (()=>void)[]
    time: {
        stamp: number,
        total: number
    },
    threeObjs: {
      scene: THREE.Scene,
      cam: THREE.PerspectiveCamera,
      root: THREE.Group,
      renderer: THREE.WebGLRenderer
    }
}