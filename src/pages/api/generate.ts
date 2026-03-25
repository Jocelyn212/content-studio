import type { APIRoute } from "astro";
import { generateWithGroq } from "../../lib/groq";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const mode = body?.mode ?? "instagram";
    const tone = body?.tone ?? "elegante";
    const prompt = body?.prompt ?? "";
    const businessType = body?.businessType ?? "";
    const targetAudience = body?.targetAudience ?? "";
    const businessGoal = body?.businessGoal ?? "";
    const offer = body?.offer ?? "";

    if (!prompt || typeof prompt !== "string") {
      return new Response(
        JSON.stringify({ error: "El prompt es obligatorio." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const result = await generateWithGroq({
      mode,
      tone,
      prompt,
      businessType,
      targetAudience,
      businessGoal,
      offer,
    });
    return new Response(
      JSON.stringify({ result }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Error al procesar la solicitud.";

    return new Response(
      JSON.stringify({ error: message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};