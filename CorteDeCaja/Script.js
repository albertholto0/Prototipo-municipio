// Datos de ejemplo para movimientos de caja (simulando una base de datos)
const cortesDeCaja = {
    '2025-04-02': {
        encargado: "Amelia Lopez",
        movimientos: [
            { fp: '001', clave: 'CLAVE-123', concepto: 'Predial', tipoPago: 'Efectivo', cantidad: 1, importe: 1250.00 },
            { fp: '002', clave: 'CLAVE-456', concepto: 'Agua', tipoPago: 'Transferencia', cantidad: 1, importe: 350.50 },
            { fp: '003', clave: 'CLAVE-789', concepto: 'Alcantarillado', tipoPago: 'Tarjeta', cantidad: 1, importe: 180.75 }
        ],
        cerrado: false,
        horaCierre: null
    },
    '2025-04-01': {
        encargado: "Amelia Lopez",
        movimientos: [
            { fp: '004', clave: 'CLAVE-123', concepto: 'Predial', tipoPago: 'Efectivo', cantidad: 1, importe: 1250.00 },
            { fp: '005', clave: 'CLAVE-321', concepto: 'Multa', tipoPago: 'Efectivo', cantidad: 1, importe: 500.00 }
        ],
        cerrado: true,
        horaCierre: '18:30 PM'
    },
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
    
    // Cargar (o generar) corte del día actual
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
    const sel = elements.selectorFecha.value;
    if (!sel) {
        alert('Por favor selecciona una fecha');
        return;
    }
    cargarCorte(sel);
}

// Cargar (o generar) corte específico
function cargarCorte(fecha) {
    currentPage = 1;
    fechaSeleccionada = fecha;
    corteActual = cortesDeCaja[fecha];

    // Si no existe, lo generamos automáticamente
    if (!corteActual) {
        cortesDeCaja[fecha] = {
            encargado: elements.encargadoCaja.textContent || "Desconocido",
            movimientos: [],
            cerrado: false,
            horaCierre: null
        };
        corteActual = cortesDeCaja[fecha];
    }
    
    // Actualizar info general
    elements.encargadoCaja.textContent = corteActual.encargado;
    elements.fechaActual.textContent = formatDate(fecha);
    elements.horaCierre.textContent = corteActual.horaCierre || '--:-- --';
    elements.totalMovimientos.textContent = corteActual.movimientos.length;
    
    // Calcular y actualizar totales
    const sum = tipo => corteActual.movimientos
        .filter(m => m.tipoPago === tipo)
        .reduce((s, m) => s + m.importe, 0);

    const efectivo = sum('Efectivo');
    const trans  = sum('Transferencia');
    const tarjeta= sum('Tarjeta');
    const general= efectivo + trans + tarjeta;

    elements.totalEfectivo.textContent       = formatCurrency(efectivo);
    elements.totalTransferencias.textContent = formatCurrency(trans);
    elements.totalTarjetas.textContent       = formatCurrency(tarjeta);
    elements.totalGeneral.textContent        = formatCurrency(general);
    
    // Botones según estado de cierre
    const esHoy = fecha === new Date().toISOString().split('T')[0];
    if (corteActual.cerrado) {
        elements.btnImprimirCorte.disabled = false;
        elements.btnCerrarCorte.disabled   = true;
    } else {
        elements.btnImprimirCorte.disabled = true;
        elements.btnCerrarCorte.disabled   = !esHoy;
    }

    // Renderizar movimientos y paginación
    renderMovementsTable();
}

// Mostrar corte vacío (ya no se usa para fechas nuevas)
function mostrarCorteVacio() {
    elements.encargadoCaja.textContent       = '--';
    elements.fechaActual.textContent         = formatDate(fechaSeleccionada);
    elements.horaCierre.textContent          = '--:-- --';
    elements.totalMovimientos.textContent    = '0';
    elements.totalEfectivo.textContent       = '$0.00';
    elements.totalTransferencias.textContent = '$0.00';
    elements.totalTarjetas.textContent       = '$0.00';
    elements.totalGeneral.textContent        = '$0.00';
    elements.movementsTable.innerHTML        = '';
    elements.paginationContainer.innerHTML   = '';
    elements.btnImprimirCorte.disabled       = true;
    elements.btnCerrarCorte.disabled         = true;
}

// Formatear moneda
function formatCurrency(amount) {
    return '$' + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Renderizar tabla de movimientos
function renderMovementsTable() {
    elements.movementsTable.innerHTML      = '';
    if (!corteActual || corteActual.movimientos.length === 0) {
        elements.paginationContainer.innerHTML = '';
        return;
    }

    const start = (currentPage - 1) * rowsPerPage;
    const end   = start + rowsPerPage;
    corteActual.movimientos.slice(start, end)
        .forEach(mov => {
            elements.movementsTable.insertAdjacentHTML('beforeend', `
                <tr>
                    <td>${mov.fp}</td>
                    <td>${mov.clave}</td>
                    <td>${mov.concepto}</td>
                    <td>${mov.tipoPago}</td>
                    <td>${mov.cantidad}</td>
                    <td>${formatCurrency(mov.importe)}</td>
                </tr>
            `);
        });

    renderPagination();
}

// Renderizar paginación
function renderPagination() {
    const totalPages = Math.ceil(corteActual.movimientos.length / rowsPerPage);
    if (totalPages <= 1) {
        elements.paginationContainer.innerHTML = '';
        return;
    }

    let html = `
        <button onclick="changePage(${currentPage - 1})" ${currentPage===1?'disabled':''}>« Anterior</button>
    `;
    const start = Math.max(1, currentPage - 2);
    const end   = Math.min(totalPages, currentPage + 2);

    if (start > 1) {
        html += `<button onclick="changePage(1)">1</button>${start>2?'...':''}`;
    }
    for (let i = start; i <= end; i++) {
        html += `<button class="${i===currentPage?'active':''}" onclick="changePage(${i})">${i}</button>`;
    }
    if (end < totalPages) {
        html += `${end<totalPages-1?'...':''}<button onclick="changePage(${totalPages})">${totalPages}</button>`;
    }
    html += `<button onclick="changePage(${currentPage + 1})" ${currentPage===totalPages?'disabled':''}>Siguiente »</button>`;

    elements.paginationContainer.innerHTML = html;
}

// Cambiar página
window.changePage = function(page) {
    currentPage = page;
    renderMovementsTable();
};

// Imprimir corte (ya registrado en DOMContentLoaded)

// Cerrar caja
elements.btnCerrarCorte.addEventListener('click', () => {
    if (confirm('¿Seguro que deseas cerrar la caja?')) {
        const now = new Date();
        const hora = now.toLocaleTimeString('es-MX', { hour:'2-digit', minute:'2-digit' });
        cortesDeCaja[fechaSeleccionada].cerrado     = true;
        cortesDeCaja[fechaSeleccionada].horaCierre = hora;
        elements.horaCierre.textContent            = hora;
        elements.btnCerrarCorte.disabled           = true;
        elements.btnImprimirCorte.disabled         = false;
        alert('Caja cerrada correctamente');
    }
});
