export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: number;
  status: "new" | "read" | "replied";
}

const STORAGE_KEY = "contact_messages";
const SUPPORT_EMAIL = "info@eventafterlife.com";

export function saveContactMessage(
  name: string,
  email: string,
  subject: string,
  message: string
): { success: boolean; error?: string } {
  try {
    const messages = getMessages();
    
    const newMessage: ContactMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      subject,
      message,
      createdAt: Date.now(),
      status: "new",
    };

    messages.push(newMessage);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    
    // Create mailto link (will open user's email client)
    const mailtoLink = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    )}`;
    
    // Note: In a real application, you would send this via a backend API
    // For now, we'll save it and the admin can view it
    
    return { success: true };
  } catch (error) {
    console.error("Error saving message:", error);
    return { success: false, error: "Failed to save message" };
  }
}

export function getAllMessages(): ContactMessage[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function getMessageById(id: string): ContactMessage | null {
  const messages = getAllMessages();
  return messages.find((m) => m.id === id) || null;
}

export function updateMessageStatus(id: string, status: ContactMessage["status"]): void {
  const messages = getAllMessages();
  const updated = messages.map((m) => (m.id === id ? { ...m, status } : m));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function deleteMessage(id: string): void {
  const messages = getAllMessages();
  const filtered = messages.filter((m) => m.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function getMessagesStats() {
  const messages = getAllMessages();
  return {
    total: messages.length,
    new: messages.filter((m) => m.status === "new").length,
    read: messages.filter((m) => m.status === "read").length,
    replied: messages.filter((m) => m.status === "replied").length,
  };
}

export function getSupportEmail(): string {
  return SUPPORT_EMAIL;
}
