document.addEventListener('DOMContentLoaded', () => {
  const tablaBody = document.querySelector('#accountsTable tbody');

  const cargarConexion = async () => {
    try {
      // Usa la URL completa para desarrollo
      const response = await fetch('http://localhost:5000/api/conexion');

      if (!response.ok) {
        throw new Error(`Error HTTP! estado: ${response.status}`);
      }

      const conexion = await response.json();
      console.log('Datos conexion: ', conexion); // Para depuración

      tablaBody.innerHTML = '';

      if (conexion.length === 0) {
        tablaBody.innerHTML = '<tr><td colspan="6">No hay conexiones registrados</td></tr>';
        return;
      }

      conexion.forEach(conexion => {
        const fila = document.createElement('tr');

        fila.innerHTML = `
          <td>${conexion.fecha_conexion || 'N/A'}</td>
          <td>${conexion.nombre_completo || 'N/A'}</td>
          <td>${conexion.cuenta || ''}</td>
          <td>${conexion.tipo || 'N/A'}</td>
          <td>
            <button class="btn-editar">Editar</button>
            <button class="btn-eliminar">Eliminar</button>
          </td>
        `;

        tablaBody.appendChild(fila);
      });

    } catch (error) {
      console.error('Error al cargar conexion', error);
      tablaBody.innerHTML = '<tr><td colspan="6">Error al cargar los datos :( </td></tr>';
    }
  };

  cargarConexion();
});