document.addEventListener('DOMContentLoaded', () => {
  const tablaBody = document.getElementById('conceptsTableBody');
  const paginationContainer = document.getElementById('pagination');
  const searchInput = document.getElementById('searchInput');
  const ItemsPorPagina = 5;
  let conceptos = [];
  let conceptosFiltrados = [];
  let currentPage = 1;

  const renderTable = (page = 1, data = conceptosFiltrados) => {
    tablaBody.innerHTML = '';
    if (data.length === 0) {
      tablaBody.innerHTML = '<tr><td colspan="7">No hay conceptos registrados</td></tr>';
      paginationContainer.innerHTML = '';
      return;
    }
    const start = (page - 1) * ItemsPorPagina;
    const end = start + ItemsPorPagina;
    const pageItems = data.slice(start, end);

    pageItems.forEach(concepto => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${concepto.clave_concepto}</td>
        <td>${concepto.clave_seccion}</td>
        <td>${concepto.descripcion}</td>
        <td>${concepto.tipo_servicio}</td>
        <td>${concepto.cuota}</td>
        <td>${concepto.periodicidad}</td>
        <td>
          <button class="action-btn modify" onclick="openModifyModal(${concepto.clave_concepto})">
            <img src="/public/Assets/editor.png" alt="Modificar" class="action-icon">
          </button>
          <button class="action-btn delete" onclick="openDeleteModal(${concepto.clave_concepto})">
            <img src="/public/Assets/eliminar.png" alt="Eliminar" class="action-icon">
          </button>
        </td>
      `;
      tablaBody.appendChild(fila);
    });
    renderPagination(data.length);
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
    const totalPages = Math.ceil(conceptosFiltrados.length / ItemsPorPagina);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderTable(currentPage, conceptosFiltrados);
  };

  const cargarConceptos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/conceptos');
      if (!response.ok) throw new Error(`Error HTTP! estado: ${response.status}`);
      conceptos = await response.json();
      conceptosFiltrados = [...conceptos];
      currentPage = 1;
      renderTable(currentPage, conceptosFiltrados);
    } catch (error) {
      console.error('Error al cargar conceptos:', error);
      tablaBody.innerHTML = '<tr><td colspan="7">Error al cargar los datos :/ </td></tr>';
      paginationContainer.innerHTML = '';
    }
  };

  // Búsqueda por clave_seccion, clave_concepto y descripcion
  searchInput.addEventListener('input', () => {
    const valor = searchInput.value.trim().toLowerCase();
    conceptosFiltrados = conceptos.filter(concepto =>
      concepto.clave_seccion.toString().includes(valor) ||
      concepto.clave_concepto.toString().includes(valor) ||
      (concepto.descripcion && concepto.descripcion.toLowerCase().includes(valor))
    );
    currentPage = 1;
    renderTable(currentPage, conceptosFiltrados);
  });

  // Botón Agregar abre modal de agregar
document.getElementById('btnAgregarConcepto').addEventListener('click', () => {
    document.getElementById('agregarConceptForm').reset();
    document.getElementById('modalAgregarConcepto').style.display = 'block';
});

  // Botón Cancelar en modal de agregar
  document.getElementById('btnCancelarModal').addEventListener('click', () => {
    document.getElementById('modalAgregarConcepto').style.display = 'none';
  });

  // Botón Cancelar en modal de editar
  document.getElementById('btnCancelarEditar').addEventListener('click', () => {
    document.getElementById('modalEditarConcepto').style.display = 'none';
  });

  // Función para abrir modal de edición
  window.openModifyModal = function(clave_concepto) {
    const concepto = conceptos.find(c => c.clave_concepto == clave_concepto);
    if (!concepto) return;

    // Llenar el formulario de edición
    document.getElementById('edit_clave_concepto').value = concepto.clave_concepto;
    document.getElementById('edit_clave_seccion').value = concepto.clave_seccion;
    document.getElementById('edit_descripcion').value = concepto.descripcion;
    document.getElementById('edit_tipo_servicio').value = concepto.tipo_servicio;
    document.getElementById('edit_cuota').value = concepto.cuota;
    document.getElementById('edit_periodicidad').value = concepto.periodicidad;

    document.getElementById('modalEditarConcepto').style.display = 'block';
};

  // Formulario para agregar
  document.getElementById('agregarConceptForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const conceptoData = {
        clave_concepto: parseInt(document.getElementById('clave_concepto').value),
        clave_seccion: parseInt(document.getElementById('clave_seccion').value),
        descripcion: document.getElementById('descripcion').value,
        tipo_servicio: document.getElementById('tipo_servicio').value,
        cuota: parseFloat(document.getElementById('cuota').value),
        periodicidad: document.getElementById('periodicidad').value
    };

    try {
        const response = await fetch('http://localhost:5000/api/conceptos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(conceptoData)
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Error al crear concepto');

        alert('Concepto creado exitosamente');
        document.getElementById('modalAgregarConcepto').style.display = 'none';
        cargarConceptos();
    } catch (error) {
        console.error('Error:', error);
        alert('Error: ' + error.message);
    }
});

  // Formulario para editar
  document.getElementById('editarConceptForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const conceptoData = {
        clave_concepto: parseInt(document.getElementById('edit_clave_concepto').value),
        descripcion: document.getElementById('edit_descripcion').value,
        tipo_servicio: document.getElementById('edit_tipo_servicio').value,
        cuota: parseFloat(document.getElementById('edit_cuota').value),
        periodicidad: document.getElementById('edit_periodicidad').value
    };

    try {
        const response = await fetch(`http://localhost:5000/api/conceptos/${conceptoData.clave_concepto}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                descripcion: conceptoData.descripcion,
                tipo_servicio: conceptoData.tipo_servicio,
                cuota: conceptoData.cuota,
                periodicidad: conceptoData.periodicidad
            })
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Error al actualizar concepto');

        alert('Concepto actualizado exitosamente');
        document.getElementById('modalEditarConcepto').style.display = 'none';
        cargarConceptos();
    } catch (error) {
        console.error('Error:', error);
        alert('Error: ' + error.message);
    }
});

  // Llenar select de clave_seccion desde la base de datos
  async function cargarSecciones() {
    try {
      const response = await fetch('http://localhost:5000/api/secciones');
      if (!response.ok) throw new Error('No se pudieron cargar las secciones');
      const secciones = await response.json();
      const select = document.getElementById('listaSeccion');
      select.innerHTML = '';
      secciones.forEach(sec => {
        const option = document.createElement('option');
        option.value = sec.clave_seccion;
        option.label = sec.nombre_seccion ? `${sec.clave_seccion} - ${sec.nombre_seccion}` : sec.clave_seccion;
        select.appendChild(option);
      });
    } catch (error) {
      console.error('Error al cargar secciones:', error);
    }
  }

  cargarSecciones();
  cargarConceptos();
});