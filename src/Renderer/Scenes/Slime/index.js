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

    const sprite = new Sprite({
      velocity: { x: 10.0, y: -5.0 },
      accelerationFunction: this.spriteAccFunction
    });
    this.scene.add(sprite.mesh);
    this.updatables.push(sprite);
    
    const sprite2 = new Sprite({
      velocity: { x: -13.0, y: -1.0 },
      accelerationFunction: this.spriteAccFunction
    });
    this.scene.add(sprite2.mesh);
    this.updatables.push(sprite2);
    
    const sprite3 = new Sprite({
      velocity: { x: -8.0, y: 7.0 },
      accelerationFunction: this.spriteAccFunction
    });
    this.scene.add(sprite3.mesh);
    this.updatables.push(sprite3);
    
    this.animate();
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

  spriteAccFunction({x, y}) {
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
