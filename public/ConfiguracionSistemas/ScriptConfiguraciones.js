document.addEventListener("DOMContentLoaded", () => {
  const cargarConfiguracion = async () => {
    try {
      // Llamada a API
      const response = await fetch("http://localhost:5000/api/configuracion");

      if (!response.ok) {
        throw new Error(`Error HTTP! estado: ${response.status}`);
      }

      const configuraciones = await response.json();

      // Validamos que haya al menos una configuración
      if (configuraciones.length === 0) {
        console.warn("No hay configuraciones disponibles.");
        return;
      }

      // Suponemos que solo hay una configuración que se debe mostrar
      const config = configuraciones[0];

      // Llenamos los campos del formulario con los datos
      document.getElementById("dependencia").value = config.dependencia || "";
      document.getElementById("lema").value = config.lema || "";
      document.getElementById("rfc").value = config.rfc || "";
      document.getElementById("idCif").value = config.id_cif || "";

      /*if (config.periodo) {
        document.getElementById("periodo").value = config.periodo;
      }*/

      // Si tienes ruta de imagen para logo o QR, puedes cargar vistas previas así:
      // document.getElementById("logoPreview").src = `/uploads/${config.logo}`;
      // document.getElementById("qrPreview").src = `/uploads/${config.codigo_qr}`;
    } catch (error) {
      console.error("Error al cargar configuración:", error);
      alert("No se pudo cargar la configuración del sistema.");
    }
  };

  cargarConfiguracion();
});
