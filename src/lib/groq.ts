export async function generateWithGroq({
  mode,
  tone,
  prompt,
  businessType,
  targetAudience,
  businessGoal,
  offer,
}: {
  mode: string;
  tone: string;
  prompt: string;
  businessType?: string;
  targetAudience?: string;
  businessGoal?: string;
  offer?: string;
}) {
  if (!import.meta.env.GROQ_API_KEY) {
    throw new Error("Falta GROQ_API_KEY en el entorno.");
  }

  const modeInstructions: Record<string, string> = {
    instagram:
      "Genera contenido para Instagram orientado a crecimiento, comunidad y conversion.",
    linkedin:
      "Genera contenido para LinkedIn enfocado en autoridad, confianza y oportunidades de negocio.",
    x: "Genera contenido para X/Twitter que sea directo, valioso y con alto potencial de interaccion.",
    tiktok:
      "Genera guion corto para video tipo TikTok/Reel con gancho inicial, desarrollo y cierre con accion recomendada.",
    email: "Genera un email bien redactado, claro y natural.",
    idea:
      "Genera ideas de contenido utiles, originales y faciles de ejecutar para negocio en redes.",
  };

  const toneInstructions: Record<string, string> = {
    elegante: "Usa un tono elegante, cuidado y natural.",
    cercano: "Usa un tono cercano, amable y fácil de leer.",
    profesional: "Usa un tono profesional, claro y confiable.",
    creativo: "Usa un tono creativo, fresco y con personalidad.",
  };

  const instruction =
    modeInstructions[mode] ||
    "Genera contenido util, claro y bien redactado en espanol para crecimiento en redes.";

  const toneInstruction =
    toneInstructions[tone] || "Usa un tono natural y bien equilibrado.";

  const modeOutputRules: Record<string, string> = {
    instagram:
      "Texto principal: 80-160 palabras, con estructura facil de leer y accion recomendada al final. Hashtags: 8-12.",
    linkedin:
      "Texto principal: 120-220 palabras, profesional, con aprendizajes claros y accion recomendada final. Hashtags: 3-6.",
    x:
      "Texto principal: maximo 260 caracteres. Una sola idea, directo, sin relleno. Accion recomendada: maximo 80 caracteres. Hashtags: 2-4. Version alternativa breve: maximo 140 caracteres.",
    tiktok:
      "Texto principal como guion corto: gancho (1 linea), desarrollo (2-4 lineas), cierre con accion recomendada (1 linea). Hashtags: 4-8.",
    email:
      "Texto principal en formato email: asunto sugerido + cuerpo claro + accion recomendada final. Hashtags: no incluir.",
    idea:
      "Entrega una idea accionable con pasos concretos de ejecucion. Hashtags: 3-6 opcionales.",
  };

  const outputRule =
    modeOutputRules[mode] ||
    "Respuesta clara y accionable, ajustada al canal elegido y sin texto innecesario.";

  const creativeAngles = [
    "mito vs realidad",
    "error comun y solucion simple",
    "antes y despues",
    "mini historia realista",
    "lista rapida de pasos",
    "pregunta incomoda que activa accion",
    "objecion tipica y respuesta",
    "beneficio concreto en 7 dias",
  ];

  const hookStylesByMode: Record<string, string[]> = {
    instagram: [
      "gancho emocional",
      "gancho aspiracional",
      "gancho de transformacion",
    ],
    linkedin: [
      "gancho profesional",
      "gancho de aprendizaje",
      "gancho de credibilidad",
    ],
    x: ["gancho directo", "dato contundente", "opinion util"],
    tiktok: ["gancho de 3 segundos", "gancho visual", "gancho de problema"],
    email: ["asunto con beneficio", "asunto con curiosidad", "asunto con urgencia"],
    idea: ["angulo inesperado", "angulo practico", "angulo de nicho"],
  };

  const strategyContext = [
    businessType ? `Tipo de negocio/profesion: ${businessType}` : null,
    targetAudience ? `Audiencia ideal: ${targetAudience}` : null,
    businessGoal ? `Objetivo principal: ${businessGoal}` : null,
    offer ? `Oferta o servicio clave: ${offer}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const seedSource = `${prompt}|${businessType || ""}|${targetAudience || ""}|${businessGoal || ""}|${offer || ""}|${Date.now()}`;
  const hash = Array.from(seedSource).reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0
  );
  const selectedAngle = creativeAngles[hash % creativeAngles.length];
  const hookOptions = hookStylesByMode[mode] || ["gancho claro"];
  const selectedHook = hookOptions[hash % hookOptions.length];

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "Eres un estratega de contenido para redes sociales enfocado en pequenos negocios, influencers y profesionales que no dominan marketing digital. Responde siempre en espanol claro y accionable. Entrega textos listos para publicar y faciles de ejecutar. Si la solicitud del usuario es simple, responde de forma breve. No te enrolles. Prohibido usar plantillas genericas repetitivas.",
        },
        {
          role: "user",
          content: `${instruction}\n${toneInstruction}\n\nReglas del canal elegido:\n${outputRule}\n\nVariacion creativa obligatoria para esta respuesta:\n- Angulo: ${selectedAngle}\n- Tipo de gancho: ${selectedHook}\n\nContexto de negocio:\n${strategyContext || "No proporcionado."}\n\nSolicitud del usuario:\n${prompt}\n\nDevuelve la respuesta usando este formato exacto:\n1) Idea central\n2) Texto principal listo para publicar\n3) Accion recomendada\n4) Hashtags sugeridos\n5) Version alternativa breve\n6) Prompt para generar imagen en otra IA\n\nReglas obligatorias finales:\n- Cumple los limites del canal sin excepcion.\n- Si superas un limite, reescribe antes de responder.\n- No agregues explicaciones fuera de los 6 puntos.\n- Evita frases vacias como: "descubre", "transforma tu estrategia", "no te pierdas la oportunidad" salvo que el contexto lo justifique.\n- Usa minimo 2 detalles concretos del negocio o de la solicitud (producto, problema, audiencia, resultado u oferta).\n- Hashtags: prioriza nicho y contexto real; evita listas genericas.`,
        },
      ],
      temperature: 0.9,
      top_p: 0.95,
      max_tokens: mode === "x" ? 320 : 700,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Error al consultar Groq.");
  }

  return data?.choices?.[0]?.message?.content?.trim() || "";
}