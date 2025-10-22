const messages = [];

export function addMessage(name, text) {
  const msg = { 
    name,
    text,
    timestamp: new Date(),
    id:Date.now(),
    likes: 0,
    dislikes:0
  };
  messages.push(msg);
  return msg;
}

export function getMessages(since) {
  if (!since) return messages;
  const sinceTime = new Date(since).getTime();
  return messages.filter(m => new Date(m.timestamp).getTime() > sinceTime);
}

export function updateReaction(messageId, type) {
  const msg = messages.find(m => m.id === messageId);
  if (!msg) return null;

  if (type === "like") msg.likes += 1;
  else if (type === "dislike") msg.dislikes += 1;

  return msg;
}
