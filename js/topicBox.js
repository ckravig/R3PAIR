import * as THREE from 'three';
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

import { topicBoxWidth, topicBoxArray, topicBoxDistance } from './main';

// Define createTopicBox method
export function createTopicBox(imageUrl, text) {
  // Container to store meshes
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
        size: 0.5,
        font: poppinsFont,
      });
      textGeometry.computeBoundingBox();
      const centerOffset = - 0.5 * (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);
      const textMaterial = new THREE.MeshNormalMaterial();
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.x = centerOffset;
      textMesh.position.y = 1.25;
      textMesh.position.z = -5;

      textMesh.name = 'topicBoxText';

      container.add(textMesh);
    });
  }

    // Append container to topicBoxArray
    topicBoxArray.push(container);

    // Set x position based on index in array
    const index = topicBoxArray.indexOf(container) -1;
    container.position.x = index * topicBoxDistance;
    container.position.z = -5;
    console.log('index:', index);
  

  return container;
}


// // Create Topic Box

// export function createTopicBox(topicBoxMapPath, text) {
//   const group = new THREE.Group();
//   const topicBoxMapTexture = new THREE.TextureLoader().load(topicBoxMapPath);
//   const geometry = new THREE.BoxGeometry(topicBoxWidth, topicBoxWidth, topicBoxWidth);
//   const material = new THREE.MeshBasicMaterial({ map: topicBoxMapTexture });
//   const mesh = new THREE.Mesh(geometry, material);
  
//   // add rotationSpeed property
//   mesh.rotationSpeed = { x: 0.005, y: 0 };

//   // add a name property
//   mesh.name = 'topicBox';

//   // Add topic box mesh to group
//   group.add(mesh);

//     // Add text mesh to group
//     if (text) {
//       const textMesh = topicBoxText(text);
//       group.add(textMesh);
//     }
  
//     return group;
// }

// export function topicBoxText(string) {
//   const fontLoader = new FontLoader();

//   const ttfLoader = new TTFLoader();
//   ttfLoader.load('/fonts/poppins/Poppins-Light.ttf', (json) => {
//     const poppinsFont = fontLoader.parse(json);

//     const textGeometry = new TextGeometry(string, {
//       height: 2,
//       size: 10,
//       font: poppinsFont,
//     });
  
//     const textMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
//     const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    
//     return textMesh;
//   });

  
// }