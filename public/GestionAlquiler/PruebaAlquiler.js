// Datos iniciales de ejemplo para  la gestión de alquileres
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

// Variables de estado globales
let isEditing = false;        // Bandera para modo edición
let currentIndex = null;      // Índice del elemento siendo editado
let currentPage = 1;          // Página actual
const rowsPerPage = 10;       // Filas por página

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

/* === FUNCIONES PRINCIPALES === */

/**
* Renderiza la tabla con los datos proporcionados.
* @param {Array} data - Datos a mostrar en la tabla.
*/
function renderTable(data) {
  elements.tableBody.innerHTML = "";
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedData = data.slice(start, end);

  // Genera las filas de la tabla con paginación
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

/**
* Renderiza los controles de paginación.
* @param {number} totalItems - Total de elementos a paginar.
*/
function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  let paginationHTML = `
        <button class="pagination-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            « Anterior
        </button>
    `;

  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  if (startPage > 1) {
    paginationHTML += `
            <button class="pagination-btn" onclick="changePage(1)">1</button>
            ${startPage > 2 ? '<span>...</span>' : ''}
        `;
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
            <button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
                ${i}
            </button>
        `;
  }

  if (endPage < totalPages) {
    paginationHTML += `
            ${endPage < totalPages - 1 ? '<span>...</span>' : ''}
            <button class="pagination-btn" onclick="changePage(${totalPages})">${totalPages}</button>
        `;
  }

  paginationHTML += `
        <button class="pagination-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            Siguiente »
        </button>
    `;
  elements.paginationContainer.innerHTML = paginationHTML;
}

/* === MANEJADORES DE EVENTOS === */

// Envío del formulario
elements.form.addEventListener("submit", handleSubmit);

// Botón cancelar
elements.btnCancel.addEventListener("click", closeModal);

// Búsqueda en tiempo real
elements.searchInput.addEventListener("input", () => {
  currentPage = 1;
  renderTable(filteredAlquileres());
});

/* === FUNCIONES AUXILIARES === */

/**
* Filtralos alquileres según el término de búsqueda.
* @returns {Array} Datos filtrados.
*/
function filteredAlquileres() {
  const term = elements.searchInput.value.toLowerCase();
  return GestionAlquileres.filter(alquiler =>
    alquiler.fecha_inicio.toLowerCase().includes(term) ||
    alquiler.tipo_trabajo.toLowerCase().includes(term) ||
    alquiler.concepto.toLowerCase().includes(term) ||
    alquiler.id_recibo.toLowerCase().includes(term)
  );
}

/**
* Maneja el envío del formulario (crear/actualizar).
* @param {Event} e - Evento del formulario.
*/
function handleSubmit(e) {
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
}

/**
* Cambia a una página específica.
* @param {number} page - Número de página a mostrar.
*/
window.changePage = function (page) {
  currentPage = page;
  renderTable(filteredAlquileres());
};

/**
* Inicia el modo edición para una base catastral.
* @param {number} index - Índice de la base a editar.
*/
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

/**
* Elimina una base catastral después de confirmación.
* @param {number} index - Índice de la base a eliminar.
*/
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

/**
* Reinicia el formulario a su estado inicial.
*/
function resetForm() {
  elements.form.reset();
  isEditing = false;
  currentIndex = null;
  elements.formTitle.textContent = "Registrar Alquiler";
  elements.btnAddOrUpdate.textContent = "Agregar";
}

/* === INICIALIZACIÓN === */
document.addEventListener("DOMContentLoaded", () => {
  renderTable(GestionAlquileres);

  // --- MODAL DE INFORMACIÓN ---
  const viewModalElements = {
    viewModalOverlay: document.getElementById('viewModalOverlay'),
    btnCloseViewModal: document.getElementById('btnCloseViewModal')
  };

  function openViewModal() {
    viewModalElements.viewModalOverlay.style.display = 'block';
  }

  function closeViewModal() {
    viewModalElements.viewModalOverlay.style.display = 'none';
  }

  viewModalElements.btnCloseViewModal.addEventListener('click', closeViewModal);

  // Haz accesible openViewModal desde window
  window.openViewModal = openViewModal;
});

// Elementos del modal
const modalElements = {
  modalOverlay: document.getElementById('modalOverlay'),
  btnOpenModal: document.getElementById('btnOpenModal'),
  btnCloseModal: document.getElementById('btnCloseModal')
};

/* === FUNCIONES DEL MODAL === */
function openModal() {
  modalElements.modalOverlay.style.display = 'block';
}

function closeModal() {
  modalElements.modalOverlay.style.display = 'none';
  resetForm();
}

// Abrir modal para nuevo alquiler
modalElements.btnOpenModal.addEventListener('click', () => {
  resetForm();
  openModal();
});

// Cerrar modal con botón X
modalElements.btnCloseModal.addEventListener('click', closeModal);

// Función para ver la información completa de un alquiler y abrir el modal de "Ver información"
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
  window.openViewModal();

  // Efecto ripple
  document.querySelectorAll('#infoContent p').forEach(item => {
    item.addEventListener('click', function (e) {
      let ripple = document.createElement('div');
      ripple.className = 'ripple-effect';
      const rect = this.getBoundingClientRect();
      ripple.style.left = (e.clientX - rect.left - 5) + 'px';
      ripple.style.top = (e.clientY - rect.top - 5) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
};

// Inicialización: renderiza la tabla al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  renderTable(GestionAlquileres);
});