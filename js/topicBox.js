import * as THREE from 'three';
// Create Topic Box

export default function createTopicBox(topicBoxMapPath) {
  const topicBoxMapTexture = new THREE.TextureLoader().load(topicBoxMapPath);
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ map: topicBoxMapTexture });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'topicBox';
  
  
  return mesh;
}