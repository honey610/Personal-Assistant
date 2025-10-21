import {Router} from "express";
import {createThread,getAllThread,getThreadById,deleteThread,newChat} from "../controllers/chat.controller.js";


const router=Router();


router.post("/create",createThread)
router.get("/allthreads",getAllThread)
router.get("/singlethread/:threadId",getThreadById)
router.delete("/deletethread/:threadId",deleteThread)
router.post("/newchat",newChat)



export default router;
