import '/style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Import MouseMeshInteraction class
import MouseMeshInteraction from './three_mmi';

// Create topicBoxArray
export let topicBoxArray = [];

// Create topicContainerArray
export let topicContainerArray = [];

// Import Topic Box object
import { createTopicBox } from './topicBox';

// Import Info Box object
import createInfoBox from './infoBox';

// Info View
let infoView = false;

// Debug const
const debug = false;

// Setup

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

let visibleHeight, visibleWidth, pixelRatio, topicBoxWidth, screenWidth, topicBoxDistance;

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

  visibleHeight = visibleHeightAtZDepth( -5, camera );
  visibleWidth = visibleWidthAtZDepth( -5, camera );
  console.log('visibleHeightAtZDepth:', visibleHeight);
  console.log('visibleWidthAtZDepth:', visibleWidth);

  // Object Sizing -------------------------------------------------
  pixelRatio = window.devicePixelRatio;
  topicBoxWidth = visibleWidth / 10;

  screenWidth = visibleWidth;
  topicBoxDistance = topicBoxWidth / (2 * Math.tan(camera.fov * Math.PI / 360)) + screenWidth;

  console.log('pixelRatio:', pixelRatio);
  console.log('topicBoxWidth:', topicBoxWidth);
  console.log('screenWidth:', screenWidth);
  console.log('screenWidth:', screenWidth);
  // ^Object Sizing^ -------------------------------------------------
}

window.addEventListener('resize', onWindowResize);

// ^ Helper functions ^ -------------------------------------------------

onWindowResize();
window.onload = function() {
  onWindowResize();
  animate();
}

// Sizing -------------------------------------------------

// let width = pixelsToUnits(window.innerWidth, camera);
// let height = pixelsToUnits(window.innerHeight, camera);

// console.log('width:', width);
// console.log('height:', height);

// ^Sizing^ -------------------------------------------------



// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// load the GLTF model
const gltfLoader = new GLTFLoader();


// // Object Sizing -------------------------------------------------
// export let pixelRatio = window.devicePixelRatio;
// export let topicBoxWidth = 1 / pixelRatio;

// export let screenWidth = window.innerWidth;
// export let topicBoxDistance = topicBoxWidth / (2 * Math.tan(camera.fov * Math.PI / 360)) + screenWidth;

// console.log('pixelRatio:', pixelRatio);
// console.log('topicBoxWidth:', topicBoxWidth);
// console.log('screenWidth:', screenWidth);
// console.log('screenWidth:', screenWidth);
// // ^Object Sizing^ -------------------------------------------------


// topicBox1 object -------------------------------------------------

const topicBox1 = createTopicBox(topicBoxWidth, '/images/RightToRepair.jpg', 'Right to Repair');
const topicBox2 = createTopicBox(topicBoxWidth, '/images/Recycle-Logo.jpg', 'Benefits');

topicContainerArray = [topicBox1, topicBox2];
topicBoxArray = [topicBox1.children[0], topicBox2.children[0]];

topicBoxArray.forEach(boxMesh => {
  boxMesh.parent.position.z = -5;
  boxMesh.parent.position.x = topicBoxDistance * topicBoxArray.indexOf(boxMesh);
  scene.add(boxMesh.parent);
});

// topicBox1.position.z = -5;
// topicBox1.position.x = 0;

// topicBox2.position.z = -5;
// topicBox2.position.x = topicBoxDistance;

// scene.add(topicBox1);
// scene.add(topicBox2);

console.log('topicBoxArray:', topicBoxArray);
console.log('topicContainerArray:', topicContainerArray);


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

topicBoxArray.forEach(mesh => {
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
    currentRotationSpeeds[topicBoxArray.indexOf(selectedMesh)].x = deltaMove.y * 0.01;
    currentRotationSpeeds[topicBoxArray.indexOf(selectedMesh)].y = deltaMove.x * 0.01;
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
// ^Topic Box Mouse Drag^ ------------------------------------------------


// Wrecnch Background -------------------------------------------------

const wrenches = [];
const numColumns = 10;
const columnSpacing = visibleWidthAtZDepth( -5, camera ) / numColumns;
const startY = 15; // highest starting y-value
const endY = -10; // lowest y-value where wrenches can appear

console.log("Loading wrench model...");

gltfLoader.load('/models/wrench/scene.gltf', (gltf) => {
  console.log("Wrench model loaded successfully.");
  const wrench = gltf.scene.children[0];
  const numWrenches = numColumns * Math.ceil(visibleHeightAtZDepth(-5, camera) / columnSpacing);

  const numRows = Math.ceil(numWrenches / numColumns); // round up to ensure we have enough wrenches
  const rowSpacing = (startY - endY) / numRows;

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numColumns; col++) {
      const instance = wrench.clone();
      instance.scale.set(0.01, 0.01, 0.01);
      instance.position.x = -visibleWidthAtZDepth(-5, camera) / 2 + col * columnSpacing;
      instance.position.y = startY - row * rowSpacing;
      instance.position.z = -5;
      scene.add(instance);
      wrenches.push(instance);
    }
  }
}, undefined, (error) => {
  console.log("Error loading wrench model:", error);
});





// ^Wrecnch Background^ -------------------------------------------------


// Animation Loop -------------------------------------------------

function animate() {
  requestAnimationFrame(animate);

  wrenches.forEach(element => {

    // make the element fall towards the bottom of the screen
    element.position.y -= 0.01;
  
    // define a random axis of rotation and a random rotation speed for each element
    if (!element.userData.axis) {
      element.userData.axis = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
      element.userData.rotationSpeed = Math.random() * 0.05;
    }
  
    // rotate the element in its own random axis and speed
    element.rotateOnAxis(element.userData.axis, element.userData.rotationSpeed);
  
    // reset the element's position and userData if it falls off the bottom of the screen
    if (element.position.y < -10) {
      element.position.y = 10;
      element.userData = {};
    }
  });
  

  // iterate through the topicBoxArray and update rotation
  topicBoxArray.forEach((mesh, index) => {
    updateRotation(mesh, index);
  });

  if (debug) {
    topicBox1Debug.innerHTML = `X axis: ${topicBox1.rotation.x}`;
  }

  mmi.update();

  renderer.render(scene, camera);
}

// ^Animation Loop^ -------------------------------------------------

// Helpers

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);



// Key Controls -------------------------------------------------

document.addEventListener('keydown', function(event) {
  if (infoView === false) {
    if (event.key === 'ArrowRight') {
      camera.position.x += topicBoxDistance;

      wrenches.forEach((wrench) => {
        wrench.position.x += topicBoxDistance;
      });
    }

    if (camera.position.x != 0) {
      if (event.key === 'ArrowLeft') {
        camera.position.x -= topicBoxDistance;

        wrenches.forEach((wrench) => {
          wrench.position.x -= topicBoxDistance;
        });
      }
    }
  
    if (event.key === 'ArrowDown') {
      camera.position.z += 1;
    }

    if (event.key === 'ArrowUp') {
      camera.position.z -= 1;
    }
  }
});

// ^ Key Controls ^ -------------------------------------------------

// Camera Controls -------------------------------------------------
let isMiddleMouseButtonDown = false;
let preMousePosition = {
  x: 0,
  y: 0
};

if (debug) {
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
}
// ^ Camera Controls ^ -------------------------------------------------

