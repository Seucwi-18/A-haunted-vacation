document.addEventListener("DOMContentLoaded", function() {
  let currentRoom = "StartScreen";
  let isTyping = false;

  // --- GAME DATA ---
  // Add 'sprite' and 'background' properties per room if you want scene/sprite changes!
  const rooms = {
    "StartScreen": {
      text: "Welcome to Haunted Hotel Adventure.\n\nA stormy night, a long drive, and a hotel with a flickering neon sign. Will you check in?",
      choices: [{ text: "Start Game", next: "DriveIntro" }],
      background: "image1",
      sprite: "",
    },
    "DriveIntro": {
      text: "It's been a long drive and you're still a few hours away from the beach. You pull into a nearby hotel. The flickering sign looms above.",
      choices: [{ text: "Enter hotel", next: "HotelLobby" }],
      background: "image1",
      sprite: "",
    },
    "HotelLobby": {
      text: "You take a look around the dimly lit lobby. The atmosphere feels heavy and unsettling. Old portraits line the walls.",
      choices: [{ text: "Talk to the clerk", next: "ClerkInteraction" }],
      background: "image1",
      sprite: "ghost.png", // Provide your own ghost sprite PNG!
    },
    "ClerkInteraction": {
      text: "The clerk slowly looks up, their smile lingering too long. 'Yes... we have one room available. Room 105,' they whisper.",
      choices: [
        { text: "Accept key", next: "AcceptKey" },
        { text: "Refuse and leave", next: "EndLeave" }
      ],
      background: "image1",
      sprite: "",
    },
    "AcceptKey": {
      text: "You take the key and feel its unnaturally cold metal against your palm.",
      choices: [{ text: "Go to hallway", next: "HallwayExplore" }],
      background: "image1",
      sprite: "ghost.png",
    },
    "EndLeave": {
      text: "You turn around, deciding this place is too creepy. You leave the hotel and drive away, the storm intensifying behind you. (Game Over)",
      choices: [{ text: "Restart", next: "StartScreen" }],
      background: "image1",
      sprite: "",
    },
    "HallwayExplore": {
      text: "You step into the dimly lit hallway. The carpet is worn and stained, and the wallpaper peels at the edges.",
      choices: [{ text: "Continue down the hallway", next: "HallwayDeeper" }],
      background: "image1",
      sprite: "",
    },
    "HallwayDeeper": {
      text: "The hallway seems to stretch on forever. Your legs feel like lead.",
      choices: [{ text: "Approach Room 105", next: "Room105Approach" }],
      background: "image1",
      sprite: "",
    },
    "Room105Approach": {
      text: "Finally, you see Room 105 ahead. Your body feels drained, as if something is pulling your very essence away.",
      choices: [
        { text: "Open Room 105", next: "Room105" },
        { text: "Collapse in hallway", next: "Room105Faint" }
      ],
      background: "image1",
      sprite: "ghost.png",
    },
    "Room105": {
      text: "You unlock the door and step inside. The room is freezing, but strangely comforting.",
      choices: [{ text: "Rest on bed", next: "Room105Home" }],
      background: "image1",
      sprite: "",
    },
    "Room105Faint": {
      text: "The exhaustion overwhelms you. Darkness consumes your thoughts as you collapse.",
      choices: [{ text: "Wake up", next: "Room105WakeUp" }],
      background: "image1",
      sprite: "",
    },
    "Room105WakeUp": {
      text: "You slowly regain consciousness, finding yourself lying on the bed. How did you get here?",
      choices: [{ text: "Try to sleep", next: "Room105Home" }],
      background: "image1",
      sprite: "",
    },
    "Room105Home": {
      text: "You're in your room. The bed is comforting, though you feel a lingering unease.",
      choices: [
        { text: "Sleep to restore sanity", next: "SleepRestore" },
        { text: "Leave room", next: "HallwayExplore" }
      ],
      background: "image1",
      sprite: "",
    },
    "SleepRestore": {
      text: "You sleep fitfully, haunted by strange dreams. When you wake, you feel somewhat restored.",
      choices: [{ text: "Get up", next: "Room105Home" }],
      background: "image1",
      sprite: "",
    }
    // ... add more rooms as you wish!
  };

  function typeText(element, text, speed = 22) {
    isTyping = true;
    element.innerHTML = "";
    let i = 0;
    function typeChar() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
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
      }, index * 160);
    });
  }

  function renderRoom(roomName) {
    const room = rooms[roomName];
    currentRoom = roomName;

    // Set background image
    document.getElementById("background").style.backgroundImage = `url('${room.background || "image1"}')`;

    // Set character sprite
    const spriteImg = document.getElementById("sprite");
    if (room.sprite && room.sprite.length > 0) {
      spriteImg.src = room.sprite;
      spriteImg.style.display = "block";
    } else {
      spriteImg.style.display = "none";
    }

    // Story
    const storyText = document.getElementById("story-text");
    typeText(storyText, room.text);

    // Choices
    const choicesDiv = document.getElementById("choices");
    choicesDiv.innerHTML = "";

    if (room.choices) {
      room.choices.forEach(choice => {
        const btn = document.createElement("button");
        btn.innerText = choice.text;
        btn.onclick = () => {
          if (!isTyping) renderRoom(choice.next);
        };
        btn.style.opacity = "0";
        choicesDiv.appendChild(btn);
      });
    }
  }

  renderRoom(currentRoom);
});
