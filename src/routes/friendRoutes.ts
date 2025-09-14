import { Router } from "express";
import {
    sendRequest,
    acceptRequest,
    rejectRequest,
    postFriendsList,
    postPendingRequests
} from "../controllers/friendController";

const router = Router();

router.post("/send", sendRequest);
router.post("/accept", acceptRequest);
router.post("/reject", rejectRequest);
router.post("/list", postFriendsList);
router.post("/pending", postPendingRequests);

export default router;
