import * as THREE from 'three';

import { cubeWidth } from './main';

// Create Topic Box

export default function createTopicBox(topicBoxMapPath) {
  const topicBoxMapTexture = new THREE.TextureLoader().load(topicBoxMapPath);
  const geometry = new THREE.BoxGeometry(cubeWidth, cubeWidth, cubeWidth);
  const material = new THREE.MeshBasicMaterial({ map: topicBoxMapTexture });
  const mesh = new THREE.Mesh(geometry, material);
  
  // add rotationSpeed property
  mesh.rotationSpeed = { x: 0.005, y: 0 };

  // add a name property
  mesh.name = 'topicBox';

  return mesh;
}
