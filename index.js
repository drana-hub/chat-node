const express = require("express");
const socketIo = require("socket.io");
const cors = require("cors");
const http = require("http");
const port = process.env.PORT || 3002;

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*", // Or specify the origins you want to allow, e.g., ["http://localhost:3000"]
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  const { userName } = socket.handshake.query;
  console.log(`New client connected ${userName} with socketId ${socket.id}.`);
  console.log(`Total connected clients now: ${io.engine.clientsCount}`);

  socket.on("joinRoom", ({ roomName, user }) => {
    socket.join(roomName);
    console.log(
      `Client ${user} with socketId ${socket.id} joined room ${roomName}`
    );
    const numClients = io.sockets.adapter.rooms.get(roomName)?.size || 0;
    console.log(`Number of clients in room ${roomName} now: ${numClients}`);
  });

  socket.on("leaveRoom", ({ roomName, user }) => {
    socket.leave(roomName);
    console.log(
      `Client ${user} with socketId ${socket.id} left room ${roomName}`
    );
    const numClients = io.sockets.adapter.rooms.get(roomName)?.size || 0;
    console.log(`Number of clients in room ${roomName} now: ${numClients}`);
  });

  socket.on("send_message", ({ roomName, data }) => {
    io.to(roomName).emit("msg_received", data);
  });
  socket.on("disconnect", () => {
    console.log(
      `Client ${socket.userName} with socket ID ${socket.id} disconnected`
    );
  });
});

server.listen(port, () => console.log("Server started on port: " + port));

app.get("/hello", (req, res) => {
  res.send("Hello, World!");
});
