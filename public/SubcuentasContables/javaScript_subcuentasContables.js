/* === INICIALIZACIÓN === */
document.addEventListener("DOMContentLoaded", () => {
    const tablaBody = document.querySelector("#accountsTable tbody");
  
    const cargarSubcuentasContables = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/subcuentasContables');
        if (!response.ok) {
          throw new Error(`Error HTTP! estado: ${response.status}`);
        }
        const cuentas = await response.json();
  
        tablaBody.innerHTML = '';
        if (cuentas.length === 0) {
          tablaBody.innerHTML = '<tr><td colspan="4">No hay subcuentas contables registradas</td></tr>';
          return;
        }
  
        cuentas.forEach(cuenta => {
          const fila = document.createElement('tr');
          if (cuenta.estado == 1) {
            cuenta.estado = 'Activo';
          }
          else if (cuenta.estado == 0) {
            cuenta.estado = 'Inactivo';
          }
  
          fila.innerHTML = `
            <td>${cuenta.clave_cuenta_contable}</td>
            <td>${cuenta.clave_subcuenta}</td>
            <td>${cuenta.nombre_subcuentas}</td>
            <td>${cuenta.estado}</td>
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
        })
      } catch (error) {
        console.error('Error al cargar subcuentas contables:', error);
        tablaBody.innerHTML = '<tr><td colspan="4">Error al cargar los datos :( </td></tr>';
  
      }
    }
  
    cargarSubcuentasContables();
  
  });