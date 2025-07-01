// File: public/GestionAlquiler/PruebaAlquiler.js
//Sergio Elias Robles Ignacio 

let allAlquileres = []; // Variable global para almacenar todos los alquileres

// Variables de estado
let isEditing = false;
let currentIndex = null;
let currentPage = 1;
const rowsPerPage = 10;

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

const viewModalElements = {
  viewModalOverlay: document.getElementById('viewModalOverlay'),
  btnCloseViewModal: document.getElementById('btnCloseViewModal')
};

let editId = null;

// =======================
// Cargar alquileres y renderizar tabla
// =======================
async function cargarAlquileres() {
  try {
    const response = await fetch('http://localhost:5000/api/alquileres');
    if (!response.ok) throw new Error(`Error HTTP! estado: ${response.status}`);
    allAlquileres = await response.json();
    renderizarAlquileres(allAlquileres);
  } catch (error) {
    console.error('Error al cargar alquileres:', error);
    elements.tableBody.innerHTML = '<tr><td colspan="6">Error al cargar los datos :( </td></tr>';
  }
}

function renderizarAlquileres(lista) {
  elements.tableBody.innerHTML = '';
  if (lista.length === 0) {
    elements.tableBody.innerHTML = '<tr><td colspan="6">No hay alquileres registrados</td></tr>';
    return;
  }
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedData = lista.slice(start, end);

  paginatedData.forEach(alquiler => {
    const fila = document.createElement('tr');
    const fechaInicio = alquiler.fecha_inicio ? alquiler.fecha_inicio.slice(0, 10) : '';
    const fechaFin = alquiler.fecha_fin ? alquiler.fecha_fin.slice(0, 10) : '';

    fila.innerHTML = `
      <td>${fechaInicio}</td>
      <td>${fechaFin}</td>
      <td>${alquiler.tipo_trabajo || ''}</td>
      <td>${alquiler.concepto || ''}</td>
      <td>${alquiler.monto_total || ''}</td>
      <td>${alquiler.estado || ''}</td>
      <td>
        <button class="action-btn edit" data-id="${alquiler.id_alquiler}" title="Editar">
            <img src="/public/Assets/editor.png" class="action-icon">
        </button>
        <button class="action-btn view" data-id="${alquiler.id_alquiler}" title="Ver información">
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
  renderizarAlquileres(filteredAlquileres());
};

function filteredAlquileres() {
  const term = elements.searchInput.value.toLowerCase();
  return allAlquileres.filter(alquiler =>
    (alquiler.fecha_inicio && alquiler.fecha_inicio.slice(0, 10).includes(term)) ||
    (alquiler.tipo_trabajo || '').toLowerCase().includes(term) ||
    (alquiler.concepto || '').toLowerCase().includes(term) ||
    (alquiler.id_recibo && alquiler.id_recibo.toString().toLowerCase().includes(term))
  );
}

// =======================
// Modal de formulario
// =======================
function openModal() {
  elements.modalOverlay.style.display = 'block';
  // Si estamos editando, ocultar el campo ID Recibo
  if (editId) {
    const idReciboGroup = document.querySelector('.form-group[id*="id_recibo"], .form-group #id_recibo');
    if (idReciboGroup) {
      if (idReciboGroup.closest('.form-group')) {
        idReciboGroup.closest('.form-group').style.display = 'none';
      } else {
        idReciboGroup.style.display = 'none';
      }
    }
  } else {
    // Si es alta, mostrar el campo
    const idReciboGroup = document.querySelector('.form-group[id*="id_recibo"], .form-group #id_recibo');
    if (idReciboGroup) {
      if (idReciboGroup.closest('.form-group')) {
        idReciboGroup.closest('.form-group').style.display = '';
      } else {
        idReciboGroup.style.display = '';
      }
    }
  }
}
function closeModal() {
  elements.modalOverlay.style.display = 'none';
  resetForm();
}

function resetForm() {
  elements.form.reset();
  editId = null;
  elements.formTitle.textContent = "Agregar Alquiler";
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
      // Obtener datos del alquiler
      const alquiler = allAlquileres.find(a => a.id_alquiler == editId);
      if (!alquiler) return;

      // Formatear fechas para el input tipo date o datetime-local
      function formatDateForInput(dateString) {
        if (!dateString) return '';
        // Si es datetime tipo '2024-06-21T12:00:00.000Z' o '2024-06-21 12:00:00'
        const d = new Date(dateString);
        if (isNaN(d)) return dateString.split('T')[0] || dateString.split(' ')[0];
        // Para input type="date"
        return d.toISOString().slice(0, 10);
      }
      document.getElementById('fecha_inicio').value = alquiler.fecha_inicio ? alquiler.fecha_inicio.slice(0, 10) : '';
      document.getElementById('fecha_fin').value = alquiler.fecha_fin ? alquiler.fecha_fin.slice(0, 10) : '';
      document.getElementById('numero_viajes').value = alquiler.numero_viajes || '';
      document.getElementById('kilometros_recorridos').value = alquiler.kilometros_recorridos || '';
      document.getElementById('horometro_inicio').value = alquiler.horometro_inicio || '';
      document.getElementById('horometro_fin').value = alquiler.horometro_fin || '';
      document.getElementById('tipo_trabajo').value = alquiler.tipo_trabajo || '';
      document.getElementById('concepto').value = alquiler.concepto || '';
      document.getElementById('tarifa_base').value = alquiler.tarifa_base || '';
      document.getElementById('monto_total').value = alquiler.monto_total || '';
      // document.getElementById('id_recibo').value = alquiler.id_recibo || ''; // Oculto en edición
      document.getElementById('estado').value = alquiler.estado || 'Pendiente';
      elements.formTitle.textContent = "Editar Alquiler";
      elements.btnAddOrUpdate.textContent = "Actualizar";
      openModal();
    });
  });

  document.querySelectorAll('.action-btn.view').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const alquiler = allAlquileres.find(a => a.id_alquiler == id);
      if (!alquiler) return;
      const infoContent = document.getElementById("infoContent");
      const fechaInicio = alquiler.fecha_inicio ? alquiler.fecha_inicio.slice(0, 10) : '';
      const fechaFin = alquiler.fecha_fin ? alquiler.fecha_fin.slice(0, 10) : '';

      infoContent.innerHTML = `
        <p><strong>Fecha de Inicio:</strong> ${fechaInicio}</p>
        <p><strong>Fecha de Fin:</strong> ${fechaFin}</p>
        <p><strong>Número de Viajes:</strong> ${alquiler.numero_viajes || ''}</p>
        <p><strong>Kilómetros Recorridos:</strong> ${alquiler.kilometros_recorridos || ''}</p>
        <p><strong>Horómetro Inicio:</strong> ${alquiler.horometro_inicio || ''}</p>
        <p><strong>Horómetro Fin:</strong> ${alquiler.horometro_fin || ''}</p>
        <p><strong>Tipo de Trabajo:</strong> ${alquiler.tipo_trabajo || ''}</p>
        <p><strong>Concepto:</strong> ${alquiler.concepto || ''}</p>
        <p><strong>Tarifa Base:</strong> ${alquiler.tarifa_base || ''}</p>
        <p><strong>Monto Total:</strong> ${alquiler.monto_total || ''}</p>
        <p><strong>Estado:</strong> ${alquiler.estado || ''}</p>
        <p><strong>ID Recibo:</strong> ${alquiler.id_recibo || ''}</p>
      `;
      openViewModal();
    });
  });
}

// =======================
// Inicialización
// =======================
document.addEventListener("DOMContentLoaded", () => {
  cargarAlquileres();

  elements.searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderizarAlquileres(filteredAlquileres());
  });

  // Solo agrega el listener si el botón existe
  if (elements.btnOpenModal) {
    elements.btnOpenModal.addEventListener('click', () => {
      resetForm();
      openModal();
    });
  }

  if (elements.btnCancel) {
    elements.btnCancel.addEventListener("click", closeModal);
  }

  if (elements.btnCloseModal) {
    elements.btnCloseModal.addEventListener("click", closeModal);
  }

  if (viewModalElements.btnCloseViewModal) {
    viewModalElements.btnCloseViewModal.addEventListener("click", closeViewModal);
  }

  elements.form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = {
      fecha_inicio: document.getElementById('fecha_inicio').value,
      fecha_fin: document.getElementById('fecha_fin').value,
      numero_viajes: Number(document.getElementById('numero_viajes').value),
      kilometros_recorridos: Number(document.getElementById('kilometros_recorridos').value),
      horometro_inicio: Number(document.getElementById('horometro_inicio').value),
      horometro_fin: Number(document.getElementById('horometro_fin').value),
      tipo_trabajo: document.getElementById('tipo_trabajo').value,
      concepto: document.getElementById('concepto').value,
      tarifa_base: Number(document.getElementById('tarifa_base').value),
      monto_total: Number(document.getElementById('monto_total').value),
      id_recibo: document.getElementById('id_recibo').value,
      estado: document.getElementById('estado').value || 'Pendiente'
    };

    try {
      let url = 'http://localhost:5000/api/alquileres';
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
      cargarAlquileres();
    } catch (error) {
      alert('No se pudo guardar el alquiler');
    }
  });
});
