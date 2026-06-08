const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Player state
let player = {
  x: 0,
  y: 10,
  z: 0,
  angle: 0
};

// Controls
let keys = {};

document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

// Mouse look
document.addEventListener("mousemove", (e) => {
  player.angle += e.movementX * 0.002;
});

// Simple ocean floor height function
function getFloorHeight(x, z) {
  return Math.sin(x * 0.05) * 2 + Math.cos(z * 0.05) * 2;
}

// Game loop
function update() {
  let speed = 0.3;

  if (keys["w"]) {
    player.x += Math.sin(player.angle) * speed;
    player.z += Math.cos(player.angle) * speed;
  }
  if (keys["s"]) {
    player.x -= Math.sin(player.angle) * speed;
    player.z -= Math.cos(player.angle) * speed;
  }
  if (keys["a"]) {
    player.x -= Math.cos(player.angle) * speed;
    player.z += Math.sin(player.angle) * speed;
  }
  if (keys["d"]) {
    player.x += Math.cos(player.angle) * speed;
    player.z -= Math.sin(player.angle) * speed;
  }

  render();
  requestAnimationFrame(update);
}

// Render scene
function render() {
  // Ocean fog background
  ctx.fillStyle = "#001a2b";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Fake water gradient
  let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#003a55");
  gradient.addColorStop(1, "#001018");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw simple "floor tiles"
  for (let i = -10; i < 10; i++) {
    for (let j = -10; j < 10; j++) {
      let worldX = player.x + i * 5;
      let worldZ = player.z + j * 5;

      let height = getFloorHeight(worldX, worldZ);

      let dx = worldX - player.x;
      let dz = worldZ - player.z;

      // rotate relative to camera
      let x = dx * Math.cos(player.angle) - dz * Math.sin(player.angle);
      let z = dx * Math.sin(player.angle) + dz * Math.cos(player.angle);

      if (z <= 0) continue;

      let size = 200 / z;

      let screenX = canvas.width / 2 + x * 200 / z;
      let screenY = canvas.height / 2 + height * 20 / z;

      // fade with distance (ocean visibility)
      let alpha = Math.max(0, 1 - z / 50);

      ctx.fillStyle = `rgba(124,199,255,${alpha * 0.3})`;

      ctx.fillRect(screenX, screenY, size, size);
    }
  }

  // Underwater tint overlay
  ctx.fillStyle = "rgba(0, 20, 40, 0.3)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

update();
