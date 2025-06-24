// Datos de ejemplo para movimientos de caja (simulando una base de datos)
const cortesDeCaja = {
    // Corte de caja de hoy
    '2025-06-19': {
        encargado: "Eden Mendoza",
        movimientos: [
            { fp: '006', clave: 'CLAVE-547', concepto: 'Agua potable', tipoPago: 'Efectivo', cantidad: 2, importe: 128.00 },
            { fp: '007', clave: 'CLAVE-789', concepto: 'Alcantarillado', tipoPago: 'Tarjeta', cantidad: 1, importe: 180.75 },
            { fp: '001', clave: 'CLAVE-123', concepto: 'Predial', tipoPago: 'Efectivo', cantidad: 1, importe: 1250.00 },
            { fp: '005', clave: 'CLAVE-321', concepto: 'Multa', tipoPago: 'Efectivo', cantidad: 1, importe: 500.00 },
            { fp: '001', clave: 'CLAVE-123', concepto: 'Predial', tipoPago: 'Efectivo', cantidad: 1, importe: 1250.00 },
            { fp: '002', clave: 'CLAVE-456', concepto: 'Agua', tipoPago: 'Transferencia', cantidad: 1, importe: 350.50 },
            { fp: '003', clave: 'CLAVE-789', concepto: 'Alcantarillado', tipoPago: 'Tarjeta', cantidad: 1, importe: 180.75 }
        ],
        cerrado: false,
        horaCierre: null
    },

    '2025-05-18': {
        encargado: "Eden Mendoza",
        movimientos: [
            { fp: '006', clave: 'CLAVE-547', concepto: 'Agua potable', tipoPago: 'Efectivo', cantidad: 2, importe: 128.00 },
            { fp: '007', clave: 'CLAVE-789', concepto: 'Alcantarillado', tipoPago: 'Tarjeta', cantidad: 1, importe: 180.75 },
            { fp: '001', clave: 'CLAVE-123', concepto: 'Predial', tipoPago: 'Efectivo', cantidad: 1, importe: 1250.00 },
            { fp: '005', clave: 'CLAVE-321', concepto: 'Multa', tipoPago: 'Efectivo', cantidad: 1, importe: 500.00 },
            { fp: '001', clave: 'CLAVE-123', concepto: 'Predial', tipoPago: 'Efectivo', cantidad: 1, importe: 1250.00 },
            { fp: '002', clave: 'CLAVE-456', concepto: 'Agua', tipoPago: 'Transferencia', cantidad: 1, importe: 350.50 },
            { fp: '003', clave: 'CLAVE-789', concepto: 'Alcantarillado', tipoPago: 'Tarjeta', cantidad: 1, importe: 180.75 }
        ],
        cerrado: false,
        horaCierre: null
    },

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

document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const tablaMovimientos = document.querySelector('#movementsTable tbody');
    const selectorFecha = document.getElementById('selectorFecha');
    const btnBuscarCorte = document.getElementById('btnBuscarCorte');
    const btnHoy = document.getElementById('btnHoy');
    const encargadoCaja = document.getElementById('encargadoCaja');
    const fechaActual = document.getElementById('fechaActual');
    const totalMovimientos = document.getElementById('totalMovimientos');
    const horaCierre = document.getElementById('horaCierre');
    const totalEfectivo = document.getElementById('totalEfectivo');
    const totalTransferencias = document.getElementById('totalTransferencias');
    const totalTarjetas = document.getElementById('totalTarjetas');
    const totalGeneral = document.getElementById('totalGeneral');

    // Cargar datos iniciales (hoy)
    function cargarDatos(fecha = new Date().toISOString().split('T')[0]) {
        fetch(`http://localhost:5000/api/corteCaja?fecha=${fecha}`)
            .then(response => response.json())
            .then(data => {
                actualizarResumen(data.resumen);
                llenarTablaMovimientos(data.movimientos);
            })
            .catch(error => console.error('Error:', error));
    }

    // Actualizar el resumen (tabla superior)
    function actualizarResumen(resumen) {
        encargadoCaja.textContent = resumen.encargado || '--';
        fechaActual.textContent = formatearFecha(resumen.fecha);
        totalMovimientos.textContent = resumen.total_movimientos || '0';
        horaCierre.textContent = resumen.hora_cierre || '--:-- --';
        totalEfectivo.textContent = `$${(resumen.total_efectivo || 0).toFixed(2)}`;
        totalTransferencias.textContent = `$${(resumen.total_transferencias || 0).toFixed(2)}`;
        totalTarjetas.textContent = `$${(resumen.total_tarjetas || 0).toFixed(2)}`;
        totalGeneral.textContent = `$${(resumen.total_general || 0).toFixed(2)}`;
    }

    // Llenar tabla de movimientos
    function llenarTablaMovimientos(movimientos) {
        tablaMovimientos.innerHTML = '';
        movimientos.forEach(mov => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${mov.folio || 'N/A'}</td>
                <td>${mov.cuenta || 'N/A'}</td>
                <td>${mov.concepto || 'N/A'}</td>
                <td>${mov.tipo_pago || 'N/A'}</td>
                <td>$${(mov.subtotal || 0).toFixed(2)}</td>
                <td>$${(mov.descuento || 0).toFixed(2)}</td>
                <td>$${(mov.total || 0).toFixed(2)}</td>
            `;
            tablaMovimientos.appendChild(fila);
        });
    }

    // Formatear fecha (DD/MM/YYYY)
    function formatearFecha(fechaStr) {
        if (!fechaStr) return '--/--/----';
        const fecha = new Date(fechaStr);
        return fecha.toLocaleDateString('es-MX');
    }

    // Eventos
    btnBuscarCorte.addEventListener('click', () => {
        if (selectorFecha.value) {
            cargarDatos(selectorFecha.value);
        } else {
            Swal.fire('Error', 'Selecciona una fecha válida', 'warning');
        }
    });

    btnHoy.addEventListener('click', () => {
        const hoy = new Date().toISOString().split('T')[0];
        selectorFecha.value = hoy;
        cargarDatos(hoy);
    });

    // Inicializar con la fecha de hoy
    selectorFecha.value = new Date().toISOString().split('T')[0];
    cargarDatos();
});

// Modal de Corte de Caja (funciones globales)
function abrirModalCorte() {
    document.getElementById('modalCorte').style.display = 'block';
    calcularTotalCorte(); // Inicializar total
}

function cerrarModalCorte() {
    document.getElementById('modalCorte').style.display = 'none';
}

function calcularTotalCorte() {
    // Sumar monedas y billetes
    const monedas = [0.5, 1, 2, 5, 10];
    const billetes = [20, 50, 100, 200, 500, 1000];
    let total = 0;

    monedas.forEach(m => {
        total += m * (parseInt(document.getElementById(`m_${m.toString().replace('.', '_')}`).value || 0));
    });

    billetes.forEach(b => {
        total += b * (parseInt(document.getElementById(`b_${b}`).value || 0));
    });

    document.getElementById('totalCorte').textContent = total.toFixed(2);
}

// Eventos para calcular total en tiempo real
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', calcularTotalCorte);
});

// Guardar corte (simulación)
document.getElementById('formCorteCaja').addEventListener('submit', (e) => {
    e.preventDefault();
    Swal.fire('Éxito', 'Corte de caja guardado correctamente', 'success');
    cerrarModalCorte();
});
// Variables de estado
let currentPage = 1;
const rowsPerPage = 10;
let corteActual = null;
let fechaSeleccionada = null;
let montoInicial = 0;
let cierreAutomaticoProgramado = false;

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

    // Inicializar eventos de los inputs para calcular total
    document.querySelectorAll("#formCorteCaja input").forEach(input => {
        input.addEventListener("input", calcularTotal);
    });

    // Event listeners
    elements.btnBuscarCorte.addEventListener('click', buscarCortePorFecha);
    elements.btnHoy.addEventListener('click', cargarCorteHoy);
});
    // Ocultar botones antes de imprimir y restaurar después
    window.onbeforeprint = () => {
        if (elements.btnCerrarCorte) elements.btnCerrarCorte.style.display = 'none';
        elements.btnBuscarCorte.style.display = 'none';
        elements.btnHoy.style.display = 'none';
    };

    window.onafterprint = () => {
        if (elements.btnCerrarCorte) elements.btnCerrarCorte.style.display = '';
        elements.btnBuscarCorte.style.display = '';
        elements.btnHoy.style.display = '';
    };


// Función para programar el cierre automático
function programarCierreAutomatico() {
    if (cierreAutomaticoProgramado) return;
    
    const ahora = new Date();
    const horaCierre = new Date();
    horaCierre.setHours(23, 50, 0, 0); // 11:50 PM
    
    // Si ya pasó la hora de hoy, programar para mañana
    if (ahora >= horaCierre) {
        horaCierre.setDate(horaCierre.getDate() + 1);
    }
    
    const tiempoRestante = horaCierre - ahora;
    
    setTimeout(() => {
        if (!corteActual?.cerrado && fechaSeleccionada === new Date().toISOString().split('T')[0]) {
            abrirModalCorte();
            Swal.fire({
                icon: 'info',
                title: 'Cierre Automático',
                text: 'Es hora de realizar el cierre de caja automático'
            });
        }
    }, tiempoRestante);
    
    cierreAutomaticoProgramado = true;
}

// Formatear fecha como DD/MM/AAAA
function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

// Cargar corte de hoy
function cargarCorte(fecha) {
    currentPage = 1;
    fechaSeleccionada = fecha;
    corteActual = cortesDeCaja[fecha];

    if (!corteActual) {
        mostrarCorteVacio();
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se encontró corte de caja para la fecha seleccionada'
        });
        return;
    }

    // Actualizar información general
    elements.encargadoCaja.textContent = corteActual.encargado || '--';
    elements.fechaActual.textContent = formatDate(fecha);
    elements.horaCierre.textContent = corteActual.horaCierre || '--:-- --';
    elements.totalMovimientos.textContent = corteActual.movimientos?.length || 0;

    // Calcular totales
    const totalEfectivo = corteActual.movimientos
        ?.filter(m => m.tipoPago === 'Efectivo')
        ?.reduce((sum, m) => sum + (m.importe || 0), 0) || 0;

    const totalTransferencias = corteActual.movimientos
        ?.filter(m => m.tipoPago === 'Transferencia')
        ?.reduce((sum, m) => sum + (m.importe || 0), 0) || 0;

    const totalTarjetas = corteActual.movimientos
        ?.filter(m => m.tipoPago === 'Tarjeta')
        ?.reduce((sum, m) => sum + (m.importe || 0), 0) || 0;

    const totalGeneral = totalEfectivo + totalTransferencias + totalTarjetas;

    // Actualizar totales
    elements.totalEfectivo.textContent = formatCurrency(totalEfectivo);
    elements.totalTransferencias.textContent = formatCurrency(totalTransferencias);
    elements.totalTarjetas.textContent = formatCurrency(totalTarjetas);
    elements.totalGeneral.textContent = formatCurrency(totalGeneral);

    // Renderizar la tabla de movimientos
    renderizarTablaMovimientos();
    renderPagination();
}

// Buscar corte por fecha seleccionada
function buscarCortePorFecha() {
    const fechaSeleccionada = elements.selectorFecha.value;
    if (!fechaSeleccionada) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor seleccione una fecha'
        });
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
        if (elements.btnCerrarCorte) {
            elements.btnCerrarCorte.disabled = true;
            elements.btnCerrarCorte.style.display = 'none';
        }
    } else if (esCorteDeHoy) {
        if (elements.btnCerrarCorte) {
            elements.btnCerrarCorte.disabled = false;
            elements.btnCerrarCorte.style.display = '';
        }
        programarCierreAutomatico();
    } else {
        if (elements.btnCerrarCorte) {
            elements.btnCerrarCorte.disabled = true;
            elements.btnCerrarCorte.style.display = 'none';
        }
    }

    // Renderizar la tabla de movimientos
    renderizarTablaMovimientos();
    renderPagination();
}

function mostrarCorteVacio() {
    elements.encargadoCaja.textContent = '--';
    elements.fechaActual.textContent = '--/--/----';
    elements.horaCierre.textContent = '--:-- --';
    elements.totalMovimientos.textContent = '0';
    elements.totalEfectivo.textContent = formatCurrency(0);
    elements.totalTransferencias.textContent = formatCurrency(0);
    elements.totalTarjetas.textContent = formatCurrency(0);
    elements.totalGeneral.textContent = formatCurrency(0);
    elements.movementsTable.innerHTML = '';
    elements.paginationContainer.innerHTML = '';
    if (elements.btnCerrarCorte) {
        elements.btnCerrarCorte.disabled = true;
        elements.btnCerrarCorte.style.display = 'none';
    }
}

function formatCurrency(value) {
    return `$${value.toFixed(2)}`;
}

// Renderizar tabla de movimientos
function renderizarTablaMovimientos() {
    if (!corteActual) {
        elements.movementsTable.innerHTML = '';
        return;
    }

    elements.movementsTable.innerHTML = '';

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = corteActual.movimientos.slice(start, end);

    paginatedData.forEach(movimiento => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${movimiento.fp}</td>
            <td>${movimiento.clave}</td>
            <td>${movimiento.concepto}</td>
            <td>${movimiento.tipoPago}</td>
            <td>${movimiento.cantidad}</td>
            <td>${formatCurrency(movimiento.importe)}</td>
        `;
        elements.movementsTable.appendChild(row);
    });
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
window.changePage = function (page) {
    if (page < 1 || page > Math.ceil(corteActual.movimientos.length / rowsPerPage)) return;
    currentPage = page;
    renderizarTablaMovimientos();
    renderPagination();
};

// Funciones para el modal de corte
function abrirModalCorte() {
    document.getElementById("modalCorte").style.display = "block";
}

function cerrarModalCorte() {
    document.getElementById("modalCorte").style.display = "none";
}

function calcularTotal() {
    const monedas = [
        { id: 'm_050', valor: 0.5 },
        { id: 'm_1', valor: 1 },
        { id: 'm_2', valor: 2 },
        { id: 'm_5', valor: 5 },
        { id: 'm_10', valor: 10 },
    ];

    const billetes = [
        { id: 'b_20', valor: 20 },
        { id: 'b_50', valor: 50 },
        { id: 'b_100', valor: 100 },
        { id: 'b_200', valor: 200 },
        { id: 'b_500', valor: 500 },
        { id: 'b_1000', valor: 1000 },
    ];

    let total = 0;

    monedas.forEach(m => {
        const cantidad = parseInt(document.getElementById(m.id).value) || 0;
        total += cantidad * m.valor;
    });

    billetes.forEach(b => {
        const cantidad = parseInt(document.getElementById(b.id).value) || 0;
        total += cantidad * b.valor;
    });

    document.getElementById("totalCorte").textContent = total.toFixed(2);
}

// Recalcular total cada vez que cambia un campo
document.querySelectorAll("#formCorteCaja input").forEach(input => {
    input.addEventListener("input", calcularTotal);
});

// Función para guardar el corte (actualizada)
document.getElementById("formCorteCaja").addEventListener("submit", function(event) {
    event.preventDefault();
    
    // Calcular total basado en los inputs
    const total = calcularTotal();
    
    // Validación mejorada
    if (isNaN(total) || total <= 0) {
        Swal.fire({
            icon: 'error',
            title: 'Error en el corte',
            html: `
                <div style="text-align:left">
                    <p>El total debe ser mayor que cero</p>
                    <p>Por favor verifica:</p>
                    <ul>
                        <li>Que hayas ingresado al menos una moneda/billete</li>
                        <li>Que las cantidades sean números válidos</li>
                    </ul>
                </div>
            `,
            confirmButtonText: 'Entendido'
        });
        return;
    }

    // Actualizar estado del corte
    const now = new Date();
    const horaCierre = now.toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    if (cortesDeCaja[fechaSeleccionada]) {
        cortesDeCaja[fechaSeleccionada].cerrado = true;
        cortesDeCaja[fechaSeleccionada].horaCierre = horaCierre;
        
        // Generar PDF antes de mostrar la confirmación
        generarPDFDeclaracion();
        
        // Mostrar confirmación
        Swal.fire({
            icon: 'success',
            title: 'Corte guardado exitosamente',
            html: `
                <div style="text-align:center">
                    <p>El corte de caja ha sido registrado</p>
                    <p>Total declarado: <strong>$${total.toFixed(2)}</strong></p>
                    <p>Hora de cierre: <strong>${horaCierre}</strong></p>
                </div>
            `,
            confirmButtonText: 'Aceptar',
            willClose: () => {
                // Limpiar y cerrar
                this.reset();
                document.getElementById("totalCorte").textContent = "0.00";
                cerrarModalCorte();
                // Forzar recarga de los datos
                cargarCorte(fechaSeleccionada);
            }
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se encontró el corte de caja para la fecha seleccionada'
        });
    }
});
// Función para calcular el total (actualizada)
function calcularTotal() {
    const denominaciones = [
        { id: 'm_050', valor: 0.5 },
        { id: 'm_1', valor: 1 },
        { id: 'm_2', valor: 2 },
        { id: 'm_5', valor: 5 },
        { id: 'm_10', valor: 10 },
        { id: 'b_20', valor: 20 },
        { id: 'b_50', valor: 50 },
        { id: 'b_100', valor: 100 },
        { id: 'b_200', valor: 200 },
        { id: 'b_500', valor: 500 },
        { id: 'b_1000', valor: 1000 }
    ];

    let total = 0;
    denominaciones.forEach(d => {
        const input = document.getElementById(d.id);
        if (input) {
            const cantidad = parseInt(input.value) || 0;
            total += cantidad * d.valor;
        }
    });

    const totalElement = document.getElementById("totalCorte");
    if (totalElement) {
        totalElement.textContent = total.toFixed(2);
    }
    
    return total;
}

// Función para generar PDF de declaración (actualizada)
function generarPDFDeclaracion() {
    // Verificar que jsPDF esté cargado
    if (typeof jsPDF === 'undefined') {
        console.error('jsPDF no está cargado correctamente');
        return;
    }

    const doc = new jsPDF();
    
    // Configuración
    doc.setFont("helvetica");
    doc.setTextColor(40);
    
    // Encabezado
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("DECLARACIÓN DE CORTE DE CAJA", 105, 20, { align: "center" });
    doc.text("Municipio de Ixtlán", 105, 27, { align: "center" });
    
    // Información básica
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Fecha: ${elements.fechaActual.textContent}`, 20, 45);
    doc.text(`Encargado: ${elements.encargadoCaja.textContent}`, 20, 55);
    
    const now = new Date();
    doc.text(`Hora de cierre: ${now.toLocaleTimeString('es-MX', {hour: '2-digit', minute: '2-digit', hour12: true})}`, 20, 65);
    
    // Sección de monedas
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("MONEDAS", 20, 80);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    const monedas = [
        { id: 'm_050', label: '$0.50' },
        { id: 'm_1', label: '$1.00' },
        { id: 'm_2', label: '$2.00' },
        { id: 'm_5', label: '$5.00' },
        { id: 'm_10', label: '$10.00' }
    ];
    
    let y = 90;
    monedas.forEach(moneda => {
        const cantidad = document.getElementById(moneda.id)?.value || "0";
        doc.text(`${moneda.label}: ${cantidad}`, 20, y);
        y += 7;
    });
    
    // Sección de billetes
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("BILLETES", 20, y + 10);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    y += 17;
    
    const billetes = [
        { id: 'b_20', label: '$20' },
        { id: 'b_50', label: '$50' },
        { id: 'b_100', label: '$100' },
        { id: 'b_200', label: '$200' },
        { id: 'b_500', label: '$500' },
        { id: 'b_1000', label: '$1000' }
    ];
    
    billetes.forEach(billete => {
        const cantidad = document.getElementById(billete.id)?.value || "0";
        doc.text(`${billete.label}: ${cantidad}`, 20, y);
        y += 7;
    });
    
    // Total
    const total = calcularTotal();
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL DECLARADO: $${total.toFixed(2)}`, 20, y + 15);
    
    // Firma
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("_________________________", 20, y + 30);
    doc.text("Firma del encargado", 20, y + 37);
    
    // Guardar PDF automáticamente
    const nombreArchivo = `Corte_Caja_${fechaSeleccionada}_${now.getHours()}${now.getMinutes()}.pdf`;
    doc.save(nombreArchivo);
}

// Función para renderizar tabla de movimientos (actualizada)
function renderizarTablaMovimientos() {
    if (!corteActual || !corteActual.movimientos) {
        elements.movementsTable.innerHTML = '<tr><td colspan="6">No hay movimientos registrados</td></tr>';
        return;
    }

    elements.movementsTable.innerHTML = '';
    
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = corteActual.movimientos.slice(start, end);

    paginatedData.forEach(movimiento => {
        if (!movimiento || !movimiento.fp) return;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${movimiento.fp || ''}</td>
            <td>${movimiento.clave || ''}</td>
            <td>${movimiento.concepto || ''}</td>
            <td>${movimiento.tipoPago || ''}</td>
            <td>${movimiento.cantidad || ''}</td>
            <td>${movimiento.importe ? formatCurrency(movimiento.importe) : ''}</td>
        `;
        elements.movementsTable.appendChild(row);
    });
}
// Función para abrir modal de declaración (si existe)
function abrirModalDeclaracion() {
    const modal = document.getElementById("modalDeclaracion");
    if (modal) {
        modal.style.display = "block";
        document.getElementById("montoInicial").value = "";
        document.getElementById("declaracionCajero").value = "";
    }
}