// Datos iniciales de ejemplo para Bases Catastrales
let GestionAlquileres = [
    {
      nombreDescripcion: "Prestamo de un volteo",
      ubicacion: "Calle Falsa 123",
      valorFinal: 50000,
      fechaInicio: "2023-05-10",
      fechaCierre: "2023-06-10",
      estadoAlquiler: "Activo",
      //Sacados de la Bd
      selectContribuyente: "Eden Mendoza",      
      selectConcepto: "Prestamo x"

    },
    {
      nombreDescripcion: "Prestamo de una retroescabadora",
      ubicacion: "Calle Falsa 123",
      valorFinal: 20000,
      fechaInicio: "2023-07-10",
      fechaCierre: "2023-08-10",
      estadoAlquiler: "Finalizado",
      //Sacados de la Bd
      selectContribuyente: "Rosendo Casarrubia",      
      selectConcepto: "Prestamo x"
    }
  ];

    // Simulación de datos de la BD
  const contribuyentes = [
      { nombre: "Juan Pérez" },
      { nombre: "María González" }
  ];

  const conceptos = [
      { descripcion: "Pago de Agua" },
      { descripcion: "Impuesto Predial" }
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

    nombreDescripcion: document.getElementById("nombreDescripcion"),
    ubicacion: document.getElementById("ubicacion"),
    fechaInicio: document.getElementById("fechaInicio"),
    fechaCierre: document.getElementById("fechaCierre"),
    valorFinal: document.getElementById("valorFinal"),
    estadoAlquiler: document.getElementById("estadoAlquiler"),

    selectContribuyente: document.getElementById("selectContribuyente"),
    selectConcepto: document.getElementById("selectConcepto"),
    
   

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
            <td>${base.nombreDescripcion}</td>
            <td>${base.fechaInicio}</td>
            <td>${base.fechaCierre}</td>
            <td>${base.estadoAlquiler}</td>
            <td>${base.selectContribuyente}</td>
            <td>
                <button class="action-btn edit" onclick="editAccount(${start + index})" title="Editar">
                    <img src="/public/Assets/editor.png" class="action-icon">
                </button>
                <button class="action-btn delete" onclick="deleteAccount(${start + index})" title="Eliminar">
                    <img src="/public/Assets/eliminar.png" class="action-icon">
                </button>
                <button class="action-btn view" onclick="viewAccount(${start + index})" title="Ver información">
                  <img src="/public/Assets/visualizar.png" class="action-icon">
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
    return GestionAlquileres.filter(base =>
      base.fechaInicio.toLowerCase().includes(term) ||
      base.nombreDescripcion.toLowerCase().includes(term)
    );
  }
  
  /**
  * Maneja el envío del formulario (crear/actualizar).
  * @param {Event} e - Evento del formulario.
  */
  function handleSubmit(e) {
    e.preventDefault();
    const base = {
      nombreDescripcion: elements.nombreDescripcion.value,
      ubicacion: elements.ubicacion.value,
      fechaInicio: elements.fechaInicio.value,
      fechaCierre: elements.fechaCierre.value,
      valorFinal: elements.valorFinal.value,
      estadoAlquiler: elements.estadoAlquiler.value,

      selectContribuyente: elements.selectContribuyente.value,
      selectConcepto: elements.selectConcepto.value,
      
    };
  
    if (isEditing) {
      GestionAlquileres[currentIndex] = base;
    } else {
      GestionAlquileres.push(base);
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
    const base = GestionAlquileres[index];
    elements.nombreDescripcion.value = base.nombreDescripcion;
    elements.ubicacion.value = base.ubicacion;
    elements.fechaInicio.value = base.fechaInicio;
    elements.fechaCierre.value = base.fechaCierre;
    elements.valorFinal.value = base.valorFinal;
    elements.estadoAlquiler.value = base.estadoAlquiler;
    elements.selectContribuyente.value = base.selectContribuyente;
    elements.selectConcepto.value = base.selectConcepto;
    
    isEditing = true;
    currentIndex = index;
    elements.formTitle.textContent = "Editar Alquiler";
    elements.btnAddOrUpdate.textContent = "Actualizar";
    openModal();
  };
  
  /**
  * Elimina una base catastral después de confirmación.
  * @param {number} index - Índice de la base a eliminar.
  */
  window.deleteAccount = function (index) {
    if (confirm("¿Confirmar eliminación?")) {
      GestionAlquileres.splice(index, 1);
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
    elements.formTitle.textContent = "Registrar Alquiler";
    elements.btnAddOrUpdate.textContent = "Agregar";
  }
  
  /* === INICIALIZACIÓN === */
  document.addEventListener("DOMContentLoaded", () => {
    renderTable(GestionAlquileres);
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
    const base = GestionAlquileres[index];
    const infoContent = document.getElementById("infoContent");
    infoContent.innerHTML = `
      
      <p><strong>Descripcion:</strong> ${base.nombreDescripcion}</p>
      <p><strong>Ubicación:</strong> ${base.ubicacion}</p>
      <p><strong>Fecha Inicio:</strong> ${base.fechaInicio}</p>
      <p><strong>Fecha Cierre:</strong> ${base.fechaCierre}</p>
      <p><strong>Valor Final:</strong> ${base.valorFinal}</p>
      <p><strong>Estado Alquiler:</strong> ${base.estadoAlquiler}</p>
      
      <p><strong>Contribuyente:</strong> ${base.selectContribuyente}</p>
      <p><strong>Concepto:</strong> ${base.selectConcepto}</p>
      
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
    renderTable(GestionAlquileres);
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