import { renderMessage, renderMessages } from "./chat.mjs";

//connecting to server
const ws = new WebSocket("ws://localhost:4000");

ws.onopen = ()=>{
    console.log("connected to websocket server")
};

ws.onmessage = (event)=>{
    const data = JSON.parse(event.data);
    if(Array.isArray(data)){
        renderMessages(data)
    }else{renderMessage(data)}
};
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("messageForm");
  const nameInput = document.getElementById("name");
  const messageInput = document.getElementById("messageInput");

  if (!form || !nameInput || !messageInput) {
    console.error("⚠️ Missing form or inputs in the HTML!");
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const text = messageInput.value.trim();

    if (!name || !text) return; // don’t send empty messages

    ws.send(JSON.stringify({ name, text }));

    messageInput.value = ""; // clear after sending
  });
});