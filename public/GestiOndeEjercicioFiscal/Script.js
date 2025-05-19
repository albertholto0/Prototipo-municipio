// Datos iniciales de ejemplo para Ejercicios Fiscales
let ejerciciosFiscales = [
  {
      id_ejercicio: 1,
      anio: 2024,
      fecha_inicio: "2024-01-01",
      fecha_fin: "2024-12-31",
      estado: "activo",
      presupuesto_asignado: 5000000.00,
      presupuesto_ejecutado: 1250000.00,
      observaciones: "Ejercicio fiscal del año 2024"
  },
  {
      id_ejercicio: 2,
      anio: 2023,
      fecha_inicio: "2023-01-01",
      fecha_fin: "2023-12-31",
      estado: "finalizado",
      presupuesto_asignado: 4800000.00,
      presupuesto_ejecutado: 4750000.00,
      observaciones: "Ejercicio fiscal del año 2023"
  }
];

// Variables de estado globales
let isEditing = false;
let currentIndex = null;
let currentPage = 1;
const rowsPerPage = 10;

// Mapeo de elementos del DOM
const elements = {
  tableBody: document.querySelector("#fiscalTable tbody"),
  searchInput: document.getElementById("searchInput"),
  form: document.getElementById("fiscalForm"),
  anio: document.getElementById("anio"),
  fecha_inicio: document.getElementById("fecha_inicio"),
  fecha_fin: document.getElementById("fecha_fin"),
  estado: document.getElementById("estado"),
  presupuesto_asignado: document.getElementById("presupuesto_asignado"),
  presupuesto_ejecutado: document.getElementById("presupuesto_ejecutado"),
  observaciones: document.getElementById("observaciones"),
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

  paginatedData.forEach((ejercicio, index) => {
      const row = `
      <tr>
          <td>${ejercicio.anio}</td>
          <td>${formatDate(ejercicio.fecha_inicio)}</td>
          <td>${formatDate(ejercicio.fecha_fin)}</td>
          <td><span class="estado-badge ${ejercicio.estado}">${capitalizeFirstLetter(ejercicio.estado)}</span></td>
          <td>$${ejercicio.presupuesto_asignado.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          <td>$${ejercicio.presupuesto_ejecutado.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          <td>${ejercicio.observaciones || '-'}</td>
          <td class="actions-cell">
              <button class="action-btn edit" onclick="editFiscal(${start + index})" title="Editar">
                  <img src="/Assets/editor.png" class="action-icon" alt="Editar">
              </button>
              <button class="action-btn delete" onclick="deleteFiscal(${start + index})" title="Eliminar">
                  <img src="/Assets/eliminar.png" class="action-icon" alt="Eliminar">
              </button>
          </td>
      </tr>
      `;
      elements.tableBody.insertAdjacentHTML("beforeend", row);
  });

  renderPagination(data.length);
}

/**
* Formatea una fecha en formato YYYY-MM-DD a DD/MM/YYYY
* @param {string} dateString 
* @returns {string}
*/
function formatDate(dateString) {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
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
          ${startPage > 2 ? '<span class="pagination-ellipsis">...</span>' : ''}
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
          ${endPage < totalPages - 1 ? '<span class="pagination-ellipsis">...</span>' : ''}
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
  renderTable(filteredFiscal());
});

/* === FUNCIONES AUXILIARES === */

/**
* Filtra los ejercicios fiscales según el término de búsqueda.
* Detecta automáticamente si se busca por año o por estado.
* @returns {Array} Datos filtrados.
*/
function filteredFiscal() {
  const term = elements.searchInput.value.toLowerCase().trim();
  
  if (term === "") {
      return ejerciciosFiscales; // Si no hay término de búsqueda, retorna todos los datos
  }
  
  // Detecta si el término es numérico (buscar por año)
  const isNumeric = /^\d+$/.test(term);
  
  if (isNumeric) {
      // Búsqueda por año
      return ejerciciosFiscales.filter(ejercicio => 
          ejercicio.anio.toString().includes(term));
  } else {
      // Búsqueda por estado
      return ejerciciosFiscales.filter(ejercicio => 
          ejercicio.estado.toLowerCase().includes(term));
  }
}

/**
* Maneja el envío del formulario (crear/actualizar).
* @param {Event} e - Evento del formulario.
*/
function handleSubmit(e) {
  e.preventDefault();
  
  // Validar fechas
  const fechaInicio = new Date(elements.fecha_inicio.value);
  const fechaFin = new Date(elements.fecha_fin.value);
  
  if (fechaFin < fechaInicio) {
      alert("La fecha de fin no puede ser anterior a la fecha de inicio");
      return;
  }
  
  // Validar presupuestos
  const presupuestoAsignado = parseFloat(elements.presupuesto_asignado.value);
  const presupuestoEjecutado = parseFloat(elements.presupuesto_ejecutado.value);
  
  if (presupuestoEjecutado > presupuestoAsignado) {
      alert("El presupuesto ejecutado no puede ser mayor al presupuesto asignado");
      return;
  }

  const ejercicio = {
      id_ejercicio: isEditing ? ejerciciosFiscales[currentIndex].id_ejercicio : generateId(),
      anio: parseInt(elements.anio.value),
      fecha_inicio: elements.fecha_inicio.value,
      fecha_fin: elements.fecha_fin.value,
      estado: elements.estado.value,
      presupuesto_asignado: presupuestoAsignado,
      presupuesto_ejecutado: presupuestoEjecutado,
      observaciones: elements.observaciones.value
  };

  if (isEditing) {
      ejerciciosFiscales[currentIndex] = ejercicio;
  } else {
      // Validar que no exista ya un ejercicio con el mismo año
      if (ejerciciosFiscales.some(e => e.anio === ejercicio.anio && e.id_ejercicio !== ejercicio.id_ejercicio)) {
          alert("Ya existe un ejercicio fiscal para este año");
          return;
      }
      ejerciciosFiscales.push(ejercicio);
  }

  closeModal();
  renderTable(filteredFiscal());
}

/**
* Genera un nuevo ID para el ejercicio fiscal
* @returns {number} Nuevo ID
*/
function generateId() {
  const maxId = ejerciciosFiscales.reduce((max, ejercicio) => 
      ejercicio.id_ejercicio > max ? ejercicio.id_ejercicio : max, 0);
  return maxId + 1;
}

/**
* Cambia a una página específica.
* @param {number} page - Número de página a mostrar.
*/
window.changePage = function (page) {
  if (page < 1 || page > Math.ceil(filteredFiscal().length / rowsPerPage)) return;
  currentPage = page;
  renderTable(filteredFiscal());
};

/**
* Inicia el modo edición para un ejercicio fiscal.
* @param {number} index - Índice del ejercicio a editar.
*/
window.editFiscal = function (index) {
  const ejercicio = ejerciciosFiscales[index];
  elements.anio.value = ejercicio.anio;
  elements.fecha_inicio.value = ejercicio.fecha_inicio;
  elements.fecha_fin.value = ejercicio.fecha_fin;
  elements.estado.value = ejercicio.estado;
  elements.presupuesto_asignado.value = ejercicio.presupuesto_asignado;
  elements.presupuesto_ejecutado.value = ejercicio.presupuesto_ejecutado;
  elements.observaciones.value = ejercicio.observaciones || '';
  isEditing = true;
  currentIndex = index;
  elements.formTitle.textContent = "Editar Ejercicio Fiscal";
  elements.btnAddOrUpdate.textContent = "Actualizar";
  openModal();
};

/**
* Elimina un ejercicio fiscal después de confirmación.
* @param {number} index - Índice del ejercicio a eliminar.
*/
window.deleteFiscal = function (index) {
  // Validar que no haya registros relacionados (simulado)
  const ejercicio = ejerciciosFiscales[index];
  const tieneRegistros = false; // En una aplicación real, verificarías en la base de datos
  
  if (tieneRegistros) {
      alert("No se puede eliminar el ejercicio fiscal porque tiene registros relacionados");
      return;
  }
  
  if (confirm("¿Confirmar eliminación del ejercicio fiscal?")) {
      ejerciciosFiscales.splice(index, 1);
      const totalPages = Math.ceil(filteredFiscal().length / rowsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
          currentPage = totalPages;
      }
      renderTable(filteredFiscal());
  }
};

/**
* Reinicia el formulario a su estado inicial.
*/
function resetForm() {
  elements.form.reset();
  isEditing = false;
  currentIndex = null;
  elements.formTitle.textContent = "Registrar Ejercicio Fiscal";
  elements.btnAddOrUpdate.textContent = "Guardar";
}

/**
* Capitaliza la primera letra de un string
* @param {string} string 
* @returns string
*/
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/* === INICIALIZACIÓN === */
document.addEventListener("DOMContentLoaded", () => {
  renderTable(ejerciciosFiscales);
});

// Elementos del modal
const modalElements = {
  modalOverlay: document.getElementById('modalOverlay'),
  btnOpenModal: document.getElementById('btnOpenModal'),
  btnCloseModal: document.getElementById('btnCloseModal')
};

/* === FUNCIONES DEL MODAL === */
function openModal() {
  modalElements.modalOverlay.style.display = 'flex';
}

function closeModal() {
  modalElements.modalOverlay.style.display = 'none';
  resetForm();
}

// Abrir modal para nuevo ejercicio fiscal
modalElements.btnOpenModal.addEventListener('click', () => {
  resetForm();
  // Establecer año actual como valor por defecto
  elements.anio.value = new Date().getFullYear();
  // Establecer fechas por defecto (1 de enero a 31 de diciembre del año seleccionado)
  elements.fecha_inicio.value = `${elements.anio.value}-01-01`;
  elements.fecha_fin.value = `${elements.anio.value}-12-31`;
  openModal();
});

// Cerrar modal con botón X
modalElements.btnCloseModal.addEventListener('click', closeModal);

// Cerrar modal al hacer clic fuera del contenido
modalElements.modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalElements.modalOverlay) {
      closeModal();
  }
});