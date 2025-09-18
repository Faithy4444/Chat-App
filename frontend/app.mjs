
const messageForm = document.getElementById("messageForm")
const apiUrl = location.hostname === 'localhost' || location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:3000'
    : "https://chatappbackend.hosting.codeyourfuture.io";

const fetchMessages = async()=>{
try{
    const lastMessageTime =state.messages.length > 0
    ?state.messages[state.messages.length - 1].timestamp
    :null;

    const queryString = lastMessageTime ? `?since=${lastMessageTime}` :"";
    const url = `${apiUrl}/messages${queryString}`;

    const response = await fetch(url);
    const data = await response.json();

    state.messages.push(...data)
    renderMessages(data)
}catch(error){
    console.log("Failed to fetch messages:", error);
}

}

const renderMessages = (messages)=>{
    const messagesContainer = document.getElementById("messages");
    messagesContainer.innerHTML = ""

    if (messages && Array.isArray(messages)) { 
    for (let message of messages) {
    if (message && typeof message === 'object' && message.name && message.message) {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("message");
        msgDiv.textContent = `${message.name}: ${message.message}`;
        messagesContainer.appendChild(msgDiv);
    } else {
        console.warn("Skipping invalid message", message);
    }
}

     } else {
        console.error("Received unexpected data format:", messages);
    }
}

messageForm.addEventListener("submit", async(e)=>{
    e.preventDefault();
    const name = document.getElementById("name").value;
    const message = document.getElementById("messageInput").value;
    const newMessage = {name, message};


    try{
        const response = await fetch(apiUrl+"/",{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newMessage),
        });
        const savedMessages = await response.json();
        fetchMessages();
        document.getElementById("messageInput").value = "";

    }catch(error){
        console.error("Error sending message:", error);

    }

})

window.addEventListener("DOMContentLoaded", ()=>{
    fetchMessages();
    setInterval(fetchMessages, 100)


});