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


window.gltfLoader.load("../assets/cube.gltf", function(gltf) {
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

function map(){
  // const N = 20;

  // const arcsData = [...Array(N).keys()].map(() => ({
  //   startLat: (Math.random() - 0.5) * 180,
  //   startLng: (Math.random() - 0.5) * 360,
  //   endLat: (Math.random() - 0.5) * 180,
  //   endLng: (Math.random() - 0.5) * 360,
  //   color: ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)]
  // }));

  const Globe = new ThreeGlobe()
    .globeImageUrl('https://unpkg.com/three-globe@2.31.1/example/img/earth-night.jpg')
    // .arcsData(arcsData)
    // .arcColor('color')
    // .arcDashLength(0.4)
    // .arcDashGap(4)
    // .arcDashInitialGap(() => Math.random() * 5)
    // .arcDashAnimateTime(1000);

  Globe.traverse(function(node){
    console.log('Name: ', node.name, ' Type: ', node.type);
  });

  
  return Globe;

}

window.beep = map();

// console.log(Globe.getGlobeRadius() , ":)");
// window.beep.scale.x /= 100000;
// window.beep.scale.y /= 100000;
// window.beep.scale.z /= 100000;


window.gltfLoader.load("../assets/work.glb", function(gltf) {
  const scene = gltf.scene;
  for(i in gltf.animations){
    console.log(i);
    console.log("hehe bway");
  };
  // scene.traverse(function(node){
  //   // if (node.isObject3D && !(node.isMesh)) {
  //   //   const mesh = convertToMesh(node);
  //   //   if (mesh) {
  //   //     // Replace the child in the scene with the new mesh
  //   //     child.parent.add(mesh);
  //   //     child.parent.remove(child);
  //   //   }
  //   // }
  //   console.log('Name: ', node.name, ' Type: ', node.type);
  //   console.log('wicklicky');
  // });
});


// fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
//   // Create text geometry
//   const geometry = new THREE.TextGeometry('TAH Virtual Exhibit', {
//     font: font,
//     size: 0.25,
//     height: 0.1,
//     curveSegments: 12,
//     bevelEnabled: true,
//     bevelThickness: 0.03,
//     bevelSize: 0.02,
//     bevelOffset: 0,
//     bevelSegments: 5
//   });

//   // Create a material
//   const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
  
//   // Create a mesh and add it to the scene
//   const textMesh = new THREE.Mesh(geometry, material);
//   textMesh.scale /= 3;

//   window.textMesh = textMesh;
// });


function textBox(input, size = 0.3){

  // Create a canvas element
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  // Set canvas size larger for better resolution
  canvas.width = 3072;
  canvas.height = 2048;

  // Text properties
  const fontSize = 128; // Large font size for better resolution
  const font = `128px Courier New`;
  const text = input;
  const textColor = 'white';
  const outlineColor = 'blue';
  const outlineWidth = 5;
  const borderWidth = 20; // Width of the border
  const borderColor = 'blue'; // Color of the border
  const lineHeight = fontSize * 1.2; // Adjust line height as needed

  // Set font properties
  context.font = font;
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  // Background color
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.lineWidth = borderWidth;
  context.strokeStyle = borderColor;
  context.strokeRect(borderWidth / 2, borderWidth / 2, canvas.width - borderWidth, canvas.height - borderWidth);

  // Draw each line of text
  context.fillStyle = textColor;
  context.strokeStyle = outlineColor;
  context.lineWidth = outlineWidth;
  const lines = text.split('\n');
  lines.forEach((line, index) => {
    const y = canvas.height / 2 - (lines.length / 2) * lineHeight + index * lineHeight;
    // Draw the outline
    context.strokeText(line, canvas.width / 2, y);
    // Draw the text
    context.fillText(line, canvas.width / 2, y);
  });

  // Create texture from canvas
  const texture = new THREE.CanvasTexture(canvas);

  // Calculate display size
  const aspect = canvas.width / canvas.height;
  const displayHeight = size; // desired height in world units
  const displayWidth = displayHeight * aspect; // maintain aspect ratio

  // Create material for the plane
  const material = new THREE.MeshBasicMaterial({ map: texture });

  // Create plane geometry
  const geometry = new THREE.PlaneGeometry(displayWidth, displayHeight);

  // Create mesh
  const mesh = new THREE.Mesh(geometry, material);


  return mesh;

}
const welcome_msg = "Welcome the TAH Augmented Exhibit,\n showcasing the features of the\n Trafik Analysis Hub \n\n So you can see how you and your \n colleagues can use them to play \n a vital role in prevention of \n human trafficking";
const heatmap_msg1 = "Intensity Heatmap \n This visualisation depicts the areas \n of greatest intensity for data points \n in the dataset isolated (based on \n the dates and trafficking \ncharacteristics specified by \n the hub user).";
const heatmap_msg2 = "This visualisation is used to help\n analysts understand geographical patterns\n present in large datasets.";

const routemap_msg1 = "Routemap\n This visualisation depicts the \n trafficking routes mentioned\nin the dataset isolated";
const routemap_msg2 = "in the example shown the source is northern Vietnam and the destination is south-east England.";

const example_msg1 = "Vinh City, Vietnam\n an incident has been reported \n by local law enforcement";
const example_msg2 = "Essex, England\n Reports of 39 Vietnamese migrants \nfound dead in a lorry \nhaving reached the UK ";

const stats_msg = "There are 49.6 million victims \n estimated to be trapped \n in modern-day slavery";
const tech_msg1 = "How the Traffik Analysis Hub works:\nThe TAH works by leveraging \n advanced IBM technologies to collect,\n analyse, and share data \non human trafficking."

const ngo_msg1 = "TAH for  NGOs, law enforcement,\n government agencies, universities:\n\n Direct access to the HUB free of charge";
const ngo_msg2 = "Which can be used to facilitate:\n\n - Research and investigation \n Identifying trends \n(i.e. at risk groups,\n hotspots, etc \n -Informed prevention campaigns)";

const comm_msg1 = "TAH for Commercial Partners:\n -Banks\n -Businesses (e.g. house and\n car rental agencies)";
const comm_msg2 = "Subscription membership to access \n exploitation analytics and \n Intelligence and trends that \n affect your business";

const instructions = "Wave the phone around \n the ground as shown by \n the animation until the target appears. \n\n Then tap on the screen \n to load in the AR gallery";

window.instructions = textBox(instructions, 0.6);
window.instructions.rotateX(-1.57);

window.welcome = textBox(welcome_msg);

window.heatmap1 = textBox(heatmap_msg1);
window.heatmap2 = textBox(heatmap_msg2)

window.routemap1 = textBox(routemap_msg1);
window.routemap2 = textBox(routemap_msg2);


window.example1 = textBox(example_msg1);
window.example2 = textBox(example_msg2);


window.stats = textBox(stats_msg);
window.tech_msg1 = textBox(tech_msg1);


window.ngo_msg1 = textBox(ngo_msg1); 
window.ngo_msg2 = textBox(ngo_msg2); 


window.comm_msg1 = textBox(comm_msg1); 
window.comm_msg2 = textBox(comm_msg2);



// left wall
window.routemap1.rotateY(1.57);
window.routemap2.rotateY(1.57);

window.example1.rotateY(1.57);
window.example2.rotateY(1.57);


// right wall (-1.57)

// back wall
window.stats.rotateY(3.14);
window.tech_msg1.rotateY(3.14);

window.comm_msg1.rotateY(3.14); 
window.comm_msg2.rotateY(3.14);

window.ngo_msg1.rotateY(3.14); 
window.ngo_msg2.rotateY(3.14);


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