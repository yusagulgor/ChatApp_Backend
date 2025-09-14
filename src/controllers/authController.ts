import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/authService";

export const register = async (req: Request, res: Response) => {
    try {
        const { name, password } = req.body;
        const result = await registerUser(name, password);
        res.status(200).json(result);
    } catch (err: any) {
        console.error("Register hata:", err);
        res.status(500).json({ error: err.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { name, password } = req.body;
        const result = await loginUser(name, password);
        res.status(200).json(result);
    } catch (err: any) {
        console.error("Login hata:", err);
        res.status(500).json({ error: err.message });
    }
};
