import { db } from "../config/firebase";
import { Message } from "../models/message";

const getOrCreateConversation = async (userId1: string, userId2: string): Promise<string> => {
    const participants = [userId1, userId2].sort();
    const conversationKey = participants.join("_");

    const convRef = db.ref(`messages/${conversationKey}`);
    const snapshot = await convRef.once("value");

    if (!snapshot.exists()) {
        await convRef.set({
            participants,
            createdAt: Date.now()
        });
        console.log("✅ Yeni konuşma oluşturuldu:", conversationKey);
    } else {
        console.log("✅ Mevcut konuşma bulundu:", conversationKey);
    }

    return conversationKey;
};

export const sendMessage = async (fromUserId: string, toUserId: string, text: string) => {
    try {
        const conversationId = await getOrCreateConversation(fromUserId, toUserId);
        console.log("📝 Mesaj gönderiliyor, konuşma ID:", conversationId);

        const messagesRef = db.ref(`messages/${conversationId}/messages`).push(); 
        const message: Message = {
            id: messagesRef.key!,
            from: fromUserId,
            to: toUserId,
            text: text,
        };

        await messagesRef.set(message);
        console.log("✅ Mesaj Firebase'e kaydedildi:", message);

        return {
            success: true,
            message: "Message sent",
            conversationId,
            data: message
        };
    } catch (error) {
        console.error("❌ Firebase hatası:", error);
        return {
            success: false,
            error: "Failed to save message to Firebase"
        };
    }
};

export const getMessages = async (userId1: string, userId2: string): Promise<Message[]> => {
    try {
        const conversationId = await getOrCreateConversation(userId1, userId2);
        console.log("📖 Mesajlar okunuyor, konuşma ID:", conversationId);

        const snapshot = await db.ref(`messages/${conversationId}/messages`).once("value"); 

        if (!snapshot.exists()) {
            console.log("📭 Bu konuşmada mesaj bulunamadı:", conversationId);
            return [];
        }

        const messagesData = snapshot.val();
        const messages: Message[] = Object.values(messagesData);

        console.log("📨 Okunan mesaj sayısı:", messages.length);
        return messages;
    } catch (error) {
        console.error("❌ Firebase okuma hatası:", error);
        throw new Error("Failed to retrieve messages from Firebase");
    }
};
