// Variables de estado globales
let isEditing = false;
let currentIndex = null;
let currentPage = 1;
const rowsPerPage = 10;
let secciones = JSON.parse(localStorage.getItem('secciones')) || [
    {
        nombre: "Segunda De Panteones",
        año_ejercicio: "2019"
    },
    {
        nombre: "Obras Públicas",
        año_ejercicio: "2020"
    },
    {
        nombre: "Drenaje",
        año_ejercicio: "2023"
    },
    {
        nombre: "Sección Sexta",
        año_ejercicio: "2024"
    },
    {
        nombre: "Tercera De Rastro",
        año_ejercicio: "2024"
    }
];

// Mapeo de elementos del DOM
const elements = {
    tableBody: document.querySelector("#accountsTable tbody"),
    searchInput: document.getElementById("searchInput"),
    form: document.getElementById("accountForm"),
    nombre: document.getElementById("nombre"),
    año_ejercicio: document.getElementById("año_ejercicio"),
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

    // Mensaje si no hay datos
    if (data.length === 0) {
        elements.tableBody.innerHTML = '<tr><td colspan="3">No hay secciones registradas</td></tr>';
        return;
    }

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = data.slice(start, end);

    paginatedData.forEach((seccion, index) => {
        const row = `
        <tr>
            <td>${seccion.nombre}</td>
            <td>${seccion.año_ejercicio}</td>
            <td>
                <button class="action-btn edit" onclick="editAccount(${start + index})" title="Editar">
                    <img src="/public/Assets/editor.png" class="action-icon">
                </button>
                <button class="action-btn delete" onclick="deleteAccount(${start + index})" title="Eliminar">
                    <img src="/public/Assets/eliminar.png" class="action-icon">
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
window.changePage = function (page) {
    if (page < 1 || page > Math.ceil(filteredAccounts().length / rowsPerPage)) return;
    currentPage = page;
    renderTable(filteredAccounts());
};

window.editAccount = function (index) {
    const seccion = secciones[index];
    elements.nombre.value = seccion.nombre;
    elements.año_ejercicio.value = seccion.año_ejercicio;

    isEditing = true;
    currentIndex = index;
    elements.formTitle.textContent = "Editar Sección";
    elements.btnAddOrUpdate.textContent = "Actualizar";
    openModal();
};

window.deleteAccount = function (index) {
    if (confirm("¿Confirmar eliminación?")) {
        secciones.splice(index, 1);
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
    // renderTable(secciones);

    const tablaBody = document.querySelector('#accountsTable tbody');

    const cargarSecciones = async () => {
        try {
            // Usa la URL completa para desarrollo
            const response = await fetch('http://localhost:5000/api/secciones');

            if (!response.ok) {
                throw new Error(`Error HTTP! estado: ${response.status}`);
            }

            const secciones = await response.json();

            tablaBody.innerHTML = '';

            if (secciones.length === 0) {
                tablaBody.innerHTML = '<tr><td colspan="6">No hay secciones registradas</td></tr>';
                return;
            }

            secciones.forEach(seccion => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${seccion.clave_subcuenta || 'N/A'}</td>
                    <td>${seccion.clave_seccion || 'N/A'}</td>
                    <td>${seccion.nombre_seccion || ''}</td>
                    <td>
                        <button class="btn-editar">Editar</button>
                        <button class="btn-eliminar">Eliminar</button>
                    </td>
                `;
                tablaBody.appendChild(fila);
            });

        } catch (error) {
            console.error('Error al cargar las secciones:', error);
            tablaBody.innerHTML = '<tr><td colspan="6">Error al cargar los datos :( </td></tr>';
        }
    };

    cargarSecciones();
});