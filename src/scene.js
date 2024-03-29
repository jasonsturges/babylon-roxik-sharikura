import * as BABYLON from "babylonjs";
import { stepCamera } from "./camera";
import { changeMotion, stepMotion } from "./motion";
import { MotionType } from "./MotionType";
import "./keyboard";

export const models = [];

export const createScene = (canvas) => {
  const engine = new BABYLON.Engine(canvas, true);

  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3.FromHexString("#efefef");
  scene.ambientColor = new BABYLON.Color3(1, 1, 1);

  const camera = new BABYLON.TargetCamera(
    "camera",
    new BABYLON.Vector3(18, 18, 18),
    scene
  );
  camera.attachControl(engine, true);

  const parameters = {
    blur_noise: false,
    dof_aperture: 0.5,
    dof_focus_distance: 1000
  };
  const lensEffect = new BABYLON.LensRenderingPipeline('lensEffects', parameters, scene, 1.0, camera);


  const directionalLight = new BABYLON.DirectionalLight(
    "DirectionalLight",
    new BABYLON.Vector3(-10, 10, -10).normalize(),
    scene
  );
  directionalLight.diffuse = new BABYLON.Color3.FromHexString("#9090aa");
  directionalLight.intensity = 0.35;

  const hemisphericLight = new BABYLON.HemisphericLight(
    "HemiLight",
    new BABYLON.Vector3(1, 1, 1),
    scene
  );
  hemisphericLight.intensity = 1.0;

  const colors = [
    "#97350b",
    "#266ea5",
    "#00847f",
    "#2f818e",
    "#08917c",
    "#08917c",
    "#6b458c",
    "#7a4526",
  ];

  const sphereMaterials = [];

  for (let i = 0; i < colors.length; i++) {
    const material = new BABYLON.StandardMaterial("sphereMaterial", scene);
    material.diffuseColor = new BABYLON.Color3.FromHexString(colors[i]);
    material.specularColor = new BABYLON.Color3.FromHexString(colors[i]);
    sphereMaterials.push(material);
  }

  const length = 8;
  const bet = 0.8;
  const offset = (length - 1) * bet * 0.5;

  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length; j++) {
      for (let k = 0; k < length; k++) {
        const material = sphereMaterials[Math.floor(Math.random() * 8)];
        const mesh = BABYLON.MeshBuilder.CreateSphere(
          "sphere",
          { diameter: 0.6 },
          scene
        );
        mesh.material = material;
        mesh.position.set(i * bet - offset, j * bet - offset, k * bet - offset);

        models.push(mesh);
      }
    }
  }

  const cube = BABYLON.MeshBuilder.CreateBox(
    "cube",
    { height: 18, width: 18, depth: 18 },
    scene
  );
  const cubeMaterial = new BABYLON.StandardMaterial("cubeMaterial", scene);
  cubeMaterial.wireframe = true;
  cube.material = cubeMaterial;

  changeMotion(MotionType.CUBE);

  engine.runRenderLoop(() => {
    stepCamera(camera);
    stepMotion();
    scene.render();
  });

  window.addEventListener('resize', () => {
    engine.resize();
  });
};
