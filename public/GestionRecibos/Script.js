// Versión mejorada de javaScript_gestionRecibos.js sin modalOverlay
(function () {
  const GESTION_RECIBOS_CONFIG = {
    apiUrl: 'http://localhost:5000/api/gestionRecibos',
    elementos: {
      tableBody: document.querySelector("#accountsTable tbody"),
      searchInput: document.getElementById("searchInput"),
      fechaInicio: document.getElementById("filterFechaInicio"),
      fechaFin: document.getElementById("filterFechaFin"),
      paginationContainer: document.getElementById("pagination")
    },
    pagination: {
      currentPage: 1,
      rowsPerPage: 10
    }
  };

  let recibosData = [];
  let isLoading = false;

  async function initGestionRecibos() {
    if (!verifyDOMElements()) return;

    try {
      isLoading = true;
      recibosData = await fetchRecibos();
      renderTable(recibosData);
      setupEventListeners();
    } catch (error) {
      showError('Error al inicializar: ' + error.message);
    } finally {
      isLoading = false;
    }
  }

  function verifyDOMElements() {
    const { elementos } = GESTION_RECIBOS_CONFIG;
    let allElementsExist = true;

    Object.entries(elementos).forEach(([key, element]) => {
      if (!element) {
        console.error(`Elemento no encontrado: ${key}`);
        allElementsExist = false;
      }
    });

    return allElementsExist;
  }

  async function fetchRecibos() {
    try {
      const response = await fetch(GESTION_RECIBOS_CONFIG.apiUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching recibos:', error);
      return generateMockData();
    }
  }

  function generateMockData() {
    const mockData = [];
    const contribuyentes = ['Juan Pérez', 'María García', 'Carlos López'];
    const conceptos = ['Impuesto Predial', 'Agua Potable', 'Alumbrado Público'];
    const descripciones = ['Pago anual', 'Mensualidad', 'Adeudo pendiente'];

    for (let i = 1; i <= 20; i++) {
      mockData.push({
        id_recibo: i,
        folio: `REC-${1000 + i}`,
        fecha_recibo: new Date(2023, i % 12, (i % 28) + 1).toISOString(),
        contribuyente: contribuyentes[i % contribuyentes.length],
        ejercicio_fiscal: "2023",
        ejercicio_periodo: String(i % 12 + 1).padStart(2, '0'),
        concepto: conceptos[i % conceptos.length],
        descripcion: descripciones[i % descripciones.length],
        monto_total: 500 + (i * 20),
        forma_de_pago: ['EFECTIVO', 'TARJETA', 'TRANSFERENCIA'][i % 3]
      });
    }

    return mockData;
  }

  function renderTable(data) {
    const { tableBody } = GESTION_RECIBOS_CONFIG.elementos;
    const { currentPage, rowsPerPage } = GESTION_RECIBOS_CONFIG.pagination;

    if (!data || data.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="10">No hay datos disponibles</td></tr>';
      return;
    }

    const start = (currentPage - 1) * rowsPerPage;
    const paginatedData = data.slice(start, start + rowsPerPage);

    tableBody.innerHTML = paginatedData.map(recibo => `
      <tr>
        <td>${recibo.folio}</td>
        <td>${formatDate(recibo.fecha_recibo)}</td>
        <td>${recibo.contribuyente}</td>
        <td>${recibo.ejercicio_fiscal}</td>
        <td>${recibo.ejercicio_periodo}</td>
        <td>${recibo.concepto || '—'}</td>
        <td>${recibo.descripcion || '—'}</td>
        <td>${formatCurrency(recibo.monto_total)}</td>
        <td>${recibo.forma_de_pago}</td>
        <td>
          <button class="btn-action view" data-id="${recibo.id_recibo}" title="Ver">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn-action delete" data-id="${recibo.id_recibo}" title="Eliminar">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');

    updatePagination(data.length);
  }

  function setupEventListeners() {
    const { searchInput, fechaInicio, fechaFin } = GESTION_RECIBOS_CONFIG.elementos;

    searchInput?.addEventListener('input', applyFilters);
    fechaInicio?.addEventListener('change', applyFilters);
    fechaFin?.addEventListener('change', applyFilters);

    GESTION_RECIBOS_CONFIG.elementos.tableBody?.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-action');
      if (!btn) return;

      const id = btn.dataset.id;
      if (btn.classList.contains('delete')) {
        confirmDelete(id);
      } else if (btn.classList.contains('view')) {
        viewReceipt(id);
      }
    });
  }

  function applyFilters() {
    const { searchInput, fechaInicio, fechaFin } = GESTION_RECIBOS_CONFIG.elementos;
    const searchTerm = searchInput.value.toLowerCase();
    const startDate = fechaInicio.value;
    const endDate = fechaFin.value;

    const filtered = recibosData.filter(recibo => {
      const matchesText = recibo.folio.toLowerCase().includes(searchTerm) ||
        recibo.contribuyente.toLowerCase().includes(searchTerm);

      const reciboDate = recibo.fecha_recibo.split('T')[0];
      const matchesDate = (!startDate || reciboDate >= startDate) &&
        (!endDate || reciboDate <= endDate);

      return matchesText && matchesDate;
    });

    GESTION_RECIBOS_CONFIG.pagination.currentPage = 1;
    renderTable(filtered);
  }

  async function confirmDelete(id) {
    if (!confirm('¿Está seguro de eliminar este recibo?')) return;

    try {
      const response = await fetch(`${GESTION_RECIBOS_CONFIG.apiUrl}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Error al eliminar');

      recibosData = recibosData.filter(r => r.id_recibo != id);
      renderTable(recibosData);
    } catch (error) {
      showError('No se pudo eliminar el recibo: ' + error.message);
    }
  }

  function viewReceipt(id) {
    const recibo = recibosData.find(r => r.id_recibo == id);
    if (!recibo) return;

    console.log('Visualizando recibo:', recibo);
    alert(`Visualizando recibo ${recibo.folio}`);
  }

  function updatePagination(totalItems) {
    const { paginationContainer } = GESTION_RECIBOS_CONFIG.elementos;
    if (!paginationContainer) return;

    const { currentPage, rowsPerPage } = GESTION_RECIBOS_CONFIG.pagination;
    const totalPages = Math.ceil(totalItems / rowsPerPage);

    let html = '';
    if (totalPages > 1) {
      html += `<button class="page-btn ${currentPage === 1 ? 'disabled' : ''}" onclick="changePage(${currentPage - 1})">«</button>`;

      for (let i = 1; i <= totalPages; i++) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
      }

      html += `<button class="page-btn ${currentPage === totalPages ? 'disabled' : ''}" onclick="changePage(${currentPage + 1})">»</button>`;
    }

    paginationContainer.innerHTML = html;
  }

  function formatDate(dateString) {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX');
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  }

  function showError(message) {
    console.error(message);
    const errorElement = document.getElementById('error-message') || createErrorElement();
    errorElement.textContent = message;
    errorElement.style.display = 'block';

    setTimeout(() => {
      errorElement.style.display = 'none';
    }, 5000);
  }

  function createErrorElement() {
    const div = document.createElement('div');
    div.id = 'error-message';
    div.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px;
      background: #ff4444;
      color: white;
      border-radius: 5px;
      display: none;
      z-index: 1000;
    `;
    document.body.appendChild(div);
    return div;
  }

  window.changePage = function (page) {
    if (page < 1 || page > Math.ceil(recibosData.length / GESTION_RECIBOS_CONFIG.pagination.rowsPerPage)) return;
    GESTION_RECIBOS_CONFIG.pagination.currentPage = page;
    renderTable(recibosData);
  };

  document.addEventListener('DOMContentLoaded', initGestionRecibos);
})();

