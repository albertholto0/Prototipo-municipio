// Mapeo de elementos del DOM
const elements = {
  tableBody: document.querySelector("#accountsTable tbody"),
  searchInput: document.getElementById("searchInput"),
  form: document.getElementById("accountForm"),
  btnAddOrUpdate: document.getElementById("btnAddOrUpdate"),
  btnCancel: document.getElementById("btnCancel"),
  formTitle: document.getElementById("formTitle"),
  paginationContainer: document.querySelector(".pagination"),
  modalOverlay: document.getElementById("modalOverlay"),
  btnOpenModal: document.getElementById("btnOpenModal"),
};

let editId = null;

// Cargar establecimientos y renderizar tabla
async function cargarEstablecimientos() {
  try {
    const response = await fetch("http://localhost:5000/api/establecimientos");
    if (!response.ok) throw new Error(`Error HTTP! estado: ${response.status}`);
    const establecimientos = await response.json();

    elements.tableBody.innerHTML = "";

    if (establecimientos.length === 0) {
      elements.tableBody.innerHTML =
        '<tr><td colspan="8">No hay establecimientos registrados</td></tr>';
      return;
    }

    establecimientos.forEach((est) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${est.nombre_establecimiento || "N/A"}</td>
        <td>${est.direccion || ""} ${est.barrio || ""} ${
        est.localidad || ""
      }</td>
        <td>${est.codigo_postal || "N/A"}</td>
        <td>${est.fecha_apertura || "N/A"}</td>
        <td>${est.giro_negocio || "N/A"}</td>
        <td>${est.nombre_contribuyente || "N/A"}</td>
        <td class="actions">
          <button class="action-btn edit" data-id="${est.id}">Editar</button>
          <button class="action-btn delete" data-id="${
            est.id
          }">Eliminar</button>
        </td>
      `;
      elements.tableBody.appendChild(fila);
    });

    // Aquí podrías agregar listeners para los botones de editar/eliminar si los vas a implementar
  } catch (error) {
    console.error("Error al cargar establecimientos:", error);
    elements.tableBody.innerHTML =
      '<tr><td colspan="8">Error al cargar los datos</td></tr>';
  }
}

// Funciones del modal
function openModal() {
  elements.modalOverlay.style.display = "flex";
}

function closeModal() {
  elements.modalOverlay.style.display = "none";
  resetForm();
}

// Limpiar formulario
function resetForm() {
  elements.form.reset();
  editId = null;
  elements.formTitle.textContent = "Agregar Establecimiento";
  elements.btnAddOrUpdate.textContent = "Agregar";
}

// Evento principal
document.addEventListener("DOMContentLoaded", () => {
  cargarEstablecimientos();

  elements.btnOpenModal.addEventListener("click", openModal);
  elements.btnCancel.addEventListener("click", closeModal);

  elements.btnAddOrUpdate.addEventListener("click", async (e) => {
    e.preventDefault();

    const data = {
      nombre_establecimiento: document.getElementById("nombre_establecimiento")
        .value,
      direccion: document.getElementById("direccion").value,
      codigo_postal: document.getElementById("codigo_postal").value,
      fecha_apertura: document.getElementById("fecha_apertura").value,
      giro_negocio: document.getElementById("giro_negocio").value,
      nombre_contribuyente: document.getElementById("nombre_contribuyente")
        .value,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/establecimientos",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error("Error al guardar");

      closeModal();
      cargarEstablecimientos();
    } catch (error) {
      alert("No se pudo guardar el establecimiento");
    }
  });
});
