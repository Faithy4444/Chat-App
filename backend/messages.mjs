const messages = [];

export function addMessage(name, text) {
  const msg = { name, text, timestamp: new Date() };
  messages.push(msg);
  return msg;
}

export function getMessages(since) {
  if (!since) return messages;
  const sinceTime = new Date(since).getTime();
  return messages.filter(m => new Date(m.timestamp).getTime() > sinceTime);
}