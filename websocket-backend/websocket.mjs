import express from "express";
import http from "http";
import pkg from "websocket";
const { client, server: WebSocketServer } = pkg;


import { addMessage, getMessages } from "../backend/messages.mjs"

const app = express();
const port = process.env.PORT || 4000;

const server = http.createServer(app);

//attaching websocket server to http server
const webSocketServer = new WebSocketServer({ 
  httpServer: server,
});

//handling websocket requests
webSocketServer.on("request", (request)=>{
  const connection = request.accept(null, request.origin);
//send existing messageswhen client connects
  connection.sendUTF(JSON.stringify(getMessages()));
  //listen for any incoming messages

  connection.on("message", (message)=>{
    if(message.type === "utf8"){
      const {name, text} = JSON.parse(message.utf8Data);
      const msg =addMessage(name, text);

      //broadcast to all
      webSocketServer.connections.forEach((client)=>{
        client.sendUTF(JSON.stringify([msg]));
      });
    }
  });

  connection.on("close", ()=>{
    console.log("websocket client disconnected")
  });
});


server.listen(port, ()=>{
  console.log(`WebSocket server running on http://localhost:${port}`);
})