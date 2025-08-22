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
    inventory.push(item); 
    renderInventory(); 
  } 

  function removeRandomItem() { 
    if(inventory.length === 0) return; 
    const index = Math.floor(Math.random() * inventory.length); 
    const removed = inventory.splice(index,1)[0]; 
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

  function typeText(element, text, speed = 25) { // faster
    isTyping = true;
    element.innerHTML = "";
    let i = 0;
    const textBox = element.parentElement;

    function typeChar() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        textBox.scrollTop = textBox.scrollHeight;
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
    document.getElementById("sanity-fill").style.width = sanity + "%"; 
    document.getElementById("sanity-percent").innerText = sanity + "%";
  } 
  
  function showSanityBar() { 
    if(!sanityBarVisible){
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
    if(moves % 4 === 0 && sanity <= 0){ 
      removeRandomItem(); 
      sanity = 25; 
      updateSanityBar(); 
    } 
  } 

  // Rooms (full text preserved)
  const rooms = {
    "StartScreen": { text: "Welcome to Haunted Hotel Adventure", choices: [{text:"Start Game", next:"DriveIntro"}], onEnter: () => { hideSanityBar(); } },
    "DriveIntro": { text: "It's been a long drive and you're still a few hours away from the beach. You decide to pull into a nearby hotel. Looking up, you see the flickering light of the hotel name, but you're too tired to care.", choices: [{text:"Walk into the hotel", next:"HotelLobby"}] },
    "HotelLobby": { text: "You take a look around the dimly lit lobby. The atmosphere feels heavy and unsettling. Old portraits line the walls, their eyes seeming to follow you.", choices: [{text:"Ask the clerk if there are any available rooms", next:"ClerkInteraction"}] },
    "ClerkInteraction": { text: "The clerk slowly looks up, their smile lingering too long and their eyes never quite meeting yours. 'Yes... we have one room available. Room 105,' they whisper, their voice carrying an odd tremor. Their pale fingers slide the key across the counter with deliberate slowness. 'Welcome to our... establishment. You'll find it quite... memorable.'", choices: [{text:"Accept the key", next:"AcceptKey"}] },
    "AcceptKey": { text: "You take the key and feel its unnaturally cold metal against your palm, as if it had been sitting in ice. The clerk's smile widens unnervingly as you slip it into your bag for safekeeping.", choices: [{text:"Proceed down the hallway", next:"HallwayExplore"}], onEnter: () => { addItem({name:"Room 105 Key", img:"images/room105key.png"}); } },
    "HallwayExplore": { 
      text: "You step into the dimly lit hallway. The carpet is worn and stained, and the wallpaper peels at the edges. Each step feels heavier than the last.", 
      choices: [{text:"Continue down the hallway", next:"HallwayDeeper"}], 
      onEnter: () => { 
        showSanityBar(); 
        animateSanityDrop(35); // animated drop before door
        moves++; 
        checkFaint();
      } 
    },
    "HallwayDeeper": { text: "The hallway seems to stretch on forever. Your legs feel like lead, and the air grows thicker with each breath. The fluorescent lights flicker ominously above.", choices: [{text:"Push forward through the exhaustion", next:"Room105Approach"}], onEnter: () => { sanity -= 25; updateSanityBar(); moves++; checkFaint(); } },
    "Room105Approach": { text: "Finally, you see Room 105 ahead. Your body feels drained, as if something is pulling your very essence away. The door stands before you, imposing and final.", choices: [{text:"Use Room 105 Key to unlock the door", next:"Room105Faint", keyRequired:"Room 105 Key"}], onEnter: () => { sanity -= 35; updateSanityBar(); moves++; checkFaint();} },
    "Room105Faint": { text:"The exhaustion overwhelms you completely. Your vision blurs and darkness consumes your thoughts as you collapse to the floor, the key clattering beside you.", choices:[{text:"...", next:"Room105WakeUp"}], onEnter: () => { sanity = 15; updateSanityBar(); } },
    "Room105WakeUp": { text:"You slowly regain consciousness, finding yourself lying on the bed. Your body feels drained and your mind clouded with confusion. How did you get here? The room feels both familiar and alien at the same time.", choices:[{text:"Get up and look around", next:"Room105Home"}] },
    "Room105Home": { text:"You're in your room. The bed is comforting, though you feel a lingering unease. You could rest here or venture out to explore.", choices:[ {text:"Sleep to restore sanity", next:"Sleep105"}, {text:"Leave the room to explore", next:"ExploreChoice"} ], onEnter: () => { if(!sanityBarVisible) showSanityBar(); } },
    // ... other rooms remain unchanged
  };

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

  function renderRoom(roomName) { 
    const room = rooms[roomName]; 
    currentRoom = roomName; 

    if(room.choices){ 
      room.choices.forEach(choice=>{ 
        if(choice.keyRequired && !inventory.some(item=>item.name===choice.keyRequired)){ 
          choice.disabled = true; 
          choice.text += " (Key required)"; 
        } 
      }); 
    } 

    if(room.onEnter) room.onEnter(); 

    // Show inventory toggle
    if(inventory.length > 0 && currentRoom !== "StartScreen" && currentRoom !== "DriveIntro" && currentRoom !== "HotelLobby" && currentRoom !== "ClerkInteraction") {
      document.getElementById("inventory-toggle").style.display = "flex";
    } else {
      document.getElementById("inventory-toggle").style.display = "none";
    }

    const choicesDiv = document.getElementById("choices"); 
    choicesDiv.innerHTML = ""; 

    const storyText = document.getElementById("story-text");
    typeText(storyText, room.text);

    if(room.choices){ 
      room.choices.forEach(choice=>{ 
        const btn = document.createElement("button"); 
        btn.innerText = choice.text; 
        btn.disabled = choice.disabled || false; 
        btn.onclick = ()=>{
          if(!isTyping) renderRoom(choice.next);
        }; 
        choicesDiv.appendChild(btn); 
      }); 
    } 
  } 

  renderRoom(currentRoom); 
});
