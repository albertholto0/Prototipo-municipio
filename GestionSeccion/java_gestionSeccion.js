// Variables de estado globales
let isEditing = false;
let currentIndex = null;
let currentPage = 1;
const rowsPerPage = 10;
let secciones = JSON.parse(localStorage.getItem('secciones')) || [];

// Mapeo de elementos del DOM
const elements = {
    tableBody: document.querySelector("#accountsTable tbody"),
    searchInput: document.getElementById("searchInput"),
    form: document.getElementById("accountForm"),
    nombre: document.getElementById("nombre"),
    año_ejercicio: document.getElementById("año_ejercicio"), // Corregido
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

    paginatedData.forEach((seccion, index) => {
        const rowNumber = start + index + 1; // Numeración que empieza en 1
        const row = `
        <tr>
            <td>${rowNumber}</td> <!-- Columna de número -->
            <td>${seccion.nombre}</td>
            <td>${seccion.año_ejercicio}</td>
            <td>
                <button class="action-btn edit" onclick="editAccount(${secciones.indexOf(seccion)})" title="Editar">
                    <img src="/Assets/editor.png" class="action-icon">
                </button>
                <button class="action-btn delete" onclick="deleteAccount(${secciones.indexOf(seccion)})" title="Eliminar">
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

function handleSubmit(e) {
    e.preventDefault();
    const seccion = {
        nombre: elements.nombre.value.trim(),
        año_ejercicio: elements.año_ejercicio.value.trim(),
    };

    if (isEditing) {
        secciones[currentIndex] = seccion;
    } else {
        secciones.push(seccion);
    }

    // Guardar en localStorage para persistencia
    localStorage.setItem('secciones', JSON.stringify(secciones));
    
    closeModal();
    renderTable(filteredAccounts());
}

function filteredAccounts() {
    const term = elements.searchInput.value.toLowerCase();
    return secciones.filter(seccion =>
        seccion.nombre.toLowerCase().includes(term) ||
        seccion.año_ejercicio.toLowerCase().includes(term)
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
    elements.formTitle.textContent = "Agregar Sección";
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
    elements.año_ejercicio.value = contribuyente.año_ejercicio;
    
    isEditing = true;
    currentIndex = index;
    elements.formTitle.textContent = "Editar Sección";
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
    
    // Renderizar tabla inicial
    renderTable(secciones);
});