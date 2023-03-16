const newItemInput = document.getElementById('new-item-input');
const addItemButton = document.getElementById('add-item-button');

const itemList = document.getElementById('item-list');

addItemButton.addEventListener('click', () => {
  const newItemText = newItemInput.value;
  if (newItemText !== '') {
    const newItem = document.createElement('li');
    newItem.draggable = true; //make the new list item draggable
    itemList.appendChild(newItem);

    //Add a div for the item name and a div for the buttons and timer
    const itemContent = document.createElement('div');
    itemContent.classList.add('item-content');
    newItem.appendChild(itemContent);
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    newItem.appendChild(buttonContainer);

    //Add the item name
    const itemName = document.createElement('span');
    itemName.innerText = newItemText;
    itemContent.appendChild(itemName);

    //Buttons for item
    const removeButton = document.createElement('button');
    removeButton.innerText = 'X';
    removeButton.addEventListener('click', () => {
      itemList.removeChild(newItem);
    });
    
    const timerDisplay = document.createElement('span');
    timerDisplay.innerText = '0:00:00';
    buttonContainer.appendChild(timerDisplay);
    const startButton = document.createElement('button');
    startButton.innerText = 'Start';
    buttonContainer.appendChild(startButton);
    const pauseButton = document.createElement('button');
    pauseButton.innerText = 'Pause';
    buttonContainer.appendChild(pauseButton);  
    buttonContainer.appendChild(removeButton);

    newItem.addEventListener('dragstart', dragStart);
    newItem.addEventListener('dragend', dragEnd);

   //Time control
    let timerInterval;
    let startTime;
    let pausedTime = 0;
    let running = false;
    startButton.addEventListener('click', () => {
      if (!running) {
        startTime = Date.now() - pausedTime;
        timerInterval = setInterval(() => {
          const elapsedTime = Date.now() - startTime;
          const hours = Math.floor(elapsedTime / 3600000);
          const minutes = Math.floor((elapsedTime % 3600000) / 60000)
            .toString()
            .padStart(2, '0');
          const seconds = Math.floor((elapsedTime % 60000) / 1000)
            .toString()
            .padStart(2, '0');
          timerDisplay.innerText = `${hours}:${minutes}:${seconds}`;
        }, 1000);
        running = true;
      }
    });
    pauseButton.addEventListener('click', () => {
      if (running) {
        clearInterval(timerInterval);
        pausedTime = Date.now() - startTime;
        running = false;
        //Contemplating adding a saving and loading feature somwhere
        //localStorage.setItem(newItemText, timerDisplay.innerText)
      }
    });
  }
});

let draggedItem = null;
let droppedItem = null;

document.addEventListener('dragover', dragOver);
document.addEventListener('drop', dropItem);

function dragStart(event) {
  draggedItem = event.target;
  setTimeout(() => event.target.classList.add('invisible'), 0);
}

function dragEnd(event) {
  event.target.classList.remove('invisible');
}

function dragOver(event) {
  event.preventDefault();
  if (event.target.tagName === 'LI') {
    event.target.classList.add('drag-over');
  }
}

function dropItem(event) {
  event.preventDefault();
  if (event.target.tagName === 'LI') {
    event.target.classList.remove('drag-over');
    droppedItem = event.target;
    const droppedIndex = [...itemList.children].indexOf(droppedItem);
    const draggedIndex = [...itemList.children].indexOf(draggedItem);
    if (droppedIndex > draggedIndex) {
      itemList.insertBefore(draggedItem, droppedItem.nextSibling);
    } else {
      itemList.insertBefore(draggedItem, droppedItem);
    }
  }
}
