import * as THREE from 'three';

import { topicBoxArray } from "./main";

const infoBox = document.getElementById('infoBox');
const title = document.getElementById('infoBoxTitle');
const content = document.getElementById('infoBoxContent');

export default function createInfoBox(meshID) {
  if (meshID === 27) {
    title.innerHTML = 'Right to Repair';
    content.innerText = 'The Right to Repair is a movement that advocates ' +
    'for the ability of individuals and independent repair shops to access ' +
    'the tools, parts, and information needed to repair and maintain ' +
    'electronic devices, appliances, and other products. In recent years, ' +
    'many manufacturers have made it difficult or even impossible for ' +
    'consumers to repair their own devices by implementing proprietary ' +
    'screws, software locks, and other barriers.\n\n' +
    
    'The Right to Repair movement aims to promote sustainability, reduce ' +
    'electronic waste, and give consumers more control over the products ' +
    'they own. By enabling repairs, consumers can extend the life of their ' +
    'devices and save money on costly replacements. Additionally, the movement ' +
    'seeks to empower independent repair businesses, which can create local ' +
    'jobs and provide affordable repair options for consumers.\n\n' +
    
    'Overall, the Right to Repair movement is about promoting a more equitable ' +
    'and sustainable system of consumer electronics and products.';
  
    
    console.log('InfoBoxMeshID:', topicBoxArray[0].id);
  }

  if (meshID === 29) {
    title.innerHTML = 'Benefits of Right to Repair';
    content.innerText = 'New content goes here';
  }

  console.log('meshID:', meshID);
  console.log('InfoBox[0]MeshID:', topicBoxArray[0].id);

  openInfoBox();
}

function openInfoBox() {
    infoBox.style.visibility = 'visible';
    console.log('infoBox.style.visibility:', infoBox.style.visibility);
}

