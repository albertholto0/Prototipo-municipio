document.addEventListener('DOMContentLoaded', () => {
  const tablaBody = document.getElementById('conceptsTableBody');

  const cargarConceptos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/conceptos');

      if (!response.ok) {
        throw new Error(`Error HTTP! estado: ${response.status}`);
      }

      const conceptos = await response.json();

      tablaBody.innerHTML = '';

      if (conceptos.length === 0) {
        tablaBody.innerHTML = '<tr><td colspan="7">No hay conceptos registrados</td></tr>';
        return;
      }

      conceptos.forEach(concepto => {
        const fila = document.createElement('tr');

        fila.innerHTML = `
          <td class="hidden">${concepto.id}</td>
            <td>${concepto.clave_concepto}</td>
            <td>${concepto.clave_seccion}</td>
            <td>${concepto.nombre_conceptos}</td>
            <td>${concepto.descripcion}</td>
            <td>${concepto.tipo_servicio}</td>
            <td>
                <button class="action-btn modify" onclick="openModifyModal(${concepto.id})">
                    <img src="/public/Assets/editor.png" alt="Modificar" class="action-icon">
                </button>
                <button class="action-btn delete" onclick="openDeleteModal(${concepto.id})">
                    <img src="/public/Assets/eliminar.png" alt="Eliminar" class="action-icon">
                </button>
            </td>
        `;

        tablaBody.appendChild(fila);
      });

    } catch (error) {
      console.error('Error al cargar conceptos:', error);
      tablaBody.innerHTML = '<tr><td colspan="7">Error al cargar los datos :/ </td></tr>';
    }
  };

  cargarConceptos();
});