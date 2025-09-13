const socket = io();

let players = {};

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let name = prompt("Escribe tu nombre:");
let country = prompt("Nombre de tu país:");
let color = "#" + Math.floor(Math.random() * 16777215).toString(16);

socket.emit("newPlayer", { name, country, color });

socket.on("updatePlayers", (data) => {
  players = data;
  draw();
});

canvas.addEventListener("mousemove", (e) => {
  socket.emit("move", { x: e.offsetX, y: e.offsetY });
});

function sendAttack() {
  let targetId = getRandomTarget();
  if (targetId) socket.emit("attack", targetId);
}

function sendBomb() {
  let targetId = getRandomTarget();
  if (targetId) socket.emit("bomb", targetId);
}

function getRandomTarget() {
  let keys = Object.keys(players).filter(id => id !== socket.id);
  if (keys.length === 0) return null;
  return keys[Math.floor(Math.random() * keys.length)];
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let id in players) {
    let p = players[id];
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.fillText(`${p.name} (${p.country}) 👑${p.crowns}`, p.x - 30, p.y - 30);
  }
}