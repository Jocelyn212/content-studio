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
* **Demo en producción:** [https://contentstudio-contentstudio-wnym98-d7f272-45-90-237-140.traefik.me/](https://contentstudio-contentstudio-wnym98-d7f272-45-90-237-140.traefik.me/)

![Interfaz Principal](https://res.cloudinary.com/pruebaweb/image/upload/v1774488671/Im%C3%A1genes%20de%20proyectos/Captura_de_pantalla_2026-03-25_a_las_20.48.38_zuqvuf.png)

---

## 📦 Despliegue e Infraestructura

El despliegue se realizó con este flujo:

1.  **Creación de VPS en CubePath:** Se aprovisionó la máquina virtual donde corre el proyecto.
2.  **Instalación y configuración de Dokploy:** Se levantó Dokploy para gestionar el servicio y las variables de entorno.
3.  **Conexión con GitHub:** Se vinculó el repositorio para automatizar despliegues desde cambios en el código.
4.  **Publicación en producción:** La aplicación quedó expuesta en una URL pública administrada desde Dokploy.


---

## 🚀 Configuración y Ejecución

### 1. Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto:
```env
GROQ_API_KEY=tu_api_key
OPENROUTER_API_KEY=tu_api_key
