const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let players = {};

io.on("connection", (socket) => {
  console.log("Jugador conectado:", socket.id);

  socket.on("newPlayer", (data) => {
    players[socket.id] = {
      id: socket.id,
      name: data.name,
      crowns: 0,
      troops: 10,
      color: data.color,
      country: data.country,
      x: Math.random() * 800,
      y: Math.random() * 600,
    };
    io.emit("updatePlayers", players);
  });

  socket.on("move", (data) => {
    if (players[socket.id]) {
      players[socket.id].x = data.x;
      players[socket.id].y = data.y;
      io.emit("updatePlayers", players);
    }
  });

  socket.on("attack", (targetId) => {
    if (players[targetId]) {
      players[targetId].troops -= 2;
      if (players[targetId].troops <= 0) {
        players[socket.id].crowns++;
        players[targetId].troops = 5;
      }
      io.emit("updatePlayers", players);
    }
  });

  socket.on("bomb", (targetId) => {
    if (players[targetId]) {
      players[targetId].troops = Math.max(0, players[targetId].troops - 5);
      io.emit("updatePlayers", players);
    }
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("updatePlayers", players);
  });
});

server.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});