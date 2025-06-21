document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const tablaBody = document.getElementById('tablaEstimulos');
    const form = document.getElementById('estimuloForm');
    const btnAdd = document.getElementById('btnAddOrUpdate');
    const btnCancel = document.getElementById('btnCancel');
    const btnOpenModal = document.getElementById('btnOpenModal');
    const searchInput = document.getElementById('searchInput');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const btnCloseViewModal = document.getElementById('btnCloseViewModal');
    const infoContent = document.getElementById('infoContent');

    // Variables de estado
    let isEditing = false;
    let currentId = null;

    // Cargar estímulos al iniciar
    cargarEstimulos();

    // Función para cargar datos
    async function cargarEstimulos() {
        try {
            const response = await fetch('http://localhost:5000/api/estimuloFiscal');
            if (!response.ok) throw new Error('Error al cargar datos');
            const data = await response.json();
            renderTable(data);
        } catch (error) {
            console.error('Error:', error);
            tablaBody.innerHTML = '<tr><td colspan="5">Error al cargar los datos</td></tr>';
        }
    }

    // Mostrar datos en la tabla
    function renderTable(data) {
        tablaBody.innerHTML = '';
        
        if (data.length === 0) {
            tablaBody.innerHTML = '<tr><td colspan="5">No se encontraron estímulos</td></tr>';
            return;
        }

        data.forEach(est => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${est.nombre_contribucion || 'N/A'}</td>
                <td>${est.porcentaje_descuento || 'N/A'}%</td>
                <td>${est.caracteristicas || 'N/A'}</td>
                <td>${est.requisitos || 'N/A'}</td>
                <td class="action-buttons">
                    <button class="action-btn edit" onclick="editEstimulo(${est.id_estimulo_fiscal})" title="Editar">
                        <img src="../Assets/editor.png" class="action-icon" width="40" height="40">
                    </button>
                    <button class="action-btn delete" onclick="confirmDelete(${est.id_estimulo_fiscal})" title="Eliminar">
                        <img src="../Assets/eliminar.png" class="action-icon"width="80" height="80">
                    </button>
                    <button class="action-btn view" onclick="viewEstimulo(${est.id_estimulo_fiscal})" title="Ver detalles">
                        <img src="../Assets/visualizar.png" class="action-icon" width="40" height="40">
                    </button>
                </td>
            `;
            tablaBody.appendChild(fila);
        });
    }

    // Función de búsqueda
    async function buscarEstimulos() {
        const termino = searchInput.value.trim();
        try {
            const url = termino 
                ? `http://localhost:5000/api/estimuloFiscal?search=${encodeURIComponent(termino)}`
                : 'http://localhost:5000/api/estimuloFiscal';
            
            const response = await fetch(url);
            if (!response.ok) throw new Error('Error en la búsqueda');
            const data = await response.json();
            renderTable(data);
        } catch (error) {
            console.error('Error:', error);
            tablaBody.innerHTML = '<tr><td colspan="5">Error al buscar</td></tr>';
        }
    }

    // Evento de búsqueda al presionar Enter
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') buscarEstimulos();
    });

    // Manejar el formulario (Agregar/Editar)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            nombre_contribucion: document.getElementById('nombre_contribucion').value,
            porcentaje_descuento: document.getElementById('porcentaje').value,
            caracteristicas: document.getElementById('caracteristicas').value,
            requisitos: document.getElementById('requisitos').value // Nota: El ID en tu HTML es 'requisitos' (con una 's')
        };

        try {
            const url = isEditing 
                ? `http://localhost:5000/api/estimuloFiscal/${currentId}`
                : 'http://localhost:5000/api/estimuloFiscal';
                
            const method = isEditing ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Error al guardar');

            closeModal();
            cargarEstimulos();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al procesar la solicitud');
        }
    });

    // Editar estímulo
    window.editEstimulo = async function(id) {
        try {
            const response = await fetch(`http://localhost:5000/api/estimuloFiscal/${id}`);
            if (!response.ok) throw new Error('Error al cargar datos');
            
            const estimulo = await response.json();
            
            document.getElementById('nombre_contribucion').value = estimulo.nombre_contribucion;
            document.getElementById('porcentaje').value = estimulo.porcentaje_descuento;
            document.getElementById('caracteristicas').value = estimulo.caracteristicas;
            document.getElementById('requisitos').value = estimulo.requisitos;
            
            isEditing = true;
            currentId = id;
            btnAdd.textContent = "Actualizar";
            document.getElementById("formTitle").textContent = "Editar Estímulo Fiscal";
            
            openModal();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al cargar el estímulo');
        }
    };

    // Confirmar eliminación
    window.confirmDelete = function(id) {
        if (confirm("¿Está seguro de eliminar este estímulo fiscal?")) {
            deleteEstimulo(id);
        }
    };

    // Eliminar estímulo
    async function deleteEstimulo(id) {
        try {
            const response = await fetch(`http://localhost:5000/api/estimuloFiscal/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) throw new Error('Error al eliminar');
            
            cargarEstimulos();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar el estímulo');
        }
    }

    // Ver detalles del estímulo
    window.viewEstimulo = async function(id) {
        try {
            const response = await fetch(`http://localhost:5000/api/estimuloFiscal/${id}`);
            if (!response.ok) throw new Error('Error al cargar datos');
            
            const estimulo = await response.json();
            
            infoContent.innerHTML = `
                <p><strong>Nombre:</strong> ${estimulo.nombre_contribucion}</p>
                <p><strong>Porcentaje de descuento:</strong> ${estimulo.porcentaje_descuento}%</p>
                <p><strong>Características:</strong> ${estimulo.caracteristicas}</p>
                <p><strong>Requisitos:</strong><br>${estimulo.requisitos.replace(/\n/g, '<br>')}</p>
            `;

            openViewModal();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al cargar los detalles');
        }
    };

    // Funciones para manejar modales
    function openModal() {
        document.getElementById("modalOverlay").style.display = "flex";
    }

    function closeModal() {
        document.getElementById("modalOverlay").style.display = "none";
        form.reset();
        isEditing = false;
        currentId = null;
        btnAdd.textContent = "Agregar";
        document.getElementById("formTitle").textContent = "Agregar Estímulo Fiscal";
    }

    function openViewModal() {
        document.getElementById("viewModalOverlay").style.display = "block";
    }

    function closeViewModal() {
        document.getElementById("viewModalOverlay").style.display = "none";
    }

    // Event listeners
    btnOpenModal.addEventListener('click', openModal);
    btnCancel.addEventListener('click', closeModal);
    btnCloseModal.addEventListener('click', closeModal);
    btnCloseViewModal.addEventListener('click', closeViewModal);

    // Aplicar estilos a la tabla después de cargar
    setTimeout(aplicarEstilosATabla, 100);
});

function aplicarEstilosATabla() {
    const celdas = document.querySelectorAll("#accountsTable td, #accountsTable th");
    celdas.forEach(celda => {
        celda.style.padding = "8px 12px";
        celda.style.textAlign = "left";
    });

    const filas = document.querySelectorAll("#accountsTable tr");
    filas.forEach(fila => {
        fila.style.height = "auto";
    });

    const iconos = document.querySelectorAll(".action-btn img");
    iconos.forEach(icono => {
        icono.style.width = "24px";
        icono.style.height = "24px";
    });
}