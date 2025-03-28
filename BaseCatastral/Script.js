// Configuración inicial
let basesCatastrales = [];
let currentPage = 1;
const rowsPerPage = 6;
let isEditing = false;
let currentIndex = null;

// Elementos del DOM
const elements = {
    tableBody: document.querySelector("#accountsTable tbody"),
    searchInput: document.getElementById("searchInput"),
    form: document.getElementById("accountForm"),
    claveCatastral: document.getElementById("claveCatastral"),
    nombrePropietario: document.getElementById("nombrePropietario"),
    ubicacion: document.getElementById("ubicacion"),
    valorTerreno: document.getElementById("valorTerreno"),
    valorConstruccion: document.getElementById("valorConstruccion"),
    usoSuelo: document.getElementById("usoSuelo"),
    fechaAvaluo: document.getElementById("fechaAvaluo"),
    btnAddOrUpdate: document.getElementById("btnAddOrUpdate"),
    btnCancel: document.getElementById("btnCancel"),
    formTitle: document.getElementById("formTitle"),
    pagination: document.querySelector(".pagination")
};

/* === FUNCIONES PRINCIPALES === */

function renderTable(data) {
    elements.tableBody.innerHTML = "";
    const start = (currentPage - 1) * rowsPerPage;
    const paginatedData = data.slice(start, start + rowsPerPage);

    paginatedData.forEach((base, index) => {
        const row = `
            <tr>
                <td>${base.claveCatastral}</td>
                <td>${base.nombrePropietario}</td>
                <td>${base.ubicacion}</td>
                <td>$${base.valorTerreno.toLocaleString()}</td>
                <td>$${base.valorConstruccion.toLocaleString()}</td>
                <td>${base.usoSuelo.charAt(0).toUpperCase() + base.usoSuelo.slice(1)}</td>
                <td>
                    <button class="action-btn edit" onclick="editBase(${start + index})">✏️ Editar</button>
                    <button class="action-btn delete" onclick="deleteBase(${start + index})">🗑️ Eliminar</button>
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
        <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            « Anterior
        </button>`;

    for(let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <button class="${i === currentPage ? 'active' : ''}" 
                    onclick="changePage(${i})">
                ${i}
            </button>`;
    }

    paginationHTML += `
        <button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            Siguiente »
        </button>`;

    elements.pagination.innerHTML = paginationHTML;
}

/* === MANEJADORES DE EVENTOS === */

elements.form.addEventListener("submit", handleSubmit);
elements.btnCancel.addEventListener("click", resetForm);
elements.searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderTable(filteredBases());
});

/* === FUNCIONES AUXILIARES === */

function filteredBases() {
    const term = elements.searchInput.value.toLowerCase();
    return basesCatastrales.filter(base => 
        base.claveCatastral.toLowerCase().includes(term) ||
        base.nombrePropietario.toLowerCase().includes(term) ||
        base.ubicacion.toLowerCase().includes(term) ||
        base.usoSuelo.toLowerCase().includes(term)
    );
}

function handleSubmit(e) {
    e.preventDefault();
    const nuevaBase = {
        claveCatastral: elements.claveCatastral.value,
        nombrePropietario: elements.nombrePropietario.value,
        ubicacion: elements.ubicacion.value,
        valorTerreno: parseFloat(elements.valorTerreno.value),
        valorConstruccion: parseFloat(elements.valorConstruccion.value),
        usoSuelo: elements.usoSuelo.value,
        fechaAvaluo: elements.fechaAvaluo.value
    };

    if(isEditing) {
        basesCatastrales[currentIndex] = nuevaBase;
    } else {
        basesCatastrales.push(nuevaBase);
    }

    resetForm();
    renderTable(filteredBases());
}

window.changePage = function(page) {
    currentPage = page;
    renderTable(filteredBases());
};

window.editBase = function(index) {
    const base = basesCatastrales[index];
    elements.claveCatastral.value = base.claveCatastral;
    elements.nombrePropietario.value = base.nombrePropietario;
    elements.ubicacion.value = base.ubicacion;
    elements.valorTerreno.value = base.valorTerreno;
    elements.valorConstruccion.value = base.valorConstruccion;
    elements.usoSuelo.value = base.usoSuelo;
    elements.fechaAvaluo.value = base.fechaAvaluo;
    
    isEditing = true;
    currentIndex = index;
    elements.formTitle.textContent = "Editar Base Catastral";
    elements.btnAddOrUpdate.textContent = "Actualizar";
    document.getElementById('formContainer').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
};

window.deleteBase = function(index) {
    if(confirm("¿Confirmar eliminación de esta base catastral?")) {
        if(validarEliminacion(index)) {
            basesCatastrales.splice(index, 1);
            const totalPages = Math.ceil(filteredBases().length / rowsPerPage);
            if(currentPage > totalPages && totalPages > 0) {
                currentPage = totalPages;
            }
            renderTable(filteredBases());
        } else {
            alert("No se puede eliminar: existen registros relacionados");
        }
    }
};

function validarEliminacion(index) {
    // Implementar lógica real de validación con backend
    return true; // Mock temporal
}

function resetForm() {
    elements.form.reset();
    isEditing = false;
    currentIndex = null;
    elements.formTitle.textContent = "Registrar Base Catastral";
    elements.btnAddOrUpdate.textContent = "Guardar";
}

/* === INICIALIZACIÓN === */
document.addEventListener("DOMContentLoaded", () => {
    // Datos de ejemplo
    basesCatastrales = [
        {
            claveCatastral: "C-001-2023",
            nombrePropietario: "Juan Pérez",
            ubicacion: "Calle Principal #123",
            valorTerreno: 500000,
            valorConstruccion: 1200000,
            usoSuelo: "habitacional",
            fechaAvaluo: "2023-01-15"
        },
        {
            claveCatastral: "C-002-2023",
            nombrePropietario: "María García",
            ubicacion: "Avenida Central #456",
            valorTerreno: 750000,
            valorConstruccion: 2000000,
            usoSuelo: "comercial",
            fechaAvaluo: "2023-02-20"
        }
    ];
    renderTable(basesCatastrales);
});