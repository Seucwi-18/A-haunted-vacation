// Game variables
let sanity = 100;
let moves = 0;
let inventory = [];
let currentRoom = "StoryIntro";

// Add item to inventory
function addItem(item) {
  inventory.push(item);
  renderInventory();
}

// Remove random item (used when fainting)
function removeRandomItem() {
  if(inventory.length === 0) return;
  const index = Math.floor(Math.random() * inventory.length);
  const removed = inventory.splice(index,1)[0];
  alert(`You fainted and lost ${removed.name}!`);
  renderInventory();
}

// Render inventory
function renderInventory() {
  const invDiv = document.getElementById("inventory");
  invDiv.innerHTML = "";
  inventory.forEach(item => {
    const img = document.createElement("img");
    img.src = item.img;
    img.title = item.name;
    invDiv.appendChild(img);
  });
}

// Update sanity bar
function updateSanityBar() {
  document.getElementById("sanity-fill").style.width = sanity + "%";
}

// Room definitions
const rooms = {
  "StoryIntro": {
    text: `After a long drive to the beach, the hotel sign flickers strangely. The clerk hands you Room 105 key.`,
    choices: [
      {text: "Proceed down the hallway", next: "HallwayExplore"}
    ],
    onEnter: () => {
      addItem({name:"Room 105 Key", img:"images/room105key.png"});
    }
  },
  "HallwayExplore": {
    text: "The hallway stretches endlessly. Floorboards creak under your steps.",
    choices: [
      {text: "Reach Room 105", next: "Room105Door"}
    ],
    onEnter: () => {
      sanity -= 75;
      moves++;
      updateSanityBar();
      checkFaint();
    }
  },
  "Room105Door": {
    text: "You reach Room 105. The door looms before you. Your sanity feels low.",
    choices: [
      {text: "Unlock door with Room 105 Key", next: "Room105Home", keyRequired: "Room 105 Key"}
    ]
  },
  "Room105Home": {
    text: "Your home base. The bed is comforting. Sleep, check inventory, or explore other rooms.",
    choices: [
      {text: "Sleep to restore sanity", next: "Sleep105"},
      {text: "Check inventory / clues", next: "Inventory105"},
      {text: "Go to 1st Floor Rooms", next: "Floor1Menu"},
      {text: "Go to 2nd Floor Rooms", next: "Floor2Menu"},
      {text: "Go to Special Rooms", next: "SpecialRoomsMenu"}
    ]
  },

  // Floor 1 Rooms
  "Floor1Menu": {
    text: "Choose a room to explore on Floor 1:",
    choices: [
      {text: "Room 101", next: "Room101Door"},
      {text: "Room 102", next: "Room102Door"},
      {text: "Room 103", next: "Room103Door"},
      {text: "Room 104", next: "Room104Door"},
      {text: "Room 105", next: "Room105Home"}
    ]
  },
  "Room101Door": {text: "Room 101 door.", choices: [{text:"Enter Room 101", next:"Room101"}], keyRequired: "Room 101 Key"},
  "Room101": {text:"You explore Room 101.", choices:[{text:"Return to Floor 1 Menu", next:"Floor1Menu"}]},

  // Floor 2 Rooms
  "Floor2Menu": {
    text: "Choose a room to explore on Floor 2:",
    choices: [
      {text: "Room 201", next: "Room201Door"},
      {text: "Room 202", next: "Room202Door"},
      {text: "Room 203", next: "Room203Door"},
      {text: "Room 204", next: "Room204Door"},
      {text: "Room 205", next: "Room205Door"}
    ]
  },
  // Special Rooms
  "SpecialRoomsMenu": {
    text: "Special Rooms Menu: explore carefully.",
    choices: [
      {text: "Pool Room", next:"PoolRoom", keyRequired: "Pool Room Key"},
      {text: "Office", next:"OfficeRoom", keyRequired: "Office Room Key"},
      {text: "Basement", next:"BasementRoom", keyRequired: "Basement Key"}
    ]
  },
  "PoolRoom": {
    text: "A ghostly figure at the bottom of the pool reaches for you!",
    choices: [
      {text:"Dodge Left", next:"PoolSafe"},
      {text:"Dodge Right", next:"BasementHidden"}
    ]
  },
  "PoolSafe": {text:"You are safe. You find a clue to the next key.", choices:[{text:"Return to Special Rooms", next:"SpecialRoomsMenu"}]},
  "BasementHidden": {text:"You are pulled into the basement! A hidden path.", choices:[{text:"Explore Basement", next:"BasementRoom"}]},

  "OfficeRoom": {text:"The office is locked behind a puzzle. Solve in Discord to get the key.", choices:[{text:"Return to Special Rooms", next:"SpecialRoomsMenu"}]},
  "BasementRoom": {text:"The basement is dark and eerie.", choices:[{text:"Return to Special Rooms", next:"SpecialRoomsMenu"}]},

 // Inventory / Sleep placeholders
  "Inventory105": {text:"Your inventory:", choices:[{text:"Return to Room 105", next:"Room105Home"}]},
  "Sleep105": {text:"You sleep and restore sanity.", choices:[{text:"Wake up", next:"Room105Home"}], onEnter:()=>{sanity=100; updateSanityBar();}}
};

// Check faint due to moves
function checkFaint() {
  if(moves % 4 === 0 && sanity <= 0){
    removeRandomItem();
    sanity = 25; // regain a little sanity after faint
    updateSanityBar();
  }
}

// Render room
function renderRoom(roomName) {
  const room = rooms[roomName];
  currentRoom = roomName;

  // Key requirement
  if(room.choices) {
    room.choices.forEach(choice => {
      if(choice.keyRequired && !inventory.some(item => item.name === choice.keyRequired)) {
        choice.disabled = true;
        choice.text += " (Key required)";
      }
    });
  }

  // onEnter hook
  if(room.onEnter) room.onEnter();

  document.getElementById("story-text").innerText = room.text;

  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  if(room.choices) {
    room.choices.forEach(choice => {
      const btn = document.createElement("button");
      btn.innerText = choice.text;
      btn.disabled = choice.disabled || false;
      btn.onclick = () => renderRoom(choice.next);
      choicesDiv.appendChild(btn);
    });
  }
}

// Start the game
renderRoom(currentRoom);
