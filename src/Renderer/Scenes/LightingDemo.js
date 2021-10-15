import * as THREE from "three";
import oc from 'three-orbit-controls';
import * as dat from 'dat.gui';
import ColorGUIHelper from "../../Helpers/ColorGUIHelper";

class LightingDemo {
  constructor() {
    this.scene    = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer();
    this.camera   = this.constructCamera();
    this.controls = this.constructControls();

    this.addRenderer();

    this.plane  = this.constructPlane();
    this.cube   = this.constructCube();
    this.sphere = this.constructSphere();
    this.light  = this.constructDirectionalLight();

    this.scene.add(this.plane);
    this.scene.add(this.cube);
    this.scene.add(this.sphere);
    this.scene.add(this.light);
    this.scene.add(this.light.target);

    this.gui = new dat.GUI();
    this.gui.addColor(new ColorGUIHelper(this.light, 'color'), 'value').name('color');
    this.gui.add(this.light.target.position, 'x', -10, 10);
    this.gui.add(this.light.target.position, 'z', -10, 10);
    this.gui.add(this.light.target.position, 'y', 0, 10);
    this.gui.add(this.light, 'intensity', 0, 2, 0.01);

    this.camera.position.set(0, 20, 100);
    this.controls.update()
  }

  constructCamera() {
    const fov    = 75;
    const aspect = window.innerWidth / window.innerHeight;
    const near   = 0.1;
    const far    = 1000;
    
    return new THREE.PerspectiveCamera(fov, aspect, near, far);
  }

  constructControls() {
    const OrbitControls = oc(THREE);
    
    return new OrbitControls(this.camera, this.renderer.domElement);
  }

  constructPlane() {
    const size = 40;
    
    const loader = new THREE.TextureLoader();
    const texture = loader.load('images/checker.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.mapFilter = THREE.NearestFilter;
    const repeats = size / 2;
    texture.repeat.set(repeats, repeats);
    
    const geometry = new THREE.PlaneGeometry(size, size);
    const material = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI * -.5;

    return mesh;
  }

  constructCube() {
    const size = 4;
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshPhongMaterial({ color: '#8AC' });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(size + 1, size / 2, 0);
    
    return mesh;
  }

  constructSphere() {
    const radius = 3;
    const widthDivisions = 32;
    const heightDivisions = 16;

    const geometry = new THREE.SphereGeometry(radius, widthDivisions, heightDivisions);
    const material = new THREE.MeshPhongMaterial({ color: '#CA8' });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(-radius - 1, radius + 2, 0);
    
    return mesh;
  }

  constructHemisphereLight() {
    const skyColor    = 0x81E1FF;
    const groundColor = 0xB97A20;
    const intensity   = 1;

    return new THREE.HemisphereLight(skyColor, groundColor, intensity);  
  }

  constructDirectionalLight() {
    const color     = 0xFFFFFF;
    const intensity = 1;

    const light = new THREE.DirectionalLight(color, intensity);
    
    light.position.set(0, 10, 0);
    light.target.position.set(-5, 0, 0);

    return light;
  }

  addRenderer() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }
  
  animate() {
    requestAnimationFrame(this.animate.bind(this));
  
    this.controls.update();
  
    this.renderer.render(this.scene, this.camera);
  }
}

export default LightingDemo;
