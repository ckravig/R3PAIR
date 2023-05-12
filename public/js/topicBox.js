import * as THREE from 'three';
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// Define createTopicBox method
export function createTopicBox(topicBoxWidth, imageUrl, text) {
  const container = new THREE.Object3D();

  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(imageUrl);
  const material = new THREE.MeshBasicMaterial({
    map: texture
  });
  const geometry = new THREE.BoxGeometry(topicBoxWidth, topicBoxWidth, topicBoxWidth);
  const boxMesh = new THREE.Mesh(geometry, material);

  // add rotationSpeed property
  boxMesh.rotationSpeed = { x: 0.005, y: 0 };

  // add a name property
  boxMesh.name = 'topicBox';

  container.add(boxMesh);

  if (text) {
    const fontLoader = new FontLoader();
    const ttfLoader = new TTFLoader();
    ttfLoader.load('/fonts/poppins/Poppins-Light.ttf', (json) => {
      // First parse the font.
      const poppinsFont = fontLoader.parse(json);
      // Use parsed font as normal.
      const textGeometry = new TextGeometry(text, {
        height: 0.05,
        size: 0.25,
        font: poppinsFont,
      });
      textGeometry.computeBoundingBox();
      const centerOffset = - 0.5 * (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);
      const textMaterial = new THREE.MeshNormalMaterial();
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.x = centerOffset;
      textMesh.position.y = 0.75;
      textMesh.position.z = 2;

      textMesh.name = 'topicBoxText';

      container.add(textMesh);
    });
  }

  return container;
}