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

  // repairBox object -------------------------------------------------

  const repairBox = createTopicBox('RightToRepair.jpg');

  scene.add(repairBox);

  repairBox.position.z = -5;
  repairBox.position.x = 0;

  if (debug) {
    const repairBoxDebug = document.createElement('div');
    repairBoxDebug.setAttribute('id', 'repairBoxDebug');
    repairBoxDebug.innerHTML = 'Right to Repair';

    // Add the div to an existing element with id "main"
    document.getElementById('main').appendChild(repairBoxDebug);
  }

  // ^repairBox object^ -------------------------------------------------

  // Scroll Animation -------------------------------------------------

  // function moveCamera() {
  //   const t = document.body.getBoundingClientRect().top;
  // moon.rotation.x += 0.05;
  // moon.rotation.y += 0.075;
  // moon.rotation.z += 0.05;

  // repairBox.rotation.y += 0.01;
  // repairBox.rotation.z += 0.01;

  //   camera.position.z = t * -0.01;
  //   camera.position.x = t * -0.0002;
  //   camera.rotation.y = t * -0.0002;
  // }

  // document.body.onscroll = moveCamera;
  // moveCamera();

  // ^Scroll Animation^ -------------------------------------------------

  // Topic Box Mouse Drag -------------------------------------------------
  // Add event listeners for mouse events on repairBox object 

  class MouseMeshInteraction {
    constructor(scene, camera){
      this.scene = scene;
      this.camera = camera;

      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2();

      this.updated = false;
      this.event = '';

      this.handlers = new Map();

      this.handlers.set('click', []);
      this.handlers.set('drag', []);

      window.addEventListener('mousemove', this);

      window.addEventListener('click', this);
      window.addEventListener('drag', this);
    }

    handleEvent(event){
      
    }

  }
  
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let currentRotationSpeed = { x: 0, y: 0 };

  renderer.domElement.addEventListener('mousedown', event => {
    mouse.x (e.clientX / window.innerWidth) *2-1;
    mouse.y (e.clientY / window.innerHeight) *2-1;
    planeNormal.copy(camera.position).normalize();
    plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, intersectionPoint);
    // isDragging = true;
  });

  renderer.domElement.addEventListener('click', event => {
    repairBox.position
  });

  renderer.domElement.addEventListener('mousemove', event => {
    if (isDragging) {
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
    isDragging = false;
  });

// ^Topic Box Mouse Drag^ -------------------------------------------------

// Animation Loop -------------------------------------------------

function animate() {
  requestAnimationFrame(animate);

  // torus.rotation.x += 0.01;
  // torus.rotation.y += 0.005;
  // torus.rotation.z += 0.01;

  // repairBox.rotation.x += 0.01;

  // repairBox animation loop
  const dragFactor = 0.99;
  repairBox.rotation.x += currentRotationSpeed.x;
  repairBox.rotation.y += currentRotationSpeed.y;
  currentRotationSpeed.x *= dragFactor;
  currentRotationSpeed.y *= dragFactor;

  if (debug) {
    repairBoxDebug.innerHTML = `X axis: ${repairBox.rotation.x}`;
  }

  if (!isDragging) {
    repairBox.rotation.y += 0.01;
    if(repairBox.rotation.x > 0) {
      repairBox.rotation.x += -0.01;
    }else if(repairBox.rotation.x < 0) {
      repairBox.rotation.x += 0.01;
    }
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
