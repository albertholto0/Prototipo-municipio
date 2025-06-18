// Variables de estado globales
let secciones = []; // Variable global para almacenar las secciones
let currentPage = 1;
const rowsPerPage = 10;

// Mapeo de elementos del DOM
const elements = {
    tableBody: document.querySelector("#accountsTable tbody"),
    searchInput: document.getElementById("searchInput"),
};

// Elementos del modal
const modalElements = {
    modalOverlay: document.getElementById('modalOverlay'),
    btnOpenModal: document.getElementById('btnOpenModal'),
    btnCancel: document.getElementById('btnCancel'),
};

// Función para cargar las secciones
const cargarSecciones = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/secciones');
        if (!response.ok) {
            throw new Error(`Error HTTP! estado: ${response.status}`);
        }
        secciones = await response.json(); // Almacena las secciones en la variable global
        renderTable(secciones); // Renderiza la tabla con todas las secciones
    } catch (error) {
        console.error('Error al cargar las secciones:', error);
        elements.tableBody.innerHTML = '<tr><td colspan="6">Error al cargar los datos :( </td></tr>';
    }
};

// Función para buscar una sección por clave
const buscarSeccionPorClave = async (clave) => {
    try {
        const response = await fetch(`http://localhost:5000/api/secciones/${clave}`);
        if (!response.ok) {
            if (response.status === 404) {
                elements.tableBody.innerHTML = '<tr><td colspan="6">Sección no encontrada</td></tr>';
                return;
            }
            throw new Error(`Error HTTP! estado: ${response.status}`);
        }
        const seccion = await response.json();
        renderTable([seccion]); // Renderiza la tabla con la sección encontrada
    } catch (error) {
        console.error('Error al buscar la sección:', error);
        elements.tableBody.innerHTML = '<tr><td colspan="6">Error al buscar la sección :( </td></tr>';
    }
};

// Función para renderizar la tabla con un array de secciones
const renderTable = (data) => {
    elements.tableBody.innerHTML = '';

    if (data.length === 0) {
        elements.tableBody.innerHTML = '<tr><td colspan="6">No hay secciones registradas</td></tr>';
        return;
    }

    data.forEach(seccion => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${seccion.clave_subcuenta || 'N/A'}</td>
            <td>${seccion.clave_seccion || 'N/A'}</td>
            <td>${seccion.descripcion || ''}</td>
            <td>
                <button class="action-btn edit" title="Editar">
                    <img src="/public/Assets/editor.png" class="action-icon">
                </button>
                <button class="action-btn delete" title="Eliminar">
                    <img src="/public/Assets/eliminar.png" class="action-icon">
                </button>
            </td>
        `;
        elements.tableBody.appendChild(fila);
    });
};

// Evento para buscar secciones
elements.searchInput.addEventListener("input", () => {
    const term = elements.searchInput.value.trim();
    if (term === '') {
        cargarSecciones(); // Si no hay término de búsqueda, carga todas las secciones
    } else {
        buscarSeccionPorClave(term); // Busca la sección por clave
    }
});

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
    cargarSecciones();
});

/* === FUNCIONES DEL MODAL === */

// Función para abrir el modal
function openModal() {
    modalElements.modalOverlay.style.display = 'block';
}

// Evento para abrir el modal
modalElements.btnOpenModal.addEventListener('click', () => {
    openModal();
});

// Evento para cerrar el modal al presionar "Cancelar"
modalElements.btnCancel.addEventListener('click', () => {
    modalElements.modalOverlay.style.display = 'none';
});

