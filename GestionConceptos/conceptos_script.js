// Control del modal
const modal = document.getElementById('modalConcepto');
const btnAgregarConcepto = document.getElementById('btnAgregarConcepto');
const btnCancelarModal = document.getElementById('btnCancelarModal');

// Abrir modal para agregar nuevo concepto
btnAgregarConcepto.addEventListener('click', () => {
    document.getElementById('modalTitle').textContent = 'Nuevo Concepto';
    document.getElementById('conceptForm').reset();
    modal.style.display = 'block';
});

// Cerrar modal
btnCancelarModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Cerrar modal al hacer clic fuera del contenido
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

document.getElementById('conceptForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validar longitudes máximas
    const tipoServicio = document.getElementById('tipo_servicio').value;
    const periodicidad = document.getElementById('periodicidad').value;
    
    if(tipoServicio.length > 30) {
        alert('El tipo de servicio no puede exceder 30 caracteres');
        return;
    }
    
    if(periodicidad.length > 50) {
        alert('La periodicidad no puede exceder 50 caracteres');
        return;
    }
    
    // Aquí iría la lógica para guardar el concepto
    const conceptoData = {
        id_concepto: document.getElementById('id_concepto').value || null,
        descripcion: document.getElementById('descripcion').value,
        tipo_servicio: tipoServicio,
        cuota: parseFloat(document.getElementById('cuota').value),
        periodicidad: periodicidad,
        id_seccion: parseInt(document.getElementById('id_seccion').value),
        id_cuenta_contable: parseInt(document.getElementById('id_cuenta_contable').value)
    };
    
    console.log('Datos a guardar:', conceptoData);
    
    // Cerrar el modal después de guardar
    modal.style.display = 'none';
});

// Simulación de datos iniciales
const conceptos = [
    { id: 1, descripcion: 'Agua potable', tipo_servicio: 'Agua', cuota: 150.00, periodicidad: 'Mensual', id_seccion: 1, id_cuenta_contable: 101 },
    { id: 2, descripcion: 'Recolección de basura', tipo_servicio: 'Basura', cuota: 100.00, periodicidad: 'Mensual', id_seccion: 2, id_cuenta_contable: 102 }
];

// Simulación de opciones para los select
const secciones = [
    { id: 1, nombre: 'Servicios Públicos' },
    { id: 2, nombre: 'Limpieza' }
];

const cuentasContables = [
    { id: 101, nombre: 'Cuenta Agua' },
    { id: 102, nombre: 'Cuenta Basura' }
];

// Cargar datos en la tabla
function cargarTablaConceptos() {
    const tbody = document.getElementById('conceptsTableBody');
    tbody.innerHTML = ''; // Limpiar tabla
    conceptos.forEach(concepto => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${concepto.id}</td>
            <td>${concepto.descripcion}</td>
            <td>${concepto.tipo_servicio}</td>
            <td>${concepto.cuota.toFixed(2)}</td>
            <td>${concepto.periodicidad}</td>
            <td>${concepto.id_seccion}</td>
            <td>${concepto.id_cuenta_contable}</td>
            <td>
                <button class="btn-edit" data-id="${concepto.id}">Editar</button>
                <button class="btn-delete" data-id="${concepto.id}">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Cargar opciones en los select
function cargarOpcionesSelect() {
    const seccionSelect = document.getElementById('searchSeccion');
    const cuentaSelect = document.getElementById('searchCuentaContable');

    secciones.forEach(seccion => {
        const option = document.createElement('option');
        option.value = seccion.id;
        option.textContent = seccion.nombre;
        seccionSelect.appendChild(option);
    });

    cuentasContables.forEach(cuenta => {
        const option = document.createElement('option');
        option.value = cuenta.id;
        option.textContent = cuenta.nombre;
        cuentaSelect.appendChild(option);
    });
}

// Manejar edición de conceptos
document.getElementById('conceptsTableBody').addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-edit')) {
        const id = parseInt(e.target.dataset.id);
        const concepto = conceptos.find(c => c.id === id);

        if (concepto) {
            document.getElementById('modalTitle').textContent = 'Editar Concepto';
            document.getElementById('id_concepto').value = concepto.id;
            document.getElementById('descripcion').value = concepto.descripcion;
            document.getElementById('tipo_servicio').value = concepto.tipo_servicio;
            document.getElementById('cuota').value = concepto.cuota;
            document.getElementById('periodicidad').value = concepto.periodicidad;
            document.getElementById('id_seccion').value = concepto.id_seccion;
            document.getElementById('id_cuenta_contable').value = concepto.id_cuenta_contable;

            modal.style.display = 'block';
        }
    }
});

// Manejar eliminación de conceptos
document.getElementById('conceptsTableBody').addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-delete')) {
        const id = parseInt(e.target.dataset.id);
        const index = conceptos.findIndex(c => c.id === id);

        if (index !== -1) {
            conceptos.splice(index, 1);
            cargarTablaConceptos();
        }
    }
});

// Manejar búsqueda/filtrado
document.getElementById('btnBuscar').addEventListener('click', () => {
    const descripcion = document.getElementById('searchDescripcion').value.toLowerCase();
    const seccion = document.getElementById('searchSeccion').value;
    const cuenta = document.getElementById('searchCuentaContable').value;

    const resultados = conceptos.filter(concepto => {
        return (
            (descripcion === '' || concepto.descripcion.toLowerCase().includes(descripcion)) &&
            (seccion === '' || concepto.id_seccion === parseInt(seccion)) &&
            (cuenta === '' || concepto.id_cuenta_contable === parseInt(cuenta))
        );
    });

    const tbody = document.getElementById('conceptsTableBody');
    tbody.innerHTML = ''; // Limpiar tabla
    resultados.forEach(concepto => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${concepto.id}</td>
            <td>${concepto.descripcion}</td>
            <td>${concepto.tipo_servicio}</td>
            <td>${concepto.cuota.toFixed(2)}</td>
            <td>${concepto.periodicidad}</td>
            <td>${concepto.id_seccion}</td>
            <td>${concepto.id_cuenta_contable}</td>
            <td>
                <button class="btn-edit" data-id="${concepto.id}">Editar</button>
                <button class="btn-delete" data-id="${concepto.id}">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
});

// Inicializar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarTablaConceptos();
    cargarOpcionesSelect();
});