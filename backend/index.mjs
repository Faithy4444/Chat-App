import express from "express";
import cors from "cors";

const app =express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());
const messages = [];
let clients = [];

app.get("/",(req, res)=>{
    const since = req.query.since;

    if(since){
        const sinceTime = new Date(since).getTime();
        const filteredMsgs =messages.filter((message)=>{
            return new Date(message.timestamp).getTime() >sinceTime;
        })
        if (filteredMsgs.length> 0){
        return res.json(filteredMsgs);
        }
        clients.push(res);
        setTimeout(()=>{
            res.json([]);
            clients = clients.filter((c)=> c!== res);
        }, 3000);
    }
    else{res.json(messages);}
});

app.post("/",(req, res)=>{
const newMessage = {
    ...req.body,
    timestamp: new Date().toISOString(),
  };
  messages.push(newMessage);
  clients.forEach((clientRes)=>clientRes.json([newMessage]));
  clients = [];
  res.status(201).json(newMessage);
});

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})