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
import { createInfoBox } from './infoBox';

// Initiate wrenches vars
let wrenches = [];
let startY, endY;

// Info View
let infoView = false;

// Debug const
let debug = true;

// Setup

const scene = new THREE.Scene();

export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

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

let visibleHeight, visibleWidth, pixelRatio, topicBoxWidth, screenWidth, topicBoxDistance;

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
  topicBoxWidth = visibleWidth / 10;

  screenWidth = visibleWidth;
  topicBoxDistance = topicBoxWidth / (2 * Math.tan(camera.fov * Math.PI / 360)) + screenWidth;

  console.log('pixelRatio:', pixelRatio);
  console.log('topicBoxWidth:', topicBoxWidth);
  console.log('screenWidth:', screenWidth);
  console.log('screenWidth:', screenWidth);
  // ^Object Sizing^ -------------------------------------------------

  topicContainerArray.forEach(container => {
    container.position.x = topicBoxDistance * topicContainerArray.indexOf(container);
  });

  await recreateWrenchBackground();

}

window.addEventListener('resize', onWindowResize);

// ^ Helper functions ^ -------------------------------------------------

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// load the GLTF model
const gltfLoader = new GLTFLoader();

// onWindowResize();
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






// InfoBox Objects -------------------------------------------------

function generateInfoModel(scene, meshID) {
  const infoDepth = -2;

  let infoVisibleHeight = visibleHeightAtZDepth(infoDepth, camera);
  let infoVisibleWidth = visibleWidthAtZDepth(infoDepth, camera);

  const infoContainer = new THREE.Object3D();
  infoContainer.name = 'infoContainer';

  // create a grey material
  const rectangleMaterial = new THREE.MeshBasicMaterial({ color: 0xd1d5db });

  // create a rectangle geometry
  const rectangleGeometry = new THREE.PlaneGeometry(1, 1);

  // create a rectangle mesh using the geometry and material
  const infoRectangle = new THREE.Mesh(rectangleGeometry, rectangleMaterial);

  // position the rectangle
  const containerWidth = infoVisibleWidth * 0.75;
  infoContainer.position.x = -(infoVisibleWidth - containerWidth) / 2;
  infoRectangle.position.x = containerWidth / 2;
  infoRectangle.position.z = infoDepth;

  console.log('infoVisibleWidth:', infoVisibleWidth);

  // set name of the rectangle
  infoRectangle.name = 'infoRectangle';

  function addInfoRectangle() {
    // add the rectangle mesh to the container
    infoContainer.add(infoRectangle);
  }

  // model
  const infoGltfLoader = new GLTFLoader();
  if (meshID === topicBoxArray[0].id || meshID === 27) {
    infoGltfLoader.load('/models/wrench/scene.gltf', (infoGltf) => {
      let infoModel = infoGltf.scene.children[0];
      console.log("Info model loaded successfully.");
      infoModel.scale.set(0.02, 0.02, 0.02);
      infoModel.position.x = containerWidth / 2;
      infoModel.position.z = infoDepth;
      infoModel.position.y = 0;
      infoModel.rotateX(degToRad(90));
      infoModel.rotateZ(degToRad(-90));
      infoModel.name = 'infoModel';
      infoContainer.add(infoModel);
      addInfoRectangle();
    }, undefined, (error) => {
      console.log("Error loading info model:", error);
    });
  } else if (meshID === 29 || meshID === topicBoxArray[1].id) {
    infoGltfLoader.load('/models/wallE/scene.gltf', (infoGltf) => {
      let infoModel = infoGltf.scene.children[0];
      console.log("Info model loaded successfully.");
      infoModel.scale.set(0.009, 0.009, 0.009);
      infoModel.position.x = containerWidth / 2;
      infoModel.position.z = infoDepth;
      infoModel.position.y = -0.25;
      infoModel.name = 'infoModel';
      infoContainer.add(infoModel);
    }, undefined, (error) => {
      console.log("Error loading info model:", error);
    });

  }

  // move infoContainer to camera position
  infoContainer.position.x += camera.position.x;
  

  // add the container to the scene
  scene.add(infoContainer);

}

function closeInfoContainer() {
  const infoContainer = scene.getObjectByName('infoContainer');
  if (infoContainer) {
    scene.remove(infoContainer);
  }
}


// ^ InfoBox Objects ^ -------------------------------------------------


// topicBox objects -------------------------------------------------

const topicBox1 = createTopicBox(topicBoxWidth, '/images/RightToRepair.jpg', 'Right to Repair');
const topicBox2 = createTopicBox(topicBoxWidth, '/images/Recycle-Logo.jpg', 'Benefits');
const topicBox3 = createTopicBox(topicBoxWidth, '/images/tractor.png', 'Tractors?');


topicContainerArray = [topicBox1, topicBox2, topicBox3];

topicContainerArray.forEach(container => {
  topicBoxArray.push(container.children[0]);
});

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

// create a handler for when user clicks on a mesh with the name 'my_interactable_mesh'
mmi.addHandler('topicBox', 'click', function(mesh) {

  createInfoBox(mesh.id);
  infoView = true;

  generateInfoModel(scene, mesh.id);
    
  console.log('infoView:', infoView);
  console.log('mesh:', mesh);
}); 

const closeButton = document.getElementById('infoBoxCloseButton');
const infoBox = document.getElementById('infoBox');
  
closeButton.addEventListener('click', () => {
	infoBox.style.visibility = 'hidden';
  infoView = false;
  closeInfoContainer(scene);
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


// Wrench Background -------------------------------------------------

function createWrenchBackground() {
  // reset wrenches array
  wrenches = [];

  let preferredWrenchDensity = 3; // number of wrenches per visible height

  const maxWrenchWidth = 0.01; // maximum width of the wrench model
  const minColumnSpacing = maxWrenchWidth * (preferredWrenchDensity * 25); // minimum column spacing for wrenches

  // calculate the number of columns based on the visible width and minimum column spacing
  // let numColumns = 10;
  let numColumns = Math.floor(visibleWidth / minColumnSpacing);

  // ensure that there are at least 3 columns
  numColumns = Math.max(numColumns, 3);

  const columnSpacing = visibleWidth / numColumns;
  const maxWrenchHeight = maxWrenchWidth * visibleHeight / visibleWidth; // maximum height of the wrench model based on aspect ratio

  const padding = 0.5; // set the amount of padding to half the maximum wrench height

  startY = visibleHeight / 2 + padding;
  endY = -visibleHeight / 2 - padding;
  
  gltfLoader.load('/models/wrench/scene.gltf', (gltf) => {
    console.log("Wrench model loaded successfully.");
    const wrench = gltf.scene.children[0];
    const numWrenches = numColumns * Math.ceil(visibleHeight * preferredWrenchDensity);

    const numRows = Math.ceil(numWrenches / numColumns);
    const rowSpacing = (startY - endY) / numRows;

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numColumns; col++) {
        const instance = wrench.clone();
        instance.scale.set(maxWrenchWidth, maxWrenchWidth, maxWrenchWidth * visibleHeight / visibleWidth);
        instance.position.x = -visibleWidth / 2 + col * columnSpacing + columnSpacing / 2;
        instance.position.y = startY - row * rowSpacing;
        instance.position.z = -5;
        scene.add(instance);
        wrenches.push(instance);
      }
    }
  }, undefined, (error) => {
    console.log("Error loading wrench model:", error);
  });
}

async function recreateWrenchBackground() {
  // Remove existing wrenches from the scene
  await Promise.all(wrenches.map(wrench => {
    return new Promise(resolve => {
      scene.remove(wrench);
      resolve();
    });
  }));

  // Recreate the wrench background with new visibleWidth and visibleHeight values
  createWrenchBackground();
}

// animate the wrenches falling down the screen
function animateWrenches() {
  wrenches.forEach(element => {
    // make the element fall towards the bottom of the screen
    element.position.y -= 0.005; // fall speed
    
    // define a random axis of rotation and a random rotation speed for each element
    if (!element.userData.axis) {
      element.userData.axis = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
      element.userData.rotationSpeed = Math.random() * 0.05;
    }
    
    // rotate the element in its own random axis and speed
    element.rotateOnAxis(element.userData.axis, element.userData.rotationSpeed);
    
    // reset the element's position and userData if it falls off the bottom of the screen
    if (element.position.y < endY) {
      element.position.y = startY;
    }
  });
}

// ^Wrench Background^ -------------------------------------------------


// Animation Loop -------------------------------------------------

function animate() {
  requestAnimationFrame(animate);

  animateWrenches();

  // iterate through the topicBoxArray and update rotation
  topicBoxArray.forEach((mesh, index) => {
    updateRotation(mesh, index);
  });
  
  mmi.update();

  renderer.render(scene, camera);
}

// ^Animation Loop^ -------------------------------------------------

// Helpers

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);



// Standard Controls -------------------------------------------------

document.addEventListener('keydown', function(event) {
  if (infoView === false) {
    if (event.key === 'ArrowRight') {
      camera.position.x += topicBoxDistance;

      // move wrenches
      wrenches.forEach((wrench) => {
        wrench.position.x += topicBoxDistance;
      });
    }

    // prevent camera from moving past topicBox1
    if (camera.position.x != topicBox1.position.x) {
      if (event.key === 'ArrowLeft') {
        camera.position.x -= topicBoxDistance;

        // move wrenches
        wrenches.forEach((wrench) => {
          wrench.position.x -= topicBoxDistance;
        });
      }
    }
    
  }
});

// ^ Standard Controls ^ -------------------------------------------------

// Debug Menu -------------------------------------------------

document.addEventListener('keydown', function(event) {
  if (event.key === 'KeyD') {
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

