import WEBGL from "./Helpers/WEBGL";
import Slime from "./Renderer/Scenes/Slime";

class App {
  static start() {
    if (!WEBGL.isWebGLAvailable()) {
      const warning = WEBGL.getWebGLErrorMessage();
      document.getElementById('container').appendChild(warning);
      return;
    }

    Slime.run();
  }
}

App.start()
