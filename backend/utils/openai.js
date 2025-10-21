import dotenv from "dotenv";

import fetch from "node-fetch";
dotenv.config();


const getOpenApi=async(message)=>{
     try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: message }], // ✅ Correct format
          }),
        });
    
        const data = await response.json();
    
        // ✅ Check for API errors
        if (data.error) {
          return res.status(400).json({ error: data.error.message });
        }
    
        return data.choices[0].message.content;
      } catch (err) {
        console.error("Error:", err);
        res.status(500).send("Internal Server Error");
      }
}

export default getOpenApi;