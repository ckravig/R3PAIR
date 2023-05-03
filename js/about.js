import '/style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Import MouseMeshInteraction class
import MouseMeshInteraction from './three_mmi';

// Info View
let infoView = false;

// Debug const
const debug = false;

// Setup
window.onload = function() {
  animate();
}

// Object Sizing
export const pixelRatio = window.devicePixelRatio;
export const cubeWidth = 1 / pixelRatio;

console.log('pixelRatio:', pixelRatio);
console.log('cubeWidth:', cubeWidth);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#canvas'),
  antialias: true,
  alpha: true,
});

// pass threejs scene and camera to mmi
const mmi = new MouseMeshInteraction(scene, camera);

renderer.setPixelRatio(pixelRatio);
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





if (debug) {
  const topicBox1Debug = document.createElement('div');
  topicBox1Debug.setAttribute('id', 'topicBox1Debug');
  topicBox1Debug.innerHTML = 'Right to Repair';

  // Add the div to an existing element with id "main"
  document.getElementById('main').appendChild(topicBox1Debug);
}

// create a handler for when user clicks on a mesh with the name 'my_interactable_mesh'
mmi.addHandler('topicBox', 'click', function(mesh) {

  createInfoBox(mesh.id);
  infoView = true;
    
  console.log('infoView:', infoView);
  console.log('mesh:', mesh);
}); 

const closeButton = document.getElementById('infoBoxCloseButton');
const infoBox = document.getElementById('infoBox');
  
closeButton.addEventListener('click', () => {
	infoBox.style.visibility = 'hidden';
  infoView = false;
  console.log('infoView:', infoView);
});

// ^topicBox1 object^ -------------------------------------------------

// Topic Box Mouse Drag -------------------------------------------------
// Add event listeners for mouse events on topicBox1 object 
let isMouseDown = false;
let previousMousePosition = { x: 0, y: 0 };
let selectedMesh = null;

const currentRotationSpeeds = [];

meshArray.forEach(mesh => {
  currentRotationSpeeds.push({ x: 0, y: 0 });
});

mmi.addHandler('topicBox', 'mousedown', function(mesh) {
  // when mouse button is pressed down on the mesh, start tracking mouse movement
  isMouseDown = true;
  selectedMesh = mesh;
  console.log('Selected Mesh on MouseDown:', selectedMesh);
}); 

// add a mouseup event listener to stop tracking mouse movement and rotation
document.addEventListener('mouseup', function(event) {
  isMouseDown = false;
});

// add a mousemove event listener to update rotation speed
document.addEventListener('mousemove', function(event) {
  onMouseMove(event);
});

// define a function to handle mouse movement
function onMouseMove(event) {
  if (isMouseDown) {
    const deltaMove = {
      x: event.clientX - previousMousePosition.x,
      y: event.clientY - previousMousePosition.y,
    };
    currentRotationSpeeds[meshArray.indexOf(selectedMesh)].x = deltaMove.y * 0.01;
    currentRotationSpeeds[meshArray.indexOf(selectedMesh)].y = deltaMove.x * 0.01;
  }
  previousMousePosition = {
    x: event.clientX,
    y: event.clientY,
  };
}

// define a function to update rotation with momentum
function updateRotation(mesh, index) {
  // apply rotation only on the selected mesh
  if (mesh === selectedMesh) {
    const dragFactor = 0.99;
    mesh.rotation.x += currentRotationSpeeds[index].x;
    mesh.rotation.y += currentRotationSpeeds[index].y;
    currentRotationSpeeds[index].x *= dragFactor;
    currentRotationSpeeds[index].y *= dragFactor;

    if (!isMouseDown) {
      mesh.rotation.y += 0.005;
      if (mesh.rotation.x > 0) {
        mesh.rotation.x += -0.01;
      } else if (mesh.rotation.x < 0) {
        mesh.rotation.x += 0.01;
      }
    }
  } else {
    // rotate the mesh independently if it is not selected
    const dragFactor = 0.99;
    mesh.rotation.x += currentRotationSpeeds[index].x;
    mesh.rotation.y += currentRotationSpeeds[index].y;
    currentRotationSpeeds[index].x *= dragFactor;
    currentRotationSpeeds[index].y *= dragFactor;

    mesh.rotation.y += 0.005;
    if (mesh.rotation.x > 0) {
      mesh.rotation.x += -0.01;
    } else if (mesh.rotation.x < 0) {
      mesh.rotation.x += 0.01;
    }
  }
}
// ^Topic Box Mouse Drag^ -------------------------------------------------

// Animation Loop -------------------------------------------------

function animate() {
  requestAnimationFrame(animate);

  // iterate through the meshArray and update rotation
  meshArray.forEach((mesh, index) => {
    updateRotation(mesh, index);
  });


  mmi.update();

  renderer.render(scene, camera);
}