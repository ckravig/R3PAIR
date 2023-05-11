import '/style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Import MouseMeshInteraction class
import MouseMeshInteraction from './three_mmi';

// Setup
window.onload = function() {
  animate();
}


const scene = new THREE.Scene();

const canvas = document.querySelector('#info3D');
const aspectRatio = canvas.clientWidth / canvas.clientHeight;
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});

// pass threejs scene and camera to mmi
const mmi = new MouseMeshInteraction(scene, camera);

renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
camera.position.setZ(-5);
camera.position.setX(0);

renderer.render(scene, camera);

// Canvas resize event listener
function onCanvasResize() {
  const aspectRatio = canvas.clientWidth / canvas.clientHeight;
  camera.aspect = aspectRatio;
  camera.updateProjectionMatrix();
}

canvas.addEventListener('resize', onCanvasResize);

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);



// ThreeJS Objects -------------------------------------------------

// 3D Model Loader
const gltfLoader = new GLTFLoader();

// threejsModel -------------------------------------------------
gltfLoader.load('/models/three.js/scene.gltf', (threejsModel) => {
  threejsModel.scene.position.x = 0;
  threejsModel.scene.position.y = 0;
  threejsModel.scene.position.z = 0;
  threejsModel.scene.scale.set(0.015, 0.015, 0.015);
  scene.add(threejsModel.scene);
});

// ^threejsModel^ -------------------------------------------------






// Animation Loop -------------------------------------------------

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

// ^Animation Loop^ -------------------------------------------------
