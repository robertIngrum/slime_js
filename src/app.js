import WEBGL from "./Helpers/WEBGL";
import LightingDemo from "./Renderer/Scenes/LightingDemo";

class App {
  static start() {
    console.log('static start');
    if (WEBGL.isWebGLAvailable()) {
      const program = new LightingDemo();
      program.animate();
    } else {
      const warning = WEBGL.getWebGLErrorMessage();
      document.getElementById('container').appendChild(warning);
    }
  }
}

App.start()
