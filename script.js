document.addEventListener("DOMContentLoaded", function() {
  let sanity = 100;
  let moves = 0;
  let inventory = [];
  let currentRoom = "StartScreen";
  let isTyping = false;

  // Inventory modal (optional)
  document.getElementById("inventory-close").addEventListener("click", function() {
    document.getElementById("inventory").style.display = "none";
  });

  function addItem(item) {
    if (!inventory.some(i => i.name === item.name)) {
      inventory.push(item);
      renderInventory();
    }
  }
  function renderInventory() {
    const invDiv = document.getElementById("inventory-items");
    invDiv.innerHTML = "";
    inventory.forEach(item => {
      const img = document.createElement("img");
      img.src = item.img;
      img.title = item.name;
      invDiv.appendChild(img);
    });
  }

  function typeText(element, text, speed = 25) {
    isTyping = true;
    element.innerHTML = "";
    let i = 0;
    function typeChar() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        element.parentElement.scrollTop = element.parentElement.scrollHeight;
        setTimeout(typeChar, speed);
      } else {
        isTyping = false;
        showButtons();
      }
    }
    typeChar();
  }
  function showButtons() {
    const buttons = document.querySelectorAll("#choices button, #choices a");
    buttons.forEach((button, index) => {
      setTimeout(() => {
        button.style.opacity = "1";
      }, index * 180);
    });
  }

  // --- GAME DATA ---
  // Add 'sprite' and 'background' properties per room if you want scene/sprite changes!
  const rooms = {
    "StartScreen": {
      speaker: "",
      text: "Welcome to Haunted Hotel Adventure.\n\nA stormy night, a long drive, and a hotel with a flickering neon sign. Will you check in?",
      choices: [{ text: "Start Game", next: "DriveIntro" }],
      background: "image1",
      sprite: "",
    },
    "DriveIntro": {
      speaker: "",
      text: "It's been a long drive and you're still a few hours away from the beach. You decide to pull into a nearby hotel. Looking up, you see the flickering light of the hotel name, half the letters burnt out.",
      choices: [{ text: "Enter hotel", next: "HotelLobby" }],
      background: "image1",
      sprite: "",
    },
    "HotelLobby": {
      speaker: "Francis",
      text: "There have been many parties here, even I have been to some.",
      choices: [{ text: "Talk to the clerk", next: "ClerkInteraction" }],
      background: "image1",
      sprite: "ghost.png", // Provide your own ghost sprite PNG!
    },
    "ClerkInteraction": {
      speaker: "Clerk",
      text: "The clerk slowly looks up, their smile lingering too long. 'Yes... we have one room available. Room 105,' they whisper.",
      choices: [
        { text: "Accept key", next: "AcceptKey" },
        { text: "Refuse and leave", next: "EndLeave" }
      ],
      background: "image1",
      sprite: "",
    },
    "AcceptKey": {
      speaker: "Francis",
      text: "You take the key and feel its unnaturally cold metal against your palm.",
      choices: [{ text: "Go to hallway", next: "HallwayExplore" }],
      background: "image1",
      sprite: "ghost.png",
      onEnter: () => {
        addItem({ name: "Room 105 Key", img: "https://cdn-icons-png.flaticon.com/512/159/159604.png" });
      }
    },
    // ... Continue your rooms as before!
    "EndLeave": {
      speaker: "",
      text: "You turn around, deciding this place is too creepy. You leave the hotel and drive away, the storm intensifying behind you. (Game Over)",
      choices: [{ text: "Restart", next: "StartScreen" }],
      background: "image1",
      sprite: "",
    },
    // Add more rooms and logic as you wish!
  };

  function renderRoom(roomName) {
    const room = rooms[roomName];
    currentRoom = roomName;

    // Speaker name
    const speakerNameDiv = document.getElementById("speaker-name");
    if (room.speaker && room.speaker.length > 0) {
      speakerNameDiv.innerText = room.speaker;
      speakerNameDiv.style.display = "block";
    } else {
      speakerNameDiv.innerText = "";
      speakerNameDiv.style.display = "none";
    }

    // Background image
    document.getElementById("background").style.backgroundImage = `url('${room.background || "image1"}')`;

    // Sprite
    const spriteImg = document.getElementById("sprite");
    if (room.sprite && room.sprite.length > 0) {
      spriteImg.src = room.sprite;
      spriteImg.style.display = "block";
    } else {
      spriteImg.style.display = "none";
    }

    // Inventory modal (optional, invoke elsewhere if needed)
    // document.getElementById("inventory").style.display = inventory.length > 0 ? "block" : "none";

    // Choices logic
    if (room.onEnter) room.onEnter();

    // Choices in VN textbox
    const choicesDiv = document.getElementById("choices");
    choicesDiv.innerHTML = "";

    const storyText = document.getElementById("story-text");
    typeText(storyText, room.text);

    if (room.choices) {
      room.choices.forEach(choice => {
        const btn = document.createElement("button");
        btn.innerText = choice.text;
        btn.onclick = () => {
          if (!isTyping) renderRoom(choice.next);
        };
        choicesDiv.appendChild(btn);
      });
    }
  }

  renderRoom(currentRoom);
});
