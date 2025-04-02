// Datos iniciales de ejemplo para Estímulos Fiscales
let estimulosFiscales = [
    
];

// Variables de estado
let isEditingEstimulo = false;
let currentEstimuloIndex = null;
let currentEstimuloPage = 1;
const estimulosPerPage = 10;

// Mapeo de elementos del DOM
const elements = {
    tableBody: document.querySelector("#estimulosTable tbody"),
    searchInput: document.getElementById("searchEstimuloInput"),
    form: document.getElementById("estimuloForm"),
    idEstimulo: document.getElementById("idEstimulo"),
    nombreContribucion: document.getElementById("nombreContribucion"),
    caracteristicas: document.getElementById("caracteristicas"),
    porcentajeDescuento: document.getElementById("porcentajeDescuento"),
    requisitos: document.getElementById("requisitos"),
    btnSave: document.getElementById("btnSaveEstimulo"),
    btnCancel: document.getElementById("btnCancelEstimulo"),
    formTitle: document.getElementById("estimuloFormTitle"),
    paginationContainer: document.querySelector(".pagination"),
    modalOverlay: document.getElementById("estimuloModalOverlay"),
    btnOpenModal: document.getElementById("btnOpenEstimuloModal"),
    btnCloseModal: document.getElementById("btnCloseEstimuloModal")
};

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
    renderEstimulosTable(estimulosFiscales);
    
    // Event listeners
    elements.btnOpenModal.addEventListener("click", openEstimuloModal);
    elements.btnCloseModal.addEventListener("click", closeEstimuloModal);
    elements.btnCancel.addEventListener("click", closeEstimuloModal);
    elements.form.addEventListener("submit", handleEstimuloSubmit);
    elements.searchInput.addEventListener("input", searchEstimulos);
});

// Renderizar tabla de estímulos
function renderEstimulosTable(data) {
    elements.tableBody.innerHTML = "";
    const start = (currentEstimuloPage - 1) * estimulosPerPage;
    const end = start + estimulosPerPage;
    const paginatedData = data.slice(start, end);

    paginatedData.forEach((estimulo, index) => {
        const row = `
            <tr>
                <td>${estimulo.idEstimulo}</td>
                <td>${estimulo.nombreContribucion}</td>
                <td>${estimulo.caracteristicas}</td>
                <td>${estimulo.porcentajeDescuento}%</td>
                <td>${estimulo.requisitos.replace(/\n/g, '<br>')}</td>
                <td>
                    <button class="action-btn edit" onclick="editEstimulo(${start + index})" title="Editar">
                        <img src="/Componentes/editor.png" class="action-icon">
                    </button>
                    <button class="action-btn delete" onclick="deleteEstimulo(${start + index})" title="Eliminar">
                        <img src="/Componentes/eliminar.png" class="action-icon">
                    </button>
                </td>
            </tr>
        `;
        elements.tableBody.insertAdjacentHTML("beforeend", row);
    });

    renderEstimulosPagination(data.length);
}

// Renderizar paginación
function renderEstimulosPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / estimulosPerPage);
    let paginationHTML = `
        <button class="pagination-btn" onclick="changeEstimuloPage(${currentEstimuloPage - 1})" ${currentEstimuloPage === 1 ? 'disabled' : ''}>
            « Anterior
        </button>
    `;

    const startPage = Math.max(1, currentEstimuloPage - 2);
    const endPage = Math.min(totalPages, currentEstimuloPage + 2);

    if (startPage > 1) {
        paginationHTML += `
            <button class="pagination-btn" onclick="changeEstimuloPage(1)">1</button>
            ${startPage > 2 ? '<span>...</span>' : ''}
        `;
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="pagination-btn ${i === currentEstimuloPage ? 'active' : ''}" onclick="changeEstimuloPage(${i})">
                ${i}
            </button>
        `;
    }

    if (endPage < totalPages) {
        paginationHTML += `
            ${endPage < totalPages - 1 ? '<span>...</span>' : ''}
            <button class="pagination-btn" onclick="changeEstimuloPage(${totalPages})">${totalPages}</button>
        `;
    }

    paginationHTML += `
        <button class="pagination-btn" onclick="changeEstimuloPage(${currentEstimuloPage + 1})" ${currentEstimuloPage === totalPages ? 'disabled' : ''}>
            Siguiente »
        </button>
    `;
    
    elements.paginationContainer.innerHTML = paginationHTML;
}

// Buscar estímulos
function searchEstimulos() {
    const term = elements.searchInput.value.toLowerCase();
    const filtered = estimulosFiscales.filter(estimulo =>
        estimulo.nombreContribucion.toLowerCase().includes(term) ||
        estimulo.porcentajeDescuento.toString().includes(term) ||
        estimulo.requisitos.toLowerCase().includes(term)
    );
    currentEstimuloPage = 1;
    renderEstimulosTable(filtered);
}

// Manejar envío del formulario
function handleEstimuloSubmit(e) {
    e.preventDefault();
    
    const estimulo = {
        idEstimulo: elements.idEstimulo.value,
        nombreContribucion: elements.nombreContribucion.value,
        caracteristicas: elements.caracteristicas.value,
        porcentajeDescuento: parseFloat(elements.porcentajeDescuento.value),
        requisitos: elements.requisitos.value
    };

    if (isEditingEstimulo) {
        estimulosFiscales[currentEstimuloIndex] = estimulo;
    } else {
        estimulosFiscales.push(estimulo);
    }

    closeEstimuloModal();
    renderEstimulosTable(estimulosFiscales);
}

// Abrir modal de estímulo
function openEstimuloModal() {
    elements.modalOverlay.style.display = 'block';
}

// Cerrar modal de estímulo
function closeEstimuloModal() {
    elements.modalOverlay.style.display = 'none';
    resetEstimuloForm();
}

// Reiniciar formulario
function resetEstimuloForm() {
    elements.form.reset();
    isEditingEstimulo = false;
    currentEstimuloIndex = null;
    elements.formTitle.textContent = "Registrar Estímulo Fiscal";
    elements.btnSave.textContent = "Guardar";
}

// Editar estímulo
function editEstimulo(index) {
    const estimulo = estimulosFiscales[index];
    elements.idEstimulo.value = estimulo.idEstimulo;
    elements.nombreContribucion.value = estimulo.nombreContribucion;
    elements.caracteristicas.value = estimulo.caracteristicas;
    elements.porcentajeDescuento.value = estimulo.porcentajeDescuento;
    elements.requisitos.value = estimulo.requisitos;
    
    isEditingEstimulo = true;
    currentEstimuloIndex = index;
    elements.formTitle.textContent = "Editar Estímulo Fiscal";
    elements.btnSave.textContent = "Actualizar";
    openEstimuloModal();
}

// Eliminar estímulo
function deleteEstimulo(index) {
    if (confirm("¿Confirmar eliminación de este estímulo fiscal?")) {
        estimulosFiscales.splice(index, 1);
        const totalPages = Math.ceil(estimulosFiscales.length / estimulosPerPage);
        if (currentEstimuloPage > totalPages && totalPages > 0) {
            currentEstimuloPage = totalPages;
        }
        renderEstimulosTable(estimulosFiscales);
    }
}

// Cambiar página
function changeEstimuloPage(page) {
    currentEstimuloPage = page;
    renderEstimulosTable(estimulosFiscales);
}

// Hacer funciones disponibles globalmente
window.editEstimulo = editEstimulo;
window.deleteEstimulo = deleteEstimulo;
window.changeEstimuloPage = changeEstimuloPage;