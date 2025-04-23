// Datos iniciales de ejemplo para Bases Catastrales
let basesCatastrales = [
    {
      claveCatastral: "CLAVE-123",
      nombrePropietario: "Juan Pérez",
      ubicacion: "Calle Falsa 123",
      baseCatastral: "1500 m²",
      valorTerreno: 50000,
      valorConstruccion: 75000,
      impuestoCalculado: 1250,
      fechaAvaluo: "2023-05-10",
      historialAvaluos: "2021,2022",
      usoSuelo: "habitacional"
    },
    {
      claveCatastral: "CLAVE-456",
      nombrePropietario: "María López",
      ubicacion: "Av. Siempre Viva 742",
      baseCatastral: "2000 m²",
      valorTerreno: 60000,
      valorConstruccion: 90000,
      impuestoCalculado: 1500,
      fechaAvaluo: "2023-06-15",
      historialAvaluos: "2022",
      usoSuelo: "comercial"
    }
  ];
  
  // Variables de estado globales
  let isEditing = false;        // Bandera para modo edición
  let currentIndex = null;      // Índice del elemento siendo editado
  let currentPage = 1;          // Página actual
  const rowsPerPage = 10;       // Filas por página
  
  // Mapeo de elementos del DOM
  const elements = {
    tableBody: document.querySelector("#accountsTable tbody"),
    searchInput: document.getElementById("searchInput"),
    form: document.getElementById("accountForm"),
    claveCatastral: document.getElementById("claveCatastral"),
    nombrePropietario: document.getElementById("nombrePropietario"),
    ubicacion: document.getElementById("ubicacion"),
    baseCatastral: document.getElementById("baseCatastral"),
    valorTerreno: document.getElementById("valorTerreno"),
    valorConstruccion: document.getElementById("valorConstruccion"),
    impuestoCalculado: document.getElementById("impuestoCalculado"),
    fechaAvaluo: document.getElementById("fechaAvaluo"),
    historialAvaluos: document.getElementById("historialAvaluos"),
    usoSuelo: document.getElementById("usoSuelo"),
    btnAddOrUpdate: document.getElementById("btnAddOrUpdate"),
    btnCancel: document.getElementById("btnCancel"),
    formTitle: document.getElementById("formTitle"),
    paginationContainer: document.querySelector(".pagination")
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
    paginatedData.forEach((base, index) => {
      const row = `
        <tr>
            <td>${base.claveCatastral}</td>
            <td>${base.nombrePropietario}</td>
            <td>${base.ubicacion}</td>
            <td>${base.baseCatastral}</td>
            <td>${base.usoSuelo}</td>
            <td>
                <button class="action-btn edit" onclick="editAccount(${start + index})" title="Editar">
                    <img src="/Assets/editor.png" class="action-icon">
                </button>
                <button class="action-btn delete" onclick="deleteAccount(${start + index})" title="Eliminar">
                    <img src="/Assets/eliminar.png" class="action-icon">
                </button>
                <button class="action-btn view" onclick="viewAccount(${start + index})" title="Ver información">
                  <img src="/Assets/visualizar.png" class="action-icon">
                </button>
            </td>
        </tr>
    `;
      elements.tableBody.insertAdjacentHTML("beforeend", row);  
    });
  
    renderPagination(data.length);
  }
  
  /**
  * Renderiza los controles de paginación.
  * @param {number} totalItems - Total de elementos a paginar.
  */
  function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / rowsPerPage);
    let paginationHTML = `
        <button class="pagination-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            « Anterior
        </button>
    `;
  
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
  
    if (startPage > 1) {
      paginationHTML += `
            <button class="pagination-btn" onclick="changePage(1)">1</button>
            ${startPage > 2 ? '<span>...</span>' : ''}
        `;
    }
  
    for (let i = startPage; i <= endPage; i++) {
      paginationHTML += `
            <button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }
  
    if (endPage < totalPages) {
      paginationHTML += `
            ${endPage < totalPages - 1 ? '<span>...</span>' : ''}
            <button class="pagination-btn" onclick="changePage(${totalPages})">${totalPages}</button>
        `;
    }
  
    paginationHTML += `
        <button class="pagination-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
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
    renderTable(filteredBases());
  });
  
  /* === FUNCIONES AUXILIARES === */
  
  /**
  * Filtra las bases según el término de búsqueda.
  * @returns {Array} Datos filtrados.
  */
  function filteredBases() {
    const term = elements.searchInput.value.toLowerCase();
    return basesCatastrales.filter(base =>
      base.claveCatastral.toLowerCase().includes(term) ||
      base.nombrePropietario.toLowerCase().includes(term)
    );
  }
  
  /**
  * Maneja el envío del formulario (crear/actualizar).
  * @param {Event} e - Evento del formulario.
  */
  function handleSubmit(e) {
    e.preventDefault();
    const base = {
      claveCatastral: elements.claveCatastral.value,
      nombrePropietario: elements.nombrePropietario.value,
      ubicacion: elements.ubicacion.value,
      baseCatastral: elements.baseCatastral.value,
      valorTerreno: elements.valorTerreno.value,
      valorConstruccion: elements.valorConstruccion.value,
      impuestoCalculado: elements.impuestoCalculado.value,
      fechaAvaluo: elements.fechaAvaluo.value,
      historialAvaluos: elements.historialAvaluos.value,
      usoSuelo: elements.usoSuelo.value
    };
  
    if (isEditing) {
      basesCatastrales[currentIndex] = base;
    } else {
      basesCatastrales.push(base);
    }
  
    closeModal();
    renderTable(filteredBases());
  }
  
  /**
  * Cambia a una página específica.
  * @param {number} page - Número de página a mostrar.
  */
  window.changePage = function (page) {
    currentPage = page;
    renderTable(filteredBases());
  };
  
  /**
  * Inicia el modo edición para una base catastral.
  * @param {number} index - Índice de la base a editar.
  */
  window.editAccount = function (index) {
    const base = basesCatastrales[index];
    elements.claveCatastral.value = base.claveCatastral;
    elements.nombrePropietario.value = base.nombrePropietario;
    elements.ubicacion.value = base.ubicacion;
    elements.baseCatastral.value = base.baseCatastral;
    elements.valorTerreno.value = base.valorTerreno;
    elements.valorConstruccion.value = base.valorConstruccion;
    elements.impuestoCalculado.value = base.impuestoCalculado;
    elements.fechaAvaluo.value = base.fechaAvaluo;
    elements.historialAvaluos.value = base.historialAvaluos;
    elements.usoSuelo.value = base.usoSuelo;
    isEditing = true;
    currentIndex = index;
    elements.formTitle.textContent = "Editar Base Catastral";
    elements.btnAddOrUpdate.textContent = "Actualizar";
    openModal();
  };
  
  /**
  * Elimina una base catastral después de confirmación.
  * @param {number} index - Índice de la base a eliminar.
  */
  window.deleteAccount = function (index) {
    if (confirm("¿Confirmar eliminación?")) {
      basesCatastrales.splice(index, 1);
      const totalPages = Math.ceil(filteredBases().length / rowsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
      }
      renderTable(filteredBases());
    }
  };
  
  /**
  * Reinicia el formulario a su estado inicial.
  */
  function resetForm() {
    elements.form.reset();
    isEditing = false;
    currentIndex = null;
    elements.formTitle.textContent = "Registrar Base Catastral";
    elements.btnAddOrUpdate.textContent = "Agregar";
  }
  
  /* === INICIALIZACIÓN === */
  document.addEventListener("DOMContentLoaded", () => {
    renderTable(basesCatastrales);
  });
  
  // Elementos del modal
  const modalElements = {
    modalOverlay: document.getElementById('modalOverlay'),
    btnOpenModal: document.getElementById('btnOpenModal'),
    btnCloseModal: document.getElementById('btnCloseModal')
  };
  
  /* === FUNCIONES DEL MODAL === */
  function openModal() {
    modalElements.modalOverlay.style.display = 'block';
  }
  
  function closeModal() {
    modalElements.modalOverlay.style.display = 'none';
    resetForm();
  }
  
  // Abrir modal para nueva base catastral
  modalElements.btnOpenModal.addEventListener('click', () => {
    resetForm();
    openModal();
  });
  
  // Cerrar modal con botón X
  modalElements.btnCloseModal.addEventListener('click', closeModal);
  
  // Función para ver la información completa de una base catastral y abrir el modal de "Ver información"
  window.viewAccount = function(index) {
    const base = basesCatastrales[index];
    const infoContent = document.getElementById("infoContent");
    infoContent.innerHTML = `
      <p><strong>Clave Catastral:</strong> ${base.claveCatastral}</p>
      <p><strong>Nombre Propietario:</strong> ${base.nombrePropietario}</p>
      <p><strong>Ubicación:</strong> ${base.ubicacion}</p>
      <p><strong>Base Catastral:</strong> ${base.baseCatastral}</p>
      <p><strong>Valor Terreno:</strong> ${base.valorTerreno}</p>
      <p><strong>Valor Construcción:</strong> ${base.valorConstruccion}</p>
      <p><strong>Impuesto Calculado:</strong> ${base.impuestoCalculado}</p>
      <p><strong>Fecha Avalúo:</strong> ${base.fechaAvaluo}</p>
      <p><strong>Historial Avalúos:</strong> ${base.historialAvaluos}</p>
      <p><strong>Uso de Suelo:</strong> ${base.usoSuelo}</p>
    `;
    openViewModal();
  };
  
  // Manejo del modal de "Ver información"
  const viewModalElements = {
    viewModalOverlay: document.getElementById('viewModalOverlay'),
    btnCloseViewModal: document.getElementById('btnCloseViewModal')
  };
  
  function openViewModal() {
    viewModalElements.viewModalOverlay.style.display = 'block';
  }
  
  function closeViewModal() {
    viewModalElements.viewModalOverlay.style.display = 'none';
  }
  
  viewModalElements.btnCloseViewModal.addEventListener('click', closeViewModal);
  
  // Inicialización: renderiza la tabla al cargar la página
  document.addEventListener("DOMContentLoaded", () => {
    renderTable(basesCatastrales);
  });
  
  elements.form.addEventListener("submit", handleSubmit);
  
  document.querySelectorAll('#infoContent p').forEach(item => {
    item.addEventListener('click', function(e) {
      let ripple = document.createElement('div');
      ripple.className = 'ripple-effect';
      const rect = this.getBoundingClientRect();
      ripple.style.left = (e.clientX - rect.left - 5) + 'px';
      ripple.style.top = (e.clientY - rect.top - 5) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });