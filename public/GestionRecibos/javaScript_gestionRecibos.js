/**
 * Módulo de gestión de recibos (versión API)
 * Maneja la carga, filtrado y eliminación de recibos desde una API REST
 */

// Configuración de elementos del DOM específicos para este módulo
const gestionRecibosElements = {
  tableBody: document.querySelector("#accountsTable tbody"),
  searchInput: document.getElementById("searchInput"),
  fechaInicio: document.getElementById("filterFechaInicio"),
  fechaFin: document.getElementById("filterFechaFin")
};

// Datos de recibos obtenidos de la API
let recibosData = [];

// URL base de la API (corregida para que coincida con tu backend)
const API_BASE_URL = "http://localhost:5000/api/gestionRecibos";
/**
 * Carga los recibos desde la API y los renderiza en la tabla
 */
async function cargarRecibosDesdeAPI() {
  try {
    const response = await fetch(API_BASE_URL);
    
    if (!response.ok) {
      throw new Error(`Error HTTP! estado: ${response.status}`);
    }
    
    recibosData = await response.json();
    renderizarTablaRecibos(recibosData);
  } catch (error) {
    console.error("Error al cargar recibos:", error);
    mostrarErrorEnTabla("Error al cargar los datos");
  }
}

/**
 * Renderiza los recibos en la tabla HTML
 * @param {Array} listaRecibos - Array de recibos a mostrar
 */
function renderizarTablaRecibos(listaRecibos) {
  gestionRecibosElements.tableBody.innerHTML = '';
  
  if (listaRecibos.length === 0) {
    mostrarMensajeTablaVacia();
    return;
  }

  listaRecibos.forEach(recibo => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${recibo.folio}</td>
      <td>${formatearFecha(recibo.fecha_recibo)}</td>
      <td>${recibo.contribuyente}</td>
      <td>${recibo.ejercicio_fiscal}</td>
      <td>${recibo.ejercicio_periodo}</td>
      <td>${recibo.concepto || '—'}</td>
      <td>$${formatearMonto(recibo.monto_total)}</td>
      <td>${recibo.forma_de_pago}</td>
      <td>
        <button class="action-btn delete" data-id="${recibo.id_recibo}" title="Eliminar">
          <img src="/public/Assets/eliminar.png" class="action-icon" alt="Eliminar">
        </button>
      </td>
    `;
    gestionRecibosElements.tableBody.appendChild(fila);
  });

  configurarBotonesEliminar();
}

/**
 * Configura los event listeners para los botones de eliminar
 */
function configurarBotonesEliminar() {
  document.querySelectorAll('.action-btn.delete').forEach(btn => {
    btn.addEventListener('click', manejarEliminarRecibo);
  });
}

/**
 * Maneja la eliminación de un recibo
 * @param {Event} event - Evento de click
 */
async function manejarEliminarRecibo(event) {
  const idRecibo = event.currentTarget.dataset.id;
  
  if (confirm('¿Estás seguro de eliminar este recibo?')) {
    try {
      const response = await fetch(`${API_BASE_URL}/${idRecibo}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar el recibo');
      }
      
      // Recarga la lista actualizada
      cargarRecibosDesdeAPI();
    } catch (error) {
      console.error("Error al eliminar recibo:", error);
      alert('No se pudo eliminar el recibo');
    }
  }
}

/**
 * Aplica los filtros de búsqueda y fecha a los recibos
 */
function aplicarFiltrosRecibos() {
  const textoBusqueda = normalizarTexto(gestionRecibosElements.searchInput.value);
  const fechaInicio = gestionRecibosElements.fechaInicio.value;
  const fechaFin = gestionRecibosElements.fechaFin.value;

  const recibosFiltrados = recibosData.filter(recibo => {
    const coincideTexto =
      normalizarTexto(recibo.folio).includes(textoBusqueda) ||
      normalizarTexto(recibo.contribuyente).includes(textoBusqueda);

    // Las fechas están en formato 'YYYY-MM-DD' (formateadas)
    const fechaRecibo = formatearFecha(recibo.fecha_recibo);

    const dentroDeRangoFechas =
      (!fechaInicio || fechaRecibo >= fechaInicio) &&
      (!fechaFin || fechaRecibo <= fechaFin);

    return coincideTexto && dentroDeRangoFechas;
  });

  renderizarTablaRecibos(recibosFiltrados);
}

/**
 * Normaliza texto para búsquedas (elimina acentos y convierte a minúsculas)
 * @param {string} texto - Texto a normalizar
 * @returns {string} Texto normalizado
 */
function normalizarTexto(texto) {
  return (texto || '')
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * Formatea una fecha ISO a formato YYYY-MM-DD
 * @param {string} fechaISO - Fecha en formato ISO
 * @returns {string} Fecha formateada
 */
function formatearFecha(fechaISO) {
  return fechaISO ? fechaISO.split('T')[0] : '—';
}

/**
 * Formatea un monto numérico a formato de moneda con dos decimales
 * @param {number} monto - Monto a formatear
 * @returns {string} Monto formateado
 */
function formatearMonto(monto) {
  return parseFloat(monto).toFixed(2);
}

/**
 * Muestra un mensaje cuando no hay recibos
 */
function mostrarMensajeTablaVacia() {
  gestionRecibosElements.tableBody.innerHTML = `
    <tr>
      <td colspan="9">No hay recibos registrados</td>
    </tr>
  `;
}

/**
 * Muestra un mensaje de error en la tabla
 * @param {string} mensaje - Mensaje de error a mostrar
 */
function mostrarErrorEnTabla(mensaje) {
  gestionRecibosElements.tableBody.innerHTML = `
    <tr>
      <td colspan="9">${mensaje}</td>
    </tr>
  `;
}

/**
 * Inicializa el módulo de gestión de recibos
 */
function inicializarGestionRecibos() {
  cargarRecibosDesdeAPI();

  // Configurar event listeners
  gestionRecibosElements.searchInput.addEventListener("input", aplicarFiltrosRecibos);
  gestionRecibosElements.fechaInicio.addEventListener("change", aplicarFiltrosRecibos);
  gestionRecibosElements.fechaFin.addEventListener("change", aplicarFiltrosRecibos);
}

// Inicializar el módulo cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", inicializarGestionRecibos);
