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
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const modes = [
    { id: "instagram", label: "Instagram" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "x", label: "X / Twitter" },
    { id: "tiktok", label: "TikTok" },
    { id: "email", label: "Email" },
    { id: "idea", label: "Ideas de contenido" },
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
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "No se pudo generar el contenido.");
      }

      setResult(data.result || "");
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

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="rounded-[28px] border border-studio-line bg-studio-sand p-5">
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-studio-ink">Modos</p>
            <p className="mt-1 text-sm leading-6 text-studio-muted">
              Elige el tipo de contenido que quieres crear.
            </p>
          </div>

          <div className="space-y-3">
            {modes.map((mode) => {
              const isActive = selectedMode === mode.id;

              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setSelectedMode(mode.id)}
                  className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                    isActive
                      ? "bg-studio-clay text-white"
                      : "border border-studio-line bg-white text-studio-ink"
                  }`}
                >
                  {mode.label}
                </button>
              );
            })}
          </div>

          <div className="border-t border-studio-line pt-6">
            <p className="text-sm font-medium text-studio-ink">Tono</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {tones.map((tone) => {
                const isActive = selectedTone === tone.id;

                return (
                  <button
                    key={tone.id}
                    type="button"
                    onClick={() => setSelectedTone(tone.id)}
                    className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                      isActive
                        ? "bg-studio-ink text-white"
                        : "border border-studio-line bg-white text-studio-muted"
                    }`}
                  >
                    {tone.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </aside>

      <div className="grid gap-6">
        <div className="rounded-[28px] border border-studio-line bg-white p-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-studio-ink">Tu idea</p>
              <p className="mt-1 text-sm leading-6 text-studio-muted">
                Describe brevemente lo que quieres crear.
              </p>
            </div>

            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              className="min-h-45 w-full resize-none rounded-3xl border border-studio-line bg-studio-cream px-5 py-4 text-sm text-studio-ink outline-none placeholder:text-studio-muted"
              placeholder="Ejemplo: quiero un post para Instagram sobre una cafetería de especialidad con tono cercano y elegante..."
            />

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isLoading}
                className="rounded-full bg-studio-clay px-6 py-3 text-sm font-medium text-white transition hover:bg-studio-clay-dark disabled:opacity-50"
              >
                {isLoading ? "Generando..." : "Generar"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setPrompt("");
                  setBusinessType("");
                  setTargetAudience("");
                  setBusinessGoal("");
                  setOffer("");
                  setResult("");
                }}
                className="rounded-full border border-studio-line px-6 py-3 text-sm font-medium text-studio-ink"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-studio-line bg-white p-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-studio-ink">
                Contexto del negocio
              </p>
              <p className="mt-1 text-sm leading-6 text-studio-muted">
                Completa esto una vez y la IA te devolvera contenido mas util para
                crecer en redes.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={businessType}
                onChange={(event) => setBusinessType(event.target.value)}
                className="w-full rounded-2xl border border-studio-line bg-studio-cream px-4 py-3 text-sm text-studio-ink outline-none placeholder:text-studio-muted"
                placeholder="Tu negocio/profesion (ej: nutricionista, tienda de ropa)"
              />

              <input
                value={targetAudience}
                onChange={(event) => setTargetAudience(event.target.value)}
                className="w-full rounded-2xl border border-studio-line bg-studio-cream px-4 py-3 text-sm text-studio-ink outline-none placeholder:text-studio-muted"
                placeholder="Audiencia objetivo (ej: mujeres 25-40 emprendedoras)"
              />

              <input
                value={businessGoal}
                onChange={(event) => setBusinessGoal(event.target.value)}
                className="w-full rounded-2xl border border-studio-line bg-studio-cream px-4 py-3 text-sm text-studio-ink outline-none placeholder:text-studio-muted"
                placeholder="Objetivo (ventas, leads, visibilidad, autoridad)"
              />

              <input
                value={offer}
                onChange={(event) => setOffer(event.target.value)}
                className="w-full rounded-2xl border border-studio-line bg-studio-cream px-4 py-3 text-sm text-studio-ink outline-none placeholder:text-studio-muted"
                placeholder="Oferta/servicio principal"
              />
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-studio-line bg-white p-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-studio-ink">Resultado</p>
              <p className="mt-1 text-sm leading-6 text-studio-muted">
                Aquí mostraremos la respuesta generada.
              </p>
            </div>

            <div className="rounded-3xl bg-studio-cream p-5">
              <p className="whitespace-pre-line text-sm leading-7 text-studio-muted">
                {result || "Todavía no has generado contenido."}
              </p>

              {result && (
                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCopyResult}
                    className="rounded-full border border-studio-line bg-white px-4 py-2 text-xs font-medium text-studio-ink transition hover:bg-studio-blush"
                  >
                    {copied ? "Copiado" : "Copiar resultado"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentGeneratorApp;