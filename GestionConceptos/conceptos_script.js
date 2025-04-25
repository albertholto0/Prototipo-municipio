const modal = document.getElementById('modalConcepto');
const btnAgregarConcepto = document.getElementById('btnAgregarConcepto');
const btnCancelarModal = document.getElementById('btnCancelarModal');
const conceptForm = document.getElementById('conceptForm');
const conceptsTableBody = document.getElementById('conceptsTableBody');
const searchInput = document.getElementById('searchInput');
const modalTitle = document.getElementById('modalTitle');
const deleteModal = document.getElementById('deleteModal');
const deleteConceptForm = document.getElementById('deleteConceptForm');
const deleteConceptIdInput = document.getElementById('deleteConceptId');
const deletePasswordInput = document.getElementById('deletePassword');

// Simulación de datos iniciales
let conceptos = [
    { id: 1, descripcion: 'Agua potable', tipo_servicio: 'Agua', cuota: 150.00, periodicidad: 'Mensual', id_seccion: 1, id_cuenta_contable: 101 },
    { id: 2, descripcion: 'Recolección de basura', tipo_servicio: 'Basura', cuota: 100.00, periodicidad: 'Mensual', id_seccion: 2, id_cuenta_contable: 102 },
    { id: 3, descripcion: 'Alumbrado público', tipo_servicio: 'Electricidad', cuota: 200.00, periodicidad: 'Mensual', id_seccion: 3, id_cuenta_contable: 103 },
    { id: 4, descripcion: 'Mantenimiento de parques', tipo_servicio: 'Parques', cuota: 50.00, periodicidad: 'Trimestral', id_seccion: 4, id_cuenta_contable: 104 },
    { id: 5, descripcion: 'Pavimentación de calles', tipo_servicio: 'Infraestructura', cuota: 500.00, periodicidad: 'Anual', id_seccion: 5, id_cuenta_contable: 105 },
    { id: 6, descripcion: 'Servicio de drenaje', tipo_servicio: 'Drenaje', cuota: 120.00, periodicidad: 'Mensual', id_seccion: 6, id_cuenta_contable: 106 },
    { id: 7, descripcion: 'Reparación de banquetas', tipo_servicio: 'Infraestructura', cuota: 300.00, periodicidad: 'Semestral', id_seccion: 7, id_cuenta_contable: 107 },
    { id: 8, descripcion: 'Recolección de escombros', tipo_servicio: 'Basura', cuota: 80.00, periodicidad: 'Mensual', id_seccion: 8, id_cuenta_contable: 108 },
    { id: 9, descripcion: 'Limpieza de ríos', tipo_servicio: 'Medio Ambiente', cuota: 250.00, periodicidad: 'Anual', id_seccion: 9, id_cuenta_contable: 109 },
    { id: 10, descripcion: 'Control de plagas', tipo_servicio: 'Salud Pública', cuota: 180.00, periodicidad: 'Semestral', id_seccion: 10, id_cuenta_contable: 110 }
];

// Cargar datos en la tabla
function cargarTablaConceptos(filteredConceptos = null) {
    const dataToRender = filteredConceptos || conceptos;
    conceptsTableBody.innerHTML = '';
    
    dataToRender.forEach(concepto => {
        const row = document.createElement('tr');
        row.dataset.id = concepto.id;
        row.innerHTML = `
            <td class="hidden">${concepto.id}</td>
            <td>${concepto.descripcion}</td>
            <td>${concepto.tipo_servicio}</td>
            <td>$${concepto.cuota.toFixed(2)}</td>
            <td>${concepto.periodicidad}</td>
            <td>${concepto.id_seccion}</td>
            <td>${concepto.id_cuenta_contable}</td>
            <td>
                <button class="action-btn modify" onclick="openModifyModal(${concepto.id})">
                    <img src="/Assets/editor.png" alt="Modificar" class="action-icon">
                </button>
                <button class="action-btn delete" onclick="openDeleteModal(${concepto.id})">
                    <img src="/Assets/eliminar.png" alt="Eliminar" class="action-icon">
                </button>
            </td>
        `;
        conceptsTableBody.appendChild(row);
    });
}

// Abrir modal para agregar nuevo concepto
function openAddModal() {
    modalTitle.textContent = 'Nuevo Concepto';
    conceptForm.reset();
    modal.style.display = 'block';
}

// Abrir modal para modificar concepto
function openModifyModal(conceptoId) {
    const concepto = conceptos.find(c => c.id === conceptoId);
    if (!concepto) return;

    modalTitle.textContent = 'Modificar Concepto';
    document.getElementById('descripcion').value = concepto.descripcion;
    document.getElementById('tipo_servicio').value = concepto.tipo_servicio;
    document.getElementById('cuota').value = concepto.cuota;
    document.getElementById('periodicidad').value = concepto.periodicidad;
    document.getElementById('id_seccion').value = concepto.id_seccion;
    document.getElementById('id_cuenta_contable').value = concepto.id_cuenta_contable;
    
    // Agregar campo oculto para el ID del concepto a modificar
    const existingIdInput = document.getElementById('conceptoId');
    if (existingIdInput) {
        existingIdInput.value = concepto.id;
    } else {
        const idInput = document.createElement('input');
        idInput.type = 'hidden';
        idInput.id = 'conceptoId';
        idInput.value = concepto.id;
        conceptForm.appendChild(idInput);
    }
    
    modal.style.display = 'block';
}

// Función para abrir modal de confirmación de eliminación
function openDeleteModal(conceptoId) {
    deleteConceptIdInput.value = conceptoId;
    deleteModal.style.display = 'block';
}

function closeDeleteModal() {
    deleteModal.style.display = 'none';
}

// Cerrar modal
function closeModal() {
    modal.style.display = 'none';
}

// Manejar envío del formulario
conceptForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validar longitudes máximas
    const tipoServicio = document.getElementById('tipo_servicio').value;
    const periodicidad = document.getElementById('periodicidad').value;

    if (tipoServicio.length > 30) {
        alert('El tipo de servicio no puede exceder 30 caracteres');
        return;
    }

    if (periodicidad.length > 50) {
        alert('La periodicidad no puede exceder 50 caracteres');
        return;
    }

    // Obtener datos del formulario
    const conceptoId = document.getElementById('conceptoId') ? parseInt(document.getElementById('conceptoId').value) : Date.now();
    const conceptoData = {
        id: conceptoId,
        descripcion: document.getElementById('descripcion').value,
        tipo_servicio: tipoServicio,
        cuota: parseFloat(document.getElementById('cuota').value),
        periodicidad: periodicidad,
        id_seccion: parseInt(document.getElementById('id_seccion').value),
        id_cuenta_contable: parseInt(document.getElementById('id_cuenta_contable').value),
    };

    // Buscar si el concepto ya existe
    const conceptoIndex = conceptos.findIndex(c => c.id === conceptoId);
    
    if (conceptoIndex > -1) {
        // Actualizar concepto existente
        conceptos[conceptoIndex] = conceptoData;
    } else {
        // Agregar nuevo concepto
        conceptos.push(conceptoData);
    }

    // Actualizar tabla y cerrar modal
    cargarTablaConceptos();
    closeModal();
});

deleteConceptForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const conceptoId = parseInt(deleteConceptIdInput.value);
    const password = deletePasswordInput.value;
    
    // Verificar contraseña (usando la misma que en usuarios)
    if (password === "admin123") {
        conceptos = conceptos.filter(concepto => concepto.id !== conceptoId);
        cargarTablaConceptos();
        closeDeleteModal();
        alert('Concepto eliminado correctamente');
    } else {
        alert("Contraseña incorrecta");
    }
});

document.querySelector('.cancel-btn-delete').addEventListener('click', closeDeleteModal);

// Actualiza el event listener para cerrar modales al hacer clic fuera
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
    if (event.target === deleteModal) {
        closeDeleteModal();
    }
});

// Búsqueda en tiempo real
searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();
    const filteredConceptos = conceptos.filter(concepto =>
        concepto.descripcion.toLowerCase().includes(term) ||
        concepto.tipo_servicio.toLowerCase().includes(term)
    );
    cargarTablaConceptos(filteredConceptos);
});

// Event listeners
btnAgregarConcepto.addEventListener('click', openAddModal);
btnCancelarModal.addEventListener('click', closeModal);

// Cerrar modal al hacer clic fuera del contenido
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

// Inicializar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarTablaConceptos();
});