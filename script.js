// Game variables
let sanity = 100;
let inventory = [];
let currentRoom = "StoryIntro";

// Function to add item to inventory
function addItem(item) {
  inventory.push(item);
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
    text: `After a long drive to the beach, the hotel sign flickers strangely.
Inside, the clerk hands you Room 105 key.`,
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
      sanity -= 75; // sanity drains
      updateSanityBar();
    }
  },
  "Room105Door": {
    text: "You reach Room 105. The door looms before you. Sanity feels low.",
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
  }
  // More rooms can be added here: Room101, 102..., Special rooms, Pool, Office, Basement, etc.
};

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

  // Call onEnter if exists
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
