import {Router}  from "express";
import {login,register,getProfile} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.middleware.js";

const router=Router();

router.get("/profile/:id",getProfile)

router.post("/login",login)
router.post("/register",register)


export default router;