import express from "express";
import http from "http";
import pkg from "websocket";
import cors from "cors";


const { server: WebSocketServer } = pkg;

import { addMessage, getMessages, updateReaction } from "./messages.mjs";


const app = express();
app.use(cors());
const port = process.env.PORT || 4000;

const server = http.createServer(app);
const webSocketServer = new WebSocketServer({ httpServer: server });

//Keep track of connected clients
let clients = [];

// Handle WebSocket requests
webSocketServer.on("request", (request) => {
  const connection = request.accept(null, request.origin);
  console.log("New WebSocket client connected");
  clients.push(connection);

  // Send existing messages when client connects
  connection.sendUTF(JSON.stringify({ type: "initialMessages", messages: getMessages() }));

  // Listen for new messages
  connection.on("message", (message) => {
    if (message.type === "utf8") {
      const data = JSON.parse(message.utf8Data);

if (data.type === "newMessage") {
  const msg = addMessage(data.name, data.text);

  // Broadcast new message to all clients
  clients.forEach(client => {
    if (client.connected) client.sendUTF(JSON.stringify({ type: "newMessage", message: msg }));
  });
}

if (data.type === "reaction") {
  const updatedMsg = updateReaction(data.messageId, data.reactionType);
  if (updatedMsg) {
    // Broadcast updated reaction to all clients
    clients.forEach(client => {
      if (client.connected) client.sendUTF(JSON.stringify({ type: "reaction", message: updatedMsg }));
    });
  }
}

    }
  });

  connection.on("close", () => {
    console.log("WebSocket client disconnected");
    clients = clients.filter((c) => c !== connection);
  });
});

app.get("/", (req, res) => {
  res.json(getMessages()); 
});


server.listen(port, "0.0.0.0", () => {
  console.log(`WebSocket server running on port ${port}`);
});
