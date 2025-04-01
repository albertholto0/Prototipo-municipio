// Datos de ejemplo para movimientos de caja
const movimientosCaja = [
    { fp: '001', clave: 'CLAVE-123', concepto: 'Predial', tipoPago: 'Efectivo', cantidad: 1, importe: 1250.00 },
    { fp: '002', clave: 'CLAVE-456', concepto: 'Agua', tipoPago: 'Transferencia', cantidad: 1, importe: 350.50 },
    { fp: '003', clave: 'CLAVE-789', concepto: 'Alcantarillado', tipoPago: 'Tarjeta', cantidad: 1, importe: 180.75 },
    { fp: '004', clave: 'CLAVE-123', concepto: 'Predial', tipoPago: 'Efectivo', cantidad: 1, importe: 1250.00 },
    { fp: '005', clave: 'CLAVE-321', concepto: 'Multa', tipoPago: 'Efectivo', cantidad: 1, importe: 500.00 }
];

// Variables de estado
let currentPage = 1;
const rowsPerPage = 10;
let corteAbierto = true;

// Elementos del DOM
const elements = {
    encargadoCaja: document.getElementById('encargadoCaja'),
    horaInicio: document.getElementById('horaInicio'),
    horaCierre: document.getElementById('horaCierre'),
    totalEfectivo: document.getElementById('totalEfectivo'),
    totalTransferencias: document.getElementById('totalTransferencias'),
    totalTarjetas: document.getElementById('totalTarjetas'),
    totalGeneral: document.getElementById('totalGeneral'),
    fechaCorte: document.getElementById('fechaCorte'),
    movementsTable: document.querySelector('#movementsTable tbody'),
    paginationContainer: document.querySelector('.pagination'),
    btnGenerarCorte: document.getElementById('btnGenerarCorte'),
    btnImprimirCorte: document.getElementById('btnImprimirCorte'),
    btnCerrarCorte: document.getElementById('btnCerrarCorte')
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Establecer fecha actual
    const today = new Date().toISOString().split('T')[0];
    elements.fechaCorte.value = today;
    
    // Cargar datos iniciales
    loadCorteData();
    renderMovementsTable();
});

// Cargar datos del corte
function loadCorteData() {
    // Calcular totales
    const totalEfectivo = movimientosCaja
        .filter(m => m.tipoPago === 'Efectivo')
        .reduce((sum, m) => sum + m.importe, 0);
    
    const totalTransferencias = movimientosCaja
        .filter(m => m.tipoPago === 'Transferencia')
        .reduce((sum, m) => sum + m.importe, 0);
    
    const totalTarjetas = movimientosCaja
        .filter(m => m.tipoPago === 'Tarjeta')
        .reduce((sum, m) => sum + m.importe, 0);
    
    const totalGeneral = totalEfectivo + totalTransferencias + totalTarjetas;
    
    // Actualizar UI
    elements.totalEfectivo.textContent = formatCurrency(totalEfectivo);
    elements.totalTransferencias.textContent = formatCurrency(totalTransferencias);
    elements.totalTarjetas.textContent = formatCurrency(totalTarjetas);
    elements.totalGeneral.textContent = formatCurrency(totalGeneral);
    
    // Establecer hora actual si no hay hora de inicio
    if (elements.horaInicio.textContent === '--:-- --') {
        const now = new Date();
        elements.horaInicio.textContent = now.toLocaleTimeString('es-MX', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
}

// Formatear moneda
function formatCurrency(amount) {
    return '$' + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Renderizar tabla de movimientos
function renderMovementsTable() {
    elements.movementsTable.innerHTML = '';
    
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = movimientosCaja.slice(start, end);
    
    paginatedData.forEach(movimiento => {
        const row = `
            <tr>
                <td>${movimiento.fp}</td>
                <td>${movimiento.clave}</td>
                <td>${movimiento.concepto}</td>
                <td>${movimiento.tipoPago}</td>
                <td>${movimiento.cantidad}</td>
                <td>${formatCurrency(movimiento.importe)}</td>
            </tr>
        `;
        elements.movementsTable.insertAdjacentHTML('beforeend', row);
    });
    
    renderPagination();
}

// Renderizar paginación
function renderPagination() {
    const totalPages = Math.ceil(movimientosCaja.length / rowsPerPage);
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
            <button class="pagination-btn" onclick="changePage(${totalPages})">${totalPages}</button>
        `;
    }

    paginationHTML += `
        <button class="pagination-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            Siguiente »
        </button>
    `;
    
    elements.paginationContainer.innerHTML = paginationHTML;
}

// Cambiar página
window.changePage = function(page) {
    currentPage = page;
    renderMovementsTable();
};

// Generar corte
elements.btnGenerarCorte.addEventListener('click', () => {
    alert(`Generando corte para la fecha: ${elements.fechaCorte.value}`);
    renderMovementsTable();
});

// Imprimir corte
elements.btnImprimirCorte.addEventListener('click', () => {
    window.print();
});

// Cerrar caja
elements.btnCerrarCorte.addEventListener('click', () => {
    if (confirm('¿Está seguro que desea cerrar la caja?')) {
        const now = new Date();
        elements.horaCierre.textContent = now.toLocaleTimeString('es-MX', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        corteAbierto = false;
        elements.btnCerrarCorte.disabled = true;
        alert('Caja cerrada correctamente');
    }
});

// Variables adicionales para corte parcial
let corteParcialActivo = false;
let movimientosParciales = [];

// Elementos del DOM para corte parcial
const elementosCorteParcial = {
    btnCorteParcial: document.getElementById('btnCorteParcial'),
    horaCorteParcial: document.getElementById('horaCorteParcial'),
    modalCorteParcial: document.getElementById('modalCorteParcial'),
    btnCloseCorteParcial: document.getElementById('btnCloseCorteParcial'),
    resumenCorteParcial: document.getElementById('resumenCorteParcial'),
    btnConfirmarCorteParcial: document.getElementById('btnConfirmarCorteParcial'),
    btnCancelarCorteParcial: document.getElementById('btnCancelarCorteParcial')
};

// Inicialización de corte parcial
function initCorteParcial() {
    // Establecer hora actual por defecto
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    elementosCorteParcial.horaCorteParcial.value = `${hours}:${minutes}`;
    
    // Event listeners
    elementosCorteParcial.btnCorteParcial.addEventListener('click', generarCorteParcial);
    elementosCorteParcial.btnCloseCorteParcial.addEventListener('click', cerrarModalCorteParcial);
    elementosCorteParcial.btnConfirmarCorteParcial.addEventListener('click', confirmarCorteParcial);
    elementosCorteParcial.btnCancelarCorteParcial.addEventListener('click', cerrarModalCorteParcial);
}

// Generar corte parcial
function generarCorteParcial() {
    if (movimientosCaja.length === 0) {
        alert('No hay movimientos para generar corte parcial');
        return;
    }
    
    // Obtener movimientos desde el último corte
    const ultimoCorte = corteParcialActivo ? movimientosParciales[movimientosParciales.length - 1]?.fecha || null : null;
    movimientosParciales = ultimoCorte 
        ? movimientosCaja.filter(m => new Date(m.fecha) > new Date(ultimoCorte))
        : [...movimientosCaja];
    
    if (movimientosParciales.length === 0) {
        alert('No hay nuevos movimientos desde el último corte');
        return;
    }
    
    // Calcular totales
    const totalEfectivo = calcularTotalPorTipo('Efectivo', movimientosParciales);
    const totalTransferencias = calcularTotalPorTipo('Transferencia', movimientosParciales);
    const totalTarjetas = calcularTotalPorTipo('Tarjeta', movimientosParciales);
    const totalGeneral = totalEfectivo + totalTransferencias + totalTarjetas;
    
    // Mostrar resumen
    elementosCorteParcial.resumenCorteParcial.innerHTML = `
        <p><strong>Hora corte:</strong> ${elementosCorteParcial.horaCorteParcial.value}</p>
        <p><strong>Movimientos incluidos:</strong> ${movimientosParciales.length}</p>
        <p><strong>Efectivo:</strong> ${formatCurrency(totalEfectivo)}</p>
        <p><strong>Transferencias:</strong> ${formatCurrency(totalTransferencias)}</p>
        <p><strong>Tarjetas:</strong> ${formatCurrency(totalTarjetas)}</p>
        <p class="total-parcial"><strong>TOTAL PARCIAL:</strong> ${formatCurrency(totalGeneral)}</p>
    `;
    
    // Mostrar modal
    elementosCorteParcial.modalCorteParcial.style.display = 'block';
    corteParcialActivo = true;
}

// Calcular total por tipo de pago
function calcularTotalPorTipo(tipo, movimientos) {
    return movimientos
        .filter(m => m.tipoPago === tipo)
        .reduce((sum, m) => sum + m.importe, 0);
}

// Confirmar corte parcial
function confirmarCorteParcial() {
    // Aquí iría la lógica para guardar el corte parcial en el sistema
    const horaCorte = elementosCorteParcial.horaCorteParcial.value;
    
    alert(`Corte parcial registrado a las ${horaCorte}`);
    cerrarModalCorteParcial();
    
    // Actualizar interfaz
    renderMovementsTable();
}

// Cerrar modal de corte parcial
function cerrarModalCorteParcial() {
    elementosCorteParcial.modalCorteParcial.style.display = 'none';
}

// Agregar al DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    initCorteParcial();
    // ... resto de tu inicialización
});
