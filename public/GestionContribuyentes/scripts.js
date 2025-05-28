document.addEventListener('DOMContentLoaded', () => {
  const tablaBody = document.querySelector('#accountsTable tbody');

  const cargarContribuyentes = async () => {
    try {
      // Usa la URL completa para desarrollo
      const response = await fetch('http://localhost:5000/api/contribuyentes');

      if (!response.ok) {
        throw new Error(`Error HTTP! estado: ${response.status}`);
      }

      const contribuyentes = await response.json();

      tablaBody.innerHTML = '';

      if (contribuyentes.length === 0) {
        tablaBody.innerHTML = '<tr><td colspan="4">No hay contribuyentes registrados</td></tr>';
        return;
      }

      contribuyentes.forEach(contribuyente => {
        const fila = document.createElement('tr');

        fila.innerHTML = `
          <td>${contribuyente.nombre_completo || 'N/A'}</td>
          <td>${contribuyente.rfc || 'N/A'}</td>
          <td>${contribuyente.direccion || ''}, ${contribuyente.barrio || ''}, ${contribuyente.localidad || ''}</td>
          <td>${contribuyente.numero_telefono || 'N/A'}</td>
          <td>
            <button class="action-btn edit" title="Editar">
                <img src="/public/Assets/editor.png" class="action-icon">
            </button>
            <button class="action-btn delete" title="Eliminar">
                <img src="/public/Assets/eliminar.png" class="action-icon">
            </button>
          </td>
        `;

        tablaBody.appendChild(fila);
      });

    } catch (error) {
      console.error('Error al cargar contribuyentes:', error);
      tablaBody.innerHTML = '<tr><td colspan="6">Error al cargar los datos :( </td></tr>';
    }
  };

  cargarContribuyentes();
});