let allSubcuentas = []; // Array para almacenar todas las subcuentas contables

// Mapeo de elementos del DOM
const elements = {
  tableBody: document.querySelector("#accountsTable tbody"),
  searchInput: document.getElementById("searchInput"),
  form: document.getElementById("accountForm"),
  btnAddOrUpdate: document.getElementById("btnAddOrUpdate"),
  btnCancel: document.getElementById("btnCancel"),
  formTitle: document.getElementById("formTitle"),
  paginationContainer: document.querySelector(".pagination"),
  modalOverlay: document.getElementById('modalOverlay'),
  btnOpenModal: document.getElementById('btnOpenModal'),
};
let editId = null;
// Cargar subcuentas contables y renderizar tabla
async function cargarSubcuentasContables() {
  try {
    const response = await fetch('http://localhost:5000/api/subcuentasContables');
    if (!response.ok) throw new Error(`Error HTTP! estado: ${response.status}`);
    allSubcuentas = await response.json(); // Guardar todas las subcuentas contables

    renderizarSubcuentas(allSubcuentas); // Usar función para renderizar

  } catch (error) {
    console.error('Error al cargar subcuentas contables:', error);
    elements.tableBody.innerHTML = '<tr><td colspan="4">Error al cargar los datos :( </td></tr>';
  }
}

function renderizarSubcuentas(lista) {
  elements.tableBody.innerHTML = '';
  if (lista.length === 0) {
    elements.tableBody.innerHTML = '<tr><td colspan="4">No hay subcuentas contables registradas</td></tr>';
    return;
  }
  lista.forEach(cuenta => {
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
              <button class="action-btn edit" data-id="${cuenta.clave_subcuenta}" title="Editar">
                  <img src="/public/Assets/editor.png" class="action-icon">
              </button>
              <button class="action-btn delete" data-id="${cuenta.clave_subcuenta}" title="Eliminar">
                  <img src="/public/Assets/eliminar.png" class="action-icon">
              </button>
            </td>
        `;
    elements.tableBody.appendChild(fila);
  });
  // Listeners del boton agregar

  // Listeners del boton de editar
  document.querySelectorAll('.action-btn.edit').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      editId = btn.getAttribute('data-id');
      // Obtener datos de la subcuenta, usando fetch
      const response = await fetch(`http://localhost:5000/api/subcuentasContables/${editId}`);
      const data = await response.json();
      // Llena el formulario
      document.getElementById('clave_cuenta_contable').value = data.clave_cuenta_contable;
      document.getElementById('clave_subcuenta').value = data.clave_subcuenta;
      document.getElementById('nombre_subcuentas').value = data.nombre_subcuentas;
      elements.formTitle.textContent = "Editar Subcuenta Contable";
      elements.btnAddOrUpdate.textContent = "Actualizar";
      // Abre el modal
      openModal();
    });
  });
  // Listeners del boton de eliminar
  document.querySelectorAll('.action-btn.delete').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const claveSubcuenta = btn.getAttribute('data-id');
      if (confirm("¿Estás seguro de que deseas eliminar esta subcuenta contable?")) {
        try {
          const response = await fetch(`http://localhost:5000/api/subcuentasContables/${claveSubcuenta}`, {
            method: 'PUT' // Cambiar a PUT para actualizar el estado
          });
          if (!response.ok) throw new Error(`Error HTTP! estado: ${response.status}`);
          // Recargar subcuentas contables
          await cargarSubcuentasContables();
        } catch (error) {
          console.error('Error al eliminar la subcuenta:', error);
          alert('Error al eliminar la subcuenta contable');
        }
      }
    });
  });
}

// Funciones del modal
function openModal() {
  elements.modalOverlay.style.display = 'flex';
  llenarSelectCuentasContables(); // Llenar el select cada vez que se abre el modal
}

function closeModal() {
  elements.modalOverlay.style.display = 'none';
  resetForm();
  editId = null; // Limpia el editId al cerrar el modal
}

// Limpiar formulario
function resetForm() {
  elements.form.reset();
}

function normalizar(texto) {
  return (texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quita acentos
    .trim();
}

async function llenarSelectCuentasContables() {
  const select = document.getElementById('clave_cuenta_contable');
  select.innerHTML = '<option value="">Seleccione una cuenta</option>'; // Limpia el select
  try {
    const response = await fetch('http://localhost:5000/api/cuentasContables');
    if (!response.ok) throw new Error('No se pudieron cargar las cuentas contables');
    const cuentas = await response.json();
    cuentas.forEach(cuenta => {
      const option = document.createElement('option');
      option.value = cuenta.clave_cuenta_contable; // SOLO el id
      option.textContent = `${cuenta.clave_cuenta_contable} - ${cuenta.nombre_cuentaContable}`;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Error al cargar cuentas contables:', error);
  }
}

/* === INICIALIZACIÓN === */
document.addEventListener("DOMContentLoaded", () => {
  cargarSubcuentasContables();

  elements.btnOpenModal.addEventListener('click', openModal);
  elements.btnCancel.addEventListener('click', closeModal);
  elements.searchInput.addEventListener('input', () => {
    const texto = normalizar(elements.searchInput.value);
    const subcuentasFiltradas = allSubcuentas.filter(cuenta => {
      // Normaliza y convierte a string todas las propiedades relevantes
      const claveCuenta = normalizar(String(cuenta.clave_cuenta_contable));
      const claveSubcuenta = normalizar(String(cuenta.clave_subcuenta));
      const nombreSubcuenta = normalizar(cuenta.nombre_subcuentas);
      const estadoSubcuenta = normalizar(String(cuenta.estado));
      // Busca en todas las propiedades
      return (
        claveCuenta.includes(texto) ||
        claveSubcuenta.includes(texto) ||
        nombreSubcuenta.includes(texto) ||
        estadoSubcuenta.includes(texto)
      );
    });
    renderizarSubcuentas(subcuentasFiltradas);
  });

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      clave_cuenta_contable: document.getElementById('clave_cuenta_contable').value,
      clave_subcuenta: document.getElementById('clave_subcuenta').value,
      nombre_subcuentas: document.getElementById('nombre_subcuentas').value
    };
    try {
      let response;
      if (editId) {
        // Actualizar subcuenta existente
        response = await fetch(`http://localhost:5000/api/subcuentasContables/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      } else {
        // Crear nueva subcuenta
        response = await fetch('http://localhost:5000/api/subcuentasContables', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      }

      if (!response.ok) throw new Error(`Error HTTP! estado: ${response.status}`);

      // Recargar subcuentas contables
      await cargarSubcuentasContables();
      closeModal();
    } catch (error) {
      console.error('Error al guardar la subcuenta:', error);
      alert('Error al guardar la subcuenta contable');
    }
  });
});