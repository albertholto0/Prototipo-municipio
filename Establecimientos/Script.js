// Datos iniciales de ejemplo para Establecimientos
let establecimientos = [
  {
    id_establecimiento: "EST-001",
    nombre_establecimiento: "Tienda de abarrotes",
    calle: "Av. Principal",
    numero: "123",
    colonia: "Centro",
    fecha_registro: "2023-01-15",
    id_contribuyente: "CONT-001",
    nombre_contribuyente: "Juan Pérez",
    giro_negocio: "comercio",
    tipo_establecimiento: "fijo",
    id_concepto: "CONC-005",
    nombre_concepto: "Comercio establecido",
  },
  {
    id_establecimiento: "EST-002",
    nombre_establecimiento: "Restaurante familiar",
    calle: "Calle Juárez",
    numero: "45",
    colonia: "San Miguel",
    fecha_registro: "2023-02-20",
    id_contribuyente: "CONT-002",
    nombre_contribuyente: "María López",
    giro_negocio: "alimentos",
    tipo_establecimiento: "fijo",
    id_concepto: "CONC-003",
    nombre_concepto: "Servicios de alimentos",
  },
];

// Datos de ejemplo para contribuyentes y conceptos
const contribuyentes = [
  { id: "CONT-001", nombre: "Juan Pérez" },
  { id: "CONT-002", nombre: "María López" },
  { id: "CONT-003", nombre: "Carlos Sánchez" },
];

const conceptos = [
  { id: "CONC-001", nombre: "Impuesto predial" },
  { id: "CONC-002", nombre: "Licencia de construcción" },
  { id: "CONC-003", nombre: "Servicios de alimentos" },
  { id: "CONC-004", nombre: "Venta ambulante" },
  { id: "CONC-005", nombre: "Comercio establecido" },
];

// Variables de estado globales
let isEditing = false; // Bandera para modo edición
let currentIndex = null; // Índice del elemento siendo editado
let currentPage = 1; // Página actual
const rowsPerPage = 10; // Filas por página

// Mapeo de elementos del DOM
const elements = {
  tableBody: document.querySelector("#establecimientosTable tbody"),
  searchInput: document.getElementById("searchInput"),
  form: document.getElementById("establecimientoForm"),
  nombreEstablecimiento: document.getElementById("nombreEstablecimiento"),
  calle: document.getElementById("calle"),
  numero: document.getElementById("numero"),
  colonia: document.getElementById("colonia"),
  fechaRegistro: document.getElementById("fechaRegistro"),
  contribuyente: document.getElementById("contribuyente"),
  giroNegocio: document.getElementById("giroNegocio"),
  tipoEstablecimiento: document.getElementById("tipoEstablecimiento"),
  idConcepto: document.getElementById("idConcepto"),
  btnAddOrUpdate: document.getElementById("btnAddOrUpdate"),
  btnCancel: document.getElementById("btnCancel"),
  formTitle: document.getElementById("formTitle"),
  paginationContainer: document.querySelector(".pagination"),
  tipoNegocioFilter: document.getElementById("tipoNegocioFilter"),
  tipoEstablecimientoFilter: document.getElementById(
    "tipoEstablecimientoFilter"
  ),
  fechaInicio: document.getElementById("fechaInicio"),
  fechaFin: document.getElementById("fechaFin"),
  btnFiltrar: document.getElementById("btnFiltrar"),
};

/* === FUNCIONES PRINCIPALES === */

/**
 * Renderiza la tabla con los datos proporcionados.
 * @param {Array} data - Datos a mostrar en la tabla.
 */
function renderTable(data) {
  elements.tableBody.innerHTML = "";
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedData = data.slice(start, end);

  // Genera las filas de la tabla con paginación
  paginatedData.forEach((est, index) => {
    const row = `
        <tr>
            <td>${est.id_establecimiento}</td>
            <td>${est.nombre_establecimiento}</td>
            <td>${est.calle} ${est.numero}, ${est.colonia}</td>
            <td>${est.fecha_registro}</td>
            <td>${est.nombre_contribuyente}</td>
            <td>${formatGiroNegocio(est.giro_negocio)}</td>
            <td>${formatTipoEstablecimiento(est.tipo_establecimiento)}</td>
            <td>${est.nombre_concepto}</td>
            <td>
                <button class="action-btn edit" onclick="editEstablecimiento(${
                  start + index
                })" title="Editar">
                    <img src="/Componentes/editor.png" class="action-icon">
                </button>
                <button class="action-btn delete" onclick="deleteEstablecimiento(${
                  start + index
                })" title="Eliminar">
                    <img src="/Componentes/eliminar.png" class="action-icon">
                </button>
            </td>
        </tr>
        `;
    elements.tableBody.insertAdjacentHTML("beforeend", row);
  });

  renderPagination(data.length);
}

/**
 * Formatea el giro de negocio para mostrarlo correctamente
 * @param {string} giro - Valor del giro de negocio
 */
function formatGiroNegocio(giro) {
  const formatos = {
    alimentos: "Alimentos",
    bebidas: "Bebidas",
    comercio: "Comercio",
    servicios: "Servicios",
    otros: "Otros",
  };
  return formatos[giro] || giro;
}

/**
 * Formatea el tipo de establecimiento para mostrarlo correctamente
 * @param {string} tipo - Valor del tipo de establecimiento
 */
function formatTipoEstablecimiento(tipo) {
  const formatos = {
    fijo: "Fijo",
    semifijo: "Semifijo",
    ambulante: "Ambulante",
  };
  return formatos[tipo] || tipo;
}

/**
 * Renderiza los controles de paginación.
 * @param {number} totalItems - Total de elementos a paginar.
 */
function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  let paginationHTML = `
        <button class="pagination-btn" onclick="changePage(${
          currentPage - 1
        })" ${currentPage === 1 ? "disabled" : ""}>
            « Anterior
        </button>
    `;

  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  if (startPage > 1) {
    paginationHTML += `
            <button class="pagination-btn" onclick="changePage(1)">1</button>
            ${startPage > 2 ? "<span>...</span>" : ""}
        `;
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
            <button class="pagination-btn ${
              i === currentPage ? "active" : ""
            }" onclick="changePage(${i})">
                ${i}
            </button>
        `;
  }

  if (endPage < totalPages) {
    paginationHTML += `
            ${endPage < totalPages - 1 ? "<span>...</span>" : ""}
            <button class="pagination-btn" onclick="changePage(${totalPages})">${totalPages}</button>
        `;
  }

  paginationHTML += `
        <button class="pagination-btn" onclick="changePage(${
          currentPage + 1
        })" ${currentPage === totalPages ? "disabled" : ""}>
            Siguiente »
        </button>
    `;
  elements.paginationContainer.innerHTML = paginationHTML;
}

/* === MANEJADORES DE EVENTOS === */

// Envío del formulario
elements.form.addEventListener("submit", handleSubmit);

// Botón cancelar
elements.btnCancel.addEventListener("click", closeModal);

// Búsqueda en tiempo real
elements.searchInput.addEventListener("input", () => {
  currentPage = 1;
  renderTable(filteredEstablecimientos());
});

// Botón filtrar
elements.btnFiltrar.addEventListener("click", () => {
  currentPage = 1;
  renderTable(filteredEstablecimientos());
});

/* === FUNCIONES AUXILIARES === */

/**
 * Filtra los establecimientos según los criterios de búsqueda.
 * @returns {Array} Datos filtrados.
 */
function filteredEstablecimientos() {
  const term = elements.searchInput.value.toLowerCase();
  const tipoNegocio = elements.tipoNegocioFilter.value;
  const tipoEstablecimiento = elements.tipoEstablecimientoFilter.value;
  const fechaInicio = elements.fechaInicio.value;
  const fechaFin = elements.fechaFin.value;

  return establecimientos.filter((est) => {
    // Filtro por término de búsqueda (nombre o contribuyente)
    const matchesSearch =
      term === "" ||
      est.nombre_establecimiento.toLowerCase().includes(term) ||
      est.nombre_contribuyente.toLowerCase().includes(term);

    // Filtro por tipo de negocio
    const matchesTipoNegocio =
      tipoNegocio === "" || est.giro_negocio === tipoNegocio;

    // Filtro por tipo de establecimiento
    const matchesTipoEstablecimiento =
      tipoEstablecimiento === "" ||
      est.tipo_establecimiento === tipoEstablecimiento;

    // Filtro por rango de fechas
    let matchesFecha = true;
    if (fechaInicio && fechaFin) {
      matchesFecha =
        est.fecha_registro >= fechaInicio && est.fecha_registro <= fechaFin;
    } else if (fechaInicio) {
      matchesFecha = est.fecha_registro >= fechaInicio;
    } else if (fechaFin) {
      matchesFecha = est.fecha_registro <= fechaFin;
    }

    return (
      matchesSearch &&
      matchesTipoNegocio &&
      matchesTipoEstablecimiento &&
      matchesFecha
    );
  });
}

/**
 * Maneja el envío del formulario (crear/actualizar).
 * @param {Event} e - Evento del formulario.
 */
function handleSubmit(e) {
  e.preventDefault();

  // Obtener los valores del formulario
  const contribuyenteSeleccionado = contribuyentes.find(
    (c) => c.id === elements.contribuyente.value
  );
  const conceptoSeleccionado = conceptos.find(
    (c) => c.id === elements.idConcepto.value
  );

  const establecimiento = {
    id_establecimiento: isEditing
      ? establecimientos[currentIndex].id_establecimiento
      : `EST-${String(establecimientos.length + 1).padStart(3, "0")}`,
    nombre_establecimiento: elements.nombreEstablecimiento.value,
    calle: elements.calle.value,
    numero: elements.numero.value,
    colonia: elements.colonia.value,
    fecha_registro: elements.fechaRegistro.value,
    id_contribuyente: elements.contribuyente.value,
    nombre_contribuyente: contribuyenteSeleccionado
      ? contribuyenteSeleccionado.nombre
      : "",
    giro_negocio: elements.giroNegocio.value,
    tipo_establecimiento: elements.tipoEstablecimiento.value,
    id_concepto: elements.idConcepto.value,
    nombre_concepto: conceptoSeleccionado ? conceptoSeleccionado.nombre : "",
  };

  if (isEditing) {
    establecimientos[currentIndex] = establecimiento;
  } else {
    establecimientos.push(establecimiento);
  }

  closeModal();
  renderTable(filteredEstablecimientos());
}

/**
 * Cambia a una página específica.
 * @param {number} page - Número de página a mostrar.
 */
window.changePage = function (page) {
  if (
    page < 1 ||
    page > Math.ceil(filteredEstablecimientos().length / rowsPerPage)
  )
    return;
  currentPage = page;
  renderTable(filteredEstablecimientos());
};

/**
 * Inicia el modo edición para un establecimiento.
 * @param {number} index - Índice del establecimiento a editar.
 */
window.editEstablecimiento = function (index) {
  const est = establecimientos[index];
  elements.nombreEstablecimiento.value = est.nombre_establecimiento;
  elements.calle.value = est.calle;
  elements.numero.value = est.numero;
  elements.colonia.value = est.colonia;
  elements.fechaRegistro.value = est.fecha_registro;
  elements.contribuyente.value = est.id_contribuyente;
  elements.giroNegocio.value = est.giro_negocio;
  elements.tipoEstablecimiento.value = est.tipo_establecimiento;
  elements.idConcepto.value = est.id_concepto;

  isEditing = true;
  currentIndex = index;
  elements.formTitle.textContent = "Editar Establecimiento";
  elements.btnAddOrUpdate.textContent = "Actualizar";
  openModal();
};

/**
 * Elimina un establecimiento después de confirmación.
 * @param {number} index - Índice del establecimiento a eliminar.
 */
window.deleteEstablecimiento = function (index) {
  if (confirm("¿Confirmar eliminación del establecimiento?")) {
    establecimientos.splice(index, 1);
    const totalPages = Math.ceil(
      filteredEstablecimientos().length / rowsPerPage
    );
    if (currentPage > totalPages && totalPages > 0) {
      currentPage = totalPages;
    }
    renderTable(filteredEstablecimientos());
  }
};

/**
 * Reinicia el formulario a su estado inicial.
 */
function resetForm() {
  elements.form.reset();
  isEditing = false;
  currentIndex = null;
  elements.formTitle.textContent = "Registrar Establecimiento";
  elements.btnAddOrUpdate.textContent = "Agregar";
}

/**
 * Llena los select de contribuyentes y conceptos
 */
function fillSelects() {
  // Llenar select de contribuyentes
  elements.contribuyente.innerHTML =
    '<option value="">Seleccione un contribuyente</option>';
  contribuyentes.forEach((contrib) => {
    elements.contribuyente.innerHTML += `<option value="${contrib.id}">${contrib.nombre}</option>`;
  });

  // Llenar select de conceptos
  elements.idConcepto.innerHTML =
    '<option value="">Seleccione un concepto</option>';
  conceptos.forEach((conc) => {
    elements.idConcepto.innerHTML += `<option value="${conc.id}">${conc.nombre}</option>`;
  });
}

/* === INICIALIZACIÓN === */
document.addEventListener("DOMContentLoaded", () => {
  fillSelects();
  renderTable(establecimientos);
});

// Elementos del modal
const modalElements = {
  modalOverlay: document.getElementById("modalOverlay"),
  btnOpenModal: document.getElementById("btnOpenModal"),
  btnCloseModal: document.getElementById("btnCloseModal"),
};

/* === FUNCIONES DEL MODAL === */
function openModal() {
  modalElements.modalOverlay.style.display = "block";
}

function closeModal() {
  modalElements.modalOverlay.style.display = "none";
  resetForm();
}

// Abrir modal para nuevo establecimiento
modalElements.btnOpenModal.addEventListener("click", () => {
  resetForm();
  openModal();
});

// Cerrar modal con botón X
modalElements.btnCloseModal.addEventListener("click", closeModal);
