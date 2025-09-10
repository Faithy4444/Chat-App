
const messageForm = document.getElementById("messageForm")
const apiUrl = "http://127.0.0.1:3000"

const fetchMessages = async()=>{
try{
    const response = await fetch(apiUrl);
    const data = await response.json();
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