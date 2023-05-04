import '/style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Import MouseMeshInteraction class
import MouseMeshInteraction from './three_mmi';

// Create modelArray
let modelArray = [];

// Setup
window.onload = function() {
  animate();
}


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#canvas'),
  antialias: true,
  alpha: true,
});

// pass threejs scene and camera to mmi
const mmi = new MouseMeshInteraction(scene, camera);

renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(0);
camera.position.setX(0);

renderer.render(scene, camera);

// Window resize event listener
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize);

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);


// Object Sizing -------------------------------------------------
export const pixelRatio = window.devicePixelRatio;
export const topicBoxWidth = 1 / pixelRatio;

export const screenWidth = window.innerWidth;
// ^Object Sizing^ -------------------------------------------------


// ThreeJS Objects -------------------------------------------------

// 3D Model Loader
const gltfLoader = new GLTFLoader();

// threejsModel -------------------------------------------------
gltfLoader.load('/models/three.js/scene.gltf', (threejsModel) => {
  threejsModel.scene.position.x = 2;
  threejsModel.scene.position.y = 1.5;
  threejsModel.scene.position.z = -5;
  threejsModel.scene.scale.set(0.015, 0.015, 0.015);
  scene.add(threejsModel.scene);
});



// ^threejsModel^ -------------------------------------------------

// viteModel -------------------------------------------------
gltfLoader.load('/models/vite/vite.gltf', (viteModel) => {
  viteModel.scene.position.x = 1;
  viteModel.scene.position.y = -1.5;
  viteModel.scene.position.z = -5;
  viteModel.scene.scale.set(1, 1, 1);
  scene.add(viteModel.scene);
});



// ^viteModel^ -------------------------------------------------



// ^ThreeJS Objects^ -------------------------------------------------





// Animation Loop -------------------------------------------------

function animate() {
  requestAnimationFrame(animate);

  // // iterate through the meshArray and update rotation
  // meshArray.forEach((mesh, index) => {
  //   updateRotation(mesh, index);
  // });

  mmi.update();

  renderer.render(scene, camera);
}

// ^Animation Loop^ -------------------------------------------------

