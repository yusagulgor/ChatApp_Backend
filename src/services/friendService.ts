import { db } from "../config/firebase";
import { User } from "../models/user";

export const sendFriendRequest = async (fromUserId: string, toName: string) => {
    const snapshot = await db.ref("users").orderByChild("name").equalTo(toName).once("value");
    if (!snapshot.exists()) throw new Error("User not found");

    const toUserId = Object.keys(snapshot.val())[0];
    if (toUserId === fromUserId) throw new Error("Cannot send request to yourself");

    await db.ref(`users/${toUserId}/friendRequests/${fromUserId}`).set(true);

    return { message: `Friend request sent to ${toName}` };
};

export const acceptFriendRequest = async (userId: string, fromUserId: string) => {
    const userRef = db.ref(`users/${userId}/my_friends`);
    const fromUserRef = db.ref(`users/${fromUserId}/my_friends`);

    const [userSnap, fromSnap] = await Promise.all([userRef.once("value"), fromUserRef.once("value")]);

    const userFriends: string[] = userSnap.exists() ? userSnap.val() : [];
    const fromFriends: string[] = fromSnap.exists() ? fromSnap.val() : [];

    if (!userFriends.includes(fromUserId)) userFriends.push(fromUserId);
    if (!fromFriends.includes(userId)) fromFriends.push(userId);

    await Promise.all([
        userRef.set(userFriends),
        fromUserRef.set(fromFriends),
        db.ref(`users/${userId}/friendRequests/${fromUserId}`).remove()
    ]);

    return { message: "Friend request accepted" };
};

export const rejectFriendRequest = async (userId: string, fromUserId: string) => {
    await db.ref(`users/${userId}/friendRequests/${fromUserId}`).remove();
    return { message: "Friend request rejected" };
};

export const listFriends = async (userId: string): Promise<User[]> => {
    const snapshot = await db.ref(`users/${userId}/my_friends`).once("value");
    if (!snapshot.exists()) return [];

    const friendIds: string[] = snapshot.val();

    const friendsData: User[] = await Promise.all(friendIds.map(async (fid) => {
        const friendSnap = await db.ref(`users/${fid}`).once("value");
        const f: User = friendSnap.val();
        return { id: fid, name: f.name, passwordHash: f.passwordHash, my_friends: f.my_friends, friendRequests: f.friendRequests };
    }));

    return friendsData;
};

export const listPendingRequests = async (userId: string): Promise<User[]> => {
    const snapshot = await db.ref(`users/${userId}/friendRequests`).once("value");
    if (!snapshot.exists()) return [];

    const requestIds: string[] = Object.keys(snapshot.val());

    const pendingData: User[] = await Promise.all(requestIds.map(async (fid) => {
        const friendSnap = await db.ref(`users/${fid}`).once("value");
        const f: User = friendSnap.val();
        return { id: fid, name: f.name, passwordHash: f.passwordHash, my_friends: f.my_friends, friendRequests: f.friendRequests };
    }));

    return pendingData;
};
