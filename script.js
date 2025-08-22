document.addEventListener("DOMContentLoaded", function() {
  let sanity = 100;
  let moves = 0;
  let inventory = [];
  let currentRoom = "StartScreen";
  let sanityBarVisible = false;
  let isTyping = false;

  // Inventory toggle
  document.getElementById("inventory-toggle").addEventListener("click", function() {
    document.getElementById("inventory").style.display = "block";
  });
  document.getElementById("inventory-close").addEventListener("click", function() {
    document.getElementById("inventory").style.display = "none";
  });

  function addItem(item) {
    if (!inventory.some(i => i.name === item.name)) {
      inventory.push(item);
      renderInventory();
    }
  }

  function removeRandomItem() {
    if (inventory.length === 0) return;
    const index = Math.floor(Math.random() * inventory.length);
    const removed = inventory.splice(index, 1)[0];
    alert(`You fainted and lost ${removed.name}!`);
    renderInventory();
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
    const buttons = document.querySelectorAll("#choices button");
    buttons.forEach((button, index) => {
      setTimeout(() => {
        button.classList.add("show");
      }, index * 200);
    });
  }

  function updateSanityBar() {
    // Vertical bar: height from 0% (empty) to 100% (full)
    document.getElementById("sanity-fill").style.height = sanity + "%";
    document.getElementById("sanity-percent").innerText = Math.max(sanity, 0) + "%";
  }

  function showSanityBar() {
    if (!sanityBarVisible) {
      sanityBarVisible = true;
      document.getElementById("sanity-bar").style.display = "block";
      document.getElementById("sanity-percent").style.display = "block";
    }
  }

  function hideSanityBar() {
    sanityBarVisible = false;
    document.getElementById("sanity-bar").style.display = "none";
    document.getElementById("sanity-percent").style.display = "none";
  }

  function checkFaint() {
    if (moves % 4 === 0 && sanity <= 0) {
      removeRandomItem();
      sanity = 25;
      updateSanityBar();
    }
  }

  function animateSanityDrop(amount) {
    let start = sanity;
    let target = Math.max(sanity - amount, 0);
    let step = (start - target) / 10;
    let count = 0;
    const interval = setInterval(() => {
      sanity -= step;
      if (sanity < 0) sanity = 0;
      updateSanityBar();
      count++;
      if (count >= 10) clearInterval(interval);
    }, 50);
  }

  // Room flow
  const rooms = {
    "StartScreen": {
      text: "Welcome to Haunted Hotel Adventure.\n\nA stormy night, a long drive, and a hotel with a flickering neon sign. Will you check in?",
      choices: [{ text: "Start Game", next: "DriveIntro" }],
      onEnter: () => { hideSanityBar(); }
    },
    "DriveIntro": {
      text: "It's been a long drive and you're still a few hours away from the beach. You decide to pull into a nearby hotel. Looking up, you see the flickering light of the hotel name, half the letters burnt out.",
      choices: [{ text: "Enter hotel", next: "HotelLobby" }],
      onEnter: () => { hideSanityBar(); }
    },
    "HotelLobby": {
      text: "You take a look around the dimly lit lobby. The atmosphere feels heavy and unsettling. Old portraits line the walls, their eyes seeming to follow you.",
      choices: [{ text: "Talk to the clerk", next: "ClerkInteraction" }],
      onEnter: () => { }
    },
    "ClerkInteraction": {
      text: "The clerk slowly looks up, their smile lingering too long and their eyes never quite meeting yours. 'Yes... we have one room available. Room 105,' they whisper.",
      choices: [
        { text: "Accept key", next: "AcceptKey" },
        { text: "Refuse and leave", next: "EndLeave" }
      ],
      onEnter: () => { }
    },
    "AcceptKey": {
      text: "You take the key and feel its unnaturally cold metal against your palm, as if it had been sitting in ice. The clerk's smile widens unnervingly as you slip it into your bag.",
      choices: [{ text: "Go to hallway", next: "HallwayExplore" }],
      onEnter: () => {
        addItem({ name: "Room 105 Key", img: "https://cdn-icons-png.flaticon.com/512/159/159604.png" });
      }
    },
    "EndLeave": {
      text: "You turn around, deciding this place is too creepy. You leave the hotel and drive away, the storm intensifying behind you. (Game Over)",
      choices: [{ text: "Restart", next: "StartScreen" }],
      onEnter: () => { hideSanityBar(); }
    },
    "HallwayExplore": {
      text: "You step into the dimly lit hallway. The carpet is worn and stained, and the wallpaper peels at the edges. Each step feels heavier than the last.",
      choices: [{ text: "Continue down the hallway", next: "HallwayDeeper" }],
      onEnter: () => {
        showSanityBar();
        animateSanityDrop(35);
        moves++;
        checkFaint();
      }
    },
    "HallwayDeeper": {
      text: "The hallway seems to stretch on forever. Your legs feel like lead, and the air grows thicker with each breath. The fluorescent lights flicker ominously above.",
      choices: [{ text: "Approach Room 105", next: "Room105Approach" }],
      onEnter: () => {
        animateSanityDrop(15);
        moves++;
        checkFaint();
      }
    },
    "Room105Approach": {
      text: "Finally, you see Room 105 ahead. Your body feels drained, as if something is pulling your very essence away. The door stands before you, imposing and final.",
      choices: [
        {
          text: "Open Room 105",
          next: "Room105",
          keyRequired: "Room 105 Key"
        },
        {
          text: "Collapse in hallway",
          next: "Room105Faint"
        }
      ],
      onEnter: () => {
        moves++;
        checkFaint();
      }
    },
    "Room105": {
      text: "You unlock the door and step inside. The room is freezing, but strangely comforting. You feel as if something is watching you from the shadows.",
      choices: [{ text: "Rest on bed", next: "Room105Home" }],
      onEnter: () => { }
    },
    "Room105Faint": {
      text: "The exhaustion overwhelms you completely. Your vision blurs and darkness consumes your thoughts as you collapse to the floor, the key clattering beside you.",
      choices: [{ text: "Wake up", next: "Room105WakeUp" }],
      onEnter: () => {
        animateSanityDrop(20);
        sanity = 0;
        updateSanityBar();
        moves++;
        checkFaint();
      }
    },
    "Room105WakeUp": {
      text: "You slowly regain consciousness, finding yourself lying on the bed. Your body feels drained and your mind clouded with confusion. How did you get here?",
      choices: [{ text: "Try to sleep", next: "Room105Home" }],
      onEnter: () => { }
    },
    "Room105Home": {
      text: "You're in your room. The bed is comforting, though you feel a lingering unease. You could rest here or venture out to explore.",
      choices: [
        { text: "Sleep to restore sanity", next: "SleepRestore" },
        { text: "Leave room", next: "HallwayExplore" }
      ],
      onEnter: () => { }
    },
    "SleepRestore": {
      text: "You sleep fitfully, haunted by strange dreams. When you wake, your sanity feels somewhat restored.",
      choices: [{ text: "Get up", next: "Room105Home" }],
      onEnter: () => {
        sanity = Math.min(sanity + 30, 100);
        updateSanityBar();
        moves++;
        checkFaint();
      }
    }
    // Add more rooms and choices as you expand!
  };

  function renderRoom(roomName) {
    const room = rooms[roomName];
    currentRoom = roomName;

    // Show/hide inventory toggle
    if (inventory.length > 0 && !["StartScreen", "DriveIntro", "HotelLobby", "ClerkInteraction"].includes(currentRoom)) {
      document.getElementById("inventory-toggle").style.display = "flex";
    } else {
      document.getElementById("inventory-toggle").style.display = "none";
    }

    // Optional: Key-required logic for choices
    if (room.choices) {
      room.choices.forEach(choice => {
        if (choice.keyRequired && !inventory.some(item => item.name === choice.keyRequired)) {
          choice.disabled = true;
          choice.text += " (Key required)";
        }
      });
    }

    if (room.onEnter) room.onEnter();

    const choicesDiv = document.getElementById("choices");
    choicesDiv.innerHTML = "";

    const storyText = document.getElementById("story-text");
    typeText(storyText, room.text);

    if (room.choices) {
      room.choices.forEach(choice => {
        const btn = document.createElement("button");
        btn.innerText = choice.text;
        btn.disabled = choice.disabled || false;
        btn.onclick = () => {
          if (!isTyping) renderRoom(choice.next);
        };
        choicesDiv.appendChild(btn);
      });
    }
  }

  // Start game
  renderRoom(currentRoom);
});
