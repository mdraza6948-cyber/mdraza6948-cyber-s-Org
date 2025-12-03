import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateReflection = async (entryContent: string): Promise<string> => {
  if (!apiKey) {
    throw new Error('API Key is missing. Please check your configuration.');
  }

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      You are a supportive, insightful, and empathetic journaling companion. 
      Read the following journal entry and provide a brief, warm reflection. 
      It could be a validating comment, a gentle insight, or a thought-provoking question to help the writer dig deeper. 
      Keep the response concise (under 60 words) and use a comforting tone.
      
      Journal Entry: "${entryContent}"
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "I couldn't generate a reflection at this moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to connect to the AI service.");
  }
};