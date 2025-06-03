// Inicializar el folio del recibo
document.addEventListener('DOMContentLoaded', () => {
    let folio = sessionStorage.getItem('ultimoFolio') || 1;
    folio = parseInt(folio) + 1;
    sessionStorage.setItem('ultimoFolio', folio);
    document.getElementById('folio').value = `REC-${folio.toString().padStart(4, '0')}`;
});

// Configurar la fecha y el ejercicio fiscal
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    document.getElementById('fecha').value = `${yyyy}-${mm}-${dd}`;
    document.getElementById('ejercicioFiscal').value = `${yyyy}`;
});

// Convertir subtotal a letras y mostrar en el campo correspondiente
document.getElementById('subtotal').addEventListener('input', function () {
    const numero = parseFloat(this.value.replace(/,/g, '')) || 0;
    document.getElementById('cantidadLetra').value = capitalizarTodasPalabras(numeroALetras(numero));
});

// Función para capitalizar la primera letra de cada palabra
function capitalizarTodasPalabras(str) {
    return str.split(' ').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Función para convertir números a letras (soporta hasta millones)
function numeroALetras(numero) {
    const unidades = ['', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
    const decenas = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis',
        'diecisiete', 'dieciocho', 'diecinueve', 'veinte', 'treinta', 'cuarenta',
        'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
    const centenas = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos',
        'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

    if (numero === 0) return 'cero pesos mexicanos';

    let resultado = '';
    const entero = Math.floor(numero);
    const decimal = Math.round((numero - entero) * 100);

    if (entero > 0) {
        if (entero >= 1000000) {
            const millones = Math.floor(entero / 1000000);
            resultado += (millones === 1 ? 'un millón ' : numeroALetras(millones) + ' millones ');
        }

        const miles = entero % 1000000;
        if (miles >= 1000) {
            const mil = Math.floor(miles / 1000);
            resultado += (mil === 1 ? 'mil ' : numeroALetras(mil) + ' mil ');
        }

        const resto = miles % 1000;
        if (resto > 0) {
            const c = Math.floor(resto / 100);
            if (c > 0) resultado += centenas[c] + ' ';

            const d = resto % 100;
            if (d >= 10 && d <= 20) {
                resultado += decenas[d - 10] + ' ';
            } else if (d > 20) {
                const di = Math.floor(d / 10);
                resultado += decenas[di + 8] + ' ';
                const u = d % 10;
                if (u > 0) resultado += 'y ' + unidades[u] + ' ';
            } else if (d > 0) {
                resultado += unidades[d] + ' ';
            }
        }
    }

    if (decimal > 0) {
        resultado += 'con ' + (decimal < 10 ? '0' + decimal : decimal) + '/100';
    }

    return resultado.trim() + (numero === 1 ? ' peso mexicano' : ' pesos mexicanos');
}

// Lógica para la apertura de caja
document.addEventListener('DOMContentLoaded', () => {
    const modalApertura = document.getElementById('modalAperturaCaja');
    const btnConfirmar = document.getElementById('btnConfirmarApertura');

    if (!localStorage.getItem('cajaAbierta')) {
        modalApertura.style.display = 'flex';
        document.getElementById('receiptForm').style.opacity = '0.5';
    }

    btnConfirmar.addEventListener('click', () => {
        const monto = parseFloat(document.getElementById('montoInicialCaja').value);
        if (monto >= 0) {
            localStorage.setItem('cajaAbierta', true);
            localStorage.setItem('montoInicial', monto);
            modalApertura.style.display = 'none';
            document.getElementById('receiptForm').style.opacity = '1';
        } else {
            alert('Ingrese una cantidad correcta por favor');
        }
    });
});

// Cargar contribuyentes dinámicamente y configurar evento de cambio
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:5000/api/contribuyentes');
        const contribuyentes = await response.json();

        const contribuyenteSelect = document.getElementById('contribuyente');
        const domicilioInput = document.getElementById('domicilio');

        // Crear un mapa para relacionar contribuyentes con sus domicilios
        const contribuyenteMap = new Map();

        contribuyentes.forEach(contribuyente => {
            const option = document.createElement('option');
            option.value = contribuyente.nombre_completo;
            option.textContent = contribuyente.nombre_completo;

            // Guardar la relación entre el contribuyente y su domicilio
            contribuyenteMap.set(contribuyente.nombre_completo, contribuyente.direccion);

            contribuyenteSelect.appendChild(option);
        });

        // Evento para actualizar el domicilio al seleccionar un contribuyente
        contribuyenteSelect.addEventListener('change', () => {
            const selectedContribuyente = contribuyenteSelect.value;
            domicilioInput.value = contribuyenteMap.get(selectedContribuyente) || '';
        });
    } catch (error) {
        console.error('Error al cargar los contribuyentes:', error);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const MAX_LEVEL = 5;
    const cuentasContainer = document.getElementById('cuentas-container');
    
    // Datos de ejemplo para las cuentas contables anidadas
    const cuentasContables = {
        // Nivel 1
        '100000': [
            {value: '110000', text: '110000 - Impuestos sobre los ingresos'},
            {value: '110100', text: '110100 - Rifas, Sorteos, Loterias y Concursos'},
            {value: '110200', text: '110200 - Impuestos sobre ventas'},
            {value: '110300', text: '110300 - Impuestos sobre servicios'},
            {value: '110400', text: '110400 - Impuestos sobre dividendos'}
        ],
        '110000': [
            {value: '110100', text: '110100 - Rifas, Sorteos, Loterias y Concursos'},
            {value: '110101', text: '110101 - Rifas'},
            {value: '110102', text: '110102 - Sorteos'},
            {value: '110103', text: '110103 - Loterías'},
            {value: '110104', text: '110104 - Concursos'}
        ],
        '110100': [
            {value: '110101', text: '110101 - Rifas'},
            {value: '110102', text: '110102 - Sorteos'},
            {value: '110103', text: '110103 - Loterías'},
            {value: '110104', text: '110104 - Concursos'},
            {value: '110105', text: '110105 - Promociones'}
        ],
        '110101': [
            {value: '11010101', text: '11010101 - Rifas benéficas'},
            {value: '11010102', text: '11010102 - Rifas comerciales'},
            {value: '11010103', text: '11010103 - Rifas deportivas'},
            {value: '11010104', text: '11010104 - Rifas escolares'},
            {value: '11010105', text: '11010105 - Otras rifas'}
        ],
        // Puedes agregar más niveles según necesites
    };
    
    function createCuentaContableSelect(level, parentValue) {
        if (level > MAX_LEVEL) return null;
        
        const div = document.createElement('div');
        div.className = 'form-group full-width';
        div.dataset.level = level;
        
        const label = document.createElement('label');
        label.htmlFor = `cuentaContable-${level}`;
        label.textContent = `Cuenta Contable Nivel ${level}:`;
        
        const select = document.createElement('select');
        select.id = `cuentaContable-${level}`;
        select.className = 'cuenta-contable-select';
        select.required = true;
        
        // Agregar opción por defecto
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '-- Seleccione una cuenta --';
        select.appendChild(defaultOption);
        
        // Agregar opciones basadas en el padre seleccionado
        if (cuentasContables[parentValue]) {
            cuentasContables[parentValue].forEach(cuenta => {
                const option = document.createElement('option');
                option.value = cuenta.value;
                option.textContent = cuenta.text;
                select.appendChild(option);
            });
        }
        
        div.appendChild(label);
        div.appendChild(select);
        
        return div;
    }
    
    cuentasContainer.addEventListener('change', function(e) {
        if (e.target.classList.contains('cuenta-contable-select')) {
            const currentContainer = e.target.closest('.form-group');
            const currentLevel = parseInt(currentContainer.dataset.level);
            const selectedValue = e.target.value;
            
            // Eliminar selects de niveles superiores
            let nextSibling = currentContainer.nextElementSibling;
            while (nextSibling) {
                const level = parseInt(nextSibling.dataset.level);
                if (level > currentLevel) {
                    const toRemove = nextSibling;
                    nextSibling = nextSibling.nextElementSibling;
                    toRemove.remove();
                } else {
                    break;
                }
            }
            
            // Solo crear nuevo select si hay opciones disponibles para el valor seleccionado
            // y no hemos alcanzado el máximo nivel
            if (selectedValue && cuentasContables[selectedValue] && currentLevel < MAX_LEVEL) {
                const newSelect = createCuentaContableSelect(currentLevel + 1, selectedValue);
                currentContainer.insertAdjacentElement('afterend', newSelect);
            }
        }
    });
});