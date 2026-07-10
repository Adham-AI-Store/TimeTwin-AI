import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function test() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Say hello and tell me your name.",
    });

    console.log("\n✅ Gemini Response:\n");
    console.log(response.text);
  } catch (error) {
    console.error("\n❌ Error:\n");
    console.error(error);
  }
}

test();