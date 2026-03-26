import type { APIRoute } from "astro";
import {
  generateHooksWithGroq,
  generateImagePromptWithGroq,
  generateWithGroq,
  type GenerateWithGroqParams,
} from "../../lib/groq";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // Validación: el prompt es obligatorio
    if (!body?.prompt || typeof body.prompt !== "string") {
      return new Response(
        JSON.stringify({ ok: false, error: "El prompt es obligatorio." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Valores por defecto sensatos
    const params: GenerateWithGroqParams = {
      mode: (body?.mode ?? "instagram") as GenerateWithGroqParams["mode"],
      tone: (body?.tone ?? "elegante") as GenerateWithGroqParams["tone"],
      prompt: body.prompt.trim(),
      businessType: body?.businessType ?? undefined,
      targetAudience: body?.targetAudience ?? undefined,
      businessGoal: body?.businessGoal ?? undefined,
      offer: body?.offer ?? undefined,
    };

    const baseContent =
      typeof body?.baseContent === "string" ? body.baseContent.trim() : "";

    // Si ya hay contenido en frontend, lo reutilizamos para acciones auxiliares.
    const resultado = baseContent || (await generateWithGroq(params));

    // Prompt de imagen: opcional, solo si el usuario lo pidió explícitamente.
    // Si falla, no bloquea el resultado principal.
    const generateImage = body?.generateImage === true;
    let promptImagen = "";
    if (generateImage) {
      try {
        promptImagen = await generateImagePromptWithGroq(params, resultado);
      } catch {
        promptImagen = "";
      }
    }

    const generateHooks = body?.generateHooks === true;
    let hooks: string[] = [];
    if (generateHooks) {
      try {
        hooks = await generateHooksWithGroq(params, resultado);
      } catch {
        hooks = [];
      }
    }

    // Respuesta consistente: ok:true con resultado
    return new Response(
      JSON.stringify({
        ok: true,
        resultado,
        promptImagen,
        hooks,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    // Manejo de errores robusto
    const mensaje =
      error instanceof Error ? error.message : "Error al procesar la solicitud.";

    return new Response(
      JSON.stringify({
        ok: false,
        error: mensaje,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};