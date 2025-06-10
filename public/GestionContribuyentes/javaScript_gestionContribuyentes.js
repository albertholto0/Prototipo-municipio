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
  btnCloseModal: document.getElementById('btnCloseModal')
};

// Cargar contribuyentes y renderizar tabla
async function cargarContribuyentes() {
  try {
    const response = await fetch('http://localhost:5000/api/contribuyentes');
    if (!response.ok) throw new Error(`Error HTTP! estado: ${response.status}`);
    const contribuyentes = await response.json();

    elements.tableBody.innerHTML = '';

    if (contribuyentes.length === 0) {
      elements.tableBody.innerHTML = '<tr><td colspan="4">No hay contribuyentes registrados</td></tr>';
      return;
    }

    contribuyentes.forEach(contribuyente => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${contribuyente.nombre_completo || 'N/A'}</td>
        <td>${contribuyente.rfc || 'N/A'}</td>
        <td>${contribuyente.direccion || ''}, ${contribuyente.barrio || ''}, ${contribuyente.localidad || ''}</td>
        <td>${contribuyente.telefono || 'N/A'}</td>
        <td>
          <button class="action-btn edit" title="Editar">
              <img src="/public/Assets/editor.png" class="action-icon">
          </button>
          <button class="action-btn delete" title="Eliminar">
              <img src="/public/Assets/eliminar.png" class="action-icon">
          </button>
        </td>
      `;
      elements.tableBody.appendChild(fila);
    });
  } catch (error) {
    console.error('Error al cargar contribuyentes:', error);
    elements.tableBody.innerHTML = '<tr><td colspan="6">Error al cargar los datos :( </td></tr>';
  }
}

// Funciones del modal
function openModal() {
  elements.modalOverlay.style.display = 'flex';
}

function closeModal() {
  elements.modalOverlay.style.display = 'none';
  resetForm();
}

// Limpiar formulario
function resetForm() {
  elements.form.reset();
}

// Evento principal
document.addEventListener('DOMContentLoaded', () => {
  cargarContribuyentes();

  elements.btnOpenModal.addEventListener('click', openModal);
  elements.btnCancel.addEventListener('click', closeModal);

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      nombre: document.getElementById('nombre').value,
      apellido_paterno: document.getElementById('apellido_paterno').value,
      apellido_materno: document.getElementById('apellido_materno').value,
      fecha_nacimiento: document.getElementById('fecha_nacimiento').value,
      rfc: document.getElementById('rfc').value,
      calle: document.getElementById('calle').value,
      num_calle: document.getElementById('num_calle').value,
      barrio: document.getElementById('barrio').value,
      localidad: document.getElementById('localidad').value,
      codigo_postal: document.getElementById('codigo_postal').value,
      telefono: document.getElementById('telefono').value,
    };

    try {
      const response = await fetch('http://localhost:5000/api/contribuyentes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Error al guardar');

      closeModal();
      cargarContribuyentes();
    } catch (error) {
      alert('No se pudo guardar el contribuyente');
    }
  });
});