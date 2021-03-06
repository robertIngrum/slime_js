import * as THREE from "three";

class Sprite {
  program;
  currentVelocity;
  #mesh = null;

  constructor({ velocity, angle, accelerationFunction, program }) {
    velocity ||= 10.0;

    this.program = program;

    this.currentVelocity = {
      x: Math.sin(angle) * velocity,
      y: Math.cos(angle) * velocity,
    };
    this.accelerationFunction = accelerationFunction;
  }

  get uniforms() {
    return {};
  }

  get vertexShader() {
    return `
      varying vec2 v_uv;

      void main(void) {
        // compute position
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      
        v_uv = uv;
      }
    `;
  }

  get fragmentShader() {
    return `
      varying vec2 v_uv;
      
      void main(void)
      {
        vec4 transparent = vec4(1., 1., 1., 0.);
        vec4 color       = vec4(0., 1., 1., 1.);
        
        vec2 center = vec2(.5, .5);
        float dist = distance(center, v_uv);
        
        gl_FragColor = mix(color, transparent, smoothstep(0., .5, dist));
      }
    `;
  }

  get mesh() {
    if (this.#mesh !== null) {
      return this.#mesh;
    }

    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.ShaderMaterial({
      uniforms:       this.uniforms,
      vertexShader:   this.vertexShader,
      fragmentShader: this.fragmentShader,
      transparent:    true,
      blending:       THREE.AdditiveBlending,
    });

    return this.#mesh = new THREE.Mesh(geometry, material);
  }

  tick(dTime) {
    const dPos = this.accelerationFunction(this);

    this.currentVelocity.x += dPos.x;
    this.currentVelocity.y += dPos.y;

    this.mesh.position.x += this.currentVelocity.x * dTime;
    this.mesh.position.y += this.currentVelocity.y * dTime;
  }
}

export default Sprite;
