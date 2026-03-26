import { useState } from "react";

function ContentGeneratorApp() {
  const [selectedMode, setSelectedMode] = useState("instagram");
  const [selectedTone, setSelectedTone] = useState("elegante");
  const [prompt, setPrompt] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [businessGoal, setBusinessGoal] = useState("");
  const [offer, setOffer] = useState("");
  const [result, setResult] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [hooks, setHooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingHooks, setIsGeneratingHooks] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedImagePrompt, setCopiedImagePrompt] = useState(false);
  const [copiedHookIndex, setCopiedHookIndex] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const modes = [
    { id: "instagram", label: "📸 Instagram" },
    { id: "linkedin", label: "💼 LinkedIn" },
    { id: "x", label: "𝕏 Twitter" },
    { id: "tiktok", label: "🎬 TikTok" },
    { id: "email", label: "✉️ Email" },
    { id: "idea", label: "💡 Ideas" },
  ];

  const tones = [
    { id: "elegante", label: "Elegante" },
    { id: "cercano", label: "Cercano" },
    { id: "profesional", label: "Profesional" },
    { id: "creativo", label: "Creativo" },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setImagePrompt("");
    setHooks([]);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: selectedMode,
          tone: selectedTone,
          prompt,
          businessType,
          targetAudience,
          businessGoal,
          offer,
          generateImage: false,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "No se pudo generar el contenido.");
      }

      setResult(data.resultado || "");
      setImagePrompt(data.promptImagen || "");
      setHooks(data.hooks || []);
    } catch (error) {
      setResult("Ha ocurrido un error al generar el contenido.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyResult = async () => {
    if (!result.trim()) return;

    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("No se pudo copiar el contenido.");
    }
  };

  const handleClear = () => {
    setPrompt("");
    setBusinessType("");
    setTargetAudience("");
    setBusinessGoal("");
    setOffer("");
    setResult("");
    setImagePrompt("");
    setHooks([]);
  };

  const handleCopyImagePrompt = async () => {
    if (!imagePrompt.trim()) return;

    try {
      await navigator.clipboard.writeText(imagePrompt);
      setCopiedImagePrompt(true);

      setTimeout(() => {
        setCopiedImagePrompt(false);
      }, 2000);
    } catch (error) {
      console.error("No se pudo copiar el prompt de imagen.");
    }
  };

  const handleGenerateImagePrompt = async () => {
    if (!result.trim() || isGeneratingImage) return;

    setIsGeneratingImage(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: selectedMode,
          tone: selectedTone,
          prompt,
          businessType,
          targetAudience,
          businessGoal,
          offer,
          generateImage: true,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "No se pudo generar el prompt de imagen.");
      }

      setImagePrompt(data.promptImagen || "");
    } catch (error) {
      console.error("Error al generar prompt de imagen:", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleGenerateHooks = async () => {
    if (!result.trim() || isGeneratingHooks) return;

    setIsGeneratingHooks(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: selectedMode,
          tone: selectedTone,
          prompt,
          businessType,
          targetAudience,
          businessGoal,
          offer,
          baseContent: result,
          generateHooks: true,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "No se pudieron generar hooks.");
      }

      setHooks(Array.isArray(data.hooks) ? data.hooks : []);
    } catch (error) {
      console.error("Error al generar hooks:", error);
    } finally {
      setIsGeneratingHooks(false);
    }
  };

  const handleCopyHook = async (hookText, index) => {
    if (!hookText?.trim()) return;

    try {
      await navigator.clipboard.writeText(hookText);
      setCopiedHookIndex(index);

      setTimeout(() => {
        setCopiedHookIndex(null);
      }, 1500);
    } catch (error) {
      console.error("No se pudo copiar el hook.");
    }
  };

  const parsedSections = result
    ? result
        .split(/\n(?=\d+\)\s)/g)
        .map((section) => section.trim())
        .filter(Boolean)
    : [];

  const normalizeText = (text) =>
    text
      .replace(/\*\*/g, "")
      .replace(/^\s*-\s?/gm, "• ")
      .replace(/"{2,}/g, '"');

  return (
    <div className="min-h-screen p-6">
      {/* FONDOS DECORATIVOS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-radial from-teal-600/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-radial from-amber-600/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-12 text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-linear-to-r from-teal-500/20 to-teal-400/10 border-2 border-teal-500 rounded-full">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-300">
              ✨ Suite Inteligente de Contenido
            </p>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 bg-linear-to-r from-white via-teal-300 to-amber-300 bg-clip-text text-transparent">
            Crea contenido que <span className="text-teal-400">vende</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Transforma tu idea en versiones profesionales para cada red social. Sin límites de creatividad.
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* FORM SECTION */}
          <div className="space-y-6">
            {/* STEP 1: Red Social */}
            <div className="bg-slate-800/80 backdrop-blur border-2 border-slate-700 rounded-3xl p-6 hover:border-teal-500 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-teal-500/40">
                  1
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-teal-300">
                  ¿Dónde creces?
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {modes.map((mode) => {
                  const isActive = selectedMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setSelectedMode(mode.id)}
                      className={`px-4 py-2 rounded-full font-semibold text-xs md:text-sm transition-all duration-300 ${
                        isActive
                          ? "bg-teal-500 text-white shadow-md shadow-teal-500/20"
                          : "border border-slate-600 bg-slate-900/45 text-slate-200 hover:border-teal-500/80 hover:text-teal-200"
                      }`}
                    >
                      {mode.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: Tono */}
            <div className="bg-slate-800/80 backdrop-blur border-2 border-slate-700 rounded-3xl p-6 hover:border-teal-500 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-teal-500/40">
                  2
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-teal-300">
                  Tu voz
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {tones.map((tone) => {
                  const isActive = selectedTone === tone.id;
                  return (
                    <button
                      key={tone.id}
                      type="button"
                      onClick={() => setSelectedTone(tone.id)}
                      className={`px-4 py-2 rounded-full font-semibold text-xs md:text-sm transition-all duration-300 ${
                        isActive
                          ? "bg-teal-500 text-white shadow-md shadow-teal-500/20"
                          : "border border-slate-600 bg-slate-900/45 text-slate-200 hover:border-teal-500/80 hover:text-teal-200"
                      }`}
                    >
                      {tone.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: Idea */}
            <div className="bg-slate-800/80 backdrop-blur border-2 border-slate-700 rounded-3xl p-6 hover:border-teal-500 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-teal-500/40">
                  3
                </div>
                <p className="text-sm font-bold text-slate-100">Cuéntame tu idea</p>
              </div>

              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                className="w-full min-h-56 rounded-2xl bg-slate-900/50 border-2 border-slate-600 px-5 py-4 text-slate-100 placeholder:text-slate-500 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all duration-300 resize-none font-medium"
                placeholder="Describe qué quieres publicar. Sé específico y auténtico..."
              />

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isLoading || !prompt.trim()}
                  className={`flex-1 rounded-full px-6 py-3 font-semibold text-sm tracking-wide transition-all duration-300 ${
                    isLoading || !prompt.trim()
                      ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                      : "bg-linear-to-r from-teal-500 to-teal-600 text-white shadow-md shadow-teal-500/25 hover:shadow-lg hover:shadow-teal-500/35"
                  }`}
                >
                  {isLoading ? "⚡ Generando..." : "✨ Generar"}
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded-full border border-teal-500/80 px-5 py-3 font-semibold text-sm text-teal-200 transition-all duration-300 hover:bg-teal-500/12"
                >
                  ↻ Limpiar
                </button>
              </div>
            </div>

            {/* OPCIONES AVANZADAS */}
            <div className="bg-slate-800/80 backdrop-blur border-2 border-slate-700 rounded-3xl p-6 hover:border-teal-500 transition-all duration-300 cursor-pointer">
              <button
                type="button"
                onClick={() => setShowAdvanced((value) => !value)}
                className="flex w-full items-center justify-between"
              >
                <span className="text-sm font-bold text-slate-100">
                  ⚙️ Opciones avanzadas (opcional)
                </span>
                <span className={`text-teal-400 transition-transform duration-300 ${showAdvanced ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </button>

              {showAdvanced && (
                <div className="mt-5 pt-5 border-t border-slate-600 grid grid-cols-2 gap-3">
                  <input
                    value={businessType}
                    onChange={(event) => setBusinessType(event.target.value)}
                    className="col-span-2 sm:col-span-1 rounded-xl bg-slate-900/50 border-2 border-slate-600 px-4 py-3 text-xs font-medium text-slate-100 placeholder:text-slate-500 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                    placeholder="Tu negocio/profesión"
                  />
                  <input
                    value={targetAudience}
                    onChange={(event) => setTargetAudience(event.target.value)}
                    className="col-span-2 sm:col-span-1 rounded-xl bg-slate-900/50 border-2 border-slate-600 px-4 py-3 text-xs font-medium text-slate-100 placeholder:text-slate-500 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                    placeholder="Audiencia objetivo"
                  />
                  <input
                    value={businessGoal}
                    onChange={(event) => setBusinessGoal(event.target.value)}
                    className="col-span-2 sm:col-span-1 rounded-xl bg-slate-900/50 border-2 border-slate-600 px-4 py-3 text-xs font-medium text-slate-100 placeholder:text-slate-500 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                    placeholder="Objetivo"
                  />
                  <input
                    value={offer}
                    onChange={(event) => setOffer(event.target.value)}
                    className="col-span-2 sm:col-span-1 rounded-xl bg-slate-900/50 border-2 border-slate-600 px-4 py-3 text-xs font-medium text-slate-100 placeholder:text-slate-500 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                    placeholder="Oferta/servicio"
                  />
                </div>
              )}
            </div>
          </div>

          {/* PREVIEW SECTION */}
          <div className="bg-white rounded-3xl border-3 border-teal-500 shadow-xl shadow-teal-500/20 overflow-hidden">
            {/* HEADER PREVIEW */}
            <div className="bg-linear-to-r from-teal-50 to-white border-b-3 border-teal-500 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <p className="text-sm font-black uppercase tracking-widest text-teal-600">
                  ✨ Tu contenido
                </p>
              </div>
              {result && (
                <button
                  type="button"
                  onClick={handleCopyResult}
                  className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-300 ${
                    copied
                      ? "bg-teal-500 text-white"
                      : "border border-teal-500 text-teal-600 hover:bg-teal-500/10"
                  }`}
                >
                  {copied ? "✓ Copiado" : "📋 Copiar"}
                </button>
              )}
            </div>

            {/* CONTENT PREVIEW */}
            <div className="p-6 relative">
              <div className="relative z-10">
                {!result && (
                  <div className="rounded-2xl border-2 border-dashed border-teal-300 bg-linear-to-br from-teal-50 to-white p-8 text-center">
                    <p className="text-lg text-teal-600 font-bold">
                      🎯 Tu contenido aparecerá aquí
                    </p>
                    <p className="text-sm text-teal-500/70 mt-2">
                      Red social → Tono → Idea → Magia lista
                    </p>
                  </div>
                )}

                {result && parsedSections.length > 1 && (
                  <div className="space-y-4">
                    {parsedSections.map((section, index) => {
                      const [rawTitle, ...rawBody] = section.split("\n");
                      const title = normalizeText(rawTitle.replace(/^\d+\)\s*/, ""));
                      const body = normalizeText(rawBody.join("\n"));

                      return (
                        <article
                          key={`${title}-${index}`}
                          className="rounded-xl border border-teal-500/20 bg-white p-6 hover:shadow-lg hover:shadow-teal-500/10 transition-all"
                        >
                          <h3 className="text-sm font-black text-teal-600 uppercase tracking-wider">
                            {index + 1}. {title}
                          </h3>
                          <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-slate-900 font-semibold">
                            {body}
                          </p>
                        </article>
                      );
                    })}
                  </div>
                )}

                {result && parsedSections.length <= 1 && (
                  <div className="rounded-xl border border-teal-500/20 bg-white p-10">
                    <p className="whitespace-pre-line text-lg leading-relaxed text-slate-900 font-semibold">
                      {normalizeText(result)}
                    </p>
                  </div>
                )}

                {result && !imagePrompt && !isGeneratingImage && (
                  <button
                    type="button"
                    onClick={handleGenerateImagePrompt}
                    className="mt-4 w-full rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-700 transition-all duration-300 hover:bg-cyan-500/20 hover:border-cyan-500/60"
                  >
                    🎨 Crear prompt visual
                  </button>
                )}

                {result && hooks.length === 0 && !isGeneratingHooks && (
                  <button
                    type="button"
                    onClick={handleGenerateHooks}
                    className="mt-3 w-full rounded-xl border border-teal-500/35 bg-teal-500/10 px-4 py-3 text-sm font-semibold text-teal-700 transition-all duration-300 hover:bg-teal-500/20 hover:border-teal-500/55"
                  >
                    🎯 Generar 5 hooks
                  </button>
                )}

                {isGeneratingHooks && (
                  <div className="mt-3 rounded-xl border border-teal-500/25 bg-teal-50 p-4 text-sm font-semibold text-teal-700">
                    Generando hooks...
                  </div>
                )}

                {hooks.length > 0 && (
                  <div className="mt-4 rounded-xl border border-teal-500/25 bg-linear-to-br from-teal-50 to-white p-6">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-black uppercase tracking-wider text-teal-700">
                        5 hooks sugeridos
                      </p>
                      <button
                        type="button"
                        onClick={handleGenerateHooks}
                        className="rounded-full border border-teal-500 px-3 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-500/10"
                      >
                        Regenerar
                      </button>
                    </div>

                    <div className="mt-3 space-y-2">
                      {hooks.map((hook, index) => (
                        <div
                          key={`${hook}-${index}`}
                          className="flex items-start justify-between gap-3 rounded-lg border border-teal-500/20 bg-white/90 p-3"
                        >
                          <p className="text-sm font-semibold leading-relaxed text-slate-800">
                            {index + 1}. {hook}
                          </p>
                          <button
                            type="button"
                            onClick={() => handleCopyHook(hook, index)}
                            className="shrink-0 rounded-full border border-teal-500 px-2.5 py-1 text-xs font-semibold text-teal-700 hover:bg-teal-500/10"
                          >
                            {copiedHookIndex === index ? "✓" : "Copiar"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {imagePrompt && !isLoading && (
                  <div className="mt-4 rounded-xl border border-cyan-500/25 bg-linear-to-br from-cyan-50 to-white p-6">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-black uppercase tracking-wider text-cyan-700">
                        Prompt visual listo para usar
                      </p>
                      <button
                        type="button"
                        onClick={handleCopyImagePrompt}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${
                          copiedImagePrompt
                            ? "bg-cyan-600 text-white"
                            : "border border-cyan-500 text-cyan-700 hover:bg-cyan-500/10"
                        }`}
                      >
                        {copiedImagePrompt ? "✓ Copiado" : "📋 Copiar texto"}
                      </button>
                    </div>

                    <p className="mt-2 text-xs text-cyan-700/80 font-medium">
                      Usalo en tu herramienta de imagen favorita.
                    </p>

                    <p className="mt-3 whitespace-pre-line rounded-lg border border-cyan-500/20 bg-white/80 p-4 text-sm leading-relaxed text-slate-800 font-medium">
                      {normalizeText(imagePrompt)}
                    </p>
                  </div>
                )}

                {isLoading && (
                  <div className="rounded-2xl border-2 border-dashed border-teal-300 bg-linear-to-br from-teal-50 to-white p-8 text-center">
                    <p className="text-lg text-teal-600 font-bold animate-pulse">
                      ⚡ Generando contenido...
                    </p>
                    <p className="text-sm text-teal-500/70 mt-2">
                      Estamos creando algo especial para ti
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentGeneratorApp;