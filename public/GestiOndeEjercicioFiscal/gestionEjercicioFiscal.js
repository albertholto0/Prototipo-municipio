document.addEventListener('DOMContentLoaded', () => {
  const tablaBody = document.querySelector('#fiscalTable tbody');

  const cargarEjercicioFiscal = async () => {
    try {
      const response = await fetch('/api/EjercicioFiscal');

      if (!response.ok) {
        const errorText = await response.text(); // Para obtener el error detallado del servidor
        console.error('Respuesta del servidor con error:', errorText);
        throw new Error(`HTTP ${response.status} - ${errorText}`);
      }

      const ejercicios = await response.json();
      tablaBody.innerHTML = '';

      if (!Array.isArray(ejercicios) || ejercicios.length === 0) {
        tablaBody.innerHTML = '<tr><td colspan="8">No hay ejercicios fiscales registrados</td></tr>';
        return;
      }

      ejercicios.forEach(ejercicio => {
        const fila = document.createElement('tr');

        // Validar y formatear fechas
        const fechaInicio = ejercicio.fecha_inicio
          ? new Date(ejercicio.fecha_inicio).toLocaleDateString()
          : 'N/A';

        const fechaFin = ejercicio.fecha_fin
          ? new Date(ejercicio.fecha_fin).toLocaleDateString()
          : 'N/A';

        fila.innerHTML = `
          <td>${ejercicio.anio ?? 'N/A'}</td>
          <td>${fechaInicio}</td>
          <td>${fechaFin}</td>
          <td>${ejercicio.estado ?? 'N/A'}</td>
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
      tablaBody.innerHTML = '<tr><td colspan="8">Error al cargar los datos</td></tr>';
    }
  };

  cargarEjercicioFiscal();
});
