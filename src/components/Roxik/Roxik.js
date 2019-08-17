import React from 'react';
import * as BABYLON from 'babylonjs';
import ResizeObserver from 'resize-observer-polyfill';
import CameraController from './CameraController';
import MotionController from './MotionController';
import './Roxik.scss';

export default class Roxik extends React.Component {

  //------------------------------
  //  model
  //------------------------------

  state = {
    width: 512,
    height: 410
  };

  models = [];


  //------------------------------
  //  methods
  //------------------------------

  /**
   * Rendering
   */
  render() {
    return (
      <canvas className='babylon' ref={(el) => {
        this.babylon = el
      }}></canvas>
    );
  }

  /**
   * Initialization
   */
  componentDidMount() {
    this.initialize();
    this.animate();

    this.observer = new ResizeObserver(entries => {
      const {width, height} = entries[0].contentRect;
      this.setState({
        width: Math.floor(width),
        height: Math.floor(height)
      });
    });

    this.observer.observe(this.babylon);
  }

  initialize() {
    this.initializeEngine();
    this.initializeCamera();
    this.initializeLights();
    this.initializeMaterials();
    this.initializeObjects();
    this.initializeFilters();
    this.initializeListeners();
  }

  initializeEngine() {
    this.engine = new BABYLON.Engine(this.babylon, true);

    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color3.FromHexString("#efefef");
  }

  initializeCamera() {
    this.camera = new BABYLON.ArcRotateCamera('ArcRotateCamera', 0, 0, -10, new BABYLON.Vector3(18, 18, 18), this.scene);
    this.camera.setTarget(BABYLON.Vector3.Zero());
    this.camera.attachControl(this.babylon, true);

    this.cameraController = new CameraController();
    this.cameraController.camera = this.camera;
  }

  initializeLights() {
    this.ambientLight = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(-10, 10, -10).normalize(), this.scene);
    this.ambientLight.diffuse = new BABYLON.Color3.FromHexString("#9090aa");
    this.ambientLight.intensity = 0.5;

    const light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(1, 1, 1), this.scene);
    light.intensity = 0.1;
  }

  initializeMaterials() {
    const colors = ["#97350b", "#266ea5", "#00847f", "#2f818e", "#08917c", "#08917c", "#6b458c", "#7a4526"];
    this.sphereMaterial = [];

    for (let i = 0; i < 8; i++) {
      const material = new BABYLON.StandardMaterial("material", this.scene);
      material.emissiveColor = new BABYLON.Color3.FromHexString(colors[i]);
      this.sphereMaterial.push(material);
    }

    this.cubeMaterial = new BABYLON.StandardMaterial("cubeMaterial", this.scene);
    this.cubeMaterial.wireframe = true;
  }

  initializeObjects() {
    const bet = 0.7;
    const offset = (((8 - 1) * bet) * 0.5);

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        for (let k = 0; k < 8; k++) {

          const m = this.sphereMaterial[Math.floor(Math.random() * 8)];
          const s = BABYLON.MeshBuilder.CreateSphere("mySphere", {diameter: 0.6}, this.scene);
          s.material = m;
          s.position.set(((i * bet) - offset), ((j * bet) - offset), ((k * bet) - offset));

          this.models.push(s);
        }
      }
    }

    this.cube = BABYLON.MeshBuilder.CreateBox("myBox", {height: 18, width: 18, depth: 18}, this.scene);
    this.cube.material = this.cubeMaterial;

    this.cameraController.models = this.models;

    this.motionController = new MotionController();
    this.motionController.models = this.models;
    this.motionController.changeScene(MotionController.CYLINDER);
  }

  initializeFilters() {
    // TODO: Bokeh
    // const pipeline = new BABYLON.DefaultRenderingPipeline('fx', false, this.scene, [this.camera]);
    //
    // pipeline.depthOfFieldBlurLevel = BABYLON.DepthOfFieldEffectBlurLevel.High;
    // pipeline.depthOfFieldEnabled = true;
    // pipeline.depthOfField.fStop = 1.4 * 0.7;
    // pipeline.depthOfField.focusDistance = 1000; //mm
    // pipeline.depthOfField.focalLength = 10 * 0.5; //mm
  }

  initializeListeners() {
    document.addEventListener("keydown", this.keydownHandler.bind(this));
  }

  /**
   * Animation loop
   */
  animate() {
    requestAnimationFrame(this.animate.bind(this));

    this.cameraController.step();
    this.motionController.step();

    this.scene.render();
  }

  keydownHandler(event) {
    const keyCode = event.which;

    switch (keyCode) {
      case 49:
      case 97:
        this.motionController.changeScene(MotionController.CYLINDER);
        break;
      case 50:
      case 98:
        this.motionController.changeScene(MotionController.SPHERE);
        break;
      case 51:
      case 99:
        this.motionController.changeScene(MotionController.CUBE);
        break;
      case 52:
      case 100:
        this.motionController.changeScene(MotionController.TUBE);
        break;
      case 53:
      case 101:
        this.motionController.changeScene(MotionController.WAVE);
        break;
      case 54:
      case 102:
        this.motionController.changeScene(MotionController.GRAVITY);
        break;
      case 55:
      case 103:
        this.motionController.changeScene(MotionController.ANTIGRAVITY);
        break;
    }
  }

  /**
   * Invalidation handler
   */
  componentDidUpdate(prevProps, prevState, snapshot) {
    this.engine.resize();
  }

  /**
   * Dipose
   */
  componentWillUnmount() {
    this.observer.disconnect();
  }

}
