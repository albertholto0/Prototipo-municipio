document.addEventListener("DOMContentLoaded", () => {
  // Cargar logo al iniciar
  const savedLogo = localStorage.getItem("logo");
  if (savedLogo) {
    const logoElements = document.querySelectorAll(".logo-image");
    logoElements.forEach((element) => {
      element.src = savedLogo;
    });
  }

  // Escuchar actualizaciones de logo
  if (typeof BroadcastChannel !== "undefined") {
    const channel = new BroadcastChannel("logo_updates");
    channel.addEventListener("message", (event) => {
      if (event.data.type === "logo_update") {
        const logoElements = document.querySelectorAll(".logo-image");
        logoElements.forEach((element) => {
          element.src = event.data.logo;
        });
      }
    });
  }
});
