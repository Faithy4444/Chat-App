import express from "express";
import http from "http";
import pkg from "websocket";
const { server: WebSocketServer } = pkg;

import { addMessage, getMessages } from "../backend/messages.mjs";

const app = express();
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
  connection.sendUTF(JSON.stringify(getMessages()));

  // Listen for new messages
  connection.on("message", (message) => {
    if (message.type === "utf8") {
      const { name, text } = JSON.parse(message.utf8Data);
      const msg = addMessage(name, text);

      //Broadcast to all connected clients
      clients.forEach((client) => {
        if (client.connected) {
          client.sendUTF(JSON.stringify([msg]));
        }
      });
    }
  });

  connection.on("close", () => {
    console.log("WebSocket client disconnected");
    clients = clients.filter((c) => c !== connection);
  });
});

server.listen(port, () => {
  console.log(`WebSocket server running on port ${port}`);
});
