// Datos iniciales de ejemplo
let recibos = [];
let contribuyentes = [
    { id: 1, nombre: "Juan Pérez", domicilio: "Calle Principal #123" },
    { id: 2, nombre: "María García", domicilio: "Avenida Central #456" }
];

let cuentasContables = [
    { id: 1, codigo: "1000-01", descripcion: "Impuesto Predial" },
    { id: 2, codigo: "2000-01", descripcion: "Agua Potable" }
];

// Nombres de los meses
const nombresMeses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// Variables de estado
let isEditing = false;
let currentReciboId = null;
let currentPage = 1;
const rowsPerPage = 10;

// Mapeo de elementos del DOM
const elements = {
    tableBody: document.querySelector("#receiptsTable tbody"),
    searchInput: document.getElementById("searchInput"),
    filterEjercicio: document.getElementById("filterEjercicio"),
    filterFechaInicio: document.getElementById("filterFechaInicio"),
    filterFechaFin: document.getElementById("filterFechaFin"),
    form: document.getElementById("receiptForm"),
    paginationContainer: document.querySelector(".pagination"),
    modalOverlay: document.getElementById("modalOverlay"),
    btnCloseModal: document.getElementById("btnCloseModal"),
    btnGuardarRecibo: document.getElementById("btnGuardarRecibo"),
    btnCancelarRecibo: document.getElementById("btnCancelarRecibo"),
    btnImprimirRecibo: document.getElementById("btnImprimirRecibo")
};

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
    generarDatosEjemplo();
    setupEventListeners();
    renderTable(recibos);
    llenarSelectContribuyentes();
    llenarSelectCuentas();
    configurarCalculos();
});

function generarDatosEjemplo() {
    for (let i = 1; i <= 25; i++) {
        const subtotal = 500 + (i * 20);
        const descuento = i % 4 === 0 ? 50 : 0;
        const total = subtotal - descuento;
        
        recibos.push({
            folio: "REC-" + (1000 + i),
            fecha: new Date(2023, i % 12, (i % 28) + 1).toISOString().split('T')[0],
            idContribuyente: i % 2 + 1,
            ejercicioFiscal: "2023",
            ejercicioPeriodo: String(i % 12 + 1).padStart(2, '0'),
            idCuentaContable: i % 2 + 1,
            cuentaReferencia: "REF-" + (100 + i),
            descripcion: "Pago de " + (i % 2 === 0 ? "Agua Potable" : "Impuesto Predial"),
            baseCatastral: i % 2 === 0 ? null : 150000 + (i * 1000),
            subtotal: subtotal,
            motivoDescuento: i % 4 === 0 ? "Pago anticipado" : "",
            descuento: descuento,
            total: total,
            formaPago: i % 3 === 0 ? "EFECTIVO" : i % 3 === 1 ? "TARJETA" : "TRANSFERENCIA",
            totalLetra: numeroALetras(total)
        });
    }
}

function setupEventListeners() {
    elements.searchInput.addEventListener("input", filtrarRecibos);
    elements.filterEjercicio.addEventListener("change", filtrarRecibos);
    elements.filterFechaInicio.addEventListener("change", filtrarRecibos);
    elements.filterFechaFin.addEventListener("change", filtrarRecibos);
    
    elements.btnCloseModal.addEventListener("click", cerrarModal);
    elements.btnCancelarRecibo.addEventListener("click", cerrarModal);
    elements.form.addEventListener("submit", guardarRecibo);
    elements.btnImprimirRecibo.addEventListener("click", imprimirRecibo);
}

function llenarSelectContribuyentes() {
    const select = document.getElementById("contribuyente");
    select.innerHTML = '<option value="">Seleccionar contribuyente</option>';
    
    contribuyentes.forEach(contribuyente => {
        const option = document.createElement("option");
        option.value = contribuyente.id;
        option.textContent = contribuyente.nombre;
        select.appendChild(option);
    });
    
    select.addEventListener("change", function() {
        const id = parseInt(this.value);
        const contribuyente = contribuyentes.find(c => c.id === id);
        document.getElementById("domicilio").value = contribuyente ? contribuyente.domicilio : "";
    });
}

function llenarSelectCuentas() {
    const select = document.getElementById("cuentaContable");
    select.innerHTML = '<option value="">Seleccionar cuenta</option>';
    
    cuentasContables.forEach(cuenta => {
        const option = document.createElement("option");
        option.value = cuenta.id;
        option.textContent = `${cuenta.codigo} - ${cuenta.descripcion}`;
        select.appendChild(option);
    });
}

function llenarSelectMeses() {
    const periodoSelect = document.getElementById("ejercicioPeriodo");
    periodoSelect.innerHTML = '<option value="">Seleccionar mes</option>';
    
    for (let i = 0; i < 12; i++) {
        const option = document.createElement("option");
        option.value = String(i + 1).padStart(2, '0');
        option.textContent = nombresMeses[i];
        periodoSelect.appendChild(option);
    }
}

function configurarCalculos() {
    const subtotalInput = document.getElementById("subtotal");
    const descuentoInput = document.getElementById("descuento");
    const totalInput = document.getElementById("total");
    const totalLetraInput = document.getElementById("totalLetra");
    
    function calcularTotal() {
        const subtotal = parseFloat(subtotalInput.value) || 0;
        const descuento = parseFloat(descuentoInput.value) || 0;
        const total = Math.max(0, subtotal - descuento);
        
        totalInput.value = total.toFixed(2);
        totalLetraInput.value = numeroALetras(total);
    }
    
    subtotalInput.addEventListener("input", calcularTotal);
    descuentoInput.addEventListener("input", calcularTotal);
    calcularTotal(); // Calcular inicialmente
}

function abrirModalNuevoRecibo() {
    elements.form.reset();
    document.getElementById("folio").value = "REC-" + (1000 + recibos.length + 1);
    document.getElementById("fecha").value = new Date().toISOString().split('T')[0];
    document.getElementById("formTitle").textContent = "Nuevo Recibo";
    elements.btnGuardarRecibo.textContent = "Guardar Recibo";
    elements.btnImprimirRecibo.textContent = "Cobrar";
    isEditing = false;
    currentReciboId = null;
    elements.modalOverlay.style.display = "flex";
    
    // Llenar select de meses
    llenarSelectMeses();
    
    // Calcular total inicial
    document.getElementById("subtotal").value = "0.00";
    document.getElementById("descuento").value = "0.00";
    document.getElementById("total").value = "0.00";
    document.getElementById("totalLetra").value = numeroALetras(0);
}

function guardarRecibo(e) {
    e.preventDefault();
    
    const formData = new FormData(elements.form);
    const reciboData = {
        folio: formData.get("folio"),
        fecha: formData.get("fecha"),
        idContribuyente: parseInt(formData.get("contribuyente")),
        ejercicioFiscal: formData.get("ejercicioFiscal"),
        ejercicioPeriodo: formData.get("ejercicioPeriodo"),
        idCuentaContable: parseInt(formData.get("cuentaContable")),
        cuentaReferencia: formData.get("cuentaReferencia"),
        descripcion: formData.get("descripcion"),
        baseCatastral: formData.get("baseCatastral") ? parseFloat(formData.get("baseCatastral")) : null,
        subtotal: parseFloat(formData.get("subtotal")),
        motivoDescuento: formData.get("motivoDescuento"),
        descuento: parseFloat(formData.get("descuento")),
        total: parseFloat(formData.get("total")),
        formaPago: formData.get("formaPago"),
        totalLetra: formData.get("totalLetra")
    };
    
    if (isEditing) {
        const index = recibos.findIndex(r => r.folio === currentReciboId);
        if (index !== -1) {
            recibos[index] = reciboData;
        }
    } else {
        recibos.push(reciboData);
    }
    
    cerrarModal();
    renderTable(filtrarRecibos());
}

function filtrarRecibos() {
    const termino = elements.searchInput.value.toLowerCase();
    const ejercicio = elements.filterEjercicio.value;
    const fechaInicio = elements.filterFechaInicio.value;
    const fechaFin = elements.filterFechaFin.value;
    
    return recibos.filter(recibo => {
        const cumpleTermino = 
            recibo.folio.toLowerCase().includes(termino) ||
            getNombreContribuyente(recibo.idContribuyente).toLowerCase().includes(termino) ||
            recibo.cuentaReferencia.toLowerCase().includes(termino);
        
        const cumpleEjercicio = ejercicio === "" || recibo.ejercicioFiscal === ejercicio;
        
        let cumpleFecha = true;
        if (fechaInicio && recibo.fecha < fechaInicio) {
            cumpleFecha = false;
        }
        if (fechaFin && recibo.fecha > fechaFin) {
            cumpleFecha = false;
        }
        
        return cumpleTermino && cumpleEjercicio && cumpleFecha;
    });
}

function getNombreContribuyente(id) {
    const contribuyente = contribuyentes.find(c => c.id === id);
    return contribuyente ? contribuyente.nombre : "Desconocido";
}

function getDescripcionCuenta(id) {
    const cuenta = cuentasContables.find(c => c.id === id);
    return cuenta ? cuenta.descripcion : "Desconocida";
}

function getNombreMes(numeroMes) {
    const index = parseInt(numeroMes) - 1;
    return nombresMeses[index] || "Desconocido";
}

function renderTable(data) {
    elements.tableBody.innerHTML = "";
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = data.slice(start, end);
    
    paginatedData.forEach(recibo => {
        const row = `
            <tr>
                <td>${recibo.folio}</td>
                <td>${recibo.fecha}</td>
                <td>${getNombreContribuyente(recibo.idContribuyente)}</td>
                <td>${recibo.ejercicioFiscal}</td>
                <td>${getNombreMes(recibo.ejercicioPeriodo)}</td>
                <td>${getDescripcionCuenta(recibo.idCuentaContable)}</td>
                <td>$${recibo.total.toFixed(2)}</td>
                <td>${recibo.formaPago}</td>
                <td>
                    <button class="action-btn edit" onclick="editarRecibo('${recibo.folio}')" title="Editar">
                        <img src="/Assets/editor.png" class="action-icon">
                    </button>
                    <button class="action-btn print" onclick="imprimirRecibo('${recibo.folio}')" title="Imprimir">
                        <img src="/Assets/visualizar.png" class="action-icon">
                    </button>
                </td>
            </tr>
        `;
        elements.tableBody.insertAdjacentHTML("beforeend", row);
    });
    
    renderPagination(data.length);
}

function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / rowsPerPage);
    let paginationHTML = '';
    
    if (totalPages > 1) {
        paginationHTML += `
            <button class="pagination-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
                « Anterior
            </button>
        `;
        
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
                    ${i}
                </button>
            `;
        }
        
        paginationHTML += `
            <button class="pagination-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
                Siguiente »
            </button>
        `;
    }
    
    elements.paginationContainer.innerHTML = paginationHTML;
}

function changePage(page) {
    if (page < 1 || page > Math.ceil(filtrarRecibos().length / rowsPerPage)) return;
    currentPage = page;
    renderTable(filtrarRecibos());
}

function editarRecibo(folio) {
    const recibo = recibos.find(r => r.folio === folio);
    if (!recibo) return;
    
    document.getElementById("folio").value = recibo.folio;
    document.getElementById("fecha").value = recibo.fecha;
    document.getElementById("ejercicioFiscal").value = recibo.ejercicioFiscal;
    
    // Llenar select de meses y seleccionar el correcto
    llenarSelectMeses();
    document.getElementById("ejercicioPeriodo").value = recibo.ejercicioPeriodo;
    
    document.getElementById("contribuyente").value = recibo.idContribuyente;
    document.getElementById("domicilio").value = contribuyentes.find(c => c.id === recibo.idContribuyente)?.domicilio || "";
    document.getElementById("cuentaContable").value = recibo.idCuentaContable;
    document.getElementById("cuentaReferencia").value = recibo.cuentaReferencia;
    document.getElementById("descripcion").value = recibo.descripcion;
    document.getElementById("baseCatastral").value = recibo.baseCatastral || "";
    document.getElementById("subtotal").value = recibo.subtotal;
    document.getElementById("motivoDescuento").value = recibo.motivoDescuento;
    document.getElementById("descuento").value = recibo.descuento;
    document.getElementById("total").value = recibo.total;
    document.getElementById("formaPago").value = recibo.formaPago;
    document.getElementById("totalLetra").value = recibo.totalLetra || numeroALetras(recibo.total);
    
    document.getElementById("formTitle").textContent = "Editar Recibo";
    elements.btnGuardarRecibo.textContent = "Actualizar Recibo";
    elements.btnImprimirRecibo.textContent = "Cobrar";
    isEditing = true;
    currentReciboId = recibo.folio;
    elements.modalOverlay.style.display = "flex";
}

function imprimirRecibo(folio) {
    const recibo = recibos.find(r => r.folio === folio);
    if (recibo) {
        alert(`Imprimiendo recibo ${folio}\nContribuyente: ${getNombreContribuyente(recibo.idContribuyente)}\nTotal: $${recibo.total.toFixed(2)}`);
        // En una implementación real, aquí generaría el PDF del recibo
    }
}

function cerrarModal() {
    elements.modalOverlay.style.display = "none";
}

function numeroALetras(numero) {
    // Validar que sea un número
    if (isNaN(numero)) return "";
    numero = parseFloat(numero);
    if (numero === 0) return "CERO PESOS MEXICANOS";
    
    // Definiciones
    const unidades = ['CERO', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
    const decenas = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
    const especiales = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
    const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];
    
    // Función para convertir números menores a 1000
    function convertirMenorMil(n) {
        let resultado = '';
        
        if (n === 0) {
            return 'CERO';
        } else if (n === 1) {
            return 'UN';
        } else if (n < 10) {
            return unidades[n];
        } else if (n < 20) {
            return especiales[n - 10];
        } else if (n < 100) {
            const decena = Math.floor(n / 10);
            const unidad = n % 10;
            
            if (unidad === 0) {
                return decenas[decena];
            } else if (decena === 2) {
                return 'VEINTI' + unidades[unidad].toLowerCase();
            } else {
                return decenas[decena] + ' Y ' + unidades[unidad];
            }
        } else if (n === 100) {
            return 'CIEN';
        } else if (n < 1000) {
            const centena = Math.floor(n / 100);
            const resto = n % 100;
            
            if (resto === 0) {
                return centenas[centena];
            } else {
                return centenas[centena] + ' ' + convertirMenorMil(resto);
            }
        }
        
        return resultado;
    }
    
    // Separar parte entera y decimal
    const entero = Math.floor(numero);
    const decimal = Math.round((numero - entero) * 100);
    
    let resultado = '';
    
    // Convertir millones
    if (entero >= 1000000) {
        const millones = Math.floor(entero / 1000000);
        const resto = entero % 1000000;
        
        if (millones === 1) {
            resultado = 'UN MILLÓN';
        } else {
            resultado = convertirMenorMil(millones) + ' MILLONES';
        }
        
        if (resto > 0) {
            resultado += ' ' + convertirMenorMil(resto);
        }
    }
    // Convertir miles
    else if (entero >= 1000) {
        const miles = Math.floor(entero / 1000);
        const resto = entero % 1000;
        
        if (miles === 1) {
            resultado = 'MIL';
        } else {
            resultado = convertirMenorMil(miles) + ' MIL';
        }
        
        if (resto > 0) {
            resultado += ' ' + convertirMenorMil(resto);
        }
    }
    // Convertir cientos
    else {
        resultado = convertirMenorMil(entero);
    }
    
    // Agregar parte decimal si existe
    if (decimal > 0) {
        if (decimal < 10) {
            resultado += ' CON 0' + decimal + '/100';
        } else {
            resultado += ' CON ' + decimal + '/100';
        }
    } else {
        resultado += ' CON 00/100';
    }
    
    return resultado + ' PESOS MEXICANOS';
}

// Funciones globales para llamadas desde HTML
window.changePage = changePage;
window.editarRecibo = editarRecibo;
window.imprimirRecibo = imprimirRecibo;