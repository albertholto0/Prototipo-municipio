// File: public/GestionConexion/java_gestionConexion.js
// Sergio Elias Robles Ignacio

let allConexiones = []; // Variable global para almacenar todas las conexiones

// Variables de estado
let editId = null;
let currentPage = 1;
const rowsPerPage = 10;

// Mapeo de elementos del DOM
const elements = {
  tableBody: document.querySelector("#accountsTable tbody"),
  searchInput: document.getElementById("searchInput"),
  form: document.getElementById("connectionForm"),
  btnAddOrUpdate: document.getElementById("btnAddOrUpdate"),
  btnCancel: document.getElementById("btnCancel"),
  formTitle: document.getElementById("formTitle"),
  paginationContainer: document.querySelector(".pagination"),
  modalOverlay: document.getElementById('modalOverlay'),
  btnOpenModal: document.getElementById('btnOpenModal'),
  btnCloseModal: document.getElementById("btnCloseModal"),
};
const viewModalElements = {
  viewModalOverlay: document.getElementById('viewModalOverlay'),
  btnCloseViewModal: document.getElementById('btnCloseViewModal'),
  btnCloseViewModal2: document.getElementById('btnCloseViewModal2')
};

// =======================
// Cargar conexiones y renderizar tabla
// =======================
async function cargarConexiones() {
  try {
    const response = await fetch('http://localhost:5000/api/conexiones');
    if (!response.ok) throw new Error(`Error HTTP! estado: ${response.status}`);
    allConexiones = await response.json();
    renderizarConexiones(allConexiones);
  } catch (error) {
    console.error('Error al cargar conexiones:', error);
    elements.tableBody.innerHTML = '<tr><td colspan="8">Error al cargar los datos :( </td></tr>';
  }
}

function renderizarConexiones(lista) {
  elements.tableBody.innerHTML = '';
  if (lista.length === 0) {
    elements.tableBody.innerHTML = '<tr><td colspan="8">No hay conexiones registradas</td></tr>';
    return;
  }
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedData = lista.slice(start, end);

  paginatedData.forEach(conexion => {
    const fila = document.createElement('tr');
    // Formatea la fecha para mostrar solo YYYY-MM-DD
    const fecha = conexion.fecha_conexion ? conexion.fecha_conexion.slice(0, 10) : '';
    fila.innerHTML = `
      <td>${fecha}</td>
      <td>${conexion.id_contribuyente || ''}</td>
      <td>${conexion.cuenta || ''}</td>
      <td>${conexion.tipo || ''}</td>
      <td>${conexion.uso || ''}</td>
      <td>${conexion.ubicacion || ''}</td>
      <td>${conexion.barrio || ''}</td>
      <td>
        <button class="action-btn edit" data-id="${conexion.id_conexion}" title="Editar">
            <img src="/public/Assets/editor.png" class="action-icon">
        </button>
        <button class="action-btn delete" data-id="${conexion.id_conexion}" title="Eliminar">
            <img src="/public/Assets/eliminar.png" class="action-icon">
        </button>
        <button class="action-btn view" data-id="${conexion.id_conexion}" title="Ver información">
            <img src="/public/Assets/visualizar.png" class="action-icon">
        </button>
      </td>
    `;
    elements.tableBody.appendChild(fila);
  });

  renderPagination(lista.length);
  addRowListeners();
}

function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  let html = `
    <button class="pagination-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>« Anterior</button>
  `;

  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  if (startPage > 1) {
    html += `<button class="pagination-btn" onclick="changePage(1)">1</button>`;
    if (startPage > 2) html += `<span>...</span>`;
  }

  for (let i = startPage; i <= endPage; i++) {
    html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) html += `<span>...</span>`;
    html += `<button class="pagination-btn" onclick="changePage(${totalPages})">${totalPages}</button>`;
  }

  html += `<button class="pagination-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Siguiente »</button>`;

  elements.paginationContainer.innerHTML = html;
}

window.changePage = function (page) {
  currentPage = page;
  renderizarConexiones(filteredConexiones());
};

function filteredConexiones() {
  const term = elements.searchInput.value.toLowerCase();
  return allConexiones.filter(conexion =>
    (conexion.cuenta || '').toLowerCase().includes(term) ||
    (conexion.tipo || '').toLowerCase().includes(term) ||
    (conexion.uso || '').toLowerCase().includes(term) ||
    (conexion.ubicacion || '').toLowerCase().includes(term) ||
    (conexion.barrio || '').toLowerCase().includes(term) ||
    (conexion.id_contribuyente && conexion.id_contribuyente.toString().includes(term))
  );
}

// =======================
// Modal de formulario
// =======================
function openModal() {
  elements.modalOverlay.style.display = 'block';
}
function closeModal() {
  elements.modalOverlay.style.display = 'none';
  resetForm();
}

function resetForm() {
  elements.form.reset();
  editId = null;
  elements.formTitle.textContent = "Agregar Conexión";
  elements.btnAddOrUpdate.textContent = "Agregar";
}

// =======================
// Modal de información
// =======================
function openViewModal() {
  viewModalElements.viewModalOverlay.style.display = 'block';
}
function closeViewModal() {
  viewModalElements.viewModalOverlay.style.display = 'none';
}

// =======================
// Listeners de filas
// =======================
function addRowListeners() {
  document.querySelectorAll('.action-btn.edit').forEach(btn => {
    btn.addEventListener('click', async () => {
      editId = btn.getAttribute('data-id');
      const conexion = allConexiones.find(a => a.id_conexion == editId);
      if (!conexion) return;

      // Formatear fecha para input type="datetime-local"
      function formatDateForInput(dateString) {
        if (!dateString) return '';
        // Si es tipo '2024-06-21T12:00:00.000Z' o '2024-06-21 12:00:00'
        const d = new Date(dateString);
        if (isNaN(d)) return dateString.replace(' ', 'T').slice(0, 16);
        // Para input type="datetime-local"
        return d.toISOString().slice(0, 16);
      }

      document.getElementById('fecha_conexion').value = conexion.fecha_conexion ? conexion.fecha_conexion.slice(0, 10) : '';
      document.getElementById('id_contribuyente').value = conexion.id_contribuyente || '';
      document.getElementById('cuenta').value = conexion.cuenta || '';
      document.getElementById('tipo').value = conexion.tipo || '';
      document.getElementById('uso').value = conexion.uso || '';
      document.getElementById('ubicacion').value = conexion.ubicacion || '';
      document.getElementById('barrio').value = conexion.barrio || '';
      elements.formTitle.textContent = "Editar Conexión";
      elements.btnAddOrUpdate.textContent = "Actualizar";
      openModal();
    });
  });

  document.querySelectorAll('.action-btn.delete').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      if (confirm('¿Estás seguro de eliminar esta conexión?')) {
        try {
          const response = await fetch(`/api/conexiones/${id}`, {
            method: 'DELETE'
          });
          if (!response.ok) throw new Error('Error al eliminar');
          cargarConexiones();
        } catch (error) {
          alert('No se pudo eliminar la conexión');
        }
      }
    });
  });

  document.querySelectorAll('.action-btn.view').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const conexion = allConexiones.find(a => a.id_conexion == id);
      if (!conexion) return;
      const infoContent = document.getElementById("infoContent");
      const fecha = conexion.fecha_conexion ? conexion.fecha_conexion.slice(0, 10) : '';
      infoContent.innerHTML = `
        <p><strong>Fecha de Conexión:</strong> ${fecha}</p>
        <p><strong>ID Contribuyente:</strong> ${conexion.id_contribuyente || ''}</p>
        <p><strong>Cuenta:</strong> ${conexion.cuenta || ''}</p>
        <p><strong>Tipo:</strong> ${conexion.tipo || ''}</p>
        <p><strong>Uso:</strong> ${conexion.uso || ''}</p>
        <p><strong>Ubicación:</strong> ${conexion.ubicacion || ''}</p>
        <p><strong>Barrio:</strong> ${conexion.barrio || ''}</p>
      `;
      openViewModal();
    });
  });
}

// =======================
// Inicialización
// =======================
document.addEventListener("DOMContentLoaded", () => {
  cargarConexiones();

  elements.searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderizarConexiones(filteredConexiones());
  });

  elements.btnOpenModal.addEventListener('click', () => {
    resetForm();
    openModal();
  });

  elements.btnCancel.addEventListener("click", closeModal);
  elements.btnCloseModal?.addEventListener("click", closeModal);
  viewModalElements.btnCloseViewModal?.addEventListener("click", closeViewModal);
  viewModalElements.btnCloseViewModal2?.addEventListener("click", closeViewModal); // NUEVO

  elements.form.addEventListener("submit", async function (e) {
    e.preventDefault();

    let data = {
      fecha_conexion: document.getElementById('fecha_conexion').value, // ahora solo YYYY-MM-DD
      id_contribuyente: Number(document.getElementById('id_contribuyente').value),
      cuenta: document.getElementById('cuenta').value,
      tipo: document.getElementById('tipo').value,
      uso: document.getElementById('uso').value,
      ubicacion: document.getElementById('ubicacion').value,
      barrio: document.getElementById('barrio').value
    };

    // Ya no es necesario ajustar el formato de fecha

    try {
      let url = 'http://localhost:5000/api/conexiones';
      let method = 'POST';
      if (editId) {
        url += `/${editId}`;
        method = 'PUT';
      }
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Error al guardar');
      closeModal();
      cargarConexiones();
    } catch (error) {
      alert('No se pudo guardar la conexión');
    }
  });
});