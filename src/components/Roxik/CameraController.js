import * as BABYLON from 'babylonjs';

export default class CameraController {

  //------------------------------
  //  model
  //------------------------------

  camera = null;
  models = [];
  frame = 1000;
  sceneLimit = 90;
  target = new BABYLON.Vector3(0, 0, 0);
  position = new BABYLON.Vector3(0, 0, 0);
  tm = null;
  cs = 0;
  gy = 0;
  l = 0;
  bl = 6;
  ts = 0;
  r = 0;
  rp = 0.03;


  //------------------------------
  //  methods
  //------------------------------

  /**
   * Frame handler
   */
  step() {
    if (++this.frame > this.sceneLimit) {
      this.frame = 0;
      this.sceneLimit = Math.floor((Math.random() * 60) + 30);
      this.tm = this.models[Math.floor(Math.random() * this.models.length)];
      this.ts = 0;
      this.cs = 0;
      this.gy = ((Math.random() * 8) - 4);
      this.rp = ((Math.random() * 0.06) - 0.03);
      this.bl = ((Math.random() * 4) + 7);
    }

    if (this.ts < 0.05) {
      this.ts += 0.005;
    }

    if (this.cs < 0.5) {
      this.cs += 0.005;
    }

    this.target.x += ((this.tm.position.x - this.target.x) * this.ts);
    this.target.y += ((this.tm.position.y - this.target.y) * this.ts);
    this.target.z += ((this.tm.position.z - this.target.z) * this.ts);

    // TODO: focusOn([this.tm]) - avoid zoom on setTarget?
    // this.camera.focusOn([this.tm]);
    // this.camera.setTarget(this.target);

    this.r += this.rp;
    this.l += ((this.bl - this.l) * 0.1);

    this.position.x = (((Math.cos(this.r) * this.l) + this.tm.position.x) - this.position.x) * this.cs;
    this.position.y = ((this.tm.position.y + this.gy) - this.position.y) * this.cs;
    this.position.z = (((Math.sin(this.r) * this.l) + this.tm.position.z) - this.position.z) * this.cs;

    // TODO: Position after determining zoom issues with camera lookAt.
    // this.camera.position = this.position;
  }
}
