// Variables de estado globales
let isEditing = false;        // Bandera para modo edición
let currentIndex = null;      // Índice del elemento siendo editado
let currentPage = 1;          // Página actual
const rowsPerPage = 10;        // Filas por página

// Mapeo de elementos del DOM
const elements = {
    tableBody: document.querySelector("#accountsTable tbody"),
    searchInput: document.getElementById("searchInput"),
    form: document.getElementById("accountForm"),
    nombre: document.getElementById("nombre"),
    apellido_paterno: document.getElementById("apellido_paterno"),
    apellido_materno: document.getElementById("apellido_materno"),
    rfc: document.getElementById("rfc"),
    calle: document.getElementById("calle"),
    num_calle: document.getElementById("num_calle"),
    colonia: document.getElementById("colonia"),
    telefono: document.getElementById("telefono"),
    num_cuenta: document.getElementById("num_cuenta"),
    btnAddOrUpdate: document.getElementById("btnAddOrUpdate"),
    btnCancel: document.getElementById("btnCancel"),
    formTitle: document.getElementById("formTitle"),
    paginationContainer: document.querySelector(".pagination")
};

/* === FUNCIONES PRINCIPALES === */

/**
 * Renderiza la tabla con los datos proporcionados
 * @param {Array} data - Datos a mostrar en la tabla
 */
function renderTable(data) {
    elements.tableBody.innerHTML = "";
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = data.slice(start, end);

    paginatedData.forEach((contribuyente, index) => {
        const row = `
        <tr>
            <td>${contribuyente.nombre} ${contribuyente.apellido_paterno} ${contribuyente.apellido_materno}</td>
            <td>${contribuyente.rfc}</td>
            <td>${contribuyente.num_cuenta}</td>
            <td>
              <button class="action-btn edit" onclick="editAccount(${start + index})" title="Editar">
                <img src="/Assets/editor.png" class="action-icon">
              </button>
              <button class="action-btn delete" onclick="deleteAccount(${start + index})" title="Eliminar">
                <img src="/Assets/eliminar.png" class="action-icon">
              </button>
            </td>
        </tr>
        `;
        elements.tableBody.insertAdjacentHTML("beforeend", row);
    });

    renderPagination(data.length);
}

/**
 * Renderiza los controles de paginación
 * @param {number} totalItems - Total de elementos a paginar
 */
function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / rowsPerPage);

    let paginationHTML = `
        <button class="pagination-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            « Anterior
        </button>
    `;

    // Rango de páginas a mostrar 
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    // Botón para primera página si no está en el rango visible
    if (startPage > 1) {
        paginationHTML += `
            <button class="pagination-btn" onclick="changePage(1)">
                1
            </button>
            ${startPage > 2 ? '<span>...</span>' : ''}
        `;
    }

    // Botones de páginas numeradas
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                    onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }

    // Botón para última página si no está en el rango visible
    if (endPage < totalPages) {
        paginationHTML += `
            ${endPage < totalPages - 1 ? '<span>...</span>' : ''}
            <button class="pagination-btn" onclick="changePage(${totalPages})">
                ${totalPages}
            </button>
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

// Evento para enviar el formulario
elements.form.addEventListener("submit", handleSubmit);

// Evento para cancelar edición
elements.btnCancel.addEventListener("click", closeModal);

// Evento para búsqueda en tiempo real
elements.searchInput.addEventListener("input", () => {
    currentPage = 1; // Resetear a primera página al buscar
    renderTable(filteredAccounts());
});

/* === FUNCIONES AUXILIARES === */

/**
 * Filtra las cuentas según el término de búsqueda
 * @returns {Array} Datos filtrados
 */
function filteredAccounts() {
    const term = elements.searchInput.value.toLowerCase();
    return cuentasContables.filter(contribuyente =>
        contribuyente.nombre.toLowerCase().includes(term) ||
        contribuyente.apellido_paterno.toLowerCase().includes(term) ||
        contribuyente.rfc.toLowerCase().includes(term) ||
        contribuyente.num_cuenta.toLowerCase().includes(term)
    );
}

/**
 * Maneja el envío del formulario (crear/actualizar)
 * @param {Event} e - Evento del formulario
 */
function handleSubmit(e) {
    e.preventDefault();
    const contribuyente = {
        nombre: elements.nombre.value,
        apellido_paterno: elements.apellido_paterno.value,
        apellido_materno: elements.apellido_materno.value,
        rfc: elements.rfc.value,
        calle: elements.calle.value,
        num_calle: elements.num_calle.value,
        colonia: elements.colonia.value,
        telefono: elements.telefono.value,
        num_cuenta: elements.num_cuenta.value
    };

    if (isEditing) {
        cuentasContables[currentIndex] = contribuyente;
    } else {
        cuentasContables.push(contribuyente);
    }

    closeModal();
    renderTable(filteredAccounts());
}

/**
 * Cambia a una página específica
 * @param {number} page - Número de página a mostrar
 */
window.changePage = function (page) {
    currentPage = page;
    renderTable(filteredAccounts());
};

/**
 * Inicia el modo edición para una cuenta
 * @param {number} index - Índice de la cuenta a editar
 */
window.editAccount = function (index) {
    const contribuyente = cuentasContables[index];
    elements.nombre.value = contribuyente.nombre;
    elements.apellido_paterno.value = contribuyente.apellido_paterno;
    elements.apellido_materno.value = contribuyente.apellido_materno;
    elements.rfc.value = contribuyente.rfc;
    elements.calle.value = contribuyente.calle;
    elements.num_calle.value = contribuyente.num_calle;
    elements.colonia.value = contribuyente.colonia;
    elements.telefono.value = contribuyente.telefono;
    elements.num_cuenta.value = contribuyente.num_cuenta;
    
    isEditing = true;
    currentIndex = index;
    elements.formTitle.textContent = "Editar Contribuyente";
    elements.btnAddOrUpdate.textContent = "Actualizar";
    openModal();

    // Desplazamiento suave al formulario
    document.getElementById('formContainer').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
};

/**
 * Elimina una cuenta después de confirmación
 * @param {number} index - Índice de la cuenta a eliminar
 */
window.deleteAccount = function (index) {
    if (confirm("¿Confirmar eliminación?")) {
        cuentasContables.splice(index, 1);
        // Ajustar currentPage si quedó vacía la página actual
        const totalPages = Math.ceil(filteredAccounts().length / rowsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
            currentPage = totalPages;
        }
        renderTable(filteredAccounts());
    }
};

/**
 * Reinicia el formulario a su estado inicial
 */
function resetForm() {
    elements.form.reset();
    isEditing = false;
    currentIndex = null;
    elements.formTitle.textContent = "Agregar Contribuyente";
    elements.btnAddOrUpdate.textContent = "Agregar";
}

/* === INICIALIZACIÓN === */
document.addEventListener("DOMContentLoaded", () => {
    renderTable(cuentasContables);
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

/* === MODIFICACIONES DE FUNCIONES EXISTENTES === */
window.editAccount = function (index) {
    const cuenta = cuentasContables[index];
    elements.numeroCuenta.value = cuenta.numeroCuenta;
    elements.descripcion.value = cuenta.descripcion;
    elements.seccion.value = cuenta.seccion;
    elements.ejercicio.value = cuenta.ejercicio;
    isEditing = true;
    currentIndex = index;
    elements.formTitle.textContent = "Editar Cuenta Contable";
    elements.btnAddOrUpdate.textContent = "Actualizar";
    openModal();
};

function handleSubmit(e) {
    e.preventDefault();
    const cuenta = {
        numeroCuenta: elements.numeroCuenta.value,
        descripcion: elements.descripcion.value,
        seccion: elements.seccion.value,
        ejercicio: elements.ejercicio.value
    };

    if (isEditing) {
        cuentasContables[currentIndex] = cuenta;
    } else {
        cuentasContables.push(cuenta);
    }

    closeModal();
    renderTable(filteredAccounts());
}

/* === EVENT LISTENERS ADICIONALES === */
// Abrir modal para nueva cuenta
modalElements.btnOpenModal.addEventListener('click', () => {
    resetForm();
    openModal();
});

// Cerrar modal con botón X
modalElements.btnCloseModal.addEventListener('click', closeModal);

// Cerrar modal haciendo clic fuera
/*
modalElements.modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalElements.modalOverlay) {
        closeModal();
    }
});
*/