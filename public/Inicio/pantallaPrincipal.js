document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("http://localhost:5000/api/configuracion");

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const configs = await response.json();
    const config = configs[0] || {
      dependencia: "IXTLÁN DE JUÁREZ",
      lema: '"INNOVACIÓN Y TRANSFORMACIÓN EN COMUNIDAD"',
    };

    // Actualizar los elementos del DOM
    document.getElementById("municipio").textContent = config.dependencia;
    document.getElementById("lema").textContent = config.lema;

    /*Opcional: actualiza el logo en pantalla principal (si lo tienes en esta vista)
    const logo = document.querySelector(".logo-left img");
    if (logo) {
      logo.src = config.logotipo + "?t=" + Date.now();
    }

    // Escuchar notificaciones por BroadcastChannel
    if (typeof BroadcastChannel !== "undefined") {
      const channel = new BroadcastChannel("logo_updates");
      channel.addEventListener("message", (event) => {
        if (event.data.type === "logo_update") {
          window.location.reload(); // Para reflejar lema, dependencia y logo
        }
      });
    }*/
  } catch (error) {
    console.error(
      "Error al cargar configuración en pantalla principal:",
      error
    );
  }
});
