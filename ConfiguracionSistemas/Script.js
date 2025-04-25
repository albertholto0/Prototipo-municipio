// Script.js
document.addEventListener("DOMContentLoaded", () => {
  const configForm = document.getElementById("configForm");

  const RFC_REGEX = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;
  const CIF_REGEX = /^[A-Z]\d{7}[A-Z0-9]$/;

  const validateRFC = (rfc) => {
    const cleanedRFC = rfc.trim().toUpperCase();
    if (!RFC_REGEX.test(cleanedRFC)) return false;

    const year = parseInt(
      cleanedRFC.length === 12
        ? cleanedRFC.substr(3, 2)
        : cleanedRFC.substr(4, 2)
    );
    const month = parseInt(
      cleanedRFC.length === 12
        ? cleanedRFC.substr(5, 2)
        : cleanedRFC.substr(6, 2)
    );
    const day = parseInt(
      cleanedRFC.length === 12
        ? cleanedRFC.substr(7, 2)
        : cleanedRFC.substr(8, 2)
    );
    return month >= 1 && month <= 12 && day >= 1 && day <= 31;
  };

  const validateCIF = (cif) => {
    const cleanedCIF = cif.trim().toUpperCase();
    return CIF_REGEX.test(cleanedCIF);
  };

  const loadSavedConfig = () => {
    const savedConfig = JSON.parse(localStorage.getItem("configData"));
    if (savedConfig) {
      document.getElementById("dependencia").value =
        savedConfig.dependencia || "";
      document.getElementById("lema").value = savedConfig.lema || "";
      document.getElementById("rfc").value = savedConfig.rfc || "";
      document.getElementById("periodo").value = savedConfig.periodo || "";
      document.getElementById("idCif").value = savedConfig.idCif || "";

      const savedLogo = localStorage.getItem("logo");
      if (savedLogo) {
        document.getElementById("logoPreview").src = savedLogo;
        updateLogoInAllTabs(savedLogo);
      }

      const savedQR = localStorage.getItem("codigoQR");
      if (savedQR) {
        document.getElementById("qrPreview").src = savedQR;
      }
    }
  };

  const updateLogoInAllTabs = (logoData) => {
    document.querySelectorAll(".logo-image").forEach((element) => {
      element.src = logoData;
    });
    if (typeof BroadcastChannel !== "undefined") {
      const channel = new BroadcastChannel("logo_updates");
      channel.postMessage({ type: "logo_update", logo: logoData });
    }
  };

  const saveConfig = (event) => {
    event.preventDefault();

    const rfc = document.getElementById("rfc").value.trim();
    const idCif = document.getElementById("idCif").value.trim();

    if (rfc && !validateRFC(rfc)) {
      alert(
        "RFC inválido. Formato esperado:\n" +
          "Persona Física: 4 letras + 6 dígitos + 3 caracteres (Ej: GODE561231GR8)\n" +
          "Persona Moral: 3 letras + 6 dígitos + 3 caracteres (Ej: GDE561231GR8)"
      );
      document.getElementById("rfc").focus();
      return;
    }

    if (idCif && !validateCIF(idCif)) {
      alert(
        "ID CIF inválido. Formato esperado:\n" +
          "1 letra + 7 dígitos + 1 caracter (Ej: A1234567B)"
      );
      document.getElementById("idCif").focus();
      return;
    }

    const configData = {
      dependencia: document.getElementById("dependencia").value.trim(),
      lema: document.getElementById("lema").value.trim(),
      rfc: rfc.toUpperCase(),
      periodo: document.getElementById("periodo").value.trim(),
      idCif: idCif.toUpperCase(),
    };

    localStorage.setItem("configData", JSON.stringify(configData));

    const logoFile = document.getElementById("logo").files[0];
    if (logoFile) {
      const reader = new FileReader();
      reader.onload = function () {
        localStorage.setItem("logo", reader.result);
        document.getElementById("logoPreview").src = reader.result;
        updateLogoInAllTabs(reader.result);
      };
      reader.readAsDataURL(logoFile);
    }

    const qrFile = document.getElementById("codigoQR").files[0];
    if (qrFile) {
      const readerQR = new FileReader();
      readerQR.onload = function () {
        localStorage.setItem("codigoQR", readerQR.result);
        document.getElementById("qrPreview").src = readerQR.result;
      };
      readerQR.readAsDataURL(qrFile);
    }

    alert("Configuración guardada correctamente.");
    location.reload();
  };

  const resetConfig = () => {
    if (
      confirm(
        "¿Estás seguro de restablecer todos los datos? Esta acción no se puede deshacer."
      )
    ) {
      localStorage.removeItem("configData");
      localStorage.removeItem("logo");
      localStorage.removeItem("codigoQR");
      location.reload();
    }
  };

  document.getElementById("logo").addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        document.getElementById("logoPreview").src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  document.getElementById("codigoQR").addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        document.getElementById("qrPreview").src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  document.getElementById("rfc").addEventListener("input", function () {
    this.classList.toggle(
      "invalid-input",
      this.value && !validateRFC(this.value)
    );
  });

  document.getElementById("idCif").addEventListener("input", function () {
    this.classList.toggle(
      "invalid-input",
      this.value && !validateCIF(this.value)
    );
  });

  loadSavedConfig();
  configForm.addEventListener("submit", saveConfig);

  // Botón de restablecer cambios
  const resetButton = document.getElementById("resetButton");
  if (resetButton) {
    resetButton.addEventListener("click", resetConfig);
  }

  window.addEventListener("storage", loadSavedConfig);

  if (typeof BroadcastChannel !== "undefined") {
    const channel = new BroadcastChannel("logo_updates");
    channel.addEventListener("message", (event) => {
      if (event.data.type === "logo_update") {
        document.querySelectorAll(".logo-image").forEach((element) => {
          element.src = event.data.logo;
        });
      }
    });
  }
});
