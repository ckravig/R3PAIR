import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Import Topic Box object
import createTopicBox from './src/js/topicBox.js';

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

  const topicBox1 = createTopicBox('RightToRepair.jpg');

  scene.add(topicBox1);

  topicBox1.position.z = -5;
  topicBox1.position.x = 0;

  if (debug) {
    const topicBox1Debug = document.createElement('div');
    topicBox1Debug.setAttribute('id', 'topicBox1Debug');
    topicBox1Debug.innerHTML = 'Right to Repair';

    // Add the div to an existing element with id "main"
    document.getElementById('main').appendChild(topicBox1Debug);
  }

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
  // Add event listeners for mouse events on topicBox1 object ----------------
  let isMouseDown = false;
  let previousMousePosition = { x: 0, y: 0 };
  let currentRotationSpeed = { x: 0, y: 0 };

  renderer.domElement.addEventListener('mousedown', event => {
    isMouseDown = true;
  });

  renderer.domElement.addEventListener('mousemove', event => {
    if (isMouseDown) {
      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y,
      };
      currentRotationSpeed.x = deltaMove.y * 0.01;
      currentRotationSpeed.y = deltaMove.x * 0.01;
    }
    previousMousePosition = {
      x: event.clientX,
      y: event.clientY,
    };
  });

  renderer.domElement.addEventListener('mouseup', event => {
    isMouseDown = false;
  });

  // define a function to update rotation with momentum
function updateRotation(mesh) {

  // topicBox1 animation loop
  const dragFactor = 0.99;
  topicBox1.rotation.x += currentRotationSpeed.x;
  topicBox1.rotation.y += currentRotationSpeed.y;
  currentRotationSpeed.x *= dragFactor;
  currentRotationSpeed.y *= dragFactor;
  
  if (!isMouseDown) {
    topicBox1.rotation.y += 0.005;
    if(topicBox1.rotation.x > 0) {
      topicBox1.rotation.x += -0.01;
    }else if(topicBox1.rotation.x < 0) {
      topicBox1.rotation.x += 0.01;
    }
  }
}

// ^Topic Box Mouse Drag^ -------------------------------------------------

// Animation Loop -------------------------------------------------

function animate() {
  requestAnimationFrame(animate);

  // torus.rotation.x += 0.01;
  // torus.rotation.y += 0.005;
  // torus.rotation.z += 0.01;

  // topicBox1.rotation.x += 0.01;

  updateRotation(topicBox1);

  if (debug) {
    topicBox1Debug.innerHTML = `X axis: ${topicBox1.rotation.x}`;
  }

  

  // moon.rotation.x += 0.005;

  // controls.update();

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
