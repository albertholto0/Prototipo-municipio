// javaScript_subcuentasContables.js

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
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>
  `;
  document.getElementById('liveToastContainer').insertAdjacentHTML('beforeend', html);
  const toastEl = document.getElementById(toastId);
  new bootstrap.Toast(toastEl, { delay: 3000 }).show();
  toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}

let allSubcuentas = []; // Guardamos todas las subcuentas contables

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
};

// ID de la subcuenta en edición (clave_subcuenta)
let editId = null;

// — Carga y render inicial —
async function cargarSubcuentasContables() {
  try {
    const res = await fetch('http://localhost:5000/api/subcuentasContables');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    allSubcuentas = await res.json();
    renderizarSubcuentas(allSubcuentas);
  } catch (err) {
    console.error(err);
    elements.tableBody.innerHTML = '<tr><td colspan="5">Error al cargar datos</td></tr>';
    showToast('Error al cargar subcuentas', 'danger');
  }
}

// — Render de la tabla con BOTONES de toggle estado —
function renderizarSubcuentas(lista) {
  elements.tableBody.innerHTML = '';
  if (lista.length === 0) {
    elements.tableBody.innerHTML = '<tr><td colspan="5">No hay subcuentas</td></tr>';
    return;
  }

  lista.forEach(cuenta => {
    const activo = cuenta.estado === 1;
    const estadoText = activo ? 'Activo' : 'Inactivo';

    elements.tableBody.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${cuenta.clave_cuentaContable}</td>
        <td>${cuenta.clave_subcuenta}</td>
        <td>${cuenta.nombre}</td>
        <td class="cell-estado">${estadoText}</td>
        <td>
          <!-- Editar -->
          <button class="action-btn edit" data-id="${cuenta.clave_subcuenta}" title="Editar">
            <img src="/public/Assets/editor.png" class="action-icon">
          </button>
          <!-- Toggle estado -->
          ${
            activo
              ? `<button class="action-btn down" onclick="openToggleSubcuenta('${cuenta.clave_subcuenta}')" title="Desactivar">
                   <img src="/public/Assets/apagar.png" class="action-icon">
                 </button>`
              : `<button class="action-btn up" onclick="openToggleSubcuenta('${cuenta.clave_subcuenta}')" title="Activar">
                   <img src="/public/Assets/alta.png" class="action-icon">
                 </button>`
          }
        </td>
      </tr>
    `);
  });

  // Listeners EDIT
  document.querySelectorAll('.action-btn.edit').forEach(btn => {
    btn.addEventListener('click', async () => {
      editId = btn.dataset.id;
      const res = await fetch(`http://localhost:5000/api/subcuentasContables/${editId}`);
      const data = await res.json();
      await llenarSelectCuentasContables();
      document.getElementById('id_cuentaContable').value = data.id_cuentaContable;
      document.getElementById('clave_subcuenta').value = data.clave_subcuenta;
      document.getElementById('clave_subcuenta').disabled = true;
      document.getElementById('nombre_subcuentas').value = data.nombre;
      elements.formTitle.textContent = 'Editar Subcuenta Contable';
      elements.btnAddOrUpdate.textContent = 'Actualizar';
      elements.modalOverlay.style.display = 'flex';
    });
  });
}

// — Función de toggle estado —
async function openToggleSubcuenta(clave) {
  if (!confirm('¿Estás seguro de cambiar el estado de esta subcuenta?')) return;

  try {
    const res = await fetch(`http://localhost:5000/api/subcuentasContables/${clave}`, {
      method: 'DELETE'  // DELETE invoca toggleEstado en el backend
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || `HTTP ${res.status}`);
    }
    const { message } = await res.json();
    showToast(message, 'success');
    await cargarSubcuentasContables();
  } catch (err) {
    console.error(err);
    showToast('Error al cambiar estado', 'danger');
  }
}

// — Modal CRUD —
function openModal() {
  elements.modalOverlay.style.display = 'flex';
  llenarSelectCuentasContables();
  document.getElementById('clave_subcuenta').disabled = false;
}

function closeModal() {
  elements.modalOverlay.style.display = 'none';
  elements.form.reset();
  editId = null;
}

// — Llenar select de cuentas contables —
async function llenarSelectCuentasContables() {
  const sel = document.getElementById('id_cuentaContable');
  sel.innerHTML = '<option value="">Seleccione...</option>';
  try {
    const res = await fetch('http://localhost:5000/api/cuentasContables');
    const cuentas = await res.json();
    cuentas.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id_cuentaContable;
      opt.text = `${c.clave_cuentaContable} – ${c.nombre_cuentaContable}`;
      sel.append(opt);
    });
  } catch (err) {
    console.error('Error al cargar cuentas contables:', err);
  }
}

// — Submit de formulario (create/update) —
elements.form.addEventListener('submit', async e => {
  e.preventDefault();

  const payload = {
    id_cuentaContable: document.getElementById('id_cuentaContable').value,
    clave_subcuenta:   document.getElementById('clave_subcuenta').value,
    nombre:            document.getElementById('nombre_subcuentas').value
  };

  let url = 'http://localhost:5000/api/subcuentasContables';
  let method = 'POST';
  if (editId) {
    url += `/${editId}`;
    method = 'PUT';
  }

  try {
    const res = await fetch(url, {
      method,
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.error || err?.message || `HTTP ${res.status}`);
    }
    closeModal();
    showToast(editId ? 'Subcuenta actualizada exitosamente' : 'Subcuenta creada exitosamente', 'success');
    await cargarSubcuentasContables();
  } catch (err) {
    console.error(err);
    showToast(err.message, 'danger');
  }
});

// — Eventos de botones y búsqueda —
elements.btnOpenModal.addEventListener('click', openModal);
elements.btnCancel.addEventListener('click', closeModal);
elements.searchInput.addEventListener('input', () => {
  const term = elements.searchInput.value.toLowerCase();
  const fil = allSubcuentas.filter(c => {
    return c.clave_subcuenta.toLowerCase().includes(term) ||
           c.nombre.toLowerCase().includes(term) ||
           (c.estado === 1 ? 'activo' : 'inactivo').includes(term) ||
           c.clave_cuentaContable.toLowerCase().includes(term);
  });
  renderizarSubcuentas(fil);
});

// — Iniciar —
document.addEventListener('DOMContentLoaded', cargarSubcuentasContables);
