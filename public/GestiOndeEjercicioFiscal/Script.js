// Variables de estado globales
let isEditing = false;
let currentIndex = null;
let currentPage = 1;
const rowsPerPage = 10;

// Mapeo de elementos del DOM
const uiElements = {
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
function renderTable(data) {
  uiElements.tableBody.innerHTML = "";
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
          <td>$${ejercicio.presupuesto_asignado.toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
          <td>$${ejercicio.presupuesto_ejecutado.toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
          <td>${ejercicio.observaciones || '-'}</td>
          <td class="actions-cell">
              <button class="action-btn edit" onclick="editFiscal(${start + index})" title="Editar">
                  <img src="/Assets/editor.png" class="action-icon" alt="Editar">
              </button>
              <button class="action-btn delete" onclick="deleteFiscal(${start + index})" title="Eliminar">
                  <img src="/Assets/eliminar.png" class="action-icon" alt="Eliminar">
              </button>
          </td>
      </tr>`;
    uiElements.tableBody.insertAdjacentHTML("beforeend", row);
  });

  renderPagination(data.length);
}

function formatDate(dateString) {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  let paginationHTML = `
      <button class="pagination-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
          « Anterior
      </button>`;

  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  if (startPage > 1) {
    paginationHTML += `
      <button class="pagination-btn" onclick="changePage(1)">1</button>
      ${startPage > 2 ? '<span class="pagination-ellipsis">...</span>' : ''}`;
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
      <button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
  }

  if (endPage < totalPages) {
    paginationHTML += `
      ${endPage < totalPages - 1 ? '<span class="pagination-ellipsis">...</span>' : ''}
      <button class="pagination-btn" onclick="changePage(${totalPages})">${totalPages}</button>`;
  }

  paginationHTML += `
      <button class="pagination-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
          Siguiente »
      </button>`;
  uiElements.paginationContainer.innerHTML = paginationHTML;
}

/* === MANEJADORES DE EVENTOS === */
uiElements.form.addEventListener("submit", handleSubmit);
uiElements.btnCancel.addEventListener("click", closeModal);
uiElements.searchInput.addEventListener("input", () => {
  currentPage = 1;
  renderTable(filteredFiscal());
});

/* === FUNCIONES AUXILIARES === */
function filteredFiscal() {
  const term = uiElements.searchInput.value.toLowerCase().trim();
  if (term === "") return ejerciciosFiscales;

  const isNumeric = /^\d+$/.test(term);
  return isNumeric
    ? ejerciciosFiscales.filter(e => e.anio.toString().includes(term))
    : ejerciciosFiscales.filter(e => e.estado.toLowerCase().includes(term));
}

function handleSubmit(e) {
  e.preventDefault();
  const fechaInicio = new Date(uiElements.fecha_inicio.value);
  const fechaFin = new Date(uiElements.fecha_fin.value);
  if (fechaFin < fechaInicio) return alert("La fecha de fin no puede ser anterior a la de inicio");

  const presupuestoAsignado = parseFloat(uiElements.presupuesto_asignado.value);
  const presupuestoEjecutado = parseFloat(uiElements.presupuesto_ejecutado.value);
  if (presupuestoEjecutado > presupuestoAsignado) return alert("El ejecutado no puede ser mayor al asignado");

  const ejercicio = {
    id_ejercicio: isEditing ? ejerciciosFiscales[currentIndex].id_ejercicio : generateId(),
    anio: parseInt(uiElements.anio.value),
    fecha_inicio: uiElements.fecha_inicio.value,
    fecha_fin: uiElements.fecha_fin.value,
    estado: uiElements.estado.value,
    presupuesto_asignado: presupuestoAsignado,
    presupuesto_ejecutado: presupuestoEjecutado,
    observaciones: uiElements.observaciones.value
  };

  if (isEditing) {
    ejerciciosFiscales[currentIndex] = ejercicio;
  } else {
    if (ejerciciosFiscales.some(e => e.anio === ejercicio.anio)) return alert("Ya existe un ejercicio para ese año");
    ejerciciosFiscales.push(ejercicio);
  }

  closeModal();
  renderTable(filteredFiscal());
}

function generateId() {
  const maxId = ejerciciosFiscales.reduce((max, e) => e.id_ejercicio > max ? e.id_ejercicio : max, 0);
  return maxId + 1;
}

window.changePage = function (page) {
  if (page < 1 || page > Math.ceil(filteredFiscal().length / rowsPerPage)) return;
  currentPage = page;
  renderTable(filteredFiscal());
};

window.editFiscal = function (index) {
  const e = ejerciciosFiscales[index];
  uiElements.anio.value = e.anio;
  uiElements.fecha_inicio.value = e.fecha_inicio;
  uiElements.fecha_fin.value = e.fecha_fin;
  uiElements.estado.value = e.estado;
  uiElements.presupuesto_asignado.value = e.presupuesto_asignado;
  uiElements.presupuesto_ejecutado.value = e.presupuesto_ejecutado;
  uiElements.observaciones.value = e.observaciones || '';
  isEditing = true;
  currentIndex = index;
  uiElements.formTitle.textContent = "Editar Ejercicio Fiscal";
  uiElements.btnAddOrUpdate.textContent = "Actualizar";
  openModal();
};

window.deleteFiscal = function (index) {
  const ejercicio = ejerciciosFiscales[index];
  if (confirm("¿Confirmar eliminación del ejercicio fiscal?")) {
    ejerciciosFiscales.splice(index, 1);
    const totalPages = Math.ceil(filteredFiscal().length / rowsPerPage);
    if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
    renderTable(filteredFiscal());
  }
};

function resetForm() {
  uiElements.form.reset();
  isEditing = false;
  currentIndex = null;
  uiElements.formTitle.textContent = "Registrar Ejercicio Fiscal";
  uiElements.btnAddOrUpdate.textContent = "Guardar";
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/* === MODAL === */
const modalElements = {
  modalOverlay: document.getElementById('modalOverlay'),
  btnOpenModal: document.getElementById('btnOpenModal'),
  btnCloseModal: document.getElementById('btnCloseModal')
};

function openModal() {
  modalElements.modalOverlay.style.display = 'flex';
}

function closeModal() {
  modalElements.modalOverlay.style.display = 'none';
  resetForm();
}

modalElements.btnOpenModal.addEventListener('click', () => {
  resetForm();
  uiElements.anio.value = new Date().getFullYear();
  uiElements.fecha_inicio.value = `${uiElements.anio.value}-01-01`;
  uiElements.fecha_fin.value = `${uiElements.anio.value}-12-31`;
  openModal();
});

modalElements.btnCloseModal.addEventListener('click', closeModal);
modalElements.modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalElements.modalOverlay) closeModal();
});
