// Datos de ejemplo
let estimulosFiscales = [
    {
        nombre_contribucion: "Descuento a adultos mayores",
        porcentaje_descuento: 50,
        caracteristicas: "Aplicable a contribuyentes mayores de 60 años",
        requisitos: "1. Identificación oficial"
    }
];

// Variables globales
let isEditing = false;
let currentIndex = null;
let currentPage = 1;
const rowsPerPage = 10;

// Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function() {
    // Elementos del DOM
    const elements = {
        tableBody: document.querySelector("#accountsTable tbody"),
        searchInput: document.getElementById("searchInput"),
        form: document.getElementById("estimuloForm"),
        nombreInput: document.getElementById("nombre_contribucion"),
        caracteristicasInput: document.getElementById("caracteristicas"),
        porcentajeInput: document.getElementById("porcentaje"),
        requisitosInput: document.getElementById("requisitos"),
        btnAdd: document.getElementById("btnAddOrUpdate"),
        btnCancel: document.getElementById("btnCancel"),
        formTitle: document.getElementById("formTitle"),
        pagination: document.querySelector(".pagination"),
        btnOpenModal: document.getElementById("btnOpenModal"),
        btnCloseModal: document.getElementById("btnCloseModal"),
        btnCloseViewModal: document.getElementById("btnCloseViewModal")
    };

    // ===== FUNCIONES PRINCIPALES =====
    function renderTable(data) {
        const filteredData = filteredEstimulos(data);
        elements.tableBody.innerHTML = "";
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedData = filteredData.slice(start, end);
<<<<<<< HEAD

=======
    
>>>>>>> main
        if (paginatedData.length === 0) {
            elements.tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="no-data">No se encontraron estímulos fiscales</td>
                </tr>
            `;
            renderPagination(0);
<<<<<<< HEAD
            aplicarEstilosATabla();
            return;
        }

=======
            aplicarEstilosATabla(); // ✅ Aquí también, por si no hay datos
            return;
        }
    
>>>>>>> main
        paginatedData.forEach((estimulo, index) => {
            const row = `
                <tr>
                    <td>${estimulo.nombre_contribucion}</td>
                    <td>${estimulo.porcentaje_descuento}%</td>
                    <td title="${estimulo.caracteristicas}">
                        ${estimulo.caracteristicas.substring(0, 30)}${estimulo.caracteristicas.length > 30 ? '...' : ''}
                    </td>
                    <td title="${estimulo.requisitos}">
                        ${estimulo.requisitos.substring(0, 30)}${estimulo.requisitos.length > 30 ? '...' : ''}
                    </td>
                    <td class="actions">
                        <button class="action-btn edit" onclick="editEstimulo(${start + index})">
                            <img src="/Assets/editor.png" alt="Editar">
                        </button>
                        <button class="action-btn delete" onclick="deleteEstimulo(${start + index})">
                            <img src="/Assets/eliminar.png" alt="Eliminar">
                        </button>
                        <button class="action-btn view" onclick="viewEstimulo(${start + index})">
                            <img src="/Assets/visualizar.png" alt="Ver">
                        </button>
                    </td>
                </tr>
            `;
            elements.tableBody.insertAdjacentHTML("beforeend", row);
        });
<<<<<<< HEAD

        renderPagination(filteredData.length);
        aplicarEstilosATabla();
    }
=======
    
        renderPagination(filteredData.length);
        aplicarEstilosATabla(); // ✅ Asegura que se apliquen los estilos al renderizar
    }
    
>>>>>>> main

    function renderPagination(totalItems) {
        const totalPages = Math.ceil(totalItems / rowsPerPage);
        elements.pagination.innerHTML = '';

        if (totalPages <= 1) return;

        // Botón Anterior
        const prevBtn = document.createElement('button');
        prevBtn.textContent = '« Anterior';
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', () => changePage(currentPage - 1));
        elements.pagination.appendChild(prevBtn);

        // Números de página
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            if (i === currentPage) {
                pageBtn.classList.add('active');
            }
            pageBtn.addEventListener('click', () => changePage(i));
            elements.pagination.appendChild(pageBtn);
        }

        // Botón Siguiente
        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Siguiente »';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener('click', () => changePage(currentPage + 1));
        elements.pagination.appendChild(nextBtn);
    }

    // ===== FUNCIONES CRUD =====
    function handleSubmit(e) {
        e.preventDefault();
        
        if (!elements.nombreInput.value || !elements.porcentajeInput.value) {
            alert("Por favor complete los campos requeridos");
            return;
        }

        const estimulo = {
            nombre_contribucion: elements.nombreInput.value,
            porcentaje_descuento: parseInt(elements.porcentajeInput.value),
            caracteristicas: elements.caracteristicasInput.value,
            requisitos: elements.requisitosInput.value
        };

        if (isEditing) {
            estimulosFiscales[currentIndex] = estimulo;
        } else {
            estimulosFiscales = [estimulo, ...estimulosFiscales];
        }

        currentPage = 1;
        elements.searchInput.value = '';
        
        closeModal();
        renderTable(estimulosFiscales);
        showNotification(isEditing ? "Estímulo actualizado" : "Estímulo agregado");
    }

    function filteredEstimulos(data) {
        const term = elements.searchInput.value.toLowerCase();
        if (!term) return data;
        
        return data.filter(estimulo =>
            estimulo.nombre_contribucion.toLowerCase().includes(term) ||
            (estimulo.caracteristicas && estimulo.caracteristicas.toLowerCase().includes(term)) ||
            (estimulo.requisitos && estimulo.requisitos.toLowerCase().includes(term))
        );
    }

    // ===== FUNCIONES DE INTERFAZ =====
    window.changePage = function(page) {
        currentPage = page;
        renderTable(estimulosFiscales);
    };

    window.editEstimulo = function(index) {
        const estimulo = estimulosFiscales[index];
        elements.nombreInput.value = estimulo.nombre_contribucion;
        elements.porcentajeInput.value = estimulo.porcentaje_descuento;
        elements.caracteristicasInput.value = estimulo.caracteristicas;
        elements.requisitosInput.value = estimulo.requisitos;
        
        isEditing = true;
        currentIndex = index;
        elements.formTitle.textContent = "Editar Estímulo Fiscal";
        elements.btnAdd.textContent = "Actualizar";
        
        openModal();
    };

    window.deleteEstimulo = function(index) {
        if (confirm("¿Está seguro de eliminar este estímulo fiscal?")) {
            estimulosFiscales.splice(index, 1);
            
            const filtered = filteredEstimulos(estimulosFiscales);
            const totalPages = Math.ceil(filtered.length / rowsPerPage);
            if (currentPage > totalPages && totalPages > 0) {
                currentPage = totalPages;
            }
            
            renderTable(estimulosFiscales);
            showNotification("Estímulo eliminado");
        }
    };

    window.viewEstimulo = function(index) {
        const estimulo = estimulosFiscales[index];
        const infoContent = document.getElementById("infoContent");
        
        infoContent.innerHTML = `
            <p><strong>Nombre:</strong> ${estimulo.nombre_contribucion}</p>
            <p><strong>Porcentaje de descuento:</strong> ${estimulo.porcentaje_descuento}%</p>
            <p><strong>Características:</strong> ${estimulo.caracteristicas}</p>
            <p><strong>Requisitos:</strong><br>${estimulo.requisitos.replace(/\n/g, '<br>')}</p>
        `;
        
        openViewModal();
    };

    // ===== MANEJO DE MODALES =====
    function openModal() {
        document.getElementById("modalOverlay").style.display = "flex";
    }
    
    function closeModal() {
        document.getElementById("modalOverlay").style.display = "none";
        elements.form.reset();
        isEditing = false;
        elements.formTitle.textContent = "Agregar Estímulo Fiscal";
        elements.btnAdd.textContent = "Agregar";
    }

    function openViewModal() {
        document.getElementById("viewModalOverlay").style.display = "block";
    }

    function closeViewModal() {
        document.getElementById("viewModalOverlay").style.display = "none";
    }

    function resetForm() {
        elements.form.reset();
        isEditing = false;
        currentIndex = null;
        elements.formTitle.textContent = "Agregar Estímulo Fiscal";
        elements.btnAdd.textContent = "Agregar";
    }

    // ===== FUNCIONES AUXILIARES =====
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    // ===== INICIALIZACIÓN =====
    // Configurar event listeners
    elements.form.addEventListener("submit", handleSubmit);
    elements.btnCancel.addEventListener("click", closeModal);
    elements.searchInput.addEventListener("input", function() {
        currentPage = 1;
        renderTable(estimulosFiscales);
    });
    
    elements.btnOpenModal.addEventListener("click", function() {
        resetForm();
        openModal();
    });
    
    elements.btnCloseModal.addEventListener("click", closeModal);
    elements.btnCloseViewModal.addEventListener("click", closeViewModal);
    
    // Renderizar tabla inicial
    renderTable(estimulosFiscales);
});

function aplicarEstilosATabla() {
    const celdas = document.querySelectorAll(".data-table td, .data-table th");
    celdas.forEach(celda => {
        celda.style.fontSize = "15px";
        celda.style.padding = "6px 8px";
        celda.style.lineHeight = "1.2";
    });

    const filas = document.querySelectorAll(".data-table tr");
    filas.forEach(fila => {
        fila.style.height = "auto";
    });

    const iconos = document.querySelectorAll(".action-btn img");
    iconos.forEach(icono => {
        icono.style.width = "41px";
        icono.style.height = "41px";
    });
}

// Ejecutar al cargar la página
<<<<<<< HEAD
document.addEventListener("DOMContentLoaded", aplicarEstilosATabla);
=======
document.addEventListener("DOMContentLoaded", aplicarEstilosATabla);
>>>>>>> main
