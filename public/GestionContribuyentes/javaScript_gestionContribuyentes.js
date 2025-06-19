let allContribuyentes = []; // Variable global para almacenar todos los contribuyentes

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
let editId = null;

// Cargar contribuyentes y renderizar tabla
async function cargarContribuyentes() {
  try {
    const response = await fetch('http://localhost:5000/api/contribuyentes');
    if (!response.ok) throw new Error(`Error HTTP! estado: ${response.status}`);
    allContribuyentes = await response.json(); // Guardar todos los contribuyentes

    renderizarContribuyentes(allContribuyentes); // Usar función para renderizar

  } catch (error) {
    console.error('Error al cargar contribuyentes:', error);
    elements.tableBody.innerHTML = '<tr><td colspan="6">Error al cargar los datos :( </td></tr>';
  }
}

function renderizarContribuyentes(lista) {
  elements.tableBody.innerHTML = '';
  if (lista.length === 0) {
    elements.tableBody.innerHTML = '<tr><td colspan="4">No hay contribuyentes registrados</td></tr>';
    return;
  }
  lista.forEach(contribuyente => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${contribuyente.nombre_completo || 'N/A'}</td>
      <td>${contribuyente.rfc || 'N/A'}</td>
      <td>${contribuyente.direccion || ''}, ${contribuyente.barrio || ''}, ${contribuyente.localidad || ''}</td>
      <td>${contribuyente.telefono || 'N/A'}</td>
      <td>
        <button class="action-btn edit" data-id="${contribuyente.id_contribuyente}" title="Editar">
            <img src="/public/Assets/editor.png" class="action-icon">
        </button>
        <button class="action-btn delete" data-id="${contribuyente.id_contribuyente}" title="Eliminar">
            <img src="/public/Assets/eliminar.png" class="action-icon">
        </button>
      </td>
    `;
    elements.tableBody.appendChild(fila);
  });
  // Listeners del boton de editar
  document.querySelectorAll('.action-btn.edit').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      editId = btn.getAttribute('data-id');
      // Obtener datos del contribuyente, usando fetch
      const response = await fetch(`http://localhost:5000/api/contribuyentes/${editId}`);
      const data = await response.json();
      // Llena el formulario
      document.getElementById('nombre').value = data.nombre_completo;
      document.getElementById('fecha_nacimiento').value = data.fecha_nacimiento;
      document.getElementById('rfc').value = data.rfc;
      document.getElementById('telefono').value = data.telefono;
      document.getElementById('calle').value = data.direccion;
      document.getElementById('barrio').value = data.barrio;
      document.getElementById('localidad').value = data.localidad;
      document.getElementById('codigo_postal').value = data.codigo_postal;
      // Abre el modal
      openModal();
    });
  });

  document.querySelectorAll('.action-btn.delete').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = btn.getAttribute('data-id');
      if (confirm('¿Estás seguro de eliminar este contribuyente?')) {
        try {
          const response = await fetch(`http://localhost:5000/api/contribuyentes/${id}`, {
            method: 'DELETE'
          });
          if (!response.ok) throw new Error('Error al eliminar');
          cargarContribuyentes();
        } catch (error) {
          alert('No se pudo eliminar el contribuyente ya que tiene datos asociados en otras tablas');
        }
      }
    });
  });
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
  elements.searchInput.addEventListener('input', () => {
    const texto = elements.searchInput.value.toLowerCase();
    const filtrados = allContribuyentes.filter(c =>
      (c.nombre_completo || '').toLowerCase().includes(texto)
    );
    renderizarContribuyentes(filtrados);
  });

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