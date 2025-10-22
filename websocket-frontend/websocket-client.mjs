import { renderMessage, renderMessages } from "./chat.mjs";

//connecting to server
const wsUrl =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "ws://localhost:4000"
    : "wss://faith-chatapp-websocket-backend.hosting.codeyourfuture.io";

const ws = new WebSocket(wsUrl);

ws.onopen = () => {
  console.log("Connected to WebSocket server");
};

ws.onclose = () => {
  console.log("WebSocket connection closed");
};

ws.onerror = (err) => {
  console.error("WebSocket error:", err);
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === "initialMessages") {
    renderMessages(data.messages);
  } else if (data.type === "newMessage") {
    renderMessage(data.message);
  } else if (data.type === "reaction") {
    const msgEl = document.querySelector(`[data-id='${data.message.id}']`);
    if (msgEl) {
      msgEl.querySelector(".like").textContent = `👍 ${data.message.likes}`;
      msgEl.querySelector(".dislike").textContent = `👎 ${data.message.dislikes}`;
    }
  }
};

export function sendReaction(messageId, type) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: "reaction", messageId, reactionType: type }));
  } else {
    console.warn("WebSocket not open — cannot send reaction");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("messageForm");
  const nameInput = document.getElementById("name");
  const messageInput = document.getElementById("messageInput");

  if (!form || !nameInput || !messageInput) {
    console.error("Missing form or inputs in the HTML!");
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const text = messageInput.value.trim();

    if (!name || !text) return;

    //Check if the WebSocket is open before sending
    if (ws.readyState === WebSocket.OPEN) {
  ws.send(JSON.stringify({ type: "newMessage", name, text }));
  messageInput.value = "";
} else {
  console.warn("WebSocket not open — message not sent");
}

  });
});
