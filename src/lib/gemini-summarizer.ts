import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function generateSummaryFromText(
  text: string | null | undefined,
): Promise<string | null> {
  if (!text || typeof text !== "string" || text.trim() === "") {
    console.warn("Invalid text provided for summarization");
    return null;
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    
    if (!apiKey || apiKey.trim() === "") {
      console.error("GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY is missing or empty. Please check your .env.local file.");
      console.error("Make sure the variable is in .env.local (not .env) and the server was restarted after adding it.");
      return null;
    }

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error("Timeout: Gemini API call took too long"));
      }, 30000); // 30 seconds timeout
    });

    process.env.GOOGLE_GENERATIVE_AI_API_KEY = apiKey;
    
    const apiCallPromise = generateText({
      model: google("gemini-2.5-flash"),
      prompt: `Você é um assistente especializado em resumir proposições de lei brasileiras. 
      
Resuma o seguinte texto de uma proposição de lei em apenas 1 ou 2 linhas, de forma clara e objetiva em português brasileiro. Foque no que a lei faz ou propõe:

${text.substring(0, 100000)}`,
    });

    const result = await Promise.race([apiCallPromise, timeoutPromise]);

    const summary = result.text?.trim() || null;

    if (!summary) {
      console.warn("Gemini returned empty summary");
      return null;
    }

    return summary;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("Timeout")) {
        console.error("Timeout while generating summary with Gemini");
        return null;
      }

      console.error("Error generating summary with Gemini:", error.message);
    } else {
      console.error("Unknown error generating summary with Gemini:", error);
    }
    return null;
  }
}

