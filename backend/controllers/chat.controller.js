 import Thread from "../models/history.model.js";
 import getOpenApi from "../utils/openai.js";
 import {audioai} from "../utils/audioai.js";
 import fs from "fs";
//  import path from "path";




export const createThread=async(req,res)=>{
   try{
    const {threadId,title}=req.body
    if(!title||!threadId){ 
        return res.status(400).json({message:"all fields are required"})
       
    }
    const newThread=new Thread(
    {
        threadId,
       title
  
        
    })
    await newThread.save()
    return res.status(200).json({message:"thread created successfully"})    

   }catch(err){

   }
}




export const getAllThread=async(req,res)=>{
    try{
     
        const thread=await Thread.find();
        return res.status(200).json({thread})


    }catch{
        return res.status(500).json({message:"something went wrong"})
    
    }
}



export const getThreadById=async(req,res)=>{
    try{
        const {threadId}=req.params
        if(!threadId){
            return res.status(400).json({message:"threadId is required"})
        }
        const thread=await Thread.findOne({threadId})
        if(!thread){
            return res.status(400).json({message:"thread not found"})
        }

//        thread.messages.forEach(msg => {
//   if (msg.role === "user") {
//     console.log(msg.content);
//   }
// });
//  thread.messages.forEach(msg => {
//   if (msg.role === "assistant") {
//     console.log(msg.content);
//   }
// });

// const res=await getOpenApi(thread.messages[thread.messages.length-1].content)
// thread.messages.push({role:"assistant",content:res})

// console.log(thread.messages.content)

        
        return res.status(200).json({messages:thread.messages})

    }catch(err){
        return res.status(500).json({message:"something went wrong"})

    }
}


export const deleteThread=async(req,res)=>{
    try{
        const {threadId}=req.params
        if(!threadId){
             return res.status(400).json({message:"threadId is required"})
        }
        const thread=await Thread.findOneAndDelete({threadId})
        if(!thread){
            return res.status(400).json({message:"thread cannot be deleted"})
        }
        return res.status(200).json({message:"thread deleted successfully"})
    }catch(err){
return res.status(500).json({message:"something went wrong"})
    }
}



export const newChat = async (req, res) => {
  try {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let thread = await Thread.findOne({ threadId });

    if (!thread) {
      thread = new Thread({
        threadId,
        title: "New Chat",
        messages: [],
      });
    }

    // Add user message
    thread.messages.push({ role: "user", content: message });

    // Get assistant response
    const response = await getOpenApi(message);

    // Add assistant message
    thread.messages.push({ role: "assistant", content: response });
    thread.updatedAt = Date.now();

    await thread.save();

    // ✅ Return full updated thread and threadId
    return res.status(200).json({
      threadId: thread.threadId,
      messages: thread.messages,
    });
  } catch (err) {
    console.error("Error in newChat:", err);
    return res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};



const supportedFormats=[".mp3",".wav",".ogg"];


export const audioChat = async (req, res) => {
  try {
    const { threadId } = req.body;

    // 1️⃣ Validate required inputs
    if (!threadId || !req.file) {
      return res
        .status(400)
        .json({ message: "Audio file and threadId are required" });
    }

    
    const audioPath = req.file.path;
    // const ext = path.extname(audioPath).toLowerCase();

    // if(!supportedFormats.includes(ext)){
    //   return res.status(400).json({ message: "Unsupported audio format" });
    // }
    // 2️⃣ Find or create thread
    let thread = await Thread.findOne({ threadId });
    if (!thread) {
      thread = new Thread({
        threadId,
        title: "New Audio Chat",
        messages: [],
      });
    }

    // 3️⃣ Transcribe and get AI response
    const result = await audioai(audioPath);
    if (!result || !result.transcription || !result.response) {
      return res.status(500).json({
        message: "Audio processing failed",
        error: result || "No result from audioai",
      });
    }

    const { transcription, response } = result;

    // 4️⃣ Save to thread
    thread.messages.push({ role: "user", content: transcription });
    thread.messages.push({ role: "assistant", content: response });
    thread.updatedAt = Date.now();

    await thread.save();

    // 5️⃣ Delete the audio file after use
    fs.unlink(audioPath, (err) => {
      if (err) console.warn("Could not delete uploaded file:", err.message);
    });

    // 6️⃣ Return updated thread
    return res.status(200).json({
      threadId: thread.threadId,
      messages: thread.messages,
      transcription,
      response,
    });
  } catch (err) {
    console.error("Error in audioChat:", err);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};
