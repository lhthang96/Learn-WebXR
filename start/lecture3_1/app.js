import * as THREE from '../../libs/three/three.module.js';
import { VRButton } from '../../libs/three/jsm/VRButton.js';
import { XRControllerModelFactory } from '../../libs/three/jsm/XRControllerModelFactory.js';
import { BoxLineGeometry } from '../../libs/three/jsm/BoxLineGeometry.js';
import { Stats } from '../../libs/stats.module.js';
import { OrbitControls } from '../../libs/three/jsm/OrbitControls.js';

class App {
  constructor() {
    const container = document.createElement('div');
    document.body.appendChild(container);

    this.clock = new THREE.Clock();

    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 1.6, 3);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x505050);

    this.scene.add(new THREE.HemisphereLight(0x606060, 0x404040));

    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1).normalize();
    this.scene.add(light);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 1.6, 0);
    this.controls.update();

    this.stats = new Stats();
    container.appendChild(this.stats.dom);

    this.initScene();
    this.setupXR();

    window.addEventListener('resize', this.resize.bind(this));

    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  random(min, max) {
    return Math.random() * (max - min) + min;
  }

  initScene() {
    // Init room
    const roomGeometry = new BoxLineGeometry(6, 6, 6, 10, 10, 10);
    const roomMaterial = new THREE.LineBasicMaterial({ color: 0x808080 });
    this.room = new THREE.LineSegments(roomGeometry, roomMaterial);
    this.scene.add(this.room);

    // Init balls
    this.radius = 0.08;
    const ballGeometry = new THREE.IcosahedronBufferGeometry(this.radius, 2);
    for (let i = 0; i < 200; i++) {
      const ballMaterial = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
      const ball = new THREE.Mesh(ballGeometry, ballMaterial);
      ball.position.x = Math.random() * 2;
      ball.position.y = Math.random() * 2;
      ball.position.z = Math.random() * 2;
      this.room.add(ball);
    }
  }

  setupXR() {
    this.renderer.xr.enabled = true;
    const vrButton = VRButton.createButton(this.renderer);
    document.body.appendChild(vrButton);
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    this.stats.update();

    this.renderer.render(this.scene, this.camera);
  }
}

export { App };
