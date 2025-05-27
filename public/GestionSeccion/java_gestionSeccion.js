// Variables de estado globales
let currentPage = 1;
const rowsPerPage = 10;

// Mapeo de elementos del DOM
const elements = {
    tableBody: document.querySelector("#accountsTable tbody"),
};

// Elementos del modal
const modalElements = {
    modalOverlay: document.getElementById('modalOverlay'),
    btnOpenModal: document.getElementById('btnOpenModal'),
    btnCancel: document.getElementById('btnCancel') 
};

// Función para cargar las secciones
const cargarSecciones = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/secciones');

        if (!response.ok) {
            throw new Error(`Error HTTP! estado: ${response.status}`);
        }

        const secciones = await response.json();

        elements.tableBody.innerHTML = '';

        if (secciones.length === 0) {
            elements.tableBody.innerHTML = '<tr><td colspan="6">No hay secciones registradas</td></tr>';
            return;
        }

        secciones.forEach(seccion => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${seccion.clave_subcuenta || 'N/A'}</td>
                <td>${seccion.clave_seccion || 'N/A'}</td>
                <td>${seccion.nombre_seccion || ''}</td>
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

    } catch (error) {
        console.error('Error al cargar las secciones:', error);
        elements.tableBody.innerHTML = '<tr><td colspan="6">Error al cargar los datos :( </td></tr>';
    }
};

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
