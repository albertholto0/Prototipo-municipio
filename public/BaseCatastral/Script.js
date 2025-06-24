const API_BASE = 'http://localhost:5000/api/baseCatastral';
const API_CONTRIB = 'http://localhost:5000/api/contribuyentes';

// Estado global
defaults = {
  bases: [],
  contribuyentes: [],
  isEditing: false,
  editingId: null,
  currentPage: 1,
  rowsPerPage: 10
};

// — Función global para mostrar un Bootstrap Toast —
function showToast(message, type = 'success') {
  const icons = {
    success: '<i class="bi bi-check-circle-fill me-2"></i>',
    danger: '<i class="bi bi-x-circle-fill me-2"></i>',
    warning: '<i class="bi bi-exclamation-triangle-fill me-2"></i>',
    info: '<i class="bi bi-info-circle-fill me-2"></i>'
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
  const bsToast = new bootstrap.Toast(toastEl, { delay: 3000 });
  bsToast.show();
  toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}

// Mapeo de elementos del DOM
elems = {
  tableBody: document.querySelector('#accountsTable tbody'),
  searchInput: document.getElementById('searchInput'),
  form: document.getElementById('accountForm'),
  contribSelect: document.getElementById('contribuyenteSelect'),
  claveCatastral: document.getElementById('claveCatastral'),
  baseCatastral: document.getElementById('baseCatastral'),
  ubicacion: document.getElementById('ubicacion'),
  barrio: document.getElementById('barrio'),
  impuestoCalculado: document.getElementById('impuestoCalculado'),
  fechaAvaluo: document.getElementById('fechaAvaluo'),
  historialAvaluos: document.getElementById('historialAvaluos'),
  btnAddOrUpdate: document.getElementById('btnAddOrUpdate'),
  btnCancel: document.getElementById('btnCancel'),
  pagination: document.querySelector('.pagination'),
  modalOverlay: document.getElementById('modalOverlay'),
  btnOpenModal: document.getElementById('btnOpenModal'),
  btnCloseModal: document.getElementById('btnCloseModal'),
  viewModalOverlay: document.getElementById('viewModalOverlay'),
  btnCloseViewModal: document.getElementById('btnCloseViewModal'),
  infoContent: document.getElementById('infoContent'),
  formTitle: document.getElementById('formTitle')
};

// Funciones de formato de fechas

// Convierte fecha para input type="date" (YYYY-MM-DD)
function formatDateToInput(dateInput) {
  if (!dateInput) return '';
  const date = (dateInput instanceof Date) ? dateInput : new Date(dateInput);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Convierte fecha ISO o Date a formato dd/mm/yyyy para mostrar
function formatDateToDMY(dateInput) {
  if (!dateInput) return '';
  const date = (dateInput instanceof Date) ? dateInput : new Date(dateInput);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// — FUNCIONES API —
async function fetchBases() {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error(res.statusText);
    defaults.bases = await res.json();
  } catch (err) {
    console.error(err);
    showToast('Error al cargar las bases catastrales', 'danger');
  }
}
async function fetchContribuyentes() {
  const res = await fetch(API_CONTRIB);
  defaults.contribuyentes = await res.json();
  populateContribSelect();
}
async function createBase(data) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Error al crear base');
  return result;
}

async function updateBase(id, data) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

async function deleteBase(id) {
  await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
}

// — RENDERIZADO —
function renderTable(data) {
  elems.tableBody.innerHTML = '';
  const start = (defaults.currentPage - 1) * defaults.rowsPerPage;
  const slice = data.slice(start, start + defaults.rowsPerPage);
  slice.forEach((b, i) => {
    const prop = defaults.contribuyentes.find(c => c.id_contribuyente === b.id_contribuyente)?.nombre || '-';
    elems.tableBody.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${b.cuenta}</td>
        <td>${prop}</td>
        <td>${b.ubicacion}</td>
        <td>${b.base_catastral}</td>
        <td>
          <button class="action-btn edit" onclick="editAccount(${start + i})" title="Editar">
            <img src="/public/Assets/editor.png" class="action-icon">
          </button>
          <button class="action-btn delete" onclick="deleteAccount(${start + i})" title="Eliminar">
            <img src="/public/Assets/eliminar.png" class="action-icon">
          </button>
          <button class="action-btn view" onclick="viewAccount(${start + i})" title="Ver información">
            <img src="/public/Assets/visualizar.png" class="action-icon">
          </button>
        </td>
      </tr>
    `);
  });
  renderPagination(data.length);
}
function renderPagination(total) {
  const pages = Math.ceil(total / defaults.rowsPerPage);
  let html = `<button class="pagination-btn" onclick="changePage(${defaults.currentPage - 1})" ${defaults.currentPage === 1 ? 'disabled' : ''}>« Anterior</button>`;
  const startPage = Math.max(1, defaults.currentPage - 2);
  const endPage = Math.min(pages, defaults.currentPage + 2);
  if (startPage > 1) html += `<button class="pagination-btn" onclick="changePage(1)">1</button>${startPage > 2 ? '<span>...</span>' : ''}`;
  for (let p = startPage; p <= endPage; p++) {
    html += `<button class="pagination-btn ${p === defaults.currentPage ? 'active' : ''}" onclick="changePage(${p})">${p}</button>`;
  }
  if (endPage < pages) html += `${endPage < pages - 1 ? '<span>...</span>' : ''}<button class="pagination-btn" onclick="changePage(${pages})">${pages}</button>`;
  html += `<button class="pagination-btn" onclick="changePage(${defaults.currentPage + 1})" ${defaults.currentPage === pages ? 'disabled' : ''}>Siguiente »</button>`;
  elems.pagination.innerHTML = html;
}

// — FILTRADO y PAGINACIÓN —
function filtered() {
  const term = elems.searchInput.value.toLowerCase();
  return defaults.bases.filter(b => {
    const prop = defaults.contribuyentes.find(c => c.id_contribuyente === b.id_contribuyente)?.nombre.toLowerCase() || '';
    return b.cuenta.toLowerCase().includes(term) || prop.includes(term);
  });
}
function changePage(p) {
  const maxPage = Math.ceil(filtered().length / defaults.rowsPerPage);
  defaults.currentPage = Math.max(1, Math.min(p, maxPage));
  renderTable(filtered());
}

// — CRUD HANDLERS —
async function handleSubmit(e) {
  e.preventDefault();
  const payload = {
    cuenta: elems.claveCatastral.value,
    id_contribuyente: +elems.contribSelect.value,
    base_catastral: parseFloat(elems.baseCatastral.value),
    ubicacion: elems.ubicacion.value,
    barrio: elems.barrio.value,
    impuesto_calculado: parseFloat(elems.impuestoCalculado.value),
    fecha_avaluo: elems.fechaAvaluo.value,
    historial_avaluos: elems.historialAvaluos.value
  };

  try {
    if (defaults.isEditing) {
      await updateBase(defaults.editingId, payload);
      showToast('Base catastral actualizada exitosamente', 'success');
    } else {
      await createBase(payload);
      showToast('Base catastral agregada exitosamente', 'success');
    }
    await refresh();
    closeModal();
  } catch (err) {
    console.error(err);
    showToast(err.message || 'Error inesperado al guardar', 'danger');
  }
}

elems.form.addEventListener('submit', handleSubmit);
elems.btnCancel.addEventListener('click', closeModal);
elems.searchInput.addEventListener('input', () => {
  defaults.currentPage = 1;
  renderTable(filtered());
});

// — FUNCIONES GLOBALES —
window.deleteAccount = async idx => {
  if (confirm('¿Confirmar eliminación?')) {
    try {
      await deleteBase(filtered()[idx].id_base_catastral);
      await refresh();
      showToast('Base catastral eliminada', 'warning');
    } catch (err) {
      console.error(err);
      showToast('Error al eliminar la base catastral', 'danger');
    }
  }
};

window.editAccount = idx => {
  const b = filtered()[idx];
  defaults.isEditing = true;
  defaults.editingId = b.id_base_catastral;
  elems.claveCatastral.value = b.cuenta;
  elems.contribSelect.value = b.id_contribuyente;
  elems.baseCatastral.value = b.base_catastral;
  elems.ubicacion.value = b.ubicacion;
  elems.barrio.value = b.barrio;
  elems.impuestoCalculado.value = b.impuesto_calculado;
  elems.fechaAvaluo.value = formatDateToInput(b.fecha_avaluo); // Formato para input date
  elems.historialAvaluos.value = b.historial_avaluos;
  elems.formTitle.textContent = 'Editar Base Catastral';
  elems.btnAddOrUpdate.textContent = 'Actualizar';
  openModal();
};

window.viewAccount = idx => {
  const b = filtered()[idx];
  elems.infoContent.innerHTML = `
    <p><strong>Clave Catastral:</strong> ${b.cuenta}</p>
    <p><strong>Propietario:</strong> ${defaults.contribuyentes.find(c => c.id_contribuyente === b.id_contribuyente)?.nombre}</p>
    <p><strong>Ubicación:</strong> ${b.ubicacion}</p>
    <p><strong>Barrio:</strong> ${b.barrio}</p>
    <p><strong>Base Catastral:</strong> ${b.base_catastral}</p>
    <p><strong>Impuesto Calculado:</strong> ${b.impuesto_calculado}</p>
    <p><strong>Fecha de Avalúo:</strong> ${formatDateToDMY(b.fecha_avaluo) || 'N/A'}</p>
    <p><strong>Historial de Avalúos:</strong> ${b.historial_avaluos || 'N/A'}</p>
  `;
  openViewModal();
};

elems.btnCloseViewModal.addEventListener('click', () => elems.viewModalOverlay.style.display = 'none');

// — MODALES —
function openModal() {
  elems.modalOverlay.style.display = 'block';
}
function closeModal() {
  elems.modalOverlay.style.display = 'none';
  defaults.isEditing = false;
  defaults.editingId = null;
  elems.form.reset();
  elems.formTitle.textContent = 'Agregar Base Catastral';
  elems.btnAddOrUpdate.textContent = 'Agregar';
}
function openViewModal() {
  elems.viewModalOverlay.style.display = 'block';
}

// — CONSTRUIR SELECT —
function populateContribSelect() {
  elems.contribSelect.innerHTML = '<option value="">-- selecciona propietario --</option>';
  defaults.contribuyentes.forEach(c =>
    elems.contribSelect.insertAdjacentHTML('beforeend', `<option value="${c.id_contribuyente}">${c.nombre}</option>`)
  );
}

// — INICIALIZACIÓN —
async function refresh() {
  await Promise.all([fetchContribuyentes(), fetchBases()]);
  renderTable(filtered());
}
document.addEventListener('DOMContentLoaded', () => {
  elems.btnOpenModal.addEventListener('click', () => { elems.form.reset(); openModal(); });
  elems.btnCloseModal.addEventListener('click', closeModal);
  refresh();
});
