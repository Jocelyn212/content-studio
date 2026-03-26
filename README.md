# 🚀 Content Suite AI

> **Deja de pelear con la IA y empieza a crear.**

Content Suite AI ayuda a creadores y PYMES a convertir una idea suelta en publicaciones profesionales listas para usar. Sin prompts complejos, sin tokens desperdiciados y sin conversaciones infinitas. 

El enfoque es radicalmente simple: **menos fricción, más velocidad y contenido accionable para publicar hoy mismo.**

---

## ✨ Características Principales

* **⚡ Generación Omnicanal:** Crea contenido optimizado para Instagram, LinkedIn, X, TikTok y Email Marketing desde una sola interfaz.
* **🎭 Ingeniería de Tono:** Elige entre voces *Elegante, Cercano, Profesional o Creativo* para que la IA se adapte a tu marca.
* **🎯 Contexto de Negocio:** Refina las respuestas inyectando audiencia, objetivos y ofertas específicas.
* **🧲 Factor Hook:** Generador opcional de 5 ganchos (hooks) magnéticos para maximizar el impacto de la primera frase.
* **🎨 Visual Prompting:** Generador de prompts visuales optimizados para herramientas externas de generación de imágenes (Midjourney, DALL-E, etc.).
* **🛡️ Alta Disponibilidad:** Sistema de *fallback* automático. Si un proveedor de IA falla, la suite conmuta al siguiente para garantizar el servicio.

---

## 🛠️ Stack Tecnológico

* **Frontend:** [Astro](https://astro.build/) & [React](https://reactjs.org/)
* **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
* **IA (LLMs):** [Groq](https://groq.com/) & [OpenRouter](https://openrouter.ai/)
* **Infraestructura:** [Dokploy](https://dokploy.com/) sobre VPS en [CubePath](https://cubepath.com/)

---

## 📸 Demo y Capturas

* **Demo Local:** `http://localhost:4321`
* **Demo Online:** [AGREGAR_URL_PUBLICA_AQUÍ]

![Interfaz Principal](https://res.cloudinary.com/pruebaweb/image/upload/v1774488671/Im%C3%A1genes%20de%20proyectos/Captura_de_pantalla_2026-03-25_a_las_20.48.38_zuqvuf.png)

---

## 📦 Despliegue e Infraestructura

El proyecto utiliza un flujo de despliegue moderno y simplificado:

1.  **CubePath:** Provisión de la máquina virtual (VPS) y red base.
2.  **Dokploy:** Orquestación del despliegue, gestión del servicio y variables de entorno.
3.  **Resultado:** Publicación continua (CD) y administración simple desde panel web.

> Consulta en `public/demo` las capturas del panel de Dokploy para documentar el flujo de despliegue end-to-end.

---

## 🚀 Configuración y Ejecución

### 1. Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto:
```env
GROQ_API_KEY=tu_api_key
OPENROUTER_API_KEY=tu_api_key
