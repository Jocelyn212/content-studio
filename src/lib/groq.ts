/**
 * Tipos para el generador de contenido
 */
type ContentMode = "instagram" | "linkedin" | "x" | "tiktok" | "email" | "idea";
type ContentTone = "elegante" | "cercano" | "profesional" | "creativo";

interface GenerateWithGroqParams {
  mode: ContentMode;
  tone: ContentTone;
  prompt: string;
  businessType?: string;
  targetAudience?: string;
  businessGoal?: string;
  offer?: string;
}

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  error?: {
    message: string;
  };
}

type AIProvider = "auto" | "groq" | "openrouter";

/**
 * Mapeo de tonos a instrucciones claras
 */
const toneInstructions: Record<ContentTone, string> = {
  elegante: "Tono elegante, cuidado y natural.",
  cercano: "Tono cercano, amable y fácil de leer.",
  profesional: "Tono profesional, claro y confiable.",
  creativo: "Tono creativo, fresco y con personalidad.",
};

/**
 * Construye el prompt específico para cada modo
 * Instrucciones claras y directas, sin over-engineering
 */
const buildPromptByMode = (
  mode: ContentMode,
  tone: ContentTone,
  params: GenerateWithGroqParams
): string => {
  const toneText = toneInstructions[tone] || "Tono natural y equilibrado.";
  const contextLines = [
    params.businessType && `Negocio: ${params.businessType}`,
    params.targetAudience && `Audiencia: ${params.targetAudience}`,
    params.businessGoal && `Objetivo: ${params.businessGoal}`,
    params.offer && `Oferta: ${params.offer}`,
  ]
    .filter(Boolean)
    .join("\n");

  const context = contextLines ? `\nContexto:\n${contextLines}` : "";

  const modePrompts: Record<ContentMode, string> = {
    instagram: `Genera contenido para Instagram que valga la pena compartir.
Límites: 80-160 palabras, estructura clara, gancho inicial, acción recomendada, 8-12 hashtags.
${toneText}
Solicitud: ${params.prompt}${context}
Devuelve SOLO el contenido listo para publicar. Sin explicaciones.`,

    linkedin: `Genera contenido profesional para LinkedIn que genere engagement.
Límites: 120-220 palabras, tono de autoridad, aprendizaje claro, acción recomendada, 3-6 hashtags.
${toneText}
Solicitud: ${params.prompt}${context}
Devuelve SOLO el contenido listo para publicar. Sin explicaciones.`,

    x: `Genera un tweet/X que impacte.
Límites: Máx 260 caracteres para el contenido principal. Una sola idea, directa, sin relleno. Acción recomendada: máx 80 caracteres. Hashtags: 2-4.
${toneText}
Solicitud: ${params.prompt}${context}
Devuelve SOLO el tweet y la acción. Sin explicaciones.`,

    tiktok: `Genera un guion corto para un video TikTok/Reel.
Límites: Gancho inicial (1 línea), desarrollo (2-4 líneas), cierre con acción (1 línea). Hashtags: 4-8.
${toneText}
Solicitud: ${params.prompt}${context}
Devuelve SOLO el guion listo para filmar. Sin explicaciones.`,

    email: `Genera un email profesional, claro y natural.
Estructura: Asunto sugerido + cuerpo claro + acción recomendada final.
${toneText}
Solicitud: ${params.prompt}${context}
Devuelve SOLO el email. Sin explicaciones adicionales.`,

    idea: `Genera un banco de ideas de contenido útiles, originales y ejecutables.
Entrega: 10-12 ideas diferentes (variar ángulos, formatos, objetivos).
Incluye para cada idea: título, ángulo, formato sugerido (reel/carrusel/post/hilo), gancho inicial.
${toneText}
Solicitud: ${params.prompt}${context}
Devuelve SOLO las ideas en formato claro. Sin explicaciones. Alterna vocabulario, no repitas estructura.`,
  };

  return modePrompts[mode] || modePrompts.instagram;
};

const callGroqOnly = async ({
  userMessage,
  maxTokens,
  temperature,
}: {
  userMessage: string;
  maxTokens: number;
  temperature: number;
}): Promise<string> => {
  const apiKey = import.meta.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY no está configurado.");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "user",
              content: userMessage,
            },
          ],
          temperature,
          top_p: 0.9,
          max_tokens: maxTokens,
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    const data = (await response.json()) as GroqResponse;

    if (!response.ok) {
      throw new Error(data?.error?.message || `Error en Groq: ${response.status}`);
    }

    const content = data?.choices?.[0]?.message?.content?.trim();

    if (!content) {
      throw new Error("Groq devolvió una respuesta vacía.");
    }

    return content;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("La solicitud a Groq tardó demasiado tiempo.");
      }
      throw error;
    }

    throw new Error("Error desconocido al consultar Groq.");
  }
};

const callOpenRouter = async ({
  userMessage,
  maxTokens,
  temperature,
}: {
  userMessage: string;
  maxTokens: number;
  temperature: number;
}): Promise<string> => {
  const apiKey = import.meta.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY no está configurado.");
  }

  const openRouterModel =
    import.meta.env.OPENROUTER_MODEL || "openrouter/free";
  const referer = import.meta.env.OPENROUTER_SITE_URL || "http://localhost:4321";

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": referer,
          "X-Title": "Content Studio",
        },
        body: JSON.stringify({
          model: openRouterModel,
          messages: [
            {
              role: "user",
              content: userMessage,
            },
          ],
          temperature,
          top_p: 0.9,
          max_tokens: maxTokens,
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    const data = (await response.json()) as GroqResponse;

    if (!response.ok) {
      throw new Error(data?.error?.message || `Error en OpenRouter: ${response.status}`);
    }

    const content = data?.choices?.[0]?.message?.content?.trim();

    if (!content) {
      throw new Error("OpenRouter devolvió una respuesta vacía.");
    }

    return content;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("La solicitud a OpenRouter tardó demasiado tiempo.");
      }
      throw error;
    }

    throw error;
  }
};

const callAI = async ({
  provider,
  userMessage,
  maxTokens,
  temperature,
}: {
  provider: AIProvider;
  userMessage: string;
  maxTokens: number;
  temperature: number;
}): Promise<string> => {
  if (provider === "groq") {
    return callGroqOnly({ userMessage, maxTokens, temperature });
  }

  if (provider === "openrouter") {
    return callOpenRouter({ userMessage, maxTokens, temperature });
  }

  try {
    return await callGroqOnly({ userMessage, maxTokens, temperature });
  } catch (groqError) {
    console.warn("Groq falló en modo auto. Se usará OpenRouter.", groqError);
    return callOpenRouter({ userMessage, maxTokens, temperature });
  }
};

const buildImagePrompt = (
  params: GenerateWithGroqParams,
  generatedContent: string
): string => {
  const contextLines = [
    params.businessType && `Negocio: ${params.businessType}`,
    params.targetAudience && `Audiencia: ${params.targetAudience}`,
    params.businessGoal && `Objetivo: ${params.businessGoal}`,
    params.offer && `Oferta: ${params.offer}`,
  ]
    .filter(Boolean)
    .join("\n");

  return `Crea UN SOLO prompt para generar imagen en IA (Midjourney/Flux/SDXL), en español, listo para copiar.
Modo de contenido: ${params.mode}
Tono: ${params.tone}
Idea original del usuario: ${params.prompt}
Contenido generado para redes: ${generatedContent}
${contextLines ? `Contexto de marca:\n${contextLines}` : ""}

Reglas:
- Devuelve solo el prompt final, sin introducciones.
- Máximo 60 palabras.
- Debe ser visual, concreto, comercial y coherente con la publicación.
- Incluye estilo visual, iluminación, encuadre y emoción.
- No uses listas ni comillas.`;
};

const buildHooksPrompt = (
  params: GenerateWithGroqParams,
  generatedContent: string
): string => {
  return `Genera exactamente 5 variantes de hook (primera frase) para este contenido.
Modo: ${params.mode}
Tono: ${params.tone}
Idea original: ${params.prompt}
Contenido base: ${generatedContent}

Reglas obligatorias:
- Devuelve solo 5 lineas.
- Una variante por linea.
- Cada hook debe tener maximo 16 palabras.
- Sin explicaciones, sin titulos, sin texto adicional.
- No repitas estructuras ni palabras iniciales en todas las lineas.`;
};

const parseHooks = (raw: string): string[] => {
  const cleaned = raw
    .split("\n")
    .map((line) =>
      line
        .trim()
        .replace(/^[-*]\s*/, "")
        .replace(/^\d+[.)]\s*/, "")
        .replace(/^"|"$/g, "")
    )
    .filter(Boolean);

  return Array.from(new Set(cleaned)).slice(0, 5);
};

/**
 * Genera contenido con Groq
 * Entrada desde el frontend → Prompt específico → Respuesta directa
 */
export async function generateWithGroq(
  params: GenerateWithGroqParams,
  provider: AIProvider = "auto"
): Promise<string> {
  // Validaciones básicas
  if (!params.prompt || typeof params.prompt !== "string") {
    throw new Error("El prompt es obligatorio y debe ser texto.");
  }

  // Construir el prompt según el modo
  const userMessage = buildPromptByMode(
    params.mode,
    params.tone,
    params
  );

  // Configurar timeouts y limite de tokens por modo
  const maxTokensByMode: Record<ContentMode, number> = {
    instagram: 500,
    linkedin: 700,
    x: 320,
    tiktok: 400,
    email: 600,
    idea: 1100,
  };

  const maxTokens = maxTokensByMode[params.mode] || 700;
  return callAI({
    provider,
    userMessage,
    maxTokens,
    temperature: 0.4,
  });
}

export async function generateImagePromptWithGroq(
  params: GenerateWithGroqParams,
  generatedContent: string,
  provider: AIProvider = "auto"
): Promise<string> {
  if (!generatedContent?.trim()) {
    throw new Error("Se necesita contenido generado para crear el prompt de imagen.");
  }

  const userMessage = buildImagePrompt(params, generatedContent);

  return callAI({
    provider,
    userMessage,
    maxTokens: 180,
    temperature: 0.35,
  });
}

export async function generateHooksWithGroq(
  params: GenerateWithGroqParams,
  generatedContent: string,
  provider: AIProvider = "auto"
): Promise<string[]> {
  if (!generatedContent?.trim()) {
    throw new Error("Se necesita contenido generado para crear hooks.");
  }

  const userMessage = buildHooksPrompt(params, generatedContent);

  const raw = await callAI({
    provider,
    userMessage,
    maxTokens: 220,
    temperature: 0.45,
  });

  const hooks = parseHooks(raw);

  if (!hooks.length) {
    throw new Error("No se pudieron generar hooks.");
  }

  return hooks;
}

export type { AIProvider, GenerateWithGroqParams };