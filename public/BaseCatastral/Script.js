// Script.js — Cliente para CRUD de Bases Catastrales y Contribuyentes
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
  valorTerreno: document.getElementById('valorTerreno'),
  valorConstruccion: document.getElementById('valorConstruccion'),
  impuestoCalculado: document.getElementById('impuestoCalculado'),
  fechaAvaluo: document.getElementById('fechaAvaluo'),
  historialAvaluos: document.getElementById('historialAvaluos'),
  usoSuelo: document.getElementById('usoSuelo'),
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

// — FUNCIONES API —
async function fetchBases() {
  const res = await fetch(API_BASE);
  defaults.bases = await res.json();
}
async function fetchContribuyentes() {
  const res = await fetch(API_CONTRIB);
  defaults.contribuyentes = await res.json();
  populateContribSelect();
}
async function createBase(data) {
  const res = await fetch(API_BASE, {
    method: 'POST', headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  });
  return res.json();
}
async function updateBase(id, data) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT', headers: {'Content-Type': 'application/json'},
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
        <td>${b.uso_suelo}</td>
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
  let html = `<button class="pagination-btn" onclick="changePage(${defaults.currentPage-1})" ${defaults.currentPage===1?'disabled':''}>« Anterior</button>`;
  const startPage = Math.max(1, defaults.currentPage - 2);
  const endPage = Math.min(pages, defaults.currentPage + 2);
  if (startPage > 1) html += `<button class="pagination-btn" onclick="changePage(1)">1</button>${startPage>2?'<span>...</span>':''}`;
  for (let p = startPage; p <= endPage; p++) {
    html += `<button class="pagination-btn ${p===defaults.currentPage?'active':''}" onclick="changePage(${p})">${p}</button>`;
  }
  if (endPage < pages) html += `${endPage<pages-1?'<span>...</span>':''}<button class="pagination-btn" onclick="changePage(${pages})">${pages}</button>`;
  html += `<button class="pagination-btn" onclick="changePage(${defaults.currentPage+1})" ${defaults.currentPage===pages?'disabled':''}>Siguiente »</button>`;
  elems.pagination.innerHTML = html;
}

// — FILTRADO y PAGINACIÓN —
function filtered() {
  const term = elems.searchInput.value.toLowerCase();
  return defaults.bases.filter(b => {
    const prop = defaults.contribuyentes.find(c => c.id_contribuyente===b.id_contribuyente)?.nombre.toLowerCase() || '';
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
    valor_terreno: parseFloat(elems.valorTerreno.value),
    valor_construccion: parseFloat(elems.valorConstruccion.value),
    impuesto_calculado: parseFloat(elems.impuestoCalculado.value),
    uso_suelo: elems.usoSuelo.value
  };
  if (defaults.isEditing) {
    await updateBase(defaults.editingId, payload);
  } else {
    await createBase(payload);
  }
  await refresh(); closeModal();
}
elems.form.addEventListener('submit', handleSubmit);
elems.btnCancel.addEventListener('click', closeModal);
elems.searchInput.addEventListener('input', () => { defaults.currentPage=1; renderTable(filtered()); });

window.deleteAccount = async idx => {
  if (confirm('¿Confirmar eliminación?')) {
    await deleteBase(filtered()[idx].id_base_catastral);
    await refresh();
  }
};
window.editAccount = idx => {
  const b = filtered()[idx];
  defaults.isEditing = true; defaults.editingId = b.id_base_catastral;
  elems.claveCatastral.value = b.cuenta;
  elems.contribSelect.value = b.id_contribuyente;
  elems.baseCatastral.value = b.base_catastral;
  elems.ubicacion.value = b.ubicacion;
  elems.barrio.value = b.barrio;
  elems.valorTerreno.value = b.valor_terreno;
  elems.valorConstruccion.value = b.valor_construccion;
  elems.impuestoCalculado.value = b.impuesto_calculado;
  elems.usoSuelo.value = b.uso_suelo;
  elems.formTitle.textContent = 'Editar Base Catastral';
  elems.btnAddOrUpdate.textContent = 'Actualizar';
  openModal();
};

// — VISUALIZAR INFO —
window.viewAccount = idx => {
  const b = filtered()[idx];
  elems.infoContent.innerHTML = `
    <p><strong>Clave Catastral:</strong> ${b.cuenta}</p>
    <p><strong>Propietario:</strong> ${defaults.contribuyentes.find(c=>c.id_contribuyente===b.id_contribuyente)?.nombre}</p>
    <p><strong>Ubicación:</strong> ${b.ubicacion}</p>
    <p><strong>Barrio:</strong> ${b.barrio}</p>
    <p><strong>Base Catastral:</strong> ${b.base_catastral}</p>
    <p><strong>Valor Terreno:</strong> ${b.valor_terreno}</p>
    <p><strong>Valor Construcción:</strong> ${b.valor_construccion}</p>
    <p><strong>Impuesto Calculado:</strong> ${b.impuesto_calculado}</p>
    <p><strong>Uso de Suelo:</strong> ${b.uso_suelo}</p>
  `;
  openViewModal();
};
elems.btnCloseViewModal.addEventListener('click', () => elems.viewModalOverlay.style.display='none');

// — MODALES —
function openModal() { elems.modalOverlay.style.display = 'block'; }
function closeModal() { elems.modalOverlay.style.display = 'none';
  defaults.isEditing=false; defaults.editingId=null; elems.form.reset(); elems.formTitle.textContent='Agregar Base Catastral'; elems.btnAddOrUpdate.textContent='Agregar';
}
function openViewModal() { elems.viewModalOverlay.style.display = 'block'; }

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
