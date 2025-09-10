import express from "express";
import cors from "cors";

const app =express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());
const messages = [
    {
        name: "Faith",
        message: "Hi how are you?"  
    },
     {
        name: "Fortunate",
        message: "I am okay"
    } 
]

app.get("/",(req, res)=>{
    res.json(messages);
});

app.post("/",(req, res)=>{
const newMessage = req.body;
messages.push(newMessage);
res.status(201).json(newMessage);
});

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})