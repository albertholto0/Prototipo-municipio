document.addEventListener("DOMContentLoaded", () => {
  const configForm = document.getElementById("configForm");

  configForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(configForm);

    try {
      const response = await fetch("http://localhost:5000/api/configuracion", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Error al guardar configuración");

      const result = await response.json();
      alert(result.message || "Configuración guardada correctamente");

      // Notificar a otras pestañas que deben actualizar
      if (typeof BroadcastChannel !== "undefined") {
        const channel = new BroadcastChannel("logo_updates");
        channel.postMessage({
          type: "logo_update",
          timestamp: Date.now(),
        });
      }

      updateLogoInCurrentTab();
    } catch (error) {
      console.error("Error:", error);
      alert("Error al guardar la configuración: " + error.message);
    }
  });

  const updateLogoInCurrentTab = () => {
    const logos = document.querySelectorAll(".logo-image, .logo-left img");
    logos.forEach((logo) => {
      const newSrc = logo.src.split("?")[0] + "?t=" + Date.now();
      logo.src = newSrc;
    });
  };

  // Escuchar mensajes desde otras pestañas
  if (typeof BroadcastChannel !== "undefined") {
    const channel = new BroadcastChannel("logo_updates");
    channel.addEventListener("message", (event) => {
      if (event.data.type === "logo_update") {
        updateLogoInCurrentTab();
        window.location.reload(); // Recarga la página para mostrar lema y dependencia actualizados
      }
    });
  }
});
