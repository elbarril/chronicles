import { AppError } from "@/lib/error";

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const GEMINI_MODEL = "gemini-2.0-flash";

export interface GeminiGenerateRequest {
  apiKey: string;
  prompt: string;
}

interface GeminiApiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
}

export async function generateText(request: GeminiGenerateRequest): Promise<string> {
  const url = `${GEMINI_API_BASE}/${GEMINI_MODEL}:generateContent?key=${request.apiKey}`;

  let response: Response;

  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: request.prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    });
  } catch {
    throw new AppError("AI_GENERATION_FAILED", "Network error contacting Gemini API.");
  }

  const data: GeminiApiResponse = (await response.json()) as GeminiApiResponse;

  if (!response.ok) {
    const status = data.error?.status ?? "";
    if (response.status === 400 && status === "INVALID_ARGUMENT") {
      throw new AppError("AI_KEY_INVALID", "Gemini API key is invalid or malformed.");
    }
    if (response.status === 403 || status === "PERMISSION_DENIED") {
      throw new AppError("AI_KEY_INVALID", "Gemini API key is not authorized.");
    }
    if (response.status === 429 || status === "RESOURCE_EXHAUSTED") {
      throw new AppError("AI_RATE_LIMITED", "Gemini API rate limit or quota exceeded.");
    }
    throw new AppError(
      "AI_GENERATION_FAILED",
      `Gemini API error: ${data.error?.message ?? response.statusText}`,
    );
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text || text.trim() === "") {
    throw new AppError("AI_GENERATION_FAILED", "Gemini returned an empty response.");
  }

  return text.trim();
}
