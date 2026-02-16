import { supabase } from "./supabase";

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

function getFromStorage(): ContactMessage[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveToStorage(messages: ContactMessage[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

export async function saveContactMessage(
  name: string,
  email: string,
  subject: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const createdAt = Date.now();
    if (supabase) {
      const { data, error } = await supabase
        .from("contact_messages")
        .insert({ name, email, subject, message, status: "new", created_at: createdAt })
        .select("id")
        .single();
      if (error) throw error;
      return { success: true };
    }
    const newMessage: ContactMessage = {
      id: `msg_${createdAt}_${Math.random().toString(36).slice(2, 9)}`,
      name,
      email,
      subject,
      message,
      createdAt,
      status: "new",
    };
    const messages = getFromStorage();
    messages.push(newMessage);
    saveToStorage(messages);
    return { success: true };
  } catch (error) {
    console.error("Error saving message:", error);
    return { success: false, error: "Failed to save message" };
  }
}

export function getAllMessages(): ContactMessage[] {
  return getFromStorage();
}

export async function getAllMessagesAsync(): Promise<ContactMessage[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map((r: { id: string; name: string; email: string; subject: string; message: string; created_at: number; status: string }) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      subject: r.subject,
      message: r.message,
      createdAt: r.created_at,
      status: r.status as ContactMessage["status"],
    }));
  }
  return getFromStorage();
}

export function getMessageById(id: string): ContactMessage | null {
  return getAllMessages().find((m) => m.id === id) || null;
}

export async function updateMessageStatus(id: string, status: ContactMessage["status"]): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from("contact_messages").update({ status }).eq("id", id);
    if (error) throw error;
    return;
  }
  const messages = getFromStorage();
  const updated = messages.map((m) => (m.id === id ? { ...m, status } : m));
  saveToStorage(updated);
}

export async function deleteMessage(id: string): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) throw error;
    return;
  }
  const messages = getFromStorage().filter((m) => m.id !== id);
  saveToStorage(messages);
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

export async function getMessagesStatsAsync(): Promise<{ total: number; new: number; read: number; replied: number }> {
  const messages = await getAllMessagesAsync();
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
