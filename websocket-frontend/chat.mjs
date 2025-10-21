export function renderMessage(msg) {
  const list = document.getElementById("messages");
  const item = document.createElement("li");
  item.textContent = `${msg.name}: ${msg.text}`;
  list.appendChild(item);
}

export function renderMessages(msgs) {
  msgs.forEach(renderMessage);
}