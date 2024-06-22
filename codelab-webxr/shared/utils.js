/*
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

window.gltfLoader = new THREE.GLTFLoader();
window.fontLoader = new THREE.FontLoader();
/**
 * The Reticle class creates an object that repeatedly calls
 * `xrSession.requestHitTest()` to render a ring along a found
 * horizontal surface.
 */
class Reticle extends THREE.Object3D {
  constructor() {
    super();

    this.loader = new THREE.GLTFLoader();
    this.loader.load("https://immersive-web.github.io/webxr-samples/media/gltf/reticle/reticle.gltf", (gltf) => {
      this.add(gltf.scene);
    })

    this.visible = false;
  }
}


window.gltfLoader.load("https://immersive-web.github.io/webxr-samples/media/gltf/sunflower/sunflower.gltf", function(gltf) {
  const flower = gltf.scene.children.find(c => c.name === 'sunflower')
  flower.castShadow = true;
  // flower.traverse(function(node){
  //   console.log('Name: ', node.name, ' Type: ', node.type);
  // });
  window.flower = gltf.scene;
});


window.gltfLoader.load("../assets/boing.glb", function(gltf) {
  const sphere = gltf.scene;
  // sphere.castShadow = true;'
  if(sphere){
    console.log("yay");
  }
  else{
    console.log("womp womp");
  }
  sphere.scale.x /= 10;
  sphere.scale.y /= 10;
  sphere.scale.z /= 10;
  window.sphere = gltf.scene;
});

window.gltfLoader.load("../assets/animate.glb", function(gltf) {
  const globe = gltf.scene;
  // globe.castShadow = true;
  globe.scale.x /= 10;
  globe.scale.y /= 10;
  globe.scale.z /= 10;

  window.globe = gltf.scene;
});

window.gltfLoader.load("../assets/animate.glb", function(gltf) {
  const scene = gltf.scene;
  for(i in gltf.animations){
    console.log(i);
    console.log("hehe bway")
  };
  scene.traverse(function(node){
    // if (node.isObject3D && !(node.isMesh)) {
    //   const mesh = convertToMesh(node);
    //   if (mesh) {
    //     // Replace the child in the scene with the new mesh
    //     child.parent.add(mesh);
    //     child.parent.remove(child);
    //   }
    // }
    console.log('Name: ', node.name, ' Type: ', node.type);
    console.log('wicklicky');
  });
});


fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
  // Create text geometry
  const geometry = new THREE.TextGeometry('TAH Virtual Exhibit', {
    font: font,
    size: 0.25,
    height: 0.1,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5
  });

  // Create a material
  const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
  
  // Create a mesh and add it to the scene
  const textMesh = new THREE.Mesh(geometry, material);
  textMesh.scale /= 3;

  window.textMesh = textMesh;
});




const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

// Set canvas size
canvas.width = 512;
canvas.height = 256;

// Text properties
const fontSize = 48;
const font = `20px Arial`;
const text = 'IBM TAH Virtual Exhibit';
const textColor = 'blue';
const outlineColor = 'black';
const outlineWidth = 2;

// Set font properties
context.font = font;
context.textAlign = 'center';
context.textBaseline = 'middle';

// Draw the outline
context.strokeStyle = outlineColor;
context.lineWidth = outlineWidth;
context.strokeText(text, canvas.width / 2, canvas.height / 2);

// Draw the text
context.fillStyle = textColor;
context.fillText(text, canvas.width / 2, canvas.height / 2);

// Create texture from canvas
const texture = new THREE.CanvasTexture(canvas);

// Create material
const material = new THREE.SpriteMaterial({ map: texture });

// Create sprite
const sprite = new THREE.Sprite(material);
sprite.scale.set(5, 2.5, 1); // Adjust size of the sprite

window.sprite = sprite;







console.log("zooweemama");


window.DemoUtils = {
  /**
   * Creates a THREE.Scene containing lights that case shadows,
   * and a mesh that will receive shadows.
   *
   * @return {THREE.Scene}
   */
  createLitScene() {
    const scene = new THREE.Scene();

    // The materials will render as a black mesh
    // without lights in our scenes. Let's add an ambient light
    // so our material can be visible, as well as a directional light
    // for the shadow.
    const light = new THREE.AmbientLight(0xffffff, 1);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight.position.set(10, 15, 10);

    // We want this light to cast shadow.
    directionalLight.castShadow = true;

    // Make a large plane to receive our shadows
    const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
    // Rotate our plane to be parallel to the floor
    planeGeometry.rotateX(-Math.PI / 2);

    // Create a mesh with a shadow material, resulting in a mesh
    // that only renders shadows once we flip the `receiveShadow` property.
    const shadowMesh = new THREE.Mesh(planeGeometry, new THREE.ShadowMaterial({
      color: 0x111111,
      opacity: 0.2,
    }));

    // Give it a name so we can reference it later, and set `receiveShadow`
    // to true so that it can render our model's shadow.
    shadowMesh.name = 'shadowMesh';
    shadowMesh.receiveShadow = true;
    shadowMesh.position.y = 10000;

    // Add lights and shadow material to scene.
    scene.add(shadowMesh);
    scene.add(light);
    scene.add(directionalLight);

    return scene;
  },

  /**
   * Creates a THREE.Scene containing cubes all over the scene.
   *
   * @return {THREE.Scene}
   */
  createCubeScene() {
    const scene = new THREE.Scene();

    const materials = [
      new THREE.MeshBasicMaterial({ color: 0xff0000 }),
      new THREE.MeshBasicMaterial({ color: 0x0000ff }),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
      new THREE.MeshBasicMaterial({ color: 0xff00ff }),
      new THREE.MeshBasicMaterial({ color: 0x00ffff }),
      new THREE.MeshBasicMaterial({ color: 0xffff00 })
    ];

    const ROW_COUNT = 4;
    const SPREAD = 1;
    const HALF = ROW_COUNT / 2;
    for (let i = 0; i < ROW_COUNT; i++) {
      for (let j = 0; j < ROW_COUNT; j++) {
        for (let k = 0; k < ROW_COUNT; k++) {
          const box = new THREE.Mesh(new THREE.BoxBufferGeometry(0.2, 0.2, 0.2), materials);
          box.position.set(i - HALF, j - HALF, k - HALF);
          box.position.multiplyScalar(SPREAD);
          scene.add(box);
        }
      }
    }

    return scene;
  },
};

/**
 * Toggle on a class on the page to disable the "Enter AR"
 * button and display the unsupported browser message.
 */
function onNoXRDevice() {
  document.body.classList.add('unsupported');
}