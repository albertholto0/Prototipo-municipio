// =======================
// Datos de ejemplo
// =======================
let GestionAlquileres = [
  {
    fecha_inicio: "2023-05-10",
    fecha_fin: "2023-06-10",
    numero_viajes: 5,
    kilometros_recorridos: 120.5,
    horometro_inicio: 100.0,
    horometro_fin: 150.0,
    tipo_trabajo: "Excavación",
    concepto: "Obra pública",
    tarifa_base: 500.0,
    monto_total: 2500.0,
    id_recibo: "REC123"
  },
  {
    fecha_inicio: "2023-07-01",
    fecha_fin: "2023-07-15",
    numero_viajes: 3,
    kilometros_recorridos: 80.0,
    horometro_inicio: 200.0,
    horometro_fin: 230.0,
    tipo_trabajo: "Transporte",
    concepto: "Materiales",
    tarifa_base: 400.0,
    monto_total: 1200.0,
    id_recibo: "REC124"
  }
];

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

  fecha_inicio: document.getElementById("fecha_inicio"),
  fecha_fin: document.getElementById("fecha_fin"),
  numero_viajes: document.getElementById("numero_viajes"),
  kilometros_recorridos: document.getElementById("kilometros_recorridos"),
  horometro_inicio: document.getElementById("horometro_inicio"),
  horometro_fin: document.getElementById("horometro_fin"),
  tipo_trabajo: document.getElementById("tipo_trabajo"),
  concepto: document.getElementById("concepto"),
  tarifa_base: document.getElementById("tarifa_base"),
  monto_total: document.getElementById("monto_total"),
  id_recibo: document.getElementById("id_recibo"),

  btnAddOrUpdate: document.getElementById("btnAddOrUpdate"),
  btnCancel: document.getElementById("btnCancel"),
  formTitle: document.getElementById("formTitle"),
  paginationContainer: document.querySelector(".pagination")
};

const modalElements = {
  modalOverlay: document.getElementById('modalOverlay'),
  btnOpenModal: document.getElementById('btnOpenModal'),
  btnCloseModal: document.getElementById('btnCloseModal')
};

const viewModalElements = {
  viewModalOverlay: document.getElementById('viewModalOverlay'),
  btnCloseViewModal: document.getElementById('btnCloseViewModal')
};

// =======================
// Funciones principales
// =======================

function renderTable(data) {
  elements.tableBody.innerHTML = "";
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedData = data.slice(start, end);

  paginatedData.forEach((alquiler, index) => {
    const row = `
      <tr>
        <td>${alquiler.fecha_inicio}</td>
        <td>${alquiler.fecha_fin}</td>
        <td>${alquiler.tipo_trabajo}</td>
        <td>${alquiler.concepto}</td>
        <td>${alquiler.monto_total}</td>
        <td>
          <button class="action-btn edit" onclick="editAccount(${start + index})" title="Editar">
            <img src="/public/Assets/editor.png" class="action-icon">
          </button>
          <button class="action-btn delete" onclick="deleteAccount(${start + index})" title="Eliminar">
            <img src="/public/Assets/eliminar.png" class="action-icon">
          </button>
          <button class="action-btn view" onclick="viewAccount(${start + index})" title="Ver información">
            <img src="/public/Assets/visualizar.png" class="action-icon">
          </button>
        </td>
      </tr>
    `;
    elements.tableBody.insertAdjacentHTML("beforeend", row);
  });

  renderPagination(data.length);
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

function filteredAlquileres() {
  const term = elements.searchInput.value.toLowerCase();
  return GestionAlquileres.filter(alquiler =>
    alquiler.fecha_inicio.toLowerCase().includes(term) ||
    alquiler.tipo_trabajo.toLowerCase().includes(term) ||
    alquiler.concepto.toLowerCase().includes(term) ||
    alquiler.id_recibo.toLowerCase().includes(term)
  );
}

// =======================
// Modal de formulario
// =======================
function openModal() {
  modalElements.modalOverlay.style.display = 'block';
}
function closeModal() {
  modalElements.modalOverlay.style.display = 'none';
  resetForm();
}

function resetForm() {
  elements.form.reset();
  isEditing = false;
  currentIndex = null;
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
// Funciones globales
// =======================
window.editAccount = function (index) {
  const alquiler = GestionAlquileres[index];
  elements.fecha_inicio.value = alquiler.fecha_inicio;
  elements.fecha_fin.value = alquiler.fecha_fin;
  elements.numero_viajes.value = alquiler.numero_viajes;
  elements.kilometros_recorridos.value = alquiler.kilometros_recorridos;
  elements.horometro_inicio.value = alquiler.horometro_inicio;
  elements.horometro_fin.value = alquiler.horometro_fin;
  elements.tipo_trabajo.value = alquiler.tipo_trabajo;
  elements.concepto.value = alquiler.concepto;
  elements.tarifa_base.value = alquiler.tarifa_base;
  elements.monto_total.value = alquiler.monto_total;
  elements.id_recibo.value = alquiler.id_recibo;

  isEditing = true;
  currentIndex = index;
  elements.formTitle.textContent = "Editar Alquiler";
  elements.btnAddOrUpdate.textContent = "Actualizar";
  openModal();
};

window.deleteAccount = function (index) {
  if (confirm("¿Confirmar eliminación?")) {
    GestionAlquileres.splice(index, 1);
    const totalPages = Math.ceil(filteredAlquileres().length / rowsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      currentPage = totalPages;
    }
    renderTable(filteredAlquileres());
  }
};

window.changePage = function (page) {
  currentPage = page;
  renderTable(filteredAlquileres());
};

window.viewAccount = function (index) {
  const alquiler = GestionAlquileres[index];
  const infoContent = document.getElementById("infoContent");
  infoContent.innerHTML = `
    <p><strong>Fecha de Inicio:</strong> ${alquiler.fecha_inicio}</p>
    <p><strong>Fecha de Fin:</strong> ${alquiler.fecha_fin}</p>
    <p><strong>Número de Viajes:</strong> ${alquiler.numero_viajes}</p>
    <p><strong>Kilómetros Recorridos:</strong> ${alquiler.kilometros_recorridos}</p>
    <p><strong>Horómetro Inicio:</strong> ${alquiler.horometro_inicio}</p>
    <p><strong>Horómetro Fin:</strong> ${alquiler.horometro_fin}</p>
    <p><strong>Tipo de Trabajo:</strong> ${alquiler.tipo_trabajo}</p>
    <p><strong>Concepto:</strong> ${alquiler.concepto}</p>
    <p><strong>Tarifa Base:</strong> ${alquiler.tarifa_base}</p>
    <p><strong>Monto Total:</strong> ${alquiler.monto_total}</p>
    <p><strong>ID Recibo:</strong> ${alquiler.id_recibo}</p>
  `;
  openViewModal();

  document.querySelectorAll('#infoContent p').forEach(item => {
    item.addEventListener('click', function (e) {
      const ripple = document.createElement('div');
      ripple.className = 'ripple-effect';
      const rect = this.getBoundingClientRect();
      ripple.style.left = `${e.clientX - rect.left - 5}px`;
      ripple.style.top = `${e.clientY - rect.top - 5}px`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
};

// =======================
// Inicialización
// =======================
document.addEventListener("DOMContentLoaded", () => {
  renderTable(GestionAlquileres);

  elements.searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderTable(filteredAlquileres());
  });

  elements.form.addEventListener("submit", function (e) {
    e.preventDefault();

    const alquiler = {
      fecha_inicio: elements.fecha_inicio.value,
      fecha_fin: elements.fecha_fin.value,
      numero_viajes: Number(elements.numero_viajes.value),
      kilometros_recorridos: Number(elements.kilometros_recorridos.value),
      horometro_inicio: Number(elements.horometro_inicio.value),
      horometro_fin: Number(elements.horometro_fin.value),
      tipo_trabajo: elements.tipo_trabajo.value,
      concepto: elements.concepto.value,
      tarifa_base: Number(elements.tarifa_base.value),
      monto_total: Number(elements.monto_total.value),
      id_recibo: elements.id_recibo.value
    };

    if (isEditing) {
      GestionAlquileres[currentIndex] = alquiler;
    } else {
      GestionAlquileres.push(alquiler);
    }

    closeModal();
    renderTable(filteredAlquileres());
  });

  elements.btnCancel.addEventListener("click", closeModal);
  modalElements.btnOpenModal.addEventListener("click", () => {
    resetForm();
    openModal();
  });
  modalElements.btnCloseModal?.addEventListener("click", closeModal);
  viewModalElements.btnCloseViewModal?.addEventListener("click", closeViewModal);
});
