import { topicBoxArray } from "./main";

const infoBox = document.getElementById('infoBox');
const title = document.getElementById('infoBoxTitle');
const content = document.getElementById('infoBoxContent');

export default function createInfoBox(meshID) {
  if (meshID === topicBoxArray[0].id) {
    title.innerHTML = 'Right to Repair';
    content.innerText = 'New content goes here';
    console.log('InfoBoxMeshID:', topicBoxArray[0].id);
  }

  if (meshID === topicBoxArray[1].id) {
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

