import * as THREE from 'three';

import { topicBoxArray } from "./main";

const infoBox = document.getElementById('infoBox');
const title = document.getElementById('infoBoxTitle');
const content = document.getElementById('infoBoxContent');

export function createInfoBox(meshID) {
  if (meshID === topicBoxArray[0].id || meshID === 27) {
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
  } else if (meshID === 29 || meshID === topicBoxArray[1].id) {
    title.innerHTML = 'Benefits of Right to Repair';
    content.innerText = 'Reducing e-waste: By allowing consumers to repair their own devices or have them repaired by independent repair shops, Right to Repair reduces the amount of electronic waste generated by throwing away broken devices and encourages the reuse and recycling of electronic components.\n\n'
    + 'Cost savings: Repairing a device is often cheaper than replacing it with a new one. Right to Repair can save consumers money by providing them with more affordable repair options.\n\n'
    + 'Increased competition: By opening up the repair market to independent repair shops, Right to Repair increases competition and gives consumers more options for repair services. This can lead to better service and more competitive pricing.\n\n'
    + 'Job creation: Right to Repair can create new job opportunities in the repair industry. Independent repair shops and technicians can offer services for a variety of devices and can help support local economies.\n\n'
    + 'Sustainability: Right to Repair promotes a more sustainable approach to consumption by extending the lifespan of devices and reducing the demand for new products. This can help reduce the environmental impact of manufacturing and reduce the consumption of finite resources.\n\n'
    + 'Accessibility: Right to Repair can increase accessibility to technology for low-income and marginalized communities who may not be able to afford new devices. Repairing existing devices can provide these communities with access to technology that can improve their lives and help bridge the digital divide.';
  } else if (meshID === 35 || meshID === topicBoxArray[2].id) {
    title.innerHTML = 'Right to Repair Industries';
    content.innerText = 'Many industries have right to repair movements within them.\n\n'
    + 'The most notable industry you might be thinking of is consumer electronics... What might not have come to your mind is FARMING! \n\n'
    + 'Tractors have become a prominent issue in the right to repair movement. Farmers, particularly those in the United States, have been advocating for their right to repair their own tractors and equipment for many years. Tractors have become increasingly complex machines with the advent of new technology, and this has made it difficult for farmers to fix their own equipment when it breaks down. In many cases, the manufacturer requires the farmer to go through an authorized dealer to make repairs, which can be costly and time-consuming.  \n\n'
    + 'This has led to a movement among farmers to demand their right to repair their own tractors. They argue that they have the knowledge and expertise to fix their own equipment and that they should not be forced to go through a dealer for repairs. Many farmers have also expressed concern about the high cost of repairs and the long wait times for repairs to be completed.  \n\n'
    + 'Tractor manufacturers, on the other hand, argue that their equipment is complex and that only authorized dealers have the knowledge and expertise to make repairs. They also argue that allowing farmers to repair their own equipment could lead to safety issues and could potentially void the warranty. \n\n'
    + 'Despite these concerns, the right to repair movement has gained momentum in recent years. Some states in the US have passed legislation that requires manufacturers to provide farmers with access to the information and tools they need to repair their own equipment. This has been a major victory for farmers who have been fighting for their right to repair their own tractors and other equipment.';
  }

  console.log('meshID:', meshID);

  openInfoBox();
}

function openInfoBox() {
    infoBox.style.visibility = 'visible';
    console.log('infoBox.style.visibility:', infoBox.style.visibility);
}