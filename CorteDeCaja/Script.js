// Datos de ejemplo para movimientos de caja (simulando una base de datos)
const cortesDeCaja = {
    // Corte de caja de hoy
    '2025-04-25': {
        encargado: "Kevin Diaz",
        movimientos: [
            { fp: '006', clave: 'CLAVE-547', concepto: 'Agua potable', tipoPago: 'Efectivo', cantidad: 2, importe: 128.00 },
            { fp: '007', clave: 'CLAVE-789', concepto: 'Alcantarillado', tipoPago: 'Tarjeta', cantidad: 1, importe: 180.75 },
            { fp: '001', clave: 'CLAVE-123', concepto: 'Predial', tipoPago: 'Efectivo', cantidad: 1, importe: 1250.00 },
            { fp: '005', clave: 'CLAVE-321', concepto: 'Multa', tipoPago: 'Efectivo', cantidad: 1, importe: 500.00 }
        ],
        cerrado: false,
        horaCierre: null
    },
    // Corte de hoy
    '2025-04-02': {
        encargado: "Amelia Lopez",
        movimientos: [
            { fp: '001', clave: 'CLAVE-123', concepto: 'Predial', tipoPago: 'Efectivo', cantidad: 1, importe: 1250.00 },
            { fp: '002', clave: 'CLAVE-456', concepto: 'Agua', tipoPago: 'Transferencia', cantidad: 1, importe: 350.50 },
            { fp: '003', clave: 'CLAVE-789', concepto: 'Alcantarillado', tipoPago: 'Tarjeta', cantidad: 1, importe: 180.75 }
        ],
        cerrado: true,
        horaCierre: '18:33 PM'
    },
    // Corte de ayer
    '2025-04-01': {
        encargado: "Amelia Lopez",
        movimientos: [
            { fp: '004', clave: 'CLAVE-123', concepto: 'Predial', tipoPago: 'Efectivo', cantidad: 1, importe: 1250.00 },
            { fp: '005', clave: 'CLAVE-321', concepto: 'Multa', tipoPago: 'Efectivo', cantidad: 1, importe: 500.00 }
        ],
        cerrado: true,
        horaCierre: '18:30 PM'
    },
    // Corte de hace 2 días
    '2025-03-31': {
        encargado: "Carlos Martínez",
        movimientos: [
            { fp: '006', clave: 'CLAVE-547', concepto: 'Renta de local', tipoPago: 'Efectivo', cantidad: 2, importe: 1000.00 },
            { fp: '007', clave: 'CLAVE-789', concepto: 'Alcantarillado', tipoPago: 'Tarjeta', cantidad: 1, importe: 180.75 }
        ],
        cerrado: true,
        horaCierre: '19:15 PM'
    }
    
};

// Variables de estado
let currentPage = 1;
const rowsPerPage = 10;
let corteActual = null;
let fechaSeleccionada = null;

// Elementos del DOM
const elements = {
    selectorFecha: document.getElementById('selectorFecha'),
    btnBuscarCorte: document.getElementById('btnBuscarCorte'),
    btnHoy: document.getElementById('btnHoy'),
    encargadoCaja: document.getElementById('encargadoCaja'),
    fechaActual: document.getElementById('fechaActual'),
    horaCierre: document.getElementById('horaCierre'),
    totalMovimientos: document.getElementById('totalMovimientos'),
    totalEfectivo: document.getElementById('totalEfectivo'),
    totalTransferencias: document.getElementById('totalTransferencias'),
    totalTarjetas: document.getElementById('totalTarjetas'),
    totalGeneral: document.getElementById('totalGeneral'),
    movementsTable: document.querySelector('#movementsTable tbody'),
    paginationContainer: document.querySelector('.pagination'),
    btnImprimirCorte: document.getElementById('btnImprimirCorte'),
    btnCerrarCorte: document.getElementById('btnCerrarCorte')
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Establecer fecha actual en el selector
    const today = new Date().toISOString().split('T')[0];
    elements.selectorFecha.value = today;
    fechaSeleccionada = today;
    
    // Cargar corte del día actual
    cargarCorte(today);
    
    // Event listeners
    elements.btnBuscarCorte.addEventListener('click', buscarCortePorFecha);
    elements.btnHoy.addEventListener('click', cargarCorteHoy);
    elements.btnImprimirCorte.addEventListener('click', () => { 
        window.print(); 

    });


        // Ocultar botones antes de imprimir y restaurar después
    window.onbeforeprint = () => {
        elements.btnImprimirCorte.style.display    = 'none';
        elements.btnCerrarCorte.style.display      = 'none';
        elements.btnBuscarCorte.style.display      = 'none';
        elements.btnHoy.style.display              = 'none';
    };
    
    window.onafterprint = () => {
        elements.btnImprimirCorte.style.display    = '';
        elements.btnCerrarCorte.style.display      = '';
        elements.btnBuscarCorte.style.display      = '';
        elements.btnHoy.style.display              = '';
    };
   
});

// Formatear fecha como DD/MM/AAAA
function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

// Cargar corte de hoy
function cargarCorteHoy() {
    const today = new Date().toISOString().split('T')[0];
    elements.selectorFecha.value = today;
    cargarCorte(today);
}

// Buscar corte por fecha seleccionada
function buscarCortePorFecha() {
    const fechaSeleccionada = elements.selectorFecha.value;
    if (!fechaSeleccionada) {
        alert('Por favor seleccione una fecha');
        return;
    }
    cargarCorte(fechaSeleccionada);
}

// Cargar corte específico
function cargarCorte(fecha) {
    currentPage = 1;
    fechaSeleccionada = fecha;
    corteActual = cortesDeCaja[fecha];
    
    if (!corteActual) {
        // Si no hay corte para esa fecha, mostrar vacío
        mostrarCorteVacio();
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se encontró corte de caja para la fecha seleccionada'
          });
          
        return;
    }

    // Actualizar información general
    elements.encargadoCaja.textContent = corteActual.encargado;
    elements.fechaActual.textContent = formatDate(fecha);
    elements.horaCierre.textContent = corteActual.horaCierre || '--:-- --';
    elements.totalMovimientos.textContent = corteActual.movimientos.length;
    
    // Calcular totales
    const totalEfectivo = corteActual.movimientos
        .filter(m => m.tipoPago === 'Efectivo')
        .reduce((sum, m) => sum + m.importe, 0);
    
    const totalTransferencias = corteActual.movimientos
        .filter(m => m.tipoPago === 'Transferencia')
        .reduce((sum, m) => sum + m.importe, 0);
    
    const totalTarjetas = corteActual.movimientos
        .filter(m => m.tipoPago === 'Tarjeta')
        .reduce((sum, m) => sum + m.importe, 0);
    
    const totalGeneral = totalEfectivo + totalTransferencias + totalTarjetas;
    
    // Actualizar totales
    elements.totalEfectivo.textContent = formatCurrency(totalEfectivo);
    elements.totalTransferencias.textContent = formatCurrency(totalTransferencias);
    elements.totalTarjetas.textContent = formatCurrency(totalTarjetas);
    elements.totalGeneral.textContent = formatCurrency(totalGeneral);
    
    // Habilitar/deshabilitar botones según si el corte está cerrado
    const esCorteDeHoy = fecha === new Date().toISOString().split('T')[0];
    
    if (corteActual.cerrado) {
        elements.btnImprimirCorte.disabled = false;
        elements.btnCerrarCorte.disabled = true;
    } else {
        elements.btnImprimirCorte.disabled = true;
        elements.btnCerrarCorte.disabled = !esCorteDeHoy;
    }
    
    // Renderizar movimientos
    renderMovementsTable();
}

// Mostrar corte vacío
function mostrarCorteVacio() {
    elements.encargadoCaja.textContent = '--';
    elements.fechaActual.textContent = formatDate(fechaSeleccionada);
    elements.horaCierre.textContent = '--:-- --';
    elements.totalMovimientos.textContent = '0';
    elements.totalEfectivo.textContent = '$0.00';
    elements.totalTransferencias.textContent = '$0.00';
    elements.totalTarjetas.textContent = '$0.00';
    elements.totalGeneral.textContent = '$0.00';
    elements.movementsTable.innerHTML = '';
    elements.paginationContainer.innerHTML = '';
    elements.btnImprimirCorte.disabled = true;
    elements.btnCerrarCorte.disabled = true;
}

// Formatear moneda
function formatCurrency(amount) {
    return '$' + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Renderizar tabla de movimientos
function renderMovementsTable() {
    if (!corteActual) {
        elements.movementsTable.innerHTML = '';
        elements.paginationContainer.innerHTML = '';
        return;
    }
    
    elements.movementsTable.innerHTML = '';
    
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = corteActual.movimientos.slice(start, end);
    
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
    if (!corteActual) {
        elements.paginationContainer.innerHTML = '';
        return;
    }
    
    const totalPages = Math.ceil(corteActual.movimientos.length / rowsPerPage);
    
    if (totalPages <= 1) {
        elements.paginationContainer.innerHTML = '';
        return;
    }
    
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

// Cerrar caja
elements.btnCerrarCorte.addEventListener('click', () => {
    Swal.fire({
      title: '¿Estás seguro que deseas cerrar la caja?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Cerrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const now = new Date();
        const horaCierre = now.toLocaleTimeString('es-MX', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
  
        // Actualizar en la "base de datos"
        cortesDeCaja[fechaSeleccionada].cerrado = true;
        cortesDeCaja[fechaSeleccionada].horaCierre = horaCierre;
  
        // Actualizar UI
        elements.horaCierre.textContent = horaCierre;
        elements.btnCerrarCorte.disabled = true;
        elements.btnImprimirCorte.disabled = false;
  
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Caja cerrada correctamente'
        });
      }
    });
  });
  

