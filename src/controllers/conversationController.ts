import { Request, Response } from "express";
import { sendMessage, getMessages } from "../services/conversationService";

export const postSendMessage = async (req: Request, res: Response) => {
    try {
        const { fromUserId, toUserId, text } = req.body;
        if (!fromUserId || !toUserId || !text) {
            return res.status(400).json({ error: "fromUserId, toUserId and text are required" });
        }

        const result = await sendMessage(fromUserId, toUserId, text);
        res.status(200).json(result);
    } catch (err: any) {
        console.error("Send message error:", err);
        res.status(500).json({ error: err.message });
    }
};

export const postGetMessages = async (req: Request, res: Response) => {
    try {
        const { userId1, userId2 } = req.body;
        if (!userId1 || !userId2) {
            return res.status(400).json({ error: "userId1 and userId2 are required" });
        }

        const messages = await getMessages(userId1, userId2);
        res.status(200).json({ messages });
    } catch (err: any) {
        console.error("Get messages error:", err);
        res.status(500).json({ error: err.message });
    }
};
