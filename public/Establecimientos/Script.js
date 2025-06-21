const elements = {
  tableBody: document.querySelector("#accountsTable tbody"),
  searchInput: document.getElementById("searchInput"), // si quieres búsqueda
  form: document.getElementById("accountForm"),
  btnAddOrUpdate: document.getElementById("btnAddOrUpdate"),
  btnCancel: document.getElementById("btnCancel"),
  formTitle: document.getElementById("formTitle"),
  modalOverlay: document.getElementById("modalOverlay"),
  btnOpenModal: document.getElementById("btnOpenModal"),
  contribuyenteSelect: document.getElementById("id_contribuyente"),
};

let allEstablecimientos = [];
let editId = null;

// Cargar contribuyentes para el select (igual que ya tienes)
async function cargarContribuyentes() {
  try {
    const response = await fetch("http://localhost:5000/api/contribuyentes");
    if (!response.ok) throw new Error(`Error HTTP! estado: ${response.status}`);
    const contribuyentes = await response.json();

    elements.contribuyenteSelect.innerHTML =
      '<option value="">Seleccione un contribuyente</option>';

    contribuyentes.forEach((c) => {
      const option = document.createElement("option");
      option.value = c.id_contribuyente;
      option.textContent =
        c.nombre_completo ||
        `${c.nombre} ${c.apellido_paterno || ""} ${
          c.apellido_materno || ""
        }`.trim();
      elements.contribuyenteSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar contribuyentes:", error);
  }
}

// Cargar establecimientos y mostrar en tabla
async function cargarEstablecimientos() {
  try {
    const response = await fetch("http://localhost:5000/api/establecimientos");
    if (!response.ok) throw new Error(`Error HTTP! estado: ${response.status}`);
    allEstablecimientos = await response.json();

    renderizarEstablecimientos(allEstablecimientos);
  } catch (error) {
    console.error("Error al cargar establecimientos:", error);
    elements.tableBody.innerHTML =
      '<tr><td colspan="8">Error al cargar establecimientos :(</td></tr>';
  }
}

function renderizarEstablecimientos(lista) {
  elements.tableBody.innerHTML = "";

  if (lista.length === 0) {
    elements.tableBody.innerHTML =
      '<tr><td colspan="8">No hay establecimientos registrados</td></tr>';
    return;
  }

  lista.forEach((est) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${est.nombre_establecimiento || ""}</td>
      <td>${est.direccion || ""}, ${est.barrio || ""}, ${
      est.localidad || ""
    }</td>
      <td>${est.codigo_postal || ""}</td>
      <td>${est.fecha_apertura ? est.fecha_apertura.split("T")[0] : ""}</td>
      <td>${est.giro_negocio || ""}</td>
      <td>${est.nombre_contribuyente || "Sin asignar"}</td>
      <td>
        <button class="action-btn edit" data-id="${
          est.id_establecimiento
        }" title="Editar">Editar</button>
        <button class="action-btn delete" data-id="${
          est.id_establecimiento
        }" title="Eliminar">Eliminar</button>
      </td>
    `;
    elements.tableBody.appendChild(fila);
  });

  // Añadir listeners a botones editar y eliminar
  document.querySelectorAll(".action-btn.edit").forEach((btn) => {
    btn.addEventListener("click", async () => {
      editId = btn.getAttribute("data-id");
      try {
        const response = await fetch(
          `http://localhost:5000/api/establecimientos/${editId}`
        );
        if (!response.ok)
          throw new Error(
            `Error al obtener establecimiento. Status: ${response.status}`
          );
        const data = await response.json();

        // Llenar formulario con datos para editar
        document.getElementById("nombre_establecimiento").value =
          data.nombre_establecimiento || "";
        document.getElementById("direccion").value = data.direccion || "";
        document.getElementById("barrio").value = data.barrio || "";
        document.getElementById("localidad").value = data.localidad || "";
        document.getElementById("codigo_postal").value =
          data.codigo_postal || "";
        document.getElementById("fecha_apertura").value = data.fecha_apertura
          ? data.fecha_apertura.split("T")[0]
          : "";
        document.getElementById("giro_negocio").value = data.giro_negocio || "";
        elements.contribuyenteSelect.value = data.id_contribuyente || "";

        elements.formTitle.textContent = "Editar Establecimiento";
        elements.btnAddOrUpdate.textContent = "Guardar";

        openModal();
      } catch (error) {
        alert("Error al cargar datos para editar: " + error.message);
      }
    });
  });

  document.querySelectorAll(".action-btn.delete").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      if (confirm("¿Seguro que quieres eliminar este establecimiento?")) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/establecimientos/${id}`,
            {
              method: "DELETE",
            }
          );
          if (!response.ok)
            throw new Error("Error al eliminar establecimiento");
          cargarEstablecimientos();
        } catch (error) {
          alert("No se pudo eliminar el establecimiento: " + error.message);
        }
      }
    });
  });
}

// Guardar o actualizar establecimiento
async function guardarEstablecimiento(e) {
  e.preventDefault();

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
    id_contribuyente: elements.contribuyenteSelect.value,
  };

  // Validar campos vacíos
  for (const key in data) {
    if (!data[key]) {
      alert(`El campo '${key.replace(/_/g, " ")}' está vacío.`);
      return;
    }
  }

  try {
    let response;
    if (editId) {
      // PUT para editar
      response = await fetch(
        `http://localhost:5000/api/establecimientos/${editId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
    } else {
      // POST para crear nuevo
      response = await fetch("http://localhost:5000/api/establecimientos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Error desconocido al guardar");
    }

    closeModal();
    cargarEstablecimientos();
    editId = null;
  } catch (error) {
    alert("No se pudo guardar el establecimiento:\n" + error.message);
  }
}

function openModal() {
  elements.modalOverlay.style.display = "flex";
}

function closeModal() {
  elements.modalOverlay.style.display = "none";
  resetForm();
}

function resetForm() {
  elements.form.reset();
  editId = null;
  elements.formTitle.textContent = "Agregar Establecimiento";
  elements.btnAddOrUpdate.textContent = "Agregar";
}

// Opcional: función para normalizar texto y filtro búsqueda similar a contribuyentes
function normalizar(texto) {
  return (texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

// Opcional: búsqueda en establecimientos (similar a contribuyentes)
function filtrarEstablecimientos(texto) {
  texto = normalizar(texto);
  const filtrados = allEstablecimientos.filter((est) => {
    const hayTexto = [
      est.nombre_establecimiento,
      est.direccion,
      est.barrio,
      est.localidad,
      est.giro_negocio,
      est.nombre_contribuyente,
    ].some((campo) => normalizar(campo).includes(texto));
    return hayTexto;
  });
  renderizarEstablecimientos(filtrados);
}

// Evento principal
document.addEventListener("DOMContentLoaded", () => {
  cargarContribuyentes();
  cargarEstablecimientos();

  elements.btnOpenModal.addEventListener("click", () => {
    editId = null; // nuevo registro
    elements.formTitle.textContent = "Agregar Establecimiento";
    elements.btnAddOrUpdate.textContent = "Agregar";
    openModal();
  });

  elements.btnCancel.addEventListener("click", closeModal);

  elements.form.addEventListener("submit", guardarEstablecimiento);

  // Si quieres búsqueda, descomenta esto y añade un input con id="searchInput"
  if (elements.searchInput) {
    elements.searchInput.addEventListener("input", (e) => {
      filtrarEstablecimientos(e.target.value);
    });
  }
});
