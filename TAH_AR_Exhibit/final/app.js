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
    this.count = 0;
    this.objects = [window.welcome, window.heatmap, window.routemap, window.example, window.stats];
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

  createGlobe() {
    const globe = new ThreeGlobe()
      .globeImageUrl('https://unpkg.com/three-globe@2.31.1/example/img/earth-night.jpg');

    globe.showAtmosphere(false);
    globe.scale.set(0.001,0.001,0.001);
    globe.position.set(0.0, 0.5, 0.0);
    const factor = 1;
    globe.scale.x /= factor;
    globe.scale.y /= factor;
    globe.scale.z /= factor;
    globe.globeMaterial.wireframe = true;
    return globe;
  }

  createGlobeHeatmap() {
    // Gen random data
    const N = 100; // 300
    const gData = [...Array(N).keys()].map(() => ({
      lat: (Math.random() - 0.5) * 160,
      lng: (Math.random() - 0.5) * 360,
      weight: Math.random()
    }));

    const globe = new ThreeGlobe()
      .globeImageUrl('https://unpkg.com/three-globe@2.31.1/example/img/earth-night.jpg')
      .heatmapsData([gData])
      .heatmapPointLat('lat')
      .heatmapPointLng('lng')
      .heatmapPointWeight('weight')
      .heatmapTopAltitude(0.3) // 0.7
      .heatmapsTransitionDuration(1000); // 3000

    globe.showAtmosphere(false);
    globe.scale.set(0.001,0.001,0.001);
    globe.position.set(0.0, 0.5, 0.0);
    const factor = 1;
    globe.scale.x /= factor;
    globe.scale.y /= factor;
    globe.scale.z /= factor;
    globe.globeMaterial.wireframe = true;
    return globe;
  }

  scene_insert(model, x, y, z) {
    if (model) {
      // const clone = model.clone();
      // console.log('original: ', model)
      // console.log('clone: ', clone)
      // const offset = new THREE.Vector3(x, y, z);
      // clone.position.copy(this.reticle.position).add(offset);
      // console.log('original image: ', model.globeImageUrl())
      // console.log('clone image: ', clone.globeImage(Url())
      // this.scene.add(clone);
      model.position.copy(this.reticle.position).add(new THREE.Vector3(x, y, z))
      model.scale.set(0.0001, 0.0001, 0.0001)
      console.log('image url: ', model.globeImageUrl())
      this.scene.add(model)
      console.log("model inserted");
    } else {
      console.log('Model is undefined');
    }
  }
  /**
   * Add a model when the screen is tapped.
   */
  onSelect = () => {
    window.bow = this.createGlobeHeatmap();
    if (window.bow) {
      console.log('material: ', window.bow.globeMaterial());
      console.log('scale: ', window.bow.scale);
      console.log('radius: ', window.bow.getGlobeRadius());

      this.scene_insert(window.bow, 0.0, 1.4, -500.0);
    } else {
      console.log('window.bow is not defined');
    }
    // this.scene_insert(this.objects[this.count], 0.0, 1.8, 0.0);
    // this.scene_insert(window.welcome, 0.0, 1.4, 0.0);
    // this.scene_insert(window.heatmap, 0.25, 1.4, 0.5);
    // this.scene_insert(window.routemap, 0.5, 1.4, 1.0);
    // this.scene_insert(window.example, 0.75, 1.4, 1.5);
    // this.scene_insert(window.stats, 1.0, 1.4, 2.0);

    // if (this.glbModel) {
    //   const clone = this.glbModel.clone();
    //   clone.position.copy(this.reticle.position);
    //   clone.scale.set(clone.scale.x / 5, clone.scale.y / 5, clone.scale.z / 5);
    //   this.scene.add(clone);

    //   // Create an AnimationMixer and play the animation
    //   this.mixer = new THREE.AnimationMixer(clone);
    //   this.playAnimation('ArrowAction');
    // } else {
    //   console.log('Model not loaded yet');
    // }

    this.scene.traverse(function (node) {
      console.log('Name: ', node.name, ' Type: ', node.type);
    });

    // Check if the globe's material is transparent
    // if (window.bow) {
    //   console.log(window.bow.showAtmosphere()); // Should be false
    // }

    // Check the scene background
    // console.log(this.scene.background); // Should be null for transparency
    this.count += 1;
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
