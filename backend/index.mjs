import express from "express";
import cors from "cors";

const app =express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());
const messages = []

app.get("/",(req, res)=>{
    const since = req.query.since;

    if(since){
        const sinceTime = new Date(since).getTime();
        const filteredMsgs =messages.filter((message)=>{
            return new Date(message.timestamp).getTime() >sinceTime;
        })
        return res.json(filteredMsgs);
    }
    return res.json(messages);
});

app.post("/",(req, res)=>{
const newMessage = {
    ...req.body,
    timestamp: new Date().toISOString(),
  };
  messages.push(newMessage);
  res.status(201).json(newMessage);
});

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})