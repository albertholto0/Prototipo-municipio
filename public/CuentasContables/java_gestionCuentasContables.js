const API_BASE = "http://localhost:5000/api/cuentasContables";

// Variables de estado globales
let isEditing = false;             // Modo edición
let editingId = null;              // ID de la cuenta en edición (id_cuentaContable)
let cuentasContables = [];         // Datos del servidor
let currentPage = 1;               // Página actual
const rowsPerPage = 10;            // Filas por página

// — Función global para mostrar un Bootstrap Toast —
function showToast(message, type = 'success') {
  const icons = {
    success: '<i class="bi bi-check-circle-fill me-2"></i>',
    danger:  '<i class="bi bi-x-circle-fill me-2"></i>',
    warning: '<i class="bi bi-exclamation-triangle-fill me-2"></i>',
    info:    '<i class="bi bi-info-circle-fill me-2"></i>'
  };
  const toastId = `toast${Date.now()}`;
  const html = `
    <div id="${toastId}" class="toast align-items-center text-bg-${type} border-0 mb-2" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">
          ${icons[type] || ''}${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
      </div>
    </div>
  `;
  document.getElementById('liveToastContainer').insertAdjacentHTML('beforeend', html);
  const toastEl = document.getElementById(toastId);
  new bootstrap.Toast(toastEl, { delay: 3000 }).show();
  toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}

// Mapeo de elementos del DOM
const elements = {
  tableBody: document.querySelector("#accountsTable tbody"),
  searchInput: document.getElementById("searchInput"),
  form: document.getElementById("accountForm"),
  numeroCuenta: document.getElementById("numeroCuenta"),     
  nombreCuenta: document.getElementById("nombreCuenta"),
  btnAddOrUpdate: document.getElementById("btnAddOrUpdate"),
  btnCancel: document.getElementById("btnCancel"),
  formTitle: document.getElementById("formTitle"),
  paginationContainer: document.querySelector(".pagination"),
  modalOverlay: document.getElementById("modalOverlay"),
  btnOpenModal: document.getElementById("btnOpenModal"),
  btnCloseModal: document.getElementById("btnCloseModal")
};

/* === RENDER === */
function renderTable(data) {
  elements.tableBody.innerHTML = "";
  const start = (currentPage - 1) * rowsPerPage;
  const paginated = data.slice(start, start + rowsPerPage);

  paginated.forEach((cuenta, idx) => {
    const i = start + idx;
    const activo = cuenta.estado === 1;
    elements.tableBody.insertAdjacentHTML(
      "beforeend",
      `
      <tr>
        <td>${cuenta.clave_cuentaContable}</td>
        <td>${cuenta.nombre_cuentaContable}</td>
        <td class="cell-estado">${activo ? 'Activo' : 'Inactivo'}</td>
        <td>
          <button class="action-btn edit" onclick="editAccount(${i})" title="Editar">
            <img src="/public/Assets/editor.png" class="action-icon">
          </button>
          <button class="action-btn delete" onclick="deleteAccount(${i})" title="Eliminar">
            <img src="/public/Assets/eliminar.png" class="action-icon">
          </button>
          ${
            activo
            ? `<button class="action-btn down" onclick="openToggleModal(${cuenta.id_cuentaContable}, false)" title="Desactivar cuenta">
                 <img src="/public/Assets/baja.png" class="action-icon">
               </button>`
            : `<button class="action-btn up" onclick="openToggleModal(${cuenta.id_cuentaContable}, true)" title="Activar cuenta">
                 <img src="/public/Assets/alta.png" class="action-icon">
               </button>`
          }
        </td>
      </tr>`
    );
  });

  renderPagination(data.length);
}

function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  let html = `<button class="pagination-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? "disabled" : ""}>« Anterior</button>`;
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  if (startPage > 1) {
    html += `<button class="pagination-btn" onclick="changePage(1)">1</button>${startPage > 2 ? '<span>...</span>' : ''}`;
  }
  for (let p = startPage; p <= endPage; p++) {
    html += `<button class="pagination-btn ${p === currentPage ? "active" : ""}" onclick="changePage(${p})">${p}</button>`;
  }
  if (endPage < totalPages) {
    html += `${endPage < totalPages - 1 ? '<span>...</span>' : ''}<button class="pagination-btn" onclick="changePage(${totalPages})">${totalPages}</button>`;
  }
  html += `<button class="pagination-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? "disabled" : ""}>Siguiente »</button>`;

  elements.paginationContainer.innerHTML = html;
}

window.changePage = function(page) {
  const filtered = filteredAccounts();
  currentPage = Math.max(1, Math.min(page, Math.ceil(filtered.length / rowsPerPage)));
  renderTable(filtered);
};

function filteredAccounts() {
  const term = elements.searchInput.value.toLowerCase();
  return cuentasContables.filter(c =>
    String(c.clave_cuentaContable).includes(term) ||
    c.nombre_cuentaContable.toLowerCase().includes(term)
  );
}

/* === CRUD === */

async function cargarCuentasContables() {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error(res.statusText);
    cuentasContables = await res.json();
    renderTable(filteredAccounts());
  } catch (err) {
    console.error("Error al cargar cuentas contables:", err);
    elements.tableBody.innerHTML = '<tr><td colspan="4">Error al cargar los datos :(</td></tr>';
    showToast('Error al cargar las cuentas.', 'danger');
  }
}

async function handleSubmit(e) {
  e.preventDefault();
  const payload = {
    clave_cuentaContable: Number(elements.numeroCuenta.value),
    nombre_cuentaContable: elements.nombreCuenta.value,
  };
  const opts = {
    method: isEditing ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  };
  const url = isEditing ? `${API_BASE}/${editingId}` : API_BASE;

  const wasEditing = isEditing; // guardamos el estado antes de enviar

  try {
    const res = await fetch(url, opts);
    if (!res.ok) throw new Error(res.statusText);

    await cargarCuentasContables();
    closeModal();

    showToast(
      wasEditing ? 'Cuenta actualizada con éxito' : 'Cuenta agregada con éxito',
      'success'
    );
  } catch (err) {
    console.error("Error guardando cuenta:", err);
    showToast('No se pudo guardar la cuenta.', 'danger');
  }
}

window.deleteAccount = async function(index) {
  // usamos id_cuentaContable para eliminar
  const { id_cuentaContable } = cuentasContables[index];
  if (!confirm("¿Confirmar eliminación?")) return;
  try {
    const res = await fetch(`${API_BASE}/${id_cuentaContable}`, { method: "DELETE" });
    if (!res.ok) throw new Error(res.statusText);
    await cargarCuentasContables();
    showToast('Cuenta eliminada con éxito', 'warning');
  } catch (err) {
    console.error("Error al eliminar cuenta:", err);
    showToast('No se pudo eliminar la cuenta.', 'danger');
  }
};


/* === TOGGLE ESTADO === */
async function openToggleModal(id, activar) {
  const msg = activar
    ? '¿Estás seguro de activar esta cuenta?'
    : '¿Estás seguro de desactivar esta cuenta?';
  if (!confirm(msg)) return;

  try {
    const res = await fetch(`${API_BASE}/toggle-estado`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ id_cuentaContable: id })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error cambiando estado');

    showToast(data.message,'success');
    await cargarCuentasContables();
  } catch (err) {
    console.error(err);
    showToast(err.message,'danger');
  }
}

/* === MODAL Y EVENTOS === */

function openModal() {
  if (!isEditing) {
    elements.form.reset();
    elements.formTitle.textContent = "Agregar Cuenta Contable";
    elements.btnAddOrUpdate.textContent = "Agregar";
  }
  elements.modalOverlay.style.display = "block";
}

function closeModal() {
  elements.modalOverlay.style.display = "none";
  isEditing = false;
  editingId = null;
}

window.editAccount = function(index) {
  const cuenta = cuentasContables[index];
  isEditing = true;
  editingId = cuenta.id_cuentaContable;

  openModal();

  // cargamos el formulario con los datos existentes:
  elements.numeroCuenta.value = cuenta.clave_cuentaContable;
  elements.nombreCuenta.value = cuenta.nombre_cuentaContable;
  elements.formTitle.textContent = "Editar Cuenta Contable";
  elements.btnAddOrUpdate.textContent = "Actualizar";
};

elements.form.addEventListener("submit", handleSubmit);
elements.btnCancel.addEventListener("click", e => {
  e.preventDefault();
  closeModal();
});
elements.searchInput.addEventListener("input", () => {
  currentPage = 1;
  renderTable(filteredAccounts());
});

document.addEventListener("DOMContentLoaded", () => {
  elements.btnOpenModal.addEventListener("click", openModal);
  elements.btnCloseModal.addEventListener("click", closeModal);
  cargarCuentasContables();
});
