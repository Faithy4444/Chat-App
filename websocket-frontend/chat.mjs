import { sendReaction } from "./websocket-client.mjs";

export function renderMessage(msg) {
  const list = document.getElementById("messages");
  const item = document.createElement("div");
  item.dataset.id = msg.id;

  item.innerHTML = `
    <strong>${msg.name}:</strong> ${msg.text}
    <div>
      <button class="like">👍 ${msg.likes}</button>
      <button class="dislike">👎 ${msg.dislikes}</button>
    </div>
  `;

  item.querySelector(".like").addEventListener("click", () => sendReaction(msg.id, "like"));
  item.querySelector(".dislike").addEventListener("click", () => sendReaction(msg.id, "dislike"));

  list.appendChild(item);
}

export function renderMessages(msgs) {
  msgs.forEach(renderMessage);
}
