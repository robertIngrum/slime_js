import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import * as dat from 'dat.gui';
import CameraFactory from "./CameraFactory";
import Sprite from "./Sprite";

class Slime {
  scene;
  renderer;
  composer;
  camera;
  updatables = [];
  clock;

  static run() {
    const program = new Slime();
    program.attach();
    program.start();
  }

  constructor() {
    this.clock    = new THREE.Clock();
    this.scene    = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.composer = new EffectComposer(this.renderer);
    this.gui      = new dat.GUI();
  }

  attach() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this.renderer.domElement);
  }

  start() {
    this.camera = CameraFactory.create();
    if (this.camera == null) { return; }
    this.camera.position.set(0, 0, 10);

    this.gui.add(this.camera.position, 'x', -100, 100);
    this.gui.add(this.camera.position, 'y', -100, 100);
    this.gui.add(this.camera.position, 'z', -100, 100);

    this.spawnSprite({ count: 3 });
    
    this.animate();
  }

  spawnSprite({ count, velocity, accelerationFunction }) {
    count ||= 1;
    velocity ||= 10;
    let degrees = 0;
    const dDegrees = 360 / count;

    for (let i = 0; i < count; i++) {
      const sprite = new Sprite({
        velocity: velocity,
        angle: degrees * Math.PI/180,
        accelerationFunction: this.spriteBounceFunction,
      });

      this.scene.add(sprite.mesh);
      this.updatables.push(sprite);

      degrees += dDegrees;
    }
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    this.camera.lookAt(0, 0, 0);
    this.tick();

    this.renderer.render(this.scene, this.camera);
  }

  tick() {
    const delta = this.clock.getDelta();

    for (const object of this.updatables) {
      object.tick(delta);
    }
  }

  spriteBounceFunction(sprite) {
    const x = sprite.mesh.position.x;
    const y = sprite.mesh.position.y;

    const bounds = 10;

    if ((x < bounds && x > -bounds) &&
        (y < bounds && y > -bounds)) {
      return { x: 0, y: 0 };
    }

    const speed = 10;
    const angle = Math.floor(Math.random() * 90) * Math.PI / 180;

    const velocity = {
      x: Math.sin(angle) * speed,
      y: Math.cos(angle) * speed,
    };

    if (x >= bounds) { velocity.x *= -1 }
    if (y >= bounds) { velocity.y *= -1 }

    sprite.currentVelocity = velocity;

    return { x: 0, y: 0 };
  }

  spriteGravFunction({x, y}) {
    const acc = .5;

    if (x === 0 && y === 0) {
      return { x: 0, y: 0 };
    } else if (x === 0) {
      return { x: 0, y: -Math.sign(y) * acc };
    } else if (y === 0) {
      return { x: -Math.sign(x) * acc, y: 0 };
    }

    const angle = Math.atan(x / y);

    return {
      x: -Math.sign(x) * Math.abs(acc * Math.sin(angle)),
      y: -Math.sign(y) * Math.abs(acc * Math.cos(angle)),
    };
  }
}

export default Slime;
