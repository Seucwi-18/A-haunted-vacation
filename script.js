document.addEventListener("DOMContentLoaded", function() {
  let currentRoom = "StartScreen";
  let isTyping = false;

  // --- GAME DATA ---
  const rooms = {
    "StartScreen": {
      text: "Welcome to Haunted Hotel Adventure.\n\nA stormy night, a long drive, and a hotel with a flickering neon sign. Will you check in?",
      choices: [{ text: "Start Game", next: "DriveIntro" }],
    },
    "DriveIntro": {
      text: "It's been a long drive and you're still a few hours away from the beach. You pull into a nearby hotel. The flickering sign looms above.",
      choices: [{ text: "Enter hotel", next: "HotelLobby" }],
    },
    "HotelLobby": {
      text: "You take a look around the dimly lit lobby. The atmosphere feels heavy and unsettling. Old portraits line the walls.",
      choices: [{ text: "Talk to the clerk", next: "ClerkInteraction" }],
    },
    "ClerkInteraction": {
      text: "The clerk slowly looks up, their smile lingering too long. 'Yes... we have one room available. Room 105,' they whisper.",
      choices: [
        { text: "Accept key", next: "AcceptKey" },
        { text: "Refuse and leave", next: "EndLeave" }
      ],
    },
    "AcceptKey": {
      text: "You take the key and feel its unnaturally cold metal against your palm.",
      choices: [{ text: "Go to hallway", next: "HallwayExplore" }],
    },
    "EndLeave": {
      text: "You turn around, deciding this place is too creepy. You leave the hotel and drive away, the storm intensifying behind you. (Game Over)",
      choices: [{ text: "Restart", next: "StartScreen" }],
    },
    "HallwayExplore": {
      text: "You step into the dimly lit hallway. The carpet is worn and stained, and the wallpaper peels at the edges.",
      choices: [{ text: "Continue down the hallway", next: "HallwayDeeper" }],
    },
    "HallwayDeeper": {
      text: "The hallway seems to stretch on forever. Your legs feel like lead.",
      choices: [{ text: "Approach Room 105", next: "Room105Approach" }],
    },
    "Room105Approach": {
      text: "Finally, you see Room 105 ahead. Your body feels drained, as if something is pulling your very essence away.",
      choices: [
        { text: "Open Room 105", next: "Room105" },
        { text: "Collapse in hallway", next: "Room105Faint" }
      ],
    },
    "Room105": {
      text: "You unlock the door and step inside. The room is freezing, but strangely comforting.",
      choices: [{ text: "Rest on bed", next: "Room105Home" }],
    },
    "Room105Faint": {
      text: "The exhaustion overwhelms you. Darkness consumes your thoughts as you collapse.",
      choices: [{ text: "Wake up", next: "Room105WakeUp" }],
    },
    "Room105WakeUp": {
      text: "You slowly regain consciousness, finding yourself lying on the bed. How did you get here?",
      choices: [{ text: "Try to sleep", next: "Room105Home" }],
    },
    "Room105Home": {
      text: "You're in your room. The bed is comforting, though you feel a lingering unease.",
      choices: [
        { text: "Sleep to restore sanity", next: "SleepRestore" },
        { text: "Leave room", next: "HallwayExplore" }
      ],
    },
    "SleepRestore": {
      text: "You sleep fitfully, haunted by strange dreams. When you wake, you feel somewhat restored.",
      choices: [{ text: "Get up", next: "Room105Home" }],
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
