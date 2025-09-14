import { Router } from "express";
import { postSendMessage, postGetMessages } from "../controllers/conversationController";

const router = Router();

router.post("/send", postSendMessage);
router.post("/messages", postGetMessages);

export default router;
