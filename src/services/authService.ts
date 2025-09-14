import { db } from "../config/firebase";
import bcrypt from "bcrypt";
import { User } from "../models/user";

export const registerUser = async (name: string, password: string): Promise<User> => {
    const snapshot = await db.ref("users").orderByChild("name").equalTo(name).once("value");
    if (snapshot.exists()) throw new Error("Username already exists");

    const hash = await bcrypt.hash(password, 10);

    const newUserRef = db.ref("users").push();
    const user: User = {
        id: newUserRef.key!,
        name,
        passwordHash: hash,
        my_friends: [],
        friendRequests: {}
    };

    await newUserRef.set(user);
    return user;
};

export const loginUser = async (name: string, password: string): Promise<User> => {
    const snapshot = await db.ref("users").orderByChild("name").equalTo(name).once("value");
    if (!snapshot.exists()) throw new Error("User not found");

    const userData = Object.values(snapshot.val())[0] as User;
    const userId = Object.keys(snapshot.val())[0];

    const match = await bcrypt.compare(password, userData.passwordHash);
    if (!match) throw new Error("Invalid password");

    return { ...userData, id: userId };
};
