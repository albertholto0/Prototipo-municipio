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
        <td>${subconcepto.clave_concepto}</td>
        <td>${subconcepto.clave_subconcepto}</td>
        <td>${subconcepto.descripcion}</td>
        <td>${subconcepto.tipo_servicio}</td>
        <td>${subconcepto.cuota}</td>
        <td>${subconcepto.periodicidad}</td>
        <td>
            <button class="action-btn modify" onclick="openModifyModal(${subconcepto.clave_subconcepto})">
                <img src="/public/Assets/editor.png" alt="Modificar" class="action-icon">
            </button>
            <button class="action-btn delete" onclick="openDeleteModal(${subconcepto.clave_subconcepto})">
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

  // Registra un nuevo subconcepto
  document.getElementById('subconceptForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const subconceptoData = {
      clave_subconcepto: parseInt(document.getElementById('clave_subconcepto').value),
      clave_concepto: parseInt(document.getElementById('clave_concepto').value),
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

  // Función para abrir el modal de edición permitiendo editar claves
  window.openModifyModal = async function(clave_subconcepto) {
    try {
        const response = await fetch(`http://localhost:5000/api/subconceptos/${clave_subconcepto}`);
        if (!response.ok) throw new Error(`Error HTTP! estado: ${response.status}`);
        const subconcepto = await response.json();

        document.getElementById('edit_clave_concepto').value = subconcepto.clave_concepto;
        document.getElementById('edit_clave_subconcepto').value = subconcepto.clave_subconcepto;
        document.getElementById('edit_descripcion').value = subconcepto.descripcion;
        document.getElementById('edit_tipo_servicio').value = subconcepto.tipo_servicio;
        document.getElementById('edit_cuota').value = subconcepto.cuota;
        document.getElementById('edit_periodicidad').value = subconcepto.periodicidad;

        // Guardar la clave actual para usarla en la actualización
        document.getElementById('editarSubconceptForm').dataset.clave_subconcepto_actual = clave_subconcepto;
        
        document.getElementById('modalEditarSubconcepto').style.display = 'block';
    } catch (error) {
        console.error('Error al cargar subconcepto:', error);
        alert('Error al cargar subconcepto: ' + error.message);
    }
};

  // Función para abrir el modal de eliminación
  window.openDeleteModal = function(clave_subconcepto) {
    document.getElementById('deleteConceptId').value = clave_subconcepto;
    document.getElementById('deleteModal').style.display = 'block';
  };

  // Evento para el formulario de edición
  document.getElementById('editarSubconceptForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const clave_subconcepto_actual = e.target.dataset.clave_subconcepto_actual;
    const subconceptoData = {
        nueva_clave_subconcepto: parseInt(document.getElementById('edit_clave_subconcepto').value),
        nueva_clave_concepto: parseInt(document.getElementById('edit_clave_concepto').value),
        descripcion: document.getElementById('edit_descripcion').value,
        tipo_servicio: document.getElementById('edit_tipo_servicio').value,
        cuota: parseFloat(document.getElementById('edit_cuota').value),
        periodicidad: document.getElementById('edit_periodicidad').value
    };

    try {
        const response = await fetch(`http://localhost:5000/api/subconceptos/${clave_subconcepto_actual}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subconceptoData)
        });

        const result = await response.json();
        
        if (!response.ok) throw new Error(result.error || 'Error al actualizar subconcepto');
        
        alert(result.message || 'Subconcepto actualizado exitosamente');
        document.getElementById('modalEditarSubconcepto').style.display = 'none';
        cargarSubconceptos();
    } catch (error) {
        console.error('Error al actualizar subconcepto:', error);
        alert('Error: ' + error.message);
    }
});

  // Evento para el formulario de eliminación
  document.getElementById('deleteConceptForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const clave_subconcepto = document.getElementById('deleteConceptId').value;
    const password = document.getElementById('deletePassword').value;

    try {
        const response = await fetch(`http://localhost:5000/api/subconceptos/${clave_subconcepto}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });

        const result = await response.json();
        
        if (!response.ok) throw new Error(result.error || 'Error al eliminar subconcepto');
        
        alert(result.message || 'Subconcepto eliminado exitosamente');
        document.getElementById('deleteModal').style.display = 'none';
        document.getElementById('deletePassword').value = '';
        cargarSubconceptos();
    } catch (error) {
        console.error('Error al eliminar subconcepto:', error);
        alert('Error: ' + error.message);
    }
});

  // Botón cerrar (X) en todos los modales (si tienes .btn-close en algún modal)
  document.querySelectorAll('.btn-close').forEach(btn => {
      btn.addEventListener('click', function() {
          this.closest('.modal-overlay').style.display = 'none';
          // Limpia campos de contraseña si aplica
          const pwd = this.closest('.modal-overlay').querySelector('input[type="password"]');
          if (pwd) pwd.value = '';
      });
  });

  // Botón cancelar en modal agregar
  const btnCancelarModal = document.getElementById('btnCancelarModal');
  if (btnCancelarModal) {
      btnCancelarModal.addEventListener('click', () => {
          document.getElementById('modalSubconcepto').style.display = 'none';
      });
  }

  // Botón cancelar en modal editar
  const btnCancelarEditarSub = document.getElementById('btnCancelarEditarSub');
  if (btnCancelarEditarSub) {
      btnCancelarEditarSub.addEventListener('click', () => {
          document.getElementById('modalEditarSubconcepto').style.display = 'none';
      });
  }

  // Botón cancelar en modal eliminar (usa la primera coincidencia dentro del modal)
  const btnCancelarEliminar = document.querySelector('#deleteModal .btn-cancel');
  if (btnCancelarEliminar) {
      btnCancelarEliminar.addEventListener('click', () => {
          document.getElementById('deleteModal').style.display = 'none';
          document.getElementById('deletePassword').value = '';
      });
  }
});