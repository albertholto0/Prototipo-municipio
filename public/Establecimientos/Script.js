document.addEventListener("DOMContentLoaded", () => {
  const tablaBody = document.querySelector("#accountsTable tbody");

  const cargarEstablecimientos = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/establecimientos"
      );

      if (!response.ok) {
        throw new Error(`Error HTTP! estado: ${response.status}`);
      }

      const establecimientos = await response.json();

      tablaBody.innerHTML = "";

      if (establecimientos.length === 0) {
        tablaBody.innerHTML =
          '<tr><td colspan="8">No hay establecimientos registrados</td></tr>';
        return;
      }

      establecimientos.forEach((est) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${est.nombre_establecimiento || "N/A"}</td>
          <td>${est.direccion || ""} ${est.barrio || ""} ${
          est.localidad || ""
        }</td>
          <td>${est.codigo_postal || "N/A"}</td>
          <td>${est.fecha_apertura || "N/A"}</td>
          <td>${est.giro_negocio || "N/A"}</td>
          <td>${est.nombre_contribuyente || "N/A"}</td>
          <td class="actions">
            <button class="action-btn edit">Editar</button>
            <button class="action-btn delete">Eliminar</button>
          </td>
        `;
        tablaBody.appendChild(fila);
      });
    } catch (error) {
      console.error("Error al cargar establecimientos:", error);
      tablaBody.innerHTML =
        '<tr><td colspan="8">Error al cargar los datos </td></tr>';
    }
  };

  cargarEstablecimientos();
});
