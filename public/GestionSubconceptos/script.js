document.addEventListener('DOMContentLoaded', () => {
  const tablaBody = document.getElementById('subconceptsTableBody');
  const paginationContainer = document.getElementById('pagination');
  const searchInput = document.getElementById('searchInput');
  const ItemsPorPagina = 10; // Número de subconceptos por página
  let subconceptos = [];
  let subconceptosFiltrados = [];
  let currentPage = 1;

  const renderTable = (page = 1, data = subconceptosFiltrados) => {
    tablaBody.innerHTML = '';
    if (data.length === 0) {
      tablaBody.innerHTML = '<tr><td colspan="7">No hay subconceptos registrados</td></tr>';
      paginationContainer.innerHTML = '';
      return;
    }
    const start = (page - 1) * ItemsPorPagina;
    const end = start + ItemsPorPagina;
    const pageItems = data.slice(start, end);

    pageItems.forEach(subconcepto => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${subconcepto.clave_subconcepto}</td>
        <td>${subconcepto.clave_concepto}</td>
        <td>${subconcepto.descripcion}</td>
        <td>${subconcepto.tipo_servicio}</td>
        <td>${subconcepto.cuota}</td>
        <td>${subconcepto.periodicidad}</td>
        <td>
          <button class="action-btn modify" onclick="openModifyModal(${subconcepto.id})">
            <img src="/public/Assets/editor.png" alt="Modificar" class="action-icon">
          </button>
          <button class="action-btn delete" onclick="openDeleteModal(${subconcepto.id})">
            <img src="/public/Assets/eliminar.png" alt="Eliminar" class="action-icon">
          </button>
        </td>
      `;
      tablaBody.appendChild(fila);
    });
    renderPagination(subconceptosFiltrados.length);
  };

  /**
  * Renderiza los controles de paginación.
  * @param {number} totalItems - Total de elementos a paginar.
  */
  function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / ItemsPorPagina);
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
    paginationContainer.innerHTML = paginationHTML;
  }

  // Cambia de página y renderiza la tabla
  window.changePage = function(page) {
    const totalPages = Math.ceil(subconceptosFiltrados.length / ItemsPorPagina);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderTable(currentPage, subconceptosFiltrados);
  };

  const cargarSubconceptos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/subconceptos');
      if (!response.ok) throw new Error(`Error HTTP! estado: ${response.status}`);
      subconceptos = await response.json();
      subconceptosFiltrados = [...subconceptos];
      currentPage = 1;
      renderTable(currentPage, subconceptosFiltrados);
    } catch (error) {
      console.error('Error al cargar subconceptos:', error);
      tablaBody.innerHTML = '<tr><td colspan="7">Error al cargar los datos :/ </td></tr>';
      paginationContainer.innerHTML = '';
    }
  };

  // Búsqueda por clave_concepto, clave_subconcepto y descripcion
  searchInput.addEventListener('input', () => {
    const valor = searchInput.value.trim().toLowerCase();
    subconceptosFiltrados = subconceptos.filter(subconcepto =>
      subconcepto.clave_concepto.toString().includes(valor) ||
      subconcepto.clave_subconcepto.toString().includes(valor) ||
      (subconcepto.descripcion && subconcepto.descripcion.toLowerCase().includes(valor))
    );
    currentPage = 1;
    renderTable(currentPage, subconceptosFiltrados);
  });

  document.getElementById('btnAgregarSubconcepto').addEventListener('click', () => {
    document.getElementById('subconceptForm').reset();
    document.getElementById('modalSubconcepto').style.display = 'block';
  });

  document.getElementById('btnCancelarModal').addEventListener('click', () => {
    document.getElementById('modalSubconcepto').style.display = 'none';
  });

  document.getElementById('subconceptForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const subconceptoData = {
      clave_subconcepto: parseInt(document.getElementById('clave_subconcepto').value),
      clave_concepto: parseInt(document.getElementById('clave_concepto').value),
      nombre_subconceptos: document.getElementById('nombre_subconceptos').value,
      descripcion: document.getElementById('descripcion').value,
      tipo_servicio: document.getElementById('tipo_servicio').value,
      cuota: parseFloat(document.getElementById('cuota').value),
      periodicidad: document.getElementById('periodicidad').value
    };

    try {
      const response = await fetch('http://localhost:5000/api/subconceptos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subconceptoData)
      });

      let result;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Respuesta inesperada: ${text.substring(0, 100)}...`);
      }

      if (!response.ok) throw new Error(result.error || 'Error al registrar subconcepto');
      
      alert(result.message || 'Subconcepto registrado exitosamente');
      document.getElementById('modalSubconcepto').style.display = 'none';
      cargarSubconceptos();
    } catch (error) {
      console.error('Error completo:', error);
      alert('Error: ' + error.message);
    }
  });

  async function cargarConceptos() {
    try {
      const response = await fetch('http://localhost:5000/api/conceptos');
      if (!response.ok) throw new Error('No se pudieron cargar los conceptos');
      const conceptos = await response.json();
      const datalist = document.getElementById('listaConceptos');
      datalist.innerHTML = '';
      conceptos.forEach(concepto => {
        // Puedes mostrar clave y descripción para mejor experiencia
        const option = document.createElement('option');
        option.value = concepto.clave_concepto;
        option.label = concepto.descripcion ? `${concepto.clave_concepto} - ${concepto.descripcion}` : concepto.clave_concepto;
        datalist.appendChild(option);
      });
    } catch (error) {
      console.error('Error al cargar conceptos:', error);
    }
  }

  // Llama a la función al cargar la página
  cargarConceptos();
  cargarSubconceptos();
});