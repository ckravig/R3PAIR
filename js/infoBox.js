const infoBox = document.getElementById('infoBox');
const title = document.getElementById('infoBoxTitle');
const content = document.getElementById('infoBoxContent');

export default function createInfoBox(meshID) {
  if (meshID === 13) {
    title.innerHTML = 'Right to Repair';
    content.innerText = 'New content goes here';
  }

  if (meshID === 14) {
    title.innerHTML = 'Benefits of Right to Repair';
    content.innerText = 'New content goes here';
  }

  openInfoBox();
}

function openInfoBox() {
    infoBox.style.visibility = 'visible';
    console.log('infoBox.style.visibility:', infoBox.style.visibility);
}

