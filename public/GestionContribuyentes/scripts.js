document.addEventListener('DOMContentLoaded', () => {
  const tablaBody = document.querySelector('#tablaContribuyentes tbody');
  
  // Función para cargar los contribuyentes
  const cargarContribuyentes = async () => {
    try {
      const response = await fetch('/api/contribuyentes');
      const contribuyentes = await response.json();
      
      // Limpiar tabla antes de agregar nuevos datos
      tablaBody.innerHTML = '';
      
      // Llenar la tabla con los datos
      contribuyentes.forEach(contribuyente => {
        const fila = document.createElement('tr');
        
        fila.innerHTML = `
          <td>${contribuyente.id_contribuyente}</td>
          <td>${contribuyente.nombre_completo}</td>
          <td>${contribuyente.rfc}</td>
          <td>${contribuyente.calle} ${contribuyente.numero_vivienda}, ${contribuyente.barrio} ${contribuyente.localidad}</td>
          <!-- Añade más celdas según tu estructura -->
        `;
        
        tablaBody.appendChild(fila);
      });
      
    } catch (error) {
      console.error('Error al cargar contribuyentes:', error);
      tablaBody.innerHTML = '<tr><td colspan="4">Error al cargar los datos</td></tr>';
    }
  };
  
  // Cargar datos al iniciar
  cargarContribuyentes();
});