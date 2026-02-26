import { GoogleGenAI } from "@google/genai";
import { WeddingDetails } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateWeddingMessage(details: Partial<WeddingDetails>, tone: string = "romantic") {
  const prompt = `Write a beautiful, elegant, and ${tone} wedding invitation message in Indonesian. 
  The couple's names are ${details.brideName} and ${details.groomName}. 
  The wedding is on ${details.date} at ${details.venue}, ${details.location}.
  Keep it concise but heartfelt. Return only the message text.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "";
  } catch (error) {
    console.error("Error generating message:", error);
    return "Terjadi kesalahan saat membuat pesan. Silakan coba lagi.";
  }
}
