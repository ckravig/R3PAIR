import '/style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// Import MouseMeshInteraction class
import MouseMeshInteraction from './three_mmi';

// Create modelArray
let modelArray = [];

// Debug const
let debug = true;


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
camera.position.setY(0);

renderer.render(scene, camera);

// Helper functions -------------------------------------------------

// Helper function to convert degrees to radians
function degToRad(degrees) {
  return degrees * (Math.PI / 180);
}

const visibleHeightAtZDepth = ( depth, camera ) => {
  // compensate for cameras not positioned at z=0
  const cameraOffset = camera.position.z;
  if ( depth < cameraOffset ) depth -= cameraOffset;
  else depth += cameraOffset;

  // vertical fov in radians
  const vFOV = camera.fov * Math.PI / 180; 

  // Math.abs to ensure the result is always positive
  return 2 * Math.tan( vFOV / 2 ) * Math.abs( depth );
};

const visibleWidthAtZDepth = ( depth, camera ) => {
  const height = visibleHeightAtZDepth( depth, camera );
  return height * camera.aspect;
};

let visibleHeight, visibleWidth, pixelRatio, screenWidth;

async function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

  visibleHeight = visibleHeightAtZDepth( -5, camera );
  visibleWidth = visibleWidthAtZDepth( -5, camera );
  console.log('visibleHeightAtZDepth:', visibleHeight);
  console.log('visibleWidthAtZDepth:', visibleWidth);

  // Object Sizing -------------------------------------------------
  pixelRatio = window.devicePixelRatio;
  screenWidth = visibleWidth;
  
  console.log('pixelRatio:', pixelRatio);
  console.log('screenWidth:', screenWidth);
  console.log('screenWidth:', screenWidth);
  // ^Object Sizing^ -------------------------------------------------


}

window.addEventListener('resize', onWindowResize);

// ^ Helper functions ^ -------------------------------------------------

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);




// ThreeJS Objects -------------------------------------------------

// 3D Model Loader
const gltfLoader = new GLTFLoader();

// Setup
window.onload = function() {
  onWindowResize();
  animate();
}

// threejsModel -------------------------------------------------
gltfLoader.load('/models/three.js/scene.gltf', (threejsModel) => {
  threejsModel.scene.position.z = camera.position.z - 5;
  let modelOffset = 0.7;
    // Positioning the three.js model in line
    threejsModel.scene.position.y = 0;
    threejsModel.scene.position.x = (-visibleWidth / 3) + modelOffset;
  threejsModel.scene.scale.set(0.015, 0.015, 0.015);
  scene.add(threejsModel.scene);
  modelArray.push(threejsModel.scene);
});

// viteModel -------------------------------------------------
gltfLoader.load('/models/vite/scene.glb', (viteModel) => {
  viteModel.scene.position.z = camera.position.z - 5;
  let modelOffset = 0.2;
      // Positioning the vite model in line
      viteModel.scene.position.y = 0;
      viteModel.scene.position.x = 0;
  viteModel.scene.scale.set(0.5, 0.5, 0.5);
  scene.add(viteModel.scene);
  modelArray.push(viteModel.scene);
});

// tailwinModel -------------------------------------------------
gltfLoader.load('/models/tailwind/scene.gltf', (tailwindModel) => {
  tailwindModel.scene.position.z = camera.position.z - 5;
  let modelOffset = 0.5;
      // Positioning the vite model in line
      tailwindModel.scene.position.y = 0;
      tailwindModel.scene.position.x = (visibleWidth / 3) - modelOffset;
      tailwindModel.scene.scale.set(2, 2, 2);
  scene.add(tailwindModel.scene);
  modelArray.push(tailwindModel.scene);
});






// ^ThreeJS Objects^ -------------------------------------------------


// Text -------------------------------------------------

const fontLoader = new FontLoader();
const ttfLoader = new TTFLoader();

// About Text
ttfLoader.load('/fonts/poppins/Poppins-Light.ttf', (json) => {
  // First parse the font.
  const poppinsFont = fontLoader.parse(json);
  // Use parsed font as normal.
  const textGeometry = new TextGeometry('About R3PAIR', {
    height: 0.05,
    size: 0.40,
    font: poppinsFont,
  });
  textGeometry.computeBoundingBox();
  const centerOffset = - 0.5 * (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);
  const textMaterial = new THREE.MeshNormalMaterial();
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.position.x = centerOffset;
  textMesh.position.y = visibleHeight * 0.25; // Set y position
  textMesh.position.z = camera.position.z - 5;

  textMesh.name = 'aboutText';

  scene.add(textMesh);
});

console.log('modelArray:', modelArray);


// three.js text
ttfLoader.load('/fonts/poppins/Poppins-Light.ttf', (json) => {
  // First parse the font.
  const poppinsFont = fontLoader.parse(json);
  // Use parsed font as normal.
  const textGeometry = new TextGeometry('three.js', {
    height: 0.05,
    size: 0.25,
    font: poppinsFont,
  });
  textGeometry.computeBoundingBox();
  const centerOffset = - 0.5 * (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);
  const textMaterial = new THREE.MeshNormalMaterial();
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);

  // Position the text directly under the first object in modelArray
  textMesh.position.y = -visibleHeight * 0.25;
  textMesh.position.x = -visibleWidth / 3;
  textMesh.position.z = camera.position.z - 5;
  textMesh.name = 'threejsText';
  scene.add(textMesh);
});


// Vite text
ttfLoader.load('/fonts/poppins/Poppins-Light.ttf', (json) => {
  // First parse the font.
  const poppinsFont = fontLoader.parse(json);
  // Use parsed font as normal.
  const textGeometry = new TextGeometry('Vite', {
    height: 0.05,
    size: 0.25,
    font: poppinsFont,
  });
  textGeometry.computeBoundingBox();
  const centerOffset = - 0.5 * (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);
  const textMaterial = new THREE.MeshNormalMaterial();
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);

  // Position the text directly under the first object in modelArray
  textMesh.position.y = -visibleHeight * 0.25;
  textMesh.position.x = centerOffset;
  textMesh.position.z = camera.position.z - 5;
  textMesh.name = 'viteText';
  scene.add(textMesh);
});


// tailwindcss text
ttfLoader.load('/fonts/poppins/Poppins-Light.ttf', (json) => {
  // First parse the font.
  const poppinsFont = fontLoader.parse(json);
  // Use parsed font as normal.
  const textGeometry = new TextGeometry('tailwindcss', {
    height: 0.05,
    size: 0.25,
    font: poppinsFont,
  });
  textGeometry.computeBoundingBox();
  const centerOffset = - 0.5 * (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);
  const textMaterial = new THREE.MeshNormalMaterial();
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);

  let modelOffset = 1.25;
  // Position the text directly under the first object in modelArray
  textMesh.position.y = -visibleHeight * 0.25;
  textMesh.position.x = (visibleWidth / 3) - modelOffset;
  textMesh.position.z = camera.position.z - 5;
  textMesh.name = 'tailwindcssText';
  scene.add(textMesh);
});

// ^ Text ^ -------------------------------------------------

// mmi -------------------------------------------------

// create a handler for when user clicks on a mesh with the name 'my_interactable_mesh'
mmi.addHandler('threejsText', 'click', function(mesh) {
  console.log('mesh:', mesh);
  window.open('https://threejs.org', '_blank');
});

// create a handler for when user clicks on a mesh with the name 'my_interactable_mesh'
mmi.addHandler('viteText', 'click', function(mesh) {
  console.log('mesh:', mesh);
  window.open('https://vitejs.dev', '_blank');
});

// create a handler for when user clicks on a mesh with the name 'my_interactable_mesh'
mmi.addHandler('tailwindcssText', 'click', function(mesh) {
  console.log('mesh:', mesh);
  window.open('https://tailwindcss.com', '_blank');
});

// ^ mmi ^ -------------------------------------------------



// Animation Loop -------------------------------------------------

function animate() {
  requestAnimationFrame(animate);

  modelArray.forEach((model) => {
    model.rotation.y += 0.005;
  });


  mmi.update();

  renderer.render(scene, camera);
}

// ^Animation Loop^ -------------------------------------------------

// Debug Menu -------------------------------------------------

document.addEventListener('keydown', function(event) {
  if (event.key === 'Keyd') {
    debug = !debug;
    console.log(`Debug mode: ${debug}`);
  }
});

if (debug) {

  // Camera Controls -------------------------------------------------
    let isMiddleMouseButtonDown = false;
    let preMousePosition = {
      x: 0,
      y: 0
    };
  
  
    document.addEventListener('mousedown', (event) => {
      if (event.button === THREE.MOUSE.MIDDLE) {
        isMiddleMouseButtonDown = true;
        preMousePosition.x = event.clientX;
        preMousePosition.y = event.clientY;
      }
    });
  
    document.addEventListener('mouseup', () => {
      isMiddleMouseButtonDown = false;
    });
  
    document.addEventListener('mousemove', (event) => {
      if (isMiddleMouseButtonDown) {
        const deltaX = event.clientX - preMousePosition.x;
        const deltaY = event.clientY - preMousePosition.y;
        camera.rotation.y -= deltaX * 0.01;
        camera.rotation.x -= deltaY * 0.01;
        preMousePosition.x = event.clientX;
        preMousePosition.y = event.clientY;
      }
    });
  
    document.addEventListener('keydown', function(event) {
      if (debug) {
        if (event.key === 'ArrowDown') {
          camera.position.z += 1;
        }
    
        if (event.key === 'ArrowUp') {
          camera.position.z -= 1;
        }
      }
        
    });
  
  // ^ Camera Controls ^ -------------------------------------------------
  
  // FPS Count -------------------------------------------------
  
  
  
  // ^ FPS Count ^ -------------------------------------------------
  
  }
  // ^ Debug Menu ^ -------------------------------------------------