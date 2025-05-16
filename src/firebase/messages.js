import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { app } from "./config";

const db = getFirestore(app);

// Add a new contact message
export const addContactMessage = async (messageData) => {
  try {
    console.log("Attempting to add message with data:", messageData);
    const messagesRef = collection(db, "messages");

    // Log the database instance
    console.log("Firestore instance:", db);

    const messageToAdd = {
      ...messageData,
      createdAt: new Date().toISOString(),
      status: "unread",
      category: messageData.category || "general",
      priority: messageData.priority || "normal",
    };

    console.log("Prepared message data:", messageToAdd);

    const docRef = await addDoc(messagesRef, messageToAdd);
    console.log("Message added successfully with ID:", docRef.id);

    return { id: docRef.id, ...messageData };
  } catch (error) {
    console.error("Error adding message:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    console.error("Error details:", error.details);
    throw error;
  }
};

// Get all messages (admin only)
export const getAllMessages = async () => {
  try {
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting messages:", error);
    throw error;
  }
};

// Get messages by status (admin only)
export const getMessagesByStatus = async (status) => {
  try {
    const messagesRef = collection(db, "messages");
    const q = query(
      messagesRef,
      where("status", "==", status),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting messages by status:", error);
    throw error;
  }
};

// Get messages by category (admin only)
export const getMessagesByCategory = async (category) => {
  try {
    const messagesRef = collection(db, "messages");
    const q = query(
      messagesRef,
      where("category", "==", category),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting messages by category:", error);
    throw error;
  }
};

// Get messages by priority (admin only)
export const getMessagesByPriority = async (priority) => {
  try {
    const messagesRef = collection(db, "messages");
    const q = query(
      messagesRef,
      where("priority", "==", priority),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting messages by priority:", error);
    throw error;
  }
};

// Mark message as read
export const markMessageAsRead = async (messageId) => {
  try {
    const messageRef = doc(db, "messages", messageId);
    await updateDoc(messageRef, {
      status: "read",
      readAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error marking message as read:", error);
    throw error;
  }
};
