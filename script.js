document.addEventListener("DOMContentLoaded", function() {
  // Sanity and inventory setup
  let sanity = 100;
  let inventory = [
    { name: "Room Key", img: "https://cdn-icons-png.flaticon.com/512/159/159604.png" },
    { name: "Flashlight", img: "https://cdn-icons-png.flaticon.com/512/716/716784.png" }
    // Add more items as needed
  ];

  // INVENTORY rendering
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

  // SANITY rendering
  function renderSanity() {
    const percent = Math.max(Math.min(sanity, 100), 0);
    document.getElementById("sanity-fill").style.height = percent + "%";
    document.getElementById("sanity-text").innerText = percent + "%";
  }

  // Save/load logic (simple localStorage)
  document.getElementById("save-btn").onclick = function() {
    localStorage.setItem("myInventory", JSON.stringify(inventory));
    localStorage.setItem("mySanity", sanity);
    alert("Game Saved!");
  };
  document.getElementById("load-btn").onclick = function() {
    const inv = localStorage.getItem("myInventory");
    const san = localStorage.getItem("mySanity");
    if (inv) inventory = JSON.parse(inv);
    if (san) sanity = parseInt(san);
    renderInventory();
    renderSanity();
    alert("Game Loaded!");
  };

  // Initial render
  renderSanity();
  renderInventory();
});
