// Variables globales para conexion y base catastral
let idConexionActual = null;
let idBaseActual = null;
let cuentaConexionActual = '';
let cuentaBaseCatastral = '';

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

const btnCancelar = document.getElementById('btnCancelarRecibo');
if (btnCancelar) {
    btnCancelar.addEventListener('click', function () {
        const form = document.getElementById('receiptForm');
        // Guarda los valores actuales
        const fechaInput = document.getElementById('fecha');
        const ejercicioFiscalInput = document.getElementById('ejercicioFiscal');
        const fechaValue = fechaInput ? fechaInput.value : '';
        const ejercicioFiscalValue = ejercicioFiscalInput ? ejercicioFiscalInput.value : '';

        if (form) {
            form.reset();
        }

        limpiarSelectsAnidadosYResetear();

        const cantidadLetraInput = document.getElementById('cantidadLetra');
        if (cantidadLetraInput) cantidadLetraInput.value = '';

        // Restaura los valores guardados
        if (fechaInput) fechaInput.value = fechaValue;
        if (ejercicioFiscalInput) ejercicioFiscalInput.value = ejercicioFiscalValue;
    });
}

// Limpiar idConexionActual al seleccionar cualquier cuenta contable anidada
function limpiarIdConexionSiSelectAnidado() {
    idConexionActual = null;
    idBaseActual = null;
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
            const value = d.id_cuentaContable || d.clave_cuentaContable || d.clave_subcuenta || d.clave_seccion || d.clave_concepto || d.clave_subconcepto || d.id;
            const clave = d.clave_cuentaContable || d.clave_subcuenta || d.clave_seccion || d.clave_concepto || d.clave_subconcepto || d.id;
            const text = clave;
            const label = d.nombre_cuentaContable || d.nombre || d.descripcion || '';
            select.innerHTML += `<option value="${value}" data-clave="${clave}">${text} - ${label}</option>`;
        });
        div.appendChild(select);

        // Limpiar el select "otroMotivo" al seleccionar cualquier cuenta contable anidada
        const cuenta = document.getElementById('clave');
        if (cuenta) {
            select.addEventListener('change', function () {
                if (this.value) {
                    cuenta.value = '';
                }
            });
        }

        // Limpiar idConexionActual al seleccionar cualquier cuenta contable anidada
        select.addEventListener('change', function () {
            if (this.value) {
                limpiarIdConexionSiSelectAnidado();
            }
        });

        if (onChange) select.addEventListener('change', onChange);
    } catch (error) {
        console.error(`Error al cargar ${label}:`, error);
    }
}

// Función para obtener el folio
async function obtenerFolio() {
    try {
        const res = await fetch('http://localhost:5000/api/cobrar/ultimoRecibo');
        const data = await res.json();
        const siguienteId = data?.ultimo_id ? data.ultimo_id + 1 : 1;
        return `FOL-${siguienteId}`;
    } catch (e) {
        return 'FOL-error';
    }
}

// Inicialización principal
document.addEventListener('DOMContentLoaded', async () => {
    const btnCancel = document.getElementById("btnCancel");
    btnCancel.addEventListener("click", () => {
        modalOverlay.style.display = 'none';
    });
    // Obtener el folio
    const folioInput = document.getElementById('folio');
    if (folioInput) {
        folioInput.value = await obtenerFolio();
    }

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
        const [contribuyentes, estimulosFiscales] = await Promise.all([
            fetch('http://localhost:5000/api/contribuyentes', { cache: "no-store" }).then(r => r.json()),
            fetch('http://localhost:5000/api/estimuloFiscal', { cache: "no-store" }).then(r => r.json()),
        ]);

        // Contribuyentes
        const contribuyenteSelect = document.getElementById('contribuyente');
        const domicilioInput = document.getElementById('domicilio');
        const otroMotivoSelect = document.getElementById('otroMotivo');
        const modalOverlay = document.getElementById('modalOverlay');
        const claveInput = document.getElementById('clave');
        const contribuyenteMap = new Map();

        // Abrir el modal de alquiler si se selecciona "Alquiler" en el select "otroMotivo"
        if (otroMotivoSelect && modalOverlay) {
            otroMotivoSelect.addEventListener('change', function () {
                if (this.value === 'alquiler') {
                    modalOverlay.style.display = 'flex'; // O 'block', según tu CSS
                }
            });
        }

        if (contribuyenteSelect && domicilioInput) {
            contribuyentes.forEach(contribuyente => {
                const option = document.createElement('option');
                option.value = contribuyente.id_contribuyente;
                option.textContent = `${contribuyente.nombre} ${contribuyente.apellido_paterno} ${contribuyente.apellido_materno}`;
                contribuyenteMap.set(contribuyente.id_contribuyente, contribuyente.direccion);
                contribuyenteSelect.appendChild(option);
            });

            if (otroMotivoSelect) {
                otroMotivoSelect.value = 'cuentaConexion'; // Asigna primero el motivo por defecto
            }

            if (contribuyenteSelect.options.length > 0) {
                contribuyenteSelect.selectedIndex = 0; // Selecciona el primero
                contribuyenteSelect.dispatchEvent(new Event('change')); // Dispara el evento para llenar "clave"
            }

            contribuyenteSelect.addEventListener('change', async () => {
                const selectedId = contribuyenteSelect.value;
                domicilioInput.value = contribuyenteMap.get(Number(selectedId)) || ''; // Convierte el ID a número

                let existeConexion = false;
                let existeBase = false;

                // MOSTRAR LA CUENTA EN EL INPUT "clave"
                // Solo busca si hay un ID válido
                if (selectedId && selectedId !== "undefined") {
                    try {
                        const res = await fetch(`http://localhost:5000/api/cobrar/conexiones/${selectedId}`);
                        const resBase = await fetch(`http://localhost:5000/api/cobrar/bases/${selectedId}`);
                        const data = await res.json();
                        const dataBase = await resBase.json();
                        idConexionActual = data.length > 0 ? data[0].id_conexion : null;
                        cuentaConexionActual = data.length > 0 ? data[0].cuenta : '';
                        idBaseActual = data.length > 0 ? data[0].id_base_catastral : null;
                        cuentaBaseCatastral = dataBase.length > 0 ? dataBase[0].cuenta : '';
                    } catch (e) {
                        idConexionActual = null;
                        cuentaConexionActual = '';
                        idBaseActual = null;
                        cuentaBaseCatastral = '';
                    }
                }

                // Mostrar alerta si no existe ni conexión ni base catastral
                if (!existeConexion && !existeBase) {
                    claveInput.classList.add('input-alerta');
                    claveInput.value = '';
                    claveInput.placeholder = '¡Este contribuyente no tiene cuenta!';
                    // Opcional: mostrar un mensaje flotante
                    // alert('El contribuyente no tiene conexión ni base catastral');
                } else {
                    claveInput.classList.remove('input-alerta');
                    claveInput.placeholder = '';
                }

                // Actualiza el input según el motivo seleccionado
                if (otroMotivoSelect.value === 'cuentaConexion') {
                    claveInput.value = cuentaConexionActual;
                } else if (otroMotivoSelect.value === 'cuentaBaseCatastral') {
                    claveInput.value = cuentaBaseCatastral;
                } else {
                    claveInput.value = '';
                }
            });

            // Al cambiar el motivo, muestra o limpia la cuenta
            otroMotivoSelect.addEventListener('change', () => {
                if (otroMotivoSelect.value === 'cuentaConexion') {
                    claveInput.value = cuentaConexionActual;
                } else if (otroMotivoSelect.value === 'cuentaBaseCatastral') {
                    claveInput.value = cuentaBaseCatastral;
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
                option.value = estimulo.id_estimulo_fiscal;
                option.textContent = `${estimulo.porcentaje_descuento}% - ${estimulo.resumen_caracteristicas}`;
                estimuloSelect.appendChild(option);
            });
            estimulosAdicionales.forEach(estimulo => {
                const option = document.createElement('option');
                option.value = `${estimulo.porcentaje_descuento}% - ${estimulo.resumen_caracteristicas}`;
                option.textContent = option.value;
                estimuloAdicionalSelect.appendChild(option);
            });
            if (estimuloSelect && estimuloAdicionalSelect) {
                estimuloSelect.addEventListener('change', calcularTotal);
                document.getElementById('subtotal').addEventListener('input', calcularTotal);
                calcularTotal(); // Para que se calcule el total al inicio si ya hay valores
            }
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

document.getElementById('receiptForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Obtén los valores de los selects anidados (pueden no existir)
    const selectCuenta = document.getElementById('select-nivel-1');
    let claveCuentaContable = null;
    if (selectCuenta) {
        const selectedOption = selectCuenta.options[selectCuenta.selectedIndex];
        claveCuentaContable = selectedOption ? selectedOption.getAttribute('data-clave') : null;
    }
    const subcuenta = document.getElementById('select-nivel-2')?.value || null;
    const seccion = document.getElementById('select-nivel-3')?.value || null;
    const concepto = document.getElementById('select-nivel-4')?.value || null;
    const subconcepto = document.getElementById('select-nivel-5')?.value || null;

    // Otros campos del formulario
    const folio = document.getElementById('folio').value;
    const fecha = document.getElementById('fecha').value;
    const ejercicioFiscal = document.getElementById('ejercicioFiscal').value;
    const periodo = document.getElementById('ejercicioPeriodo').value;
    const subtotal = document.getElementById('subtotal').value;
    const monto_total = document.getElementById('total').value;
    const monto_total_letras = document.getElementById('cantidadLetra').value;
    const forma_de_pago = document.getElementById('formaPago').value;
    const id_contribuyente = document.getElementById('contribuyente').value;
    const id_estimulo_fiscal = document.getElementById('descuento').value;
    console.log('id_estimulo_fiscal seleccionado:', id_estimulo_fiscal);
    const descripcion = document.getElementById('descripcion').value;

    // id_conexion (si aplica)
    const id_conexion = idConexionActual || null; // Si tienes el campo, asígnalo aquí

    // id_base (si no esta seleccionado conexion)
    const id_base = idBaseActual || null;

    // id_usuario siempre 1 (lo puedes poner en el backend, pero si lo quieres enviar, hazlo aquí)
    const id_usuario = 1;

    // Validación: al menos uno debe tener valor
    const claveInput = document.getElementById('clave');
    if ((!claveInput.value || claveInput.value.trim() === '') && (!claveCuentaContable || claveCuentaContable.trim() === '')) {
        Swal.fire({
            icon: 'warning',
            title: '¡Atención!',
            text: 'Debes llenar la cuenta o seleccionar una cuenta contable.',
            confirmButtonColor: '#3085d6'
        });
        return;
    }

    // Construye el objeto de datos
    const data = {
        folio,
        fecha,
        ejercicioFiscal,
        periodo,
        subtotal,
        monto: monto_total,
        monto_total_letras,
        forma_de_pago,
        id_contribuyente,
        descripcion,
        clave_cuentaContable: claveCuentaContable,
        clave_subcuenta: subcuenta,
        clave_seccion: seccion,
        clave_concepto: concepto,
        clave_subconcepto: subconcepto,
        id_estimulo_fiscal,
        id_conexion,
        id_base,
        id_usuario
    };

    console.log('Datos enviados:', data);
    console.log('Clave cuenta contable:', claveCuentaContable);

    try {
        const response = await fetch('http://localhost:5000/api/cobrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`Error HTTP! estado: ${response.status}`);
        Swal.fire({
            icon: 'success',
            title: '¡Guardado!',
            text: 'Recibo Guardado exitosamente'
        });
        // Opcional: limpiar el formulario o redirigir
    } catch (error) {
        console.error('Error al guardar el recibo:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al guardar el recibo. Por favor, inténtalo de nuevo.',
        });
    }
});
// ...existing code...

function calcularTotal() {
    const subtotalInput = document.getElementById('subtotal');
    const descuentoSelect = document.getElementById('descuento');
    const totalInput = document.getElementById('total');
    const cantidadLetraInput = document.getElementById('cantidadLetra');

    if (!subtotalInput || !descuentoSelect || !totalInput || !cantidadLetraInput) return;

    // Obtén el subtotal como número
    const subtotal = parseFloat(subtotalInput.value.replace(/,/g, '')) || 0;

    // Obtén el porcentaje del descuento seleccionado del texto del option
    let porcentaje = 0;
    const selectedOption = descuentoSelect.options[descuentoSelect.selectedIndex];
    if (selectedOption) {
        const match = selectedOption.textContent.match(/^(\d+(?:\.\d+)?)%/);
        if (match) porcentaje = parseFloat(match[1]);
    }

    // Calcula el total
    const total = subtotal - (subtotal * porcentaje / 100);
    totalInput.value = total.toFixed(2);

    // Convierte el total a letras y lo muestra
    cantidadLetraInput.value = capitalizarTodasPalabras(numeroALetras(total));
}