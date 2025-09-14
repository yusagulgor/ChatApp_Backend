import { Request, Response } from "express";
import {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    listFriends,
    listPendingRequests
} from "../services/friendService";

export const sendRequest = async (req: Request, res: Response) => {
    try {
        const { fromUserId, toName } = req.body;
        const result = await sendFriendRequest(fromUserId, toName);
        res.status(200).json(result);
    } catch (err: any) {
        console.error("Send Friend Request hata:", err);
        res.status(500).json({ error: err.message });
    }
};

export const acceptRequest = async (req: Request, res: Response) => {
    try {
        const { userId, fromUserId } = req.body;
        const result = await acceptFriendRequest(userId, fromUserId);
        res.status(200).json(result);
    } catch (err: any) {
        console.error("Accept Friend Request hata:", err);
        res.status(500).json({ error: err.message });
    }
};

export const rejectRequest = async (req: Request, res: Response) => {
    try {
        const { userId, fromUserId } = req.body;
        const result = await rejectFriendRequest(userId, fromUserId);
        res.status(200).json(result);
    } catch (err: any) {
        console.error("Reject Friend Request hata:", err);
        res.status(500).json({ error: err.message });
    }
};

export const postFriendsList = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ error: "userId is required" });

        const friends = await listFriends(userId);
        res.status(200).json({ friends });
    } catch (err: any) {
        console.error("Post Friends List hata:", err);
        res.status(500).json({ error: err.message });
    }
};

export const postPendingRequests = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ error: "userId is required" });

        const pending = await listPendingRequests(userId);
        res.status(200).json({ pending });
    } catch (err: any) {
        console.error("Post Pending Requests hata:", err);
        res.status(500).json({ error: err.message });
    }
};
