import {Router} from "express";
import {createThread,getAllThread,getThreadById,deleteThread,newChat,audioChat} from "../controllers/chat.controller.js";
import multer from "multer";




const router=Router();
const upload = multer({ dest: "uploads/" });


router.post("/create",createThread)
router.get("/allthreads",getAllThread)
router.get("/singlethread/:threadId",getThreadById)
router.delete("/deletethread/:threadId",deleteThread)
router.post("/newchat",newChat)
router.post("/audiochat",upload.single("audio"),audioChat)




export default router;
