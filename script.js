document.addEventListener("DOMContentLoaded", function() { 
  let sanity = 100; 
  let moves = 0; 
  let inventory = []; 
  let currentRoom = "StartScreen"; 
  let sanityBarVisible = false;
  let isTyping = false;

  // Inventory toggle functionality
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

  function typeText(element, text, speed = 50) {
    isTyping = true;
    element.innerHTML = "";
    let i = 0;
    
    const textBox = element.parentElement;

    function typeChar() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        
        // Auto-scroll to bottom as text accumulates
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
  } 
  
  function showSanityBar() { 
    sanityBarVisible = true; 
    document.getElementById("sanity-bar").style.display = "block"; 
  } 
  
  function hideSanityBar() { 
    sanityBarVisible = false; 
    document.getElementById("sanity-bar").style.display = "none"; 
  } 
  
  function checkFaint() { 
    if(moves % 4 === 0 && sanity <= 0){ 
      removeRandomItem(); 
      sanity = 25; 
      updateSanityBar(); 
    } 
  } 
  
  const rooms = { 
    "StartScreen": { text: "Welcome to Haunted Hotel Adventure", choices: [{text:"Start Game", next:"DriveIntro"}], onEnter: () => { hideSanityBar(); } }, 
    "DriveIntro": { text: "It's been a long drive and you're still a few hours away from the beach. You decide to pull into a nearby hotel. Looking up, you see the flickering light of the hotel name, but you're too tired to care.", choices: [{text:"Walk into the hotel", next:"HotelLobby"}] }, 
    "HotelLobby": { text: "You take a look around the dimly lit lobby. The atmosphere feels heavy and unsettling. Old portraits line the walls, their eyes seeming to follow you.", choices: [{text:"Ask the clerk if there are any available rooms", next:"ClerkInteraction"}] }, 
    "ClerkInteraction": { text: "The clerk slowly looks up, their smile lingering too long and their eyes never quite meeting yours. 'Yes... we have one room available. Room 105,' they whisper, their voice carrying an odd tremor. Their pale fingers slide the key across the counter with deliberate slowness. 'Welcome to our... establishment. You'll find it quite... memorable.'", choices: [{text:"Accept the key", next:"AcceptKey"}] }, 
    "AcceptKey": { text: "You take the key and feel its unnaturally cold metal against your palm, as if it had been sitting in ice. The clerk's smile widens unnervingly as you slip it into your bag for safekeeping.", choices: [{text:"Proceed down the hallway", next:"HallwayExplore"}], onEnter: () => { addItem({name:"Room 105 Key", img:"images/room105key.png"}); } }, 
    "HallwayExplore": { 
      text: "You step into the dimly lit hallway. The carpet is worn and stained, and the wallpaper peels at the edges. Each step feels heavier than the last.", 
      choices: [{text:"Continue down the hallway", next:"HallwayDeeper"}], 
      onEnter: () => { sanity -= 15; moves++; updateSanityBar(); checkFaint();} 
    },
    "HallwayDeeper": { 
      text: "The hallway seems to stretch on forever. Your legs feel like lead, and the air grows thicker with each breath. The fluorescent lights flicker ominously above.", 
      choices: [{text:"Push forward through the exhaustion", next:"Room105Approach"}], 
      onEnter: () => { sanity -= 25; moves++; updateSanityBar(); checkFaint();} 
    },
    "Room105Approach": { 
      text: "Finally, you see Room 105 ahead. Your body feels drained, as if something is pulling your very essence away. The door stands before you, imposing and final.", 
      choices: [{text:"Use Room 105 Key to unlock the door", next:"Room105Faint", keyRequired:"Room 105 Key"}], 
      onEnter: () => { sanity -= 35; moves++; updateSanityBar(); checkFaint();} 
    },
    "Room105Faint": { text:"The exhaustion overwhelms you completely. Your vision blurs and darkness consumes your thoughts as you collapse to the floor, the key clattering beside you.", choices:[{text:"...", next:"Room105WakeUp"}], onEnter: () => { sanity = 15; updateSanityBar(); } },
    "Room105WakeUp": { text:"You slowly regain consciousness, finding yourself lying on the bed. Your body feels drained and your mind clouded with confusion. How did you get here? The room feels both familiar and alien at the same time.", choices:[{text:"Get up and look around", next:"Room105Home"}] },
    "Room105Home": { text:"You're in your room. The bed is comforting, though you feel a lingering unease. You could rest here, check your bag, or venture out to explore.", choices:[ {text:"Sleep to restore sanity", next:"Sleep105"}, {text:"Check your bag", next:"Inventory105"}, {text:"Leave the room to explore", next:"ExploreChoice"} ], onEnter: () => { if(!sanityBarVisible) showSanityBar(); } }, 
    "ExploreChoice": { text:"You step out of your room into the dimly lit hallway. Which direction do you want to explore?", choices:[ {text:"Explore the first floor", next:"Floor1Menu"}, {text:"Go up to the second floor", next:"Floor2Menu"}, {text:"Look for other areas", next:"SpecialRoomsMenu"}, {text:"Return to your room", next:"Room105Home"} ] },
    "Floor1Menu": { text:"You're on the first floor. The hallway stretches in both directions with several doors.", choices:[ {text:"Room 101", next:"Room101Door"}, {text:"Room 102", next:"Room102Door"}, {text:"Room 103", next:"Room103Door"}, {text:"Room 104", next:"Room104Door"}, {text:"Return to your room (105)", next:"Room105Home"} ] }, 
    "Room101Door": {text:"Room 101 door.", choices:[{text:"Enter Room 101", next:"Room101"}], keyRequired:"Room 101 Key"}, 
    "Room101": {
      text:"Room 101 is dimly lit. You find an old diary on the nightstand and a rusty key under the pillow.",
      choices:[
        {text:"Read the diary", next:"Room101Diary"},
        {text:"Take the Room 201 Key", next:"Room101"},
        {text:"Return to Floor 1 Menu", next:"Floor1Menu"}
      ],
      onEnter: () => {
        if(!inventory.some(item => item.name === "Room 201 Key")) {
          addItem({name:"Room 201 Key", img:"images/room201key.png"});
        }
      }
    },
    "Room101Diary": {
      text:"The diary reads: 'The pool holds secrets, but beware the depths. The office key lies where shadows dance.' You feel unsettled.",
      choices:[{text:"Return to Room 101", next:"Room101"}],
      onEnter: () => { sanity -= 10; updateSanityBar(); }
    }, 
    "Room102Door": {text:"Room 102 door is slightly ajar.", choices:[{text:"Enter Room 102", next:"Room102"}]},
    "Room102": {
      text:"Room 102 smells of decay. A mirror reflects something that isn't there. You find a basement key hidden behind it.",
      choices:[{text:"Return to Floor 1 Menu", next:"Floor1Menu"}],
      onEnter: () => {
        sanity -= 15; 
        updateSanityBar();
        if(!inventory.some(item => item.name === "Basement Key")) {
          addItem({name:"Basement Key", img:"images/basementkey.png"});
        }
      }
    },
    "Room103Door": {text:"Room 103 door.", choices:[{text:"Enter Room 103", next:"Room103"}]},
    "Room103": {
      text:"Room 103 is freezing cold. Your breath is visible. A ghostly whisper mentions 'the office'.",
      choices:[{text:"Return to Floor 1 Menu", next:"Floor1Menu"}],
      onEnter: () => { sanity -= 20; updateSanityBar(); }
    },
    "Room104Door": {text:"Room 104 door.", choices:[{text:"Enter Room 104", next:"Room104"}]},
    "Room104": {
      text:"Room 104 has scratch marks on the walls. You find a pool room key in a hidden compartment.",
      choices:[{text:"Return to Floor 1 Menu", next:"Floor1Menu"}],
      onEnter: () => {
        sanity -= 10; 
        updateSanityBar();
        if(!inventory.some(item => item.name === "Pool Room Key")) {
          addItem({name:"Pool Room Key", img:"images/poolkey.png"});
        }
      }
    },
    "Floor2Menu": { text:"You're on the second floor. The atmosphere feels even heavier here.", choices:[ {text:"Room 201", next:"Room201Door"}, {text:"Room 202", next:"Room202Door"}, {text:"Room 203", next:"Room203Door"}, {text:"Room 204", next:"Room204Door"}, {text:"Room 205", next:"Room205Door"}, {text:"Go back downstairs", next:"ExploreChoice"} ] }, 
    "Room201Door": {text:"Room 201 door is locked tight.", choices:[{text:"Enter Room 201", next:"Room201", keyRequired:"Room 201 Key"}], keyRequired:"Room 201 Key"},
    "Room201": {
      text:"Room 201 contains ancient furniture covered in dust. A painting on the wall seems to watch you. You discover an office key behind it.",
      choices:[{text:"Return to Floor 2 Menu", next:"Floor2Menu"}],
      onEnter: () => {
        sanity -= 25; 
        updateSanityBar();
        if(!inventory.some(item => item.name === "Office Room Key")) {
          addItem({name:"Office Room Key", img:"images/officekey.png"});
        }
      }
    },
    "Room202Door": {text:"Room 202 door.", choices:[{text:"Enter Room 202", next:"Room202"}]},
    "Room202": {
      text:"Room 202 is filled with old newspapers. Headlines speak of mysterious disappearances at this very hotel.",
      choices:[{text:"Return to Floor 2 Menu", next:"Floor2Menu"}],
      onEnter: () => { sanity -= 15; updateSanityBar(); }
    },
    "Room203Door": {text:"Room 203 door.", choices:[{text:"Enter Room 203", next:"Room203"}]},
    "Room203": {
      text:"Room 203 has a broken window. The wind howls through, bringing whispers of the past.",
      choices:[{text:"Return to Floor 2 Menu", next:"Floor2Menu"}],
      onEnter: () => { sanity -= 10; updateSanityBar(); }
    },
    "Room204Door": {text:"Room 204 door.", choices:[{text:"Enter Room 204", next:"Room204"}]},
    "Room204": {
      text:"Room 204 is completely empty except for a single chair facing the wall. Sitting in it reveals a hidden clue.",
      choices:[
        {text:"Sit in the chair", next:"Room204Clue"},
        {text:"Return to Floor 2 Menu", next:"Floor2Menu"}
      ]
    },
    "Room204Clue": {
      text:"As you sit, you hear a voice: 'The final secret lies in the basement depths. Beware the guardian.'",
      choices:[{text:"Return to Floor 2 Menu", next:"Floor2Menu"}],
      onEnter: () => { sanity -= 30; updateSanityBar(); }
    },
    "Room205Door": {text:"Room 205 door.", choices:[{text:"Enter Room 205", next:"Room205"}]},
    "Room205": {
      text:"Room 205 is your mirror room to 105, but everything is wrong. The bed is unmade, and shadows move independently.",
      choices:[{text:"Return to Floor 2 Menu", next:"Floor2Menu"}],
      onEnter: () => { sanity -= 20; updateSanityBar(); }
    },
    "SpecialRoomsMenu": { text:"You discover some other areas of the hotel beyond the regular rooms.", choices:[ {text:"Pool Room", next:"PoolRoom", keyRequired:"Pool Room Key"}, {text:"Office", next:"OfficeRoom", keyRequired:"Office Room Key"}, {text:"Basement", next:"BasementRoom", keyRequired:"Basement Key"}, {text:"Go back", next:"ExploreChoice"} ] }, 
    "PoolRoom": {text:"A ghostly figure at the bottom of the pool reaches for you!", choices:[{text:"Dodge Left", next:"PoolSafe"},{text:"Dodge Right", next:"BasementHidden"}]}, 
    "PoolSafe": {text:"You are safe. You find a clue to the next key.", choices:[{text:"Continue exploring", next:"SpecialRoomsMenu"}]}, 
    "BasementHidden": {text:"You are pulled into the basement! A hidden path.", choices:[{text:"Explore Basement", next:"BasementRoom"}]}, 
    "OfficeRoom": {text:"The office is locked behind a puzzle. Solve in Discord to get the key.", choices:[{text:"Continue exploring", next:"SpecialRoomsMenu"}]}, 
    "BasementRoom": {text:"The basement is dark and eerie.", choices:[{text:"Continue exploring", next:"SpecialRoomsMenu"}]}, 
    "Inventory105": {text:"You check the contents of your bag:", choices:[{text:"Return to your room", next:"Room105Home"}]}, 
    "Sleep105": {text:"You sleep and restore sanity.", choices:[{text:"Wake up", next:"Room105Home"}], onEnter:()=>{sanity=100; updateSanityBar();}} 
  }; 
  
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

    // Show/hide inventory toggle based on room
    if(currentRoom === "AcceptKey" || (inventory.length > 0 && currentRoom !== "StartScreen" && currentRoom !== "DriveIntro" && currentRoom !== "HotelLobby" && currentRoom !== "ClerkInteraction")) {
      document.getElementById("inventory-toggle").style.display = "flex";
    } else {
      document.getElementById("inventory-toggle").style.display = "none";
    }

    // Clear choices first
    const choicesDiv = document.getElementById("choices"); 
    choicesDiv.innerHTML = ""; 

    // Start typewriter effect
    const storyText = document.getElementById("story-text");
    typeText(storyText, room.text);

    // Create buttons but keep them hidden initially
    if(room.choices){ 
      room.choices.forEach(choice=>{ 
        const btn = document.createElement("button"); 
        btn.innerText = choice.text; 
        btn.disabled = choice.disabled || false; 
        btn.onclick = ()=>{
          if(!isTyping) {
            renderRoom(choice.next);
          }
        }; 
        choicesDiv.appendChild(btn); 
      }); 
    } 
  } 
  
  renderRoom(currentRoom); 
});
