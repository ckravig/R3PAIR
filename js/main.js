import '/style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Import MouseMeshInteraction class
import MouseMeshInteraction from './three_mmi';

// Import Topic Box object
import createTopicBox from './topicBox';

// Info View
let infoView = false;

// Debug const
const debug = false;

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

renderer.setPixelRatio(window.devicePixelRatio);
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

  // Gradient Background ------------------------------------------------

  // // Create a canvas element
  // const canvas = document.createElement('canvas');
  // canvas.width = window.innerWidth;
  // canvas.height = window.innerHeight;

  // // Get the 2D context of the canvas
  // const ctx = canvas.getContext('2d');

  // // Create a gradient fill style for the canvas
  // const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  // gradient.addColorStop(0, '#8ec5fc');
  // gradient.addColorStop(0.5, '#e0c3fc');
  // gradient.addColorStop(1, '#80d0c7');

  // // Draw the gradient on the canvas
  // ctx.fillStyle = gradient;
  // ctx.fillRect(0, 0, canvas.width, canvas.height);

  // // Create a texture from the canvas
  // const texture = new THREE.Texture(canvas);
  // texture.needsUpdate = true;

  // // Set the texture as the background of the scene
  // scene.background = texture;

  // ^Gradient Background^ ---------------------------------------------------

  // topicBox1 object -------------------------------------------------

const topicBox1 = createTopicBox('/images/RightToRepair.jpg');
const topicBox2 = createTopicBox('/images/Recycle-Logo.jpg');

topicBox1.position.z = -5;
topicBox1.position.x = 0;

topicBox2.position.z = -5;
topicBox2.position.x = 5;

scene.add(topicBox1);
scene.add(topicBox2);



const closeButton = document.getElementById('infoBoxCloseButton');
const infoBox = document.getElementById('infoBox');
  
closeButton.addEventListener('click', () => {
	infoBox.style.visibility = 'hidden';
  infoView = false;
  console.log('infoView:', infoView);
});

if (debug) {
  const topicBox1Debug = document.createElement('div');
  topicBox1Debug.setAttribute('id', 'topicBox1Debug');
  topicBox1Debug.innerHTML = 'Right to Repair';

  // Add the div to an existing element with id "main"
  document.getElementById('main').appendChild(topicBox1Debug);
}

// create a handler for when user clicks on a mesh with the name 'my_interactable_mesh'
mmi.addHandler('topicBox', 'click', function(mesh) {
  console.log('interactable mesh has been clicked!');
  console.log(topicBox1);
  infoBox.style.visibility = 'visible';
  infoView = true;
  console.log('infoView:', infoView);
}); 

  // ^topicBox1 object^ -------------------------------------------------

  // Scroll Animation -------------------------------------------------

  // function moveCamera() {
  //   const t = document.body.getBoundingClientRect().top;
  // moon.rotation.x += 0.05;
  // moon.rotation.y += 0.075;
  // moon.rotation.z += 0.05;

  // topicBox1.rotation.y += 0.01;
  // topicBox1.rotation.z += 0.01;

  //   camera.position.z = t * -0.01;
  //   camera.position.x = t * -0.0002;
  //   camera.rotation.y = t * -0.0002;
  // }

  // document.body.onscroll = moveCamera;
  // moveCamera();

  // ^Scroll Animation^ -------------------------------------------------

// Topic Box Mouse Drag -------------------------------------------------
// Add event listeners for mouse events on topicBox1 object 
let isMouseDown = false;
let previousMousePosition = { x: 0, y: 0 };
let currentRotationSpeed = { x: 0, y: 0 };
const momentumDampingFactor = 0.99;

mmi.addHandler('topicBox', 'mousedown', function(mesh) {
  // when mouse button is pressed down on the mesh, start tracking mouse movement
  isMouseDown = true;
  
  document.addEventListener('mousemove', function(event) {
    if (isMouseDown) {
      onMouseMove(event, mesh);
    }
  });
}); 

// add a mouseup event listener to stop tracking mouse movement and rotation
document.addEventListener('mouseup', function(event) {
  isMouseDown = false;
});

// define a function to handle mouse movement
function onMouseMove(event, mesh) {
  if (isMouseDown) {
    const deltaMove = {
      x: event.clientX - previousMousePosition.x,
      y: event.clientY - previousMousePosition.y,
    };
    currentRotationSpeed.x += deltaMove.y * 0.01;
    currentRotationSpeed.y += deltaMove.x * 0.01;

    const distance = Math.sqrt(deltaMove.x ** 2 + deltaMove.y ** 2);
    if (distance > 2) { // add a threshold to reduce jittering
      mesh.rotation.x = currentRotationSpeed.x;
      mesh.rotation.y = currentRotationSpeed.y;
    }
  } else {
    // decay current rotation speed over time
    currentRotationSpeed.x *= momentumDampingFactor;
    currentRotationSpeed.y *= momentumDampingFactor;
    
    // stop updating rotation if current rotation speed becomes negligible
    if (Math.abs(currentRotationSpeed.x) < 0.01 && Math.abs(currentRotationSpeed.y) < 0.01) {
      currentRotationSpeed = { x: 0, y: 0 };
    }
    
    mesh.rotation.x = currentRotationSpeed.x;
    mesh.rotation.y = currentRotationSpeed.y;
  }
  previousMousePosition = {
    x: event.clientX,
    y: event.clientY,
  };
}

// define a function to update rotation with momentum
function updateRotation(mesh) {
  if (!isMouseDown) {mesh.rotation.y += 0.005;}
  
  // mesh.rotation.y += currentRotationSpeed.y * 0.01;
  // mesh.rotation.x += currentRotationSpeed.x * 0.01;
  // currentRotationSpeed.x *= momentumDampingFactor;
  // currentRotationSpeed.y *= momentumDampingFactor;
  // if (Math.abs(currentRotationSpeed.x) < 0.01 && Math.abs(currentRotationSpeed.y) < 0.01) {
  //   currentRotationSpeed = { x: 0, y: 0 };
  // }

  if (!isMouseDown) {
    topicBox1.rotation.y += 0.005;
    if(topicBox1.rotation.x > 0) {
      topicBox1.rotation.x += -0.01;
    }else if(topicBox1.rotation.x < 0) {
      topicBox1.rotation.x += 0.01;
    }
  }
}

// renderer.domElement.addEventListener('mousedown', event => {
//   mouse.x (e.clientX / window.innerWidth) *2-1;
//   mouse.y (e.clientY / window.innerHeight) *2-1;
//   planeNormal.copy(camera.position).normalize();
//   plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
//   raycaster.setFromCamera(mouse, camera);
//   raycaster.ray.intersectPlane(plane, intersectionPoint);
//   isDragging = true;
// });

  // renderer.domElement.addEventListener('click', event => {
  //   topicBox1.position
  // });

  // mmi.addHandler('topicBox', 'mousemove', function(mesh) {
  //   if (isDragging) {
  //     const deltaMove = {
  //       x: event.clientX - previousMousePosition.x,
  //       y: event.clientY - previousMousePosition.y,
  //     };
  //     currentRotationSpeed.x = deltaMove.y * 0.01;
  //     currentRotationSpeed.y = deltaMove.x * 0.01;
  //   }
  //   previousMousePosition = {
  //     x: event.clientX,
  //     y: event.clientY,
  //   };
  // }); 

  // renderer.domElement.addEventListener('mousemove', event => {
  //   if (isDragging) {
  //     const deltaMove = {
  //       x: event.clientX - previousMousePosition.x,
  //       y: event.clientY - previousMousePosition.y,
  //     };
  //     currentRotationSpeed.x = deltaMove.y * 0.01;
  //     currentRotationSpeed.y = deltaMove.x * 0.01;
  //   }
  //   previousMousePosition = {
  //     x: event.clientX,
  //     y: event.clientY,
  //   };
  // });

  // renderer.domElement.addEventListener('mouseup', event => {
  //   isDragging = false;
  // });

// ^Topic Box Mouse Drag^ -------------------------------------------------

// Animation Loop -------------------------------------------------

function animate() {
  requestAnimationFrame(animate);

  // torus.rotation.x += 0.01;
  // torus.rotation.y += 0.005;
  // torus.rotation.z += 0.01;

  // topicBox1.rotation.y += 0.005;

  updateRotation(topicBox1);

  // topicBox1 animation loop
  // const dragFactor = 0.99;
  // topicBox1.rotation.x += currentRotationSpeed.x;
  // topicBox1.rotation.y += currentRotationSpeed.y;
  // currentRotationSpeed.x *= dragFactor;
  // currentRotationSpeed.y *= dragFactor;

  if (debug) {
    topicBox1Debug.innerHTML = `X axis: ${topicBox1.rotation.x}`;
  }



  // moon.rotation.x += 0.005;

  // controls.update();

  mmi.update();

  renderer.render(scene, camera);
}

// initThree();
// animate();

// ^Animation Loop^ -------------------------------------------------

// Helpers

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);

// Helper function to convert degrees to radians
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

// ^ Helper functions ^ -------------------------------------------------

// Key Controls -------------------------------------------------

document.addEventListener('keydown', function(event) {
  if (infoView === false) {
    
    if (event.key === 'ArrowRight') {
      camera.position.x += 5;
    }
  
    if (event.key === 'ArrowLeft') {
      camera.position.x += -5;
    }

  }
  console.log('infoView:', infoView);
});

// ^ Key Controls ^ -------------------------------------------------