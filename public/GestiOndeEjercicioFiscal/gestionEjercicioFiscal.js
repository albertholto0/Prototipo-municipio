document.addEventListener('DOMContentLoaded', () => {
  const tablaBody = document.querySelector('#accountsTable tbody');

  const cargarEjercicioFiscal = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/EjercicioFiscal');

      if (!response.ok) {
        throw new Error(`Error HTTP! estado: ${response.status}`);
      }

      const ejercicios = await response.json();
      tablaBody.innerHTML = '';

      if (ejercicios.length === 0) {
        tablaBody.innerHTML = '<tr><td colspan="10">No hay ejercicios fiscales registrados</td></tr>';
        return;
      }

      ejercicios.forEach(ejercicio => {
        const fila = document.createElement('tr');

        fila.innerHTML = `
          <td>${ejercicio.id_ejercicio}</td>
          <td>${ejercicio.anio}</td>
          <td>${ejercicio.fecha_inicio}</td>
          <td>${ejercicio.fecha_fin}</td>
          <td>${ejercicio.estado}</td>
          <td>${ejercicio.proyeccion_ingreso ?? 'N/A'}</td>
          <td>${ejercicio.ingreso_recaudado ?? 'N/A'}</td>
          <td>${ejercicio.observaciones ?? ''}</td>
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
      console.error('Error al cargar Ejercicio Fiscal:', error);
      tablaBody.innerHTML = '<tr><td colspan="11">Error al cargar los datos :( </td></tr>';
    }
  };

  cargarEjercicioFiscal(); // Llamada correcta aquí
});
