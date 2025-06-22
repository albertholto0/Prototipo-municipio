// Variables de estado globales
let isEditing = false;             // Modo edición
let editingId = null;              // ID de la cuenta en edición
let cuentasContables = [];         // Datos del servidor
let currentPage = 1;               // Página actual
const rowsPerPage = 10;            // Filas por página
const API_BASE = "http://localhost:5000/api/cuentasContables";

// Mapeo de elementos del DOM
const elements = {
  tableBody: document.querySelector("#accountsTable tbody"),
  searchInput: document.getElementById("searchInput"),
  form: document.getElementById("accountForm"),
  numeroCuenta: document.getElementById("numeroCuenta"),
  nombreCuenta: document.getElementById("nombreCuenta"),
  estado: document.getElementById("estado"),
  btnAddOrUpdate: document.getElementById("btnAddOrUpdate"),
  btnCancel: document.getElementById("btnCancel"),
  formTitle: document.getElementById("formTitle"),
  paginationContainer: document.querySelector(".pagination"),
  modalOverlay: document.getElementById("modalOverlay"),
  btnOpenModal: document.getElementById("btnOpenModal"),
  btnCloseModal: document.getElementById("btnCloseModal")
};

/* === FUNCIONES DE RENDER === */

function renderTable(data) {
  elements.tableBody.innerHTML = "";
  const start = (currentPage - 1) * rowsPerPage;
  const paginated = data.slice(start, start + rowsPerPage);

  paginated.forEach((cuenta, idx) => {
    const i = start + idx;
    const estadoText = cuenta.estado ? "Activo" : "Inactivo";
    elements.tableBody.insertAdjacentHTML(
      "beforeend",
      `
      <tr>
        <td>${cuenta.clave_cuenta_contable}</td>
        <td>${cuenta.nombre_cuentaContable}</td>
        <td>${estadoText}</td>
        <td>
          <button class="action-btn edit" onclick="editAccount(${i})" title="Editar">
            <img src="/public/Assets/editor.png" class="action-icon">
          </button>
          <button class="action-btn delete" onclick="deleteAccount(${i})" title="Eliminar">
            <img src="/public/Assets/eliminar.png" class="action-icon">
          </button>
        </td>
      </tr>`
    );
  });

  renderPagination(data.length);
}

function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  let html = `<button class="pagination-btn" onclick="changePage(${currentPage - 1})" ${currentPage===1?"disabled":""}>« Anterior</button>`;
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  if (startPage > 1) {
    html += `<button class="pagination-btn" onclick="changePage(1)">1</button>${startPage>2?'<span>...</span>':''}`;
  }
  for (let p = startPage; p <= endPage; p++) {
    html += `<button class="pagination-btn ${p===currentPage?"active":""}" onclick="changePage(${p})">${p}</button>`;
  }
  if (endPage < totalPages) {
    html += `${endPage<totalPages-1?'<span>...</span>':''}<button class="pagination-btn" onclick="changePage(${totalPages})">${totalPages}</button>`;
  }
  html += `<button class="pagination-btn" onclick="changePage(${currentPage + 1})" ${currentPage===totalPages?"disabled":""}>Siguiente »</button>`;

  elements.paginationContainer.innerHTML = html;
}

window.changePage = function(page) {
  const filtered = filteredAccounts();
  currentPage = Math.max(1, Math.min(page, Math.ceil(filtered.length/rowsPerPage)));
  renderTable(filtered);
};

function filteredAccounts() {
  const term = elements.searchInput.value.toLowerCase();
  return cuentasContables.filter(c =>
    c.clave_cuenta_contable.toString().includes(term) ||
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
  }
}

async function handleSubmit(e) {
  e.preventDefault();
  const payload = {
    clave_cuenta_contable: Number(elements.numeroCuenta.value),
    nombre_cuentaContable: elements.nombreCuenta.value,
    estado: elements.estado.value === "true"
  };
  const opts = {
    method: isEditing ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  };
  const url = isEditing ? `${API_BASE}/${editingId}` : API_BASE;

  try {
    const res = await fetch(url, opts);
    if (!res.ok) throw new Error(res.statusText);
    await cargarCuentasContables();
    closeModal();
  } catch (err) {
    console.error("Error guardando cuenta:", err);
  }
}

window.deleteAccount = async function(index) {
  const { id_cuentaContable } = cuentasContables[index];
  if (!confirm("¿Confirmar eliminación?")) return;
  try {
    const res = await fetch(`${API_BASE}/${id_cuentaContable}`, { method: "DELETE" });
    if (!res.ok) throw new Error(res.statusText);
    await cargarCuentasContables();
  } catch (err) {
    console.error("Error al eliminar cuenta:", err);
  }
};

window.editAccount = function(index) {
  const cuenta = cuentasContables[index];
  isEditing = true;
  editingId = cuenta.id_cuentaContable;

  elements.numeroCuenta.value = cuenta.clave_cuenta_contable;
  elements.nombreCuenta.value = cuenta.nombre_cuentaContable;
  elements.estado.value = cuenta.estado ? "true" : "false";
  elements.estado.disabled = false;

  elements.formTitle.textContent = "Editar Cuenta Contable";
  elements.btnAddOrUpdate.textContent = "Actualizar";
  openModal();
};

/* === MODAL Y EVENTOS === */

function openModal() {
  elements.form.reset();
  if (!isEditing) {
    elements.formTitle.textContent = "Agregar Cuenta Contable";
    elements.btnAddOrUpdate.textContent = "Agregar";
    elements.estado.value = "true";
    elements.estado.disabled = true;
  }
  elements.modalOverlay.style.display = "block";
}

function closeModal() {
  elements.modalOverlay.style.display = "none";
  isEditing = false;
  editingId = null;
  elements.estado.disabled = false;
}

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
