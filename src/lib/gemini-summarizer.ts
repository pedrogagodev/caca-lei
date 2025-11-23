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

export async function generateDidacticSummaryFromText(
  text: string | null | undefined,
): Promise<string | null> {
  if (!text || typeof text !== "string" || text.trim() === "") {
    console.warn("Invalid text provided for didactic summarization");
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
      prompt: `Você é um assistente especializado em explicar leis brasileiras de forma simples e didática para pessoas leigas.

Crie um resumo didático sobre a seguinte proposição de lei em português brasileiro. O texto deve:

1. COMEÇAR com um gancho inicial chamativo e envolvente (pode ser uma pergunta retórica, uma afirmação impactante, ou uma curiosidade) para prender a atenção do usuário
2. Usar linguagem SIMPLES e CLARA, sem juridiquês ou termos técnicos complexos
3. Explicar o que a lei faz de forma que QUALQUER PESSOA possa entender, mesmo sem conhecimento jurídico
4. Ter aproximadamente 100-200 palavras (para ser lido em 40 segundos a 1 minuto e meio em velocidade normal de narração)
5. Ser direto, objetivo e envolvente

Texto da proposição de lei:

${text.substring(0, 100000)}`,
    });

    const result = await Promise.race([apiCallPromise, timeoutPromise]);

    const summary = result.text?.trim() || null;

    if (!summary) {
      console.warn("Gemini returned empty didactic summary");
      return null;
    }

    return summary;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("Timeout")) {
        console.error("Timeout while generating didactic summary with Gemini");
        return null;
      }

      console.error("Error generating didactic summary with Gemini:", error.message);
    } else {
      console.error("Unknown error generating didactic summary with Gemini:", error);
    }
    return null;
  }
}

