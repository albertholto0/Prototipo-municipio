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

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el formulario
    inicializarFormulario();
    
    // Configurar eventos del formulario
    configurarEventosFormulario();
});

function inicializarFormulario() {
    // Establecer fecha actual
    const fechaInput = document.getElementById('fecha');
    const hoy = new Date();
    fechaInput.valueAsDate = hoy;
    
    // Generar folio automático (puedes personalizar esto)
    const folioInput = document.getElementById('folio');
    folioInput.value = 'REC-' + hoy.getTime().toString().slice(-6);
    
    // Llenar select de meses
    const selectMeses = document.getElementById('ejercicioPeriodo');
    nombresMeses.forEach((mes, index) => {
        const option = document.createElement('option');
        option.value = index + 1;
        option.textContent = mes;
        selectMeses.appendChild(option);
    });
    
    // Llenar select de contribuyentes
    const selectContribuyentes = document.getElementById('contribuyente');
    contribuyentes.forEach(contribuyente => {
        const option = document.createElement('option');
        option.value = contribuyente.id;
        option.textContent = contribuyente.nombre;
        selectContribuyentes.appendChild(option);
    });
    
    // Llenar select de cuentas contables
    const selectCuentas = document.getElementById('cuentaContable');
    cuentasContables.forEach(cuenta => {
        const option = document.createElement('option');
        option.value = cuenta.id;
        option.textContent = `${cuenta.codigo} - ${cuenta.descripcion}`;
        selectCuentas.appendChild(option);
    });
    
    // Configurar evento para actualizar domicilio cuando se selecciona contribuyente
    selectContribuyentes.addEventListener('change', function() {
        const idContribuyente = parseInt(this.value);
        const contribuyente = contribuyentes.find(c => c.id === idContribuyente);
        if (contribuyente) {
            document.getElementById('domicilio').value = contribuyente.domicilio;
        }
    });
    
    // Configurar eventos para cálculos
    document.getElementById('subtotal').addEventListener('input', calcularTotal);
    document.getElementById('descuento').addEventListener('input', calcularTotal);
}

function configurarEventosFormulario() {
    const form = document.getElementById('receiptForm');
    const btnCancelar = document.getElementById('btnCancelarRecibo');
    const btnImprimir = document.getElementById('btnImprimirRecibo');
    
    // Evento para enviar el formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        guardarRecibo();
    });
    
    // Evento para cancelar
    btnCancelar.addEventListener('click', function() {
        if (confirm('¿Estás seguro de que deseas cancelar? Se perderán los datos no guardados.')) {
            form.reset();
            inicializarFormulario();
        }
    });
    
    // Evento para imprimir
    btnImprimir.addEventListener('click', function() {
        if (confirm('¿Deseas guardar e imprimir el recibo?')) {
            guardarRecibo();
            // Aquí iría la lógica para imprimir
            alert('Recibo guardado e impreso (simulado)');
        }
    });
}

function calcularTotal() {
    const subtotal = parseFloat(document.getElementById('subtotal').value) || 0;
    const descuento = parseFloat(document.getElementById('descuento').value) || 0;
    const total = subtotal - descuento;
    
    document.getElementById('total').value = total.toFixed(2);
    document.getElementById('totalLetra').value = numeroALetras(total) + ' pesos';
}

function guardarRecibo() {
    // Validar formulario
    const form = document.getElementById('receiptForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Crear objeto recibo
    const nuevoRecibo = {
        folio: document.getElementById('folio').value,
        fecha: document.getElementById('fecha').value,
        ejercicioFiscal: document.getElementById('ejercicioFiscal').value,
        ejercicioPeriodo: document.getElementById('ejercicioPeriodo').value,
        contribuyenteId: parseInt(document.getElementById('contribuyente').value),
        contribuyenteNombre: document.getElementById('contribuyente').options[document.getElementById('contribuyente').selectedIndex].text,
        domicilio: document.getElementById('domicilio').value,
        cuentaContableId: parseInt(document.getElementById('cuentaContable').value),
        cuentaContableDesc: document.getElementById('cuentaContable').options[document.getElementById('cuentaContable').selectedIndex].text,
        cuentaReferencia: document.getElementById('cuentaReferencia').value,
        descripcion: document.getElementById('descripcion').value,
        baseCatastral: parseFloat(document.getElementById('baseCatastral').value) || 0,
        subtotal: parseFloat(document.getElementById('subtotal').value),
        motivoDescuento: document.getElementById('motivoDescuento').value,
        descuento: parseFloat(document.getElementById('descuento').value) || 0,
        total: parseFloat(document.getElementById('total').value),
        formaPago: document.getElementById('formaPago').value,
        totalLetra: document.getElementById('totalLetra').value
    };
    
    // Agregar a la lista de recibos (en una aplicación real, aquí harías una petición al servidor)
    recibos.push(nuevoRecibo);
    
    // Mostrar mensaje de éxito
    alert('Recibo guardado exitosamente');
    
    // Reiniciar formulario para un nuevo recibo
    form.reset();
    inicializarFormulario();
}

// Función auxiliar para convertir números a letras (simplificada)
function numeroALetras(numero) {
    // Esta es una implementación simplificada
    // En una aplicación real, usarías una librería más completa
    const unidades = ['', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
    const decenas = ['', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
    
    const entero = Math.floor(numero);
    const decimal = Math.round((numero - entero) * 100);
    
    if (entero === 0) return 'cero';
    if (entero < 10) return unidades[entero];
    if (entero < 20) {
        const especiales = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
        return especiales[entero - 10];
    }
    if (entero < 100) {
        const d = Math.floor(entero / 10);
        const u = entero % 10;
        return decenas[d] + (u > 0 ? ' y ' + unidades[u] : '');
    }
    
    return 'Número grande'; // Simplificación para números mayores a 99
}