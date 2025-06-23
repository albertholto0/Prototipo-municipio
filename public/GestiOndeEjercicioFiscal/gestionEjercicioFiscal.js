let allEjercicios = [];

const elements = {
  tableBody: document.querySelector("#fiscalTable tbody"),
  searchInput: document.getElementById("searchInput"),
  form: document.getElementById("fiscalForm"),
  btnAddOrUpdate: document.getElementById("btnAddOrUpdate"),
  btnCancel: document.getElementById("btnCancel"),
  formTitle: document.getElementById("formTitle"),
  paginationContainer: document.querySelector(".pagination"),
  modalOverlay: document.getElementById("modalOverlay"),
  btnOpenModal: document.getElementById("btnOpenModal"),
  btnCloseModal: document.getElementById("btnCloseModal")
};

let editId = null;

async function cargarEjercicios() {
  try {
    const response = await fetch("http://localhost:5000/api/EjercicioFiscal");
    if (!response.ok) throw new Error(`Error HTTP! estado: ${response.status}`);
    allEjercicios = await response.json();
    renderizarEjercicios(allEjercicios);
  } catch (error) {
    console.error("Error al cargar ejercicios fiscales:", error);
    elements.tableBody.innerHTML = '<tr><td colspan="7">Error al cargar los datos</td></tr>';
  }
}

function renderizarEjercicios(lista) {
  elements.tableBody.innerHTML = '';
  if (lista.length === 0) {
    elements.tableBody.innerHTML = '<tr><td colspan="7">No hay ejercicios fiscales registrados</td></tr>';
    return;
  }

  lista.forEach(e => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${e.anio}</td>
      <td>${e.fecha_inicio.split('T')[0]}</td>
      <td>${e.fecha_fin.split('T')[0]}</td>
      <td>${e.estado}</td>
      <td>${e.proyeccion_ingreso}</td>
      <td>${e.ingreso_recaudado}</td>
      <td>${e.observaciones || ''}</td>
      <td>
        <button class="action-btn edit" data-id="${e.id_ejercicio}" title="Editar">
          <img src="/public/Assets/editor.png" class="action-icon">
        </button>
        <button class="action-btn delete" data-id="${e.id_ejercicio}" title="Eliminar">
          <img src="/public/Assets/eliminar.png" class="action-icon">
        </button>
      </td>
    `;
    elements.tableBody.appendChild(fila);
  });

  document.querySelectorAll('.action-btn.edit').forEach(btn => {
    btn.addEventListener('click', async () => {
      editId = btn.dataset.id;
      const response = await fetch(`http://localhost:5000/api/EjercicioFiscal/${editId}`);
      const data = await response.json();

      document.getElementById("anio").value = data.anio;
      document.getElementById("fecha_inicio").value = data.fecha_inicio.split('T')[0];
      document.getElementById("fecha_fin").value = data.fecha_fin.split('T')[0];
      document.getElementById("estado").value = data.estado;
      document.getElementById("presupuesto_asignado").value = data.proyeccion_ingreso;
      document.getElementById("presupuesto_ejecutado").value = data.ingreso_recaudado;
      document.getElementById("observaciones").value = data.observaciones || '';

      openModal();
    });
  });

  document.querySelectorAll('.action-btn.delete').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if (confirm('¿Estás seguro de eliminar este ejercicio fiscal?')) {
        try {
          const response = await fetch(`http://localhost:5000/api/EjercicioFiscal/${id}`, {
            method: 'DELETE'
          });
          if (!response.ok) throw new Error('Error al eliminar');
          cargarEjercicios();
        } catch (error) {
          alert('No se pudo eliminar el ejercicio fiscal');
        }
      }
    });
  });
}

function openModal() {
  elements.modalOverlay.style.display = 'flex';
}

function closeModal() {
  elements.modalOverlay.style.display = 'none';
  resetForm();
  editId = null;
}

function resetForm() {
  elements.form.reset();
}

function normalizar(texto) {
  return (texto || '')
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

document.addEventListener("DOMContentLoaded", () => {
  cargarEjercicios();

  elements.btnOpenModal.addEventListener("click", openModal);
  elements.btnCancel.addEventListener("click", closeModal);
  elements.btnCloseModal.addEventListener("click", closeModal);

  elements.searchInput.addEventListener("input", () => {
    const texto = normalizar(elements.searchInput.value);
    const filtrados = allEjercicios.filter(e =>
      e.anio.toString().includes(texto) || normalizar(e.estado).includes(texto)
    );
    renderizarEjercicios(filtrados);
  });

  elements.form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      anio: document.getElementById("anio").value,
      fecha_inicio: document.getElementById("fecha_inicio").value,
      fecha_fin: document.getElementById("fecha_fin").value,
      estado: document.getElementById("estado").value,
      proyeccion_ingreso: parseFloat(document.getElementById("presupuesto_asignado").value),
      ingreso_recaudado: parseFloat(document.getElementById("presupuesto_ejecutado").value),
      observaciones: document.getElementById("observaciones").value
    };

    try {
      let response;
      if (editId) {
        response = await fetch(`http://localhost:5000/api/EjercicioFiscal/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
      } else {
        response = await fetch("http://localhost:5000/api/EjercicioFiscal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
      }

      if (!response.ok) throw new Error("Error al guardar");

      closeModal();
      cargarEjercicios();
      editId = null;
    } catch (error) {
      alert("No se pudo guardar el ejercicio fiscal");
    }
  });
}); 