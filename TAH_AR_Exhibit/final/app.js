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

/**
 * Query for WebXR support. If there's no support for the `immersive-ar` mode,
 * show an error.
 */
(async function() {
  const isArSessionSupported = navigator.xr && navigator.xr.isSessionSupported && await navigator.xr.isSessionSupported("immersive-ar");
  if (isArSessionSupported) {
    document.getElementById("enter-ar").addEventListener("click", window.app.activateXR)
  } else {
    onNoXRDevice();
  }
})();

/**
 * Container class to manage connecting to the WebXR Device API
 * and handle rendering on every frame.
 */
class App {

  constructor() {
    this.glbModel = null;
    this.mixer = null;
  }

  /**
   * Run when the Start AR button is pressed.
   */
  activateXR = async () => {
    try {
      // Initialize a WebXR session using "immersive-ar".
      this.xrSession = await navigator.xr.requestSession("immersive-ar", {
        requiredFeatures: ['hit-test', 'dom-overlay'],
        domOverlay: { root: document.body }
      });

      // Create the canvas that will contain our camera's background and our virtual scene.
      this.createXRCanvas();

      // Load the model
      await this.loadGLTFModel('../assets/AR-Experience.glb');

      // With everything set up, start the app.
      await this.onSessionStarted();
    } catch (e) {
      console.log(e);
      onNoXRDevice();
    }
  }

  /**
   * Load a GLTF model
   */
  loadGLTFModel = async (path) => {
    const loader = new THREE.GLTFLoader();
    return new Promise((resolve, reject) => {
      loader.load(path, (gltf) => {
        this.glbModel = gltf.scene;
        this.animations = gltf.animations;
        resolve();
      }, undefined, reject);
    });
  }

  /**
   * Add a canvas element and initialize a WebGL context that is compatible with WebXR.
   */
  createXRCanvas() {
    this.canvas = document.createElement("canvas");
    document.body.appendChild(this.canvas);
    this.gl = this.canvas.getContext("webgl", { xrCompatible: true });

    this.xrSession.updateRenderState({
      baseLayer: new XRWebGLLayer(this.xrSession, this.gl)
    });
  }

  /**
   * Called when the XRSession has begun. Here we set up our three.js
   * renderer, scene, and camera and attach our XRWebGLLayer to the
   * XRSession and kick off the render loop.
   */
  onSessionStarted = async () => {
    // Add the `ar` class to our body, which will hide our 2D components
    document.body.classList.add('ar');

    // To help with working with 3D on the web, we'll use three.js.
    this.setupThreeJs();

    // Setup an XRReferenceSpace using the "local" coordinate system.
    this.localReferenceSpace = await this.xrSession.requestReferenceSpace('local');

    // Create another XRReferenceSpace that has the viewer as the origin.
    this.viewerSpace = await this.xrSession.requestReferenceSpace('viewer');
    // Perform hit testing using the viewer as origin.
    this.hitTestSource = await this.xrSession.requestHitTestSource({ space: this.viewerSpace });

    // Start a rendering loop using this.onXRFrame.
    this.xrSession.requestAnimationFrame(this.onXRFrame);

    this.xrSession.addEventListener("select", this.onSelect);
  }

  /**
   * Add a model when the screen is tapped.
   */

  onSelect = () => {
    if (this.glbModel) {
      const clone = this.glbModel.clone();
      clone.position.copy(this.reticle.position);
      this.scene.add(clone);

      // Create an AnimationMixer and play the animation
      this.mixer = new THREE.AnimationMixer(clone);
      this.playAnimation('ArrowAction');
    } else {
      console.log('Model not loaded yet');
    }
  }

  /**
   * Play a specified animation from the loaded GLB model
   */
  playAnimation = (animationName) => {
    if (this.mixer && this.animations) {
      const clip = this.animations.find(clip => clip.name === animationName);
      if (clip) {
        const action = this.mixer.clipAction(clip);
        action.reset().play();
      } else {
        console.log(`Animation ${animationName} not found`);
      }
    }
  }

  /** Place a sunflower when the screen is tapped. */
  // onSelect = () => {
  //   if (window.sunflower) {
  //     const clone = window.sunflower.clone();
  //     clone.position.copy(this.reticle.position);
  //     this.scene.add(clone)

  //     const shadowMesh = this.scene.children.find(c => c.name === 'shadowMesh');
  //     shadowMesh.position.y = clone.position.y;
  //   }
  // }

  //scene_insert(model, x,y,z){
  //  if(model){
  //    const clone = model.clone();
  //    const offset = new THREE.Vector3(x,y,z);
  //    clone.position.copy(this.reticle.position).add(offset);
  //    this.scene.add(clone);
  //    console.log("model inserted");
  //  }
  //  else{
  //    console.log('oink');
  //  }
  //}

  //onSelect = () => {
    // this.scene_insert(window.beep, 0.0, 0.0, 0.0);
  //  this.scene_insert(window.globe,-1.0, 1.0, 0.0);
  //  this.scene_insert(window.sphere, 1.0, 1.25, 0.0);
  //  this.scene_insert(window.msg1, 0.0, 1.4, 0.0);
    // this.scene_insert(window.textMesh, (-1.0, 1.0, -1.0));


  //  window.beep.scale.set(0.1,0.1,0.1);
  //  window.beep.position.copy(this.reticle.postion).add(new THREE.Vector3(0,0,-2));
  //  this.scene.add(window.beep);

  //  this.scene.traverse(function(node){
  //    console.log('Name: ', node.name, ' Type: ', node.type);
  //    console.log('no relation');
  //  });
  //}



// if(window.textMesh){
//   const clone = window.textMesh.clone();
//   const offset = new THREE.Vector3(-1.0, 1.0, -1.0);
//   clone.position.copy(this.reticle.position).add(offset);
//   this.scene.add(clone);
//   console.log('Text added at position:', clone.position);
// }
// else{
//   console.log('oink');
// }





  /**
   * Called on the XRSession's requestAnimationFrame.
   * Called with the time and XRPresentationFrame.
   */
  onXRFrame = (time, frame) => {
    // Queue up the next draw request.
    this.xrSession.requestAnimationFrame(this.onXRFrame);

    // Bind the graphics framebuffer to the baseLayer's framebuffer.
    const framebuffer = this.xrSession.renderState.baseLayer.framebuffer
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer)
    this.renderer.setFramebuffer(framebuffer);

    // Retrieve the pose of the device.
    // XRFrame.getViewerPose can return null while the session attempts to establish tracking.
    const pose = frame.getViewerPose(this.localReferenceSpace);
    if (pose) {
      // In mobile AR, we only have one view.
      const view = pose.views[0];

      const viewport = this.xrSession.renderState.baseLayer.getViewport(view);
      this.renderer.setSize(viewport.width, viewport.height)

      // Use the view's transform matrix and projection matrix to configure the THREE.camera.
      this.camera.matrix.fromArray(view.transform.matrix)
      this.camera.projectionMatrix.fromArray(view.projectionMatrix);
      this.camera.updateMatrixWorld(true);

      // Conduct hit test.
      const hitTestResults = frame.getHitTestResults(this.hitTestSource);

      // If we have results, consider the environment stabilized.
      if (!this.stabilized && hitTestResults.length > 0) {
        this.stabilized = true;
        document.body.classList.add('stabilized');
      }
      if (hitTestResults.length > 0) {
        const hitPose = hitTestResults[0].getPose(this.localReferenceSpace);

        // Update the reticle position
        this.reticle.visible = true;
        this.reticle.position.set(hitPose.transform.position.x, hitPose.transform.position.y, hitPose.transform.position.z)
        this.reticle.updateMatrixWorld(true);
      }

      //this.scene.traverse(function (child){
      //  if(child.name == 'Cube'){
      //    child.rotation.y += 0.01;
      //  }

      //});

      // Update the animation mixer if it exists
      if (this.mixer) {
        const delta = this.clock.getDelta();
        this.mixer.update(delta);
      }

      // Render the scene with THREE.WebGLRenderer.
      this.renderer.render(this.scene, this.camera)
    }
  }

  /**
   * Initialize three.js specific rendering code, including a WebGLRenderer,
   * a demo scene, and a camera for viewing the 3D content.
   */
  setupThreeJs() {
    // To help with working with 3D on the web, we'll use three.js.
    // Set up the WebGLRenderer, which handles rendering to our session's base layer.
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      preserveDrawingBuffer: true,
      canvas: this.canvas,
      context: this.gl
    });
    this.renderer.autoClear = false;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Initialize our demo scene.
    this.scene = DemoUtils.createLitScene();
    this.reticle = new Reticle();
    this.scene.add(this.reticle);

    // We'll update the camera matrices directly from API, so
    // disable matrix auto updates so three.js doesn't attempt
    // to handle the matrices independently.
    this.camera = new THREE.PerspectiveCamera();
    this.camera.matrixAutoUpdate = false;

    // Initialise clock for animation updates
    this.clock = new THREE.Clock();
  }
};

window.app = new App();
