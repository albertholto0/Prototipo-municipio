// Utilidad: Capitalizar la primera letra de cada palabra
function capitalizarTodasPalabras(str) {
    return str.split(' ').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Utilidad: Convertir números a letras (soporta hasta millones)
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

function limpiarSelectsAnidadosYResetear() {
    // Elimina todos los selects de nivel 2 a 5
    for (let i = 2; i <= 5; i++) {
        const sel = document.getElementById('select-nivel-' + i);
        if (sel) sel.remove();
    }
    // Deja el select de nivel 1 con valor vacío si existe
    const selectNivel1 = document.getElementById('select-nivel-1');
    if (selectNivel1) selectNivel1.value = '';
}

const otroMotivo = document.getElementById('otroMotivo');
if (otroMotivo) {
    otroMotivo.addEventListener('focus', limpiarSelectsAnidadosYResetear);
}

// Cargar selects anidados dinámicamente
async function cargarSelect(url, label, nivel, onChange) {
    try {
        const res = await fetch(url);
        const datos = await res.json();

        // Elimina selects de niveles inferiores
        for (let i = nivel; i <= 5; i++) {
            const sel = document.getElementById('select-nivel-' + i);
            if (sel) sel.remove();
        }

        if (!datos.length) return;

        const div = document.getElementById('selects-anidados');
        const select = document.createElement('select');
        select.id = 'select-nivel-' + nivel;
        select.className = 'select-anidado';
        select.innerHTML = `<option value="">Seleccione ${label}</option>`;
        datos.forEach(d => {
            const value = d.clave_cuenta_contable || d.clave_subcuenta || d.clave_seccion || d.clave_concepto || d.clave_subconcepto || d.id;
            const text = d.nombre_cuentaContable || d.nombre_subcuentas || d.descripcion || d.nombre || d.descripcion || d.nombre;
            select.innerHTML += `<option value="${value}">${value} - ${text}</option>`;
        });
        div.appendChild(select);

        if (onChange) select.addEventListener('change', onChange);
    } catch (error) {
        console.error(`Error al cargar ${label}:`, error);
    }
}

// Inicialización principal
document.addEventListener('DOMContentLoaded', async () => {
    // Configurar fecha y ejercicio fiscal
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const fechaInput = document.getElementById('fecha');
    const ejercicioFiscalInput = document.getElementById('ejercicioFiscal');
    if (fechaInput) fechaInput.value = `${yyyy}-${mm}-${dd}`;
    if (ejercicioFiscalInput) ejercicioFiscalInput.value = `${yyyy}`;

    // Lógica para apertura de caja
    const modalApertura = document.getElementById('modalAperturaCaja');
    const btnConfirmar = document.getElementById('btnConfirmarApertura');
    const receiptForm = document.getElementById('receiptForm');
    if (modalApertura && btnConfirmar && receiptForm && !localStorage.getItem('cajaAbierta')) {
        modalApertura.style.display = 'flex';
        receiptForm.style.opacity = '0.5';
        btnConfirmar.addEventListener('click', () => {
            const monto = parseFloat(document.getElementById('montoInicialCaja').value);
            if (monto >= 0) {
                localStorage.setItem('cajaAbierta', true);
                localStorage.setItem('montoInicial', monto);
                modalApertura.style.display = 'none';
                receiptForm.style.opacity = '1';
            } else {
                alert('Ingrese una cantidad correcta por favor');
            }
        });
    }

    // Desactivar selects mutuamente excluyentes
    const cuentaContable = document.getElementById('cuentaContable');
    const otroMotivo = document.getElementById('otroMotivo');
    if (cuentaContable && otroMotivo) {
        cuentaContable.addEventListener('focus', () => { otroMotivo.value = 'NO DISPONIBLE'; });
        otroMotivo.addEventListener('focus', () => { cuentaContable.value = 'NO DISPONIBLE'; });
        otroMotivo.addEventListener('change', desactivarInput);
    }

    // Descuentos adicionales solo disponibles en enero y febrero
    const selectDescuento = document.getElementById("descuentoAdicional");
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth() + 1; // Enero = 1, Febrero = 2, etc.

    // Verificar si el mes actual es enero (1) o febrero (2)
    if (mesActual === 1 || mesActual === 2) {
        selectDescuento.disabled = false; // Activar el select
    } else {
        selectDescuento.disabled = true; // Desactivar el select
        selectDescuento.removeAttribute("required"); // Opcional: Quitar "required" si no está en Ene-Feb
    }

    // Cargar contribuyentes y descuentos
    try {
        const [contribuyentes, cuentasContables, estimulosFiscales] = await Promise.all([
            fetch('http://localhost:5000/api/contribuyentes').then(r => r.json()),
            fetch('http://localhost:5000/api/cuentasContables').then(r => r.json()),
            fetch('http://localhost:5000/api/estimulosFiscales').then(r => r.json())
        ]);

        // Contribuyentes
        const contribuyenteSelect = document.getElementById('contribuyente');
        const domicilioInput = document.getElementById('domicilio');
        const otroMotivoSelect = document.getElementById('otroMotivo'); // <-- Agrega esto aquí
        const claveInput = document.getElementById('clave');
        const contribuyenteMap = new Map();
        if (contribuyenteSelect && domicilioInput) {
            contribuyentes.forEach(contribuyente => {
                const option = document.createElement('option');
                option.value = contribuyente.id_contribuyente;
                option.textContent = `${contribuyente.nombre} ${contribuyente.apellido_paterno} ${contribuyente.apellido_materno}`;
                contribuyenteMap.set(contribuyente.id_contribuyente, contribuyente.direccion);
                contribuyenteSelect.appendChild(option);
            });

            let cuentaConexionActual = '';

            contribuyenteSelect.addEventListener('change', async () => {
                const selectedId = contribuyenteSelect.value;
                domicilioInput.value = contribuyenteMap.get(Number(selectedId)) || ''; // Convierte el ID a número

                // MOSTRAR LA CUENTA EN EL INPUT "clave"
                // Solo busca si hay un ID válido
                if (selectedId && selectedId !== "undefined") {
                    try {
                        const res = await fetch(`http://localhost:5000/api/cobrar/conexiones/${selectedId}`);
                        const data = await res.json();
                        cuentaConexionActual = data.length > 0 ? data[0].cuenta : '';
                    } catch (e) {
                        cuentaConexionActual = '';
                    }
                } else {
                    cuentaConexionActual = '';
                }
                // Actualiza el input según el motivo seleccionado
                if (otroMotivoSelect.value === 'cuentaConexion') {
                    claveInput.value = cuentaConexionActual;
                } else {
                    claveInput.value = '';
                }
            });

            // Al cambiar el motivo, muestra o limpia la cuenta
            otroMotivoSelect.addEventListener('change', () => {
                if (otroMotivoSelect.value === 'cuentaConexion') {
                    claveInput.value = cuentaConexionActual;
                } else {
                    claveInput.value = '';
                }
            });
        }

        // Descuentos
        const estimuloSelect = document.getElementById('descuento');
        const estimuloAdicionalSelect = document.getElementById('descuentoAdicional');
        if (estimuloSelect && estimuloAdicionalSelect) {
            const estimulosNormales = estimulosFiscales.filter(e => e.tipo_descuento === "normal");
            const estimulosAdicionales = estimulosFiscales.filter(e => e.tipo_descuento === "adicional");
            estimulosNormales.forEach(estimulo => {
                const option = document.createElement('option');
                option.value = `${estimulo.porcentaje_descuento}% - ${estimulo.resumen_caracteristicas}`;
                option.textContent = option.value;
                estimuloSelect.appendChild(option);
            });
            estimulosAdicionales.forEach(estimulo => {
                const option = document.createElement('option');
                option.value = `${estimulo.porcentaje_descuento}% - ${estimulo.resumen_caracteristicas}`;
                option.textContent = option.value;
                estimuloAdicionalSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
    }

    // Total a letras
    const totalInput = document.getElementById('total');
    const cantidadLetraInput = document.getElementById('cantidadLetra');
    if (totalInput && cantidadLetraInput) {
        totalInput.addEventListener('input', function () {
            const numero = parseFloat(this.value.replace(/,/g, '')) || 0;
            cantidadLetraInput.value = capitalizarTodasPalabras(numeroALetras(numero));
        });
    }

    // Selects anidados de cuentas contables
    // Puedes ajustar los nombres de los campos según tu API
    await cargarSelect('http://localhost:5000/api/cobrar/cuentas', 'Cuenta', 1, function () {
        if (this.value) {
            cargarSelect(`http://localhost:5000/api/cobrar/subcuentas/${this.value}`, 'Subcuenta', 2, function () {
                if (this.value) {
                    cargarSelect(`http://localhost:5000/api/cobrar/secciones/${this.value}`, 'Sección', 3, function () {
                        if (this.value) {
                            cargarSelect(`http://localhost:5000/api/cobrar/conceptos/${this.value}`, 'Concepto', 4, function () {
                                if (this.value) {
                                    cargarSelect(`http://localhost:5000/api/cobrar/subconceptos/${this.value}`, 'Subconcepto', 5);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

function calcularTotal() {
    const subtotalInput = document.getElementById('subtotal');
    const descuentoSelect = document.getElementById('descuento');
    const totalInput = document.getElementById('total');
    const cantidadLetraInput = document.getElementById('cantidadLetra');

    if (!subtotalInput || !descuentoSelect || !totalInput || !cantidadLetraInput) return;

    // Obtén el subtotal como número
    const subtotal = parseFloat(subtotalInput.value.replace(/,/g, '')) || 0;

    // Obtén el porcentaje del descuento seleccionado (asumiendo formato "10% - ...")
    let porcentaje = 0;
    const selected = descuentoSelect.value;
    if (selected) {
        const match = selected.match(/^(\d+(?:\.\d+)?)%/);
        if (match) porcentaje = parseFloat(match[1]);
    }

    // Calcula el total
    const total = subtotal - (subtotal * porcentaje / 100);
    totalInput.value = total.toFixed(2);

    // Convierte el total a letras y lo muestra
    cantidadLetraInput.value = capitalizarTodasPalabras(numeroALetras(total));
}

// Escucha cambios en subtotal y descuento
document.getElementById('subtotal').addEventListener('input', calcularTotal);
document.getElementById('descuento').addEventListener('change', calcularTotal);