// Variables de estado globales
let isEditing = false;
let currentIndex = null;
let currentPage = 1;
const rowsPerPage = 10;
let contribuyentes = [];

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
    paginationContainer: document.querySelector(".pagination"),
    modalOverlay: document.getElementById('modalOverlay'),
    btnOpenModal: document.getElementById('btnOpenModal'),
};

// Funciones principales
function renderTable(data) {
    elements.tableBody.innerHTML = "";
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = data.slice(start, end);

    paginatedData.forEach((contribuyente, index) => {
        const domicilio = `${contribuyente.calle} ${contribuyente.num_calle}, ${contribuyente.colonia}`;
        const row = `
        <tr>
            <td>${contribuyente.nombre} ${contribuyente.apellido_paterno} ${contribuyente.apellido_materno}</td>
            <td>${contribuyente.rfc}</td>
            <td>${domicilio}</td>
            <td>${contribuyente.telefono}</td>
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

// Funciones de manejo de eventos
function handleSubmit(e) {
    e.preventDefault();
    const contribuyente = {
        nombre: elements.nombre.value.trim(),
        apellido_paterno: elements.apellido_paterno.value.trim(),
        apellido_materno: elements.apellido_materno.value.trim(),
        rfc: elements.rfc.value.trim().toUpperCase(),
        calle: elements.calle.value.trim(),
        num_calle: elements.num_calle.value.trim(),
        colonia: elements.colonia.value.trim(),
        telefono: elements.telefono.value.trim(),
        num_cuenta: elements.num_cuenta.value.trim()
    };

    if (isEditing) {
        contribuyentes[currentIndex] = contribuyente;
    } else {
        contribuyentes.push(contribuyente);
    }

    closeModal();
    renderTable(filteredAccounts());
}

function filteredAccounts() {
    const term = elements.searchInput.value.toLowerCase();
    return contribuyentes.filter(contribuyente =>
        contribuyente.nombre.toLowerCase().includes(term) ||
        contribuyente.apellido_paterno.toLowerCase().includes(term) ||
        contribuyente.rfc.toLowerCase().includes(term) ||
        contribuyente.num_cuenta.toLowerCase().includes(term)
    );
}

// Funciones del modal
function openModal() {
    elements.modalOverlay.style.display = 'block';
}

function closeModal() {
    elements.modalOverlay.style.display = 'none';
    resetForm();
}

function resetForm() {
    elements.form.reset();
    isEditing = false;
    currentIndex = null;
    elements.formTitle.textContent = "Agregar Contribuyente";
    elements.btnAddOrUpdate.textContent = "Agregar";
}

// Funciones globales
window.changePage = function(page) {
    if (page < 1 || page > Math.ceil(filteredAccounts().length / rowsPerPage)) return;
    currentPage = page;
    renderTable(filteredAccounts());
};

window.editAccount = function(index) {
    const contribuyente = contribuyentes[index];
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
};

window.deleteAccount = function(index) {
    if (confirm("¿Confirmar eliminación?")) {
        contribuyentes.splice(index, 1);
        const totalPages = Math.ceil(filteredAccounts().length / rowsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
            currentPage = totalPages;
        }
        renderTable(filteredAccounts());
    }
};

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
    // Event listeners
    elements.form.addEventListener("submit", handleSubmit);
    elements.btnCancel.addEventListener("click", closeModal);
    elements.searchInput.addEventListener("input", () => {
        currentPage = 1;
        renderTable(filteredAccounts());
    });
    elements.btnOpenModal.addEventListener('click', () => {
        resetForm();
        openModal();
    });
    elements.btnCloseModal.addEventListener('click', closeModal);
    
    // Renderizar tabla inicial
    renderTable(contribuyentes);
});