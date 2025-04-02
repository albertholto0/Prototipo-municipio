document.addEventListener("DOMContentLoaded", () => {
  const configForm = document.getElementById("configForm");

  // Cargar valores previos (si existen) en el formulario
  const loadSavedConfig = () => {
    const savedConfig = JSON.parse(localStorage.getItem("configData"));
    if (savedConfig) {
      document.getElementById("dependencia").value =
        savedConfig.dependencia || "";
      document.getElementById("logo").value = savedConfig.logo || "";
      document.getElementById("lema").value = savedConfig.lema || "";
      document.getElementById("rfc").value = savedConfig.rfc || "";
      document.getElementById("nombre").value = savedConfig.nombre || "";
      document.getElementById("idCif").value = savedConfig.idCif || "";
      document.getElementById("codigoQR").value = savedConfig.codigoQR || "";
    }
  };

  // Función para guardar la configuración
  const saveConfig = (event) => {
    event.preventDefault(); // Evitar la recarga de la página

    const configData = {
      dependencia: document.getElementById("dependencia").value,
      lema: document.getElementById("lema").value,
      rfc: document.getElementById("rfc").value,
      nombre: document.getElementById("nombre").value,
      idCif: document.getElementById("idCif").value,
      logo: document.getElementById("logo").value, // Guardar logo
      codigoQR: document.getElementById("codigoQR").value, // Guardar código QR
    };

    // Guardar en localStorage
    localStorage.setItem("configData", JSON.stringify(configData));

    // Opcional: Guardar también el archivo de logo como URL (si se sube uno)
    const logoFile = document.getElementById("logo").files[0];
    if (logoFile) {
      const reader = new FileReader();
      reader.onloadend = function () {
        localStorage.setItem("logo", reader.result); // Guardar imagen base64
      };
      reader.readAsDataURL(logoFile);
    }

    // Opcional: Guardar también el código QR
    const qrFile = document.getElementById("codigoQR").files[0];
    if (qrFile) {
      const readerQR = new FileReader();
      readerQR.onloadend = function () {
        localStorage.setItem("codigoQR", readerQR.result); // Guardar imagen QR base64
      };
      readerQR.readAsDataURL(qrFile);
    }

    alert("Configuración guardada correctamente.");
    location.reload(); // Recargar la página para reflejar los cambios
  };

  // Cargar la configuración guardada
  loadSavedConfig();

  // Evento de envío del formulario
  configForm.addEventListener("submit", saveConfig);

  // Detectar cambios en localStorage para actualizar dinámicamente en todas las páginas
  window.addEventListener("storage", () => {
    loadSavedConfig(); // Refrescar los valores si hay un cambio en el almacenamiento
  });
});
