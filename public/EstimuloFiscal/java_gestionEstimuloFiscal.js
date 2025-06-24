const API_URL = 'http://localhost:5000/api/estimuloFiscal';

const tableBody = document.getElementById('tablaEstimulos');
const form = document.getElementById('estimuloForm');
const btnAddOrUpdate = document.getElementById('btnAddOrUpdate');
const btnCancel = document.getElementById('btnCancel');
const btnOpenModal = document.getElementById('btnOpenModal');
const btnCloseModal = document.getElementById('btnCloseModal');
const modalOverlay = document.getElementById('modalOverlay');
const viewModalOverlay = document.getElementById('viewModalOverlay');
const btnCloseViewModal = document.getElementById('btnCloseViewModal');
const infoContent = document.getElementById('infoContent');
const formTitle = document.getElementById('formTitle');

const inputNombre = document.getElementById('nombre_contribucion');
const inputPorcentaje = document.getElementById('porcentaje');
const inputCaracteristicas = document.getElementById('caracteristicas');
const inputRequisitos = document.getElementById('requisitos');
const inputTipoDescuento = document.getElementById('tipo_descuento');

let isEditing = false;
let currentId = null;

function openModal() {
  modalOverlay.style.display = 'flex';
  
  const modal = document.querySelector('.modal-content');
  if (modal) {
    modal.style.height = 'auto'; // Reinicia altura para que se ajuste al contenido
    modal.style.maxHeight = '65vh'; // Opcional: evita que se desborde en pantallas pequeñas
    modal.scrollTop = 0; // Asegura que empiece desde arriba si hubo scroll
  }
}
function closeModal() {
  modalOverlay.style.display = 'none';
  form.reset();
  isEditing = false;
  currentId = null;
  btnAddOrUpdate.textContent = 'Agregar';
  formTitle.textContent = 'Agregar Estímulo Fiscal';
}

function openViewModal() {
  viewModalOverlay.style.display = 'block';
}
function closeViewModal() {
  viewModalOverlay.style.display = 'none';
  infoContent.innerHTML = '';
}

function showAlert(msg) {
  alert(msg);
}

async function fetchEstimulos() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Error al cargar datos');
    const data = await res.json();
    renderTable(data);
  } catch (e) {
    console.error(e);
    tableBody.innerHTML = `<tr><td colspan="5">Error al cargar los datos</td></tr>`;
  }
}

function renderTable(data) {
  tableBody.innerHTML = '';
  if (data.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5">No hay estímulos fiscales</td></tr>`;
    return;
  }

  data.forEach(est => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${est.nombre_contribucion || ''}</td>
      <td>${est.porcentaje_descuento || ''}%</td>
      <td>${est.caracteristicas || ''}</td>
      <td>${est.requisitos || ''}</td>
      <td>${est.tipo_descuento || ''}</td> 
      <td style="display:flex; gap:5px; justify-content:center;" >
          <button class="action-btn edit" onclick="editEstimulo(${est.id_estimulo_fiscal})" title="Editar">
            <img src="/public/Assets/editor.png" class="action-icon">
          </button>
          <button class="action-btn delete" onclick="deleteEstimulo(${est.id_estimulo_fiscal})" title="Eliminar">
            <img src="/public/Assets/eliminar.png" class="action-icon">
          </button>
          <button class="action-btn view" onclick="viewEstimulo(${est.id_estimulo_fiscal})" title="Ver información">
            <img src="/public/Assets/visualizar.png" class="action-icon">
          </button>
        </td>
    `;

    tableBody.appendChild(tr);
  });
}

form.addEventListener('submit', async e => {
  e.preventDefault();

  const payload = {
    nombre_contribucion: inputNombre.value.trim(),
    porcentaje_descuento: Number(inputPorcentaje.value),
    caracteristicas: inputCaracteristicas.value.trim(),
    requisitos: inputRequisitos.value.trim(),
    tipo_descuento: inputTipoDescuento.value
  };

  if (!payload.nombre_contribucion) {
    showAlert('El nombre de contribución es obligatorio');
    return;
  }

  try {
    let res;
    if (isEditing) {
      res = await fetch(`${API_URL}/${currentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    if (!res.ok) throw new Error('Error en la solicitud');

    showAlert(isEditing ? 'Estímulo actualizado' : 'Estímulo agregado');
    closeModal();
    fetchEstimulos();
  } catch (err) {
    console.error(err);
    showAlert('Error al guardar estímulo');
  }
});

window.editEstimulo = async function(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error('No se encontró el estímulo');
    const est = await res.json();

    inputNombre.value = est.nombre_contribucion || '';
    inputPorcentaje.value = est.porcentaje_descuento || 0;
    inputCaracteristicas.value = est.caracteristicas || '';
    inputRequisitos.value = est.requisitos || '';
    inputTipoDescuento.value = est.tipo_descuento || '';

    isEditing = true;
    currentId = id;
    btnAddOrUpdate.textContent = 'Actualizar';
    formTitle.textContent = 'Editar Estímulo Fiscal';
    openModal();
  } catch (err) {
    console.error(err);
    showAlert('Error al cargar estímulo para editar');
  }
};

window.deleteEstimulo = async function(id) {
  if (!confirm('¿Eliminar este estímulo fiscal?')) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar');
    showAlert('Estímulo eliminado');
    fetchEstimulos();
  } catch (err) {
    console.error(err);
    showAlert('Error al eliminar estímulo');
  }
};

window.viewEstimulo = async function(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error('Error al cargar detalles');
    const est = await res.json();

    infoContent.innerHTML = `
      <p><strong>Nombre:</strong> ${est.nombre_contribucion}</p>
      <p><strong>Porcentaje de descuento:</strong> ${est.porcentaje_descuento}%</p>
      <p><strong>Características:</strong> ${est.caracteristicas}</p>
      <p><strong>Requisitos:</strong> ${est.requisitos.replace(/\n/g, '<br>')}</p>
    `;

    openViewModal();
  } catch (err) {
    console.error(err);
    showAlert('Error al mostrar detalles');
  }
};

btnOpenModal.addEventListener('click', () => {
  form.reset();
  openModal();
});

btnCancel.addEventListener('click', closeModal);
btnCloseModal.addEventListener('click', closeModal);
btnCloseViewModal.addEventListener('click', closeViewModal);

window.addEventListener('DOMContentLoaded', fetchEstimulos);

document.getElementById('searchInput').addEventListener('input', function (e) {
  const term = e.target.value.toLowerCase();
  const rows = tableBody.querySelectorAll('tr');

  rows.forEach(row => {
    const text = row.innerText.toLowerCase();
    row.style.display = text.includes(term) ? '' : 'none';
  });
});
