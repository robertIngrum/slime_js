import * as THREE from "three";

class CameraFactory {
  static validTypes = ['Perspective', 'Orthographic'];
  static defaults = {
    type:   'Perspective',
    /* Perspective Defaults */
    fov:    90,
    aspect: window.innerWidth / window.innerHeight,
    /* Orthographic Defaults */
    left:   -1,
    right:  1,
    top:    -1,
    bottom: 1,
    /* Defaults */
    near:   1,
    far:    50,
  }

  static create(props = {}) {
    return new CameraFactory(props).create();
  }

  constructor(props = {}) {
    this.props = { ...CameraFactory.defaults, ...props };
  }

  create() {
    if (!CameraFactory.validTypes.includes(this.props.type)) {
      console.log(`Failed to start camera: Invalid camera type (${this.props.type}).`);
      return null;
    }

    return this[`create${this.props.type}Camera`]();
  }

  createPerspectiveCamera() {
    return new THREE.PerspectiveCamera(
      this.props.fov,
      this.props.aspect,
      this.props.near,
      this.props.far
    );
  }

  createOrthographicCamera() {
    return new THREE.OrthographicCamera(
      this.props.left,
      this.props.right,
      this.props.top,
      this.props.bottom,
      this.props.near,
      this.props.far,
    )
  }
}

export default CameraFactory;
