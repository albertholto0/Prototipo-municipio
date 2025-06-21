const elements = {
  tableBody: document.querySelector("#accountsTable tbody"),
  form: document.getElementById("accountForm"),
  btnAddOrUpdate: document.getElementById("btnAddOrUpdate"),
  btnCancel: document.getElementById("btnCancel"),
  formTitle: document.getElementById("formTitle"),
  modalOverlay: document.getElementById("modalOverlay"),
  btnOpenModal: document.getElementById("btnOpenModal"),
  contribuyenteSelect: document.getElementById("id_contribuyente"),
};

let editId = null;

// Cargar lista de contribuyentes desde la API
async function cargarContribuyentes() {
  try {
    const response = await fetch("http://localhost:5000/api/contribuyentes");
    const contribuyentes = await response.json();

    elements.contribuyenteSelect.innerHTML =
      '<option value="">Seleccione un contribuyente</option>';

    contribuyentes.forEach((c) => {
      const option = document.createElement("option");
      option.value = c.id_contribuyente;
      option.textContent = c.nombre_completo; // Ajusta según tu base de datos
      elements.contribuyenteSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar contribuyentes:", error);
  }
}

// Cargar establecimientos y mostrarlos en la tabla
async function cargarEstablecimientos() {
  try {
    const response = await fetch("http://localhost:5000/api/establecimientos");
    const establecimientos = await response.json();

    elements.tableBody.innerHTML = "";

    if (establecimientos.length === 0) {
      elements.tableBody.innerHTML =
        '<tr><td colspan="8">No hay establecimientos</td></tr>';
      return;
    }

    establecimientos.forEach((est) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${est.nombre_establecimiento}</td>
        <td>${est.direccion}, ${est.barrio}, ${est.localidad}</td>
        <td>${est.codigo_postal}</td>
        <td>${est.fecha_apertura}</td>
        <td>${est.giro_negocio}</td>
        <td>${est.nombre_contribuyente || "Sin asignar"}</td>
        <td class="actions">
          <button class="action-btn edit" data-id="${
            est.id_establecimiento
          }">Editar</button>
          <button class="action-btn delete" data-id="${
            est.id_establecimiento
          }">Eliminar</button>
        </td>
      `;
      elements.tableBody.appendChild(fila);
    });
  } catch (error) {
    console.error("Error al cargar establecimientos:", error);
  }
}

// Guardar o actualizar establecimiento
async function guardarEstablecimiento(e) {
  e.preventDefault();
  console.log("Intentando guardar...");
  const data = {
    nombre_establecimiento: document
      .getElementById("nombre_establecimiento")
      .value.trim(),
    direccion: document.getElementById("direccion").value.trim(),
    barrio: document.getElementById("barrio").value.trim(),
    localidad: document.getElementById("localidad").value.trim(),
    codigo_postal: document.getElementById("codigo_postal").value.trim(),
    fecha_apertura: document.getElementById("fecha_apertura").value.trim(),
    giro_negocio: document.getElementById("giro_negocio").value.trim(),
    id_contribuyente: document.getElementById("id_contribuyente").value,
  };

  for (const key in data) {
    if (!data[key]) {
      alert(`El campo '${key.replace("_", " ")}' está vacío.`);
      return;
    }
  }

  try {
    const response = await fetch("http://localhost:5000/api/establecimientos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resultText = await response.text();

    if (!response.ok) {
      throw new Error(resultText || "Error desconocido del servidor");
    }

    //console.log("Establecimiento guardado:", result);
    closeModal();
    cargarEstablecimientos();
  } catch (error) {
    console.error("Error al guardar establecimiento:", error.message);
    alert("No se pudo guardar el establecimiento:\n" + error.message);
  }
}

// Abrir/Cerrar modal
function openModal() {
  elements.modalOverlay.style.display = "flex";
}

function closeModal() {
  elements.modalOverlay.style.display = "none";
  resetForm();
}

// Resetear formulario
function resetForm() {
  elements.form.reset();
  editId = null;
  elements.formTitle.textContent = "Agregar Establecimiento";
  elements.btnAddOrUpdate.textContent = "Agregar";
}

// Evento principal
document.addEventListener("DOMContentLoaded", () => {
  cargarEstablecimientos();
  cargarContribuyentes();

  elements.btnOpenModal.addEventListener("click", openModal);
  elements.btnCancel.addEventListener("click", closeModal);
  elements.form.addEventListener("submit", guardarEstablecimiento);
});
