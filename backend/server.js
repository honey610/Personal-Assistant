import express from "express";
import dotenv from "dotenv";

import mongoose from "mongoose";
import cors from "cors";
import chatRoutes from "./routes/chat.routes.js";
import getOpenApi from "./utils/openai.js";
import authRoutes from "./routes/auth.routes.js";



dotenv.config(); // ✅ Load environment variables

const app = express();

app.use(express.json());
// app.use(cors());
const allowedOrigins = [
  "https://7czb1w3g-5173.inc1.devtunnels.ms",
  "http://localhost:5173",
  "https://main.dgfh8yg4e4qqc.amplifyapp.com"
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);



app.use("/api/chat",chatRoutes)
app.use("/api/auth",authRoutes)



// Middleware to parse JSON bodies


const PORT = process.env.PORT || 4000 ;


// app.post("/test", async (req, res) => {
//    try{
//       const{message}=req.body;
//        if (!message) return res.status(400).json({ error: "Message is required" });
//        const openai=await getOpenApi(message);
      
//        res.send(openai);

//    }catch(err){
//     console.log(err)
//    }
// });
app.get("/", (req, res) => {
  res.send("✅ Server is running successfully!");
});




// ✅ Connect to MongoDB
const start=async()=>{
   
     const mongodb=await mongoose.connect(process.env.MONGO_URI)
     console.log("mongodb is connected")
 app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
 })

}

  


start();



// ✅ Use POST instead of GET (GET does not have a body)
// app.post("/test", async (req, res) => {
//   try {
//     const response = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "gpt-4o-mini",
//         messages: [{ role: "user", content: req.body.message }], // ✅ Correct format
//       }),
//     });

//     const data = await response.json();

//     // ✅ Check for API errors
//     if (data.error) {
//       return res.status(400).json({ error: data.error.message });
//     }

//     res.send(data.choices[0].message.content);
//   } catch (err) {
//     console.error("Error:", err);
//     res.status(500).send("Internal Server Error");
//   }
// });

