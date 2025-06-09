document.addEventListener('DOMContentLoaded', async () => {
    // Configurar la fecha y el ejercicio fiscal
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    document.getElementById('fecha').value = `${yyyy}-${mm}-${dd}`;
    document.getElementById('ejercicioFiscal').value = `${yyyy}`;

    // Lógica para la apertura de caja
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

    // Cargar contribuyentes dinámicamente y configurar evento de cambio
    try {
        const response = await fetch('http://localhost:5000/api/contribuyentes');
        const responseCuentasContables = await fetch('http://localhost:5000/api/cuentasContables');
        const contribuyentes = await response.json();
        const cuentasContables = await responseCuentasContables.json();
        const contribuyenteSelect = document.getElementById('contribuyente');
        const domicilioInput = document.getElementById('domicilio');
        const cuentaContableSelect = document.getElementById('cuentaContable');
        const contribuyenteMap = new Map();

        contribuyentes.forEach(contribuyente => {
            const option = document.createElement('option');
            option.value = contribuyente.nombre_completo;
            option.textContent = contribuyente.nombre_completo;
            contribuyenteMap.set(contribuyente.nombre_completo, contribuyente.direccion);
            contribuyenteSelect.appendChild(option);
        });

        cuentasContables.forEach(cuenta => {
            const option = document.createElement('option');
            option.value = cuenta.clave_cuenta_contable + " - " + cuenta.nombre_cuentaContable;
            option.textContent = cuenta.clave_cuenta_contable + " - " + cuenta.nombre_cuentaContable;
            cuentaContableSelect.appendChild(option);
        });

        contribuyenteSelect.addEventListener('change', () => {
            const selectedContribuyente = contribuyenteSelect.value;
            domicilioInput.value = contribuyenteMap.get(selectedContribuyente) || '';
        });
    } catch (error) {
        console.error('Error al cargar los contribuyentes:', error);
    }

    // Convertir subtotal a letras y mostrar en el campo correspondiente
    document.getElementById('subtotal').addEventListener('input', function () {
        const numero = parseFloat(this.value.replace(/,/g, '')) || 0;
        document.getElementById('cantidadLetra').value = capitalizarTodasPalabras(numeroALetras(numero));
    });
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