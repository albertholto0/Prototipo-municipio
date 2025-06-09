document.addEventListener('DOMContentLoaded', () => {
  const tablaBody = document.getElementById('conceptsTableBody');
  const paginationContainer = document.getElementById('pagination');
  const ItemsPorPagina = 10;
  let conceptos = [];
  let currentPage = 1;

  const renderTable = (page = 1) => {
    tablaBody.innerHTML = '';
    if (conceptos.length === 0) {
      tablaBody.innerHTML = '<tr><td colspan="7">No hay conceptos registrados</td></tr>';
      paginationContainer.innerHTML = '';
      return;
    }
    const start = (page - 1) * ItemsPorPagina;
    const end = start + ItemsPorPagina;
    const pageItems = conceptos.slice(start, end);

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
          <button class="action-btn modify" onclick="openModifyModal(${concepto.id})">
            <img src="/public/Assets/editor.png" alt="Modificar" class="action-icon">
          </button>
          <button class="action-btn delete" onclick="openDeleteModal(${concepto.id})">
            <img src="/public/Assets/eliminar.png" alt="Eliminar" class="action-icon">
          </button>
        </td>
      `;
      tablaBody.appendChild(fila);
    });
    renderPagination(page);
  };

  const renderPagination = (page) => {
    const totalPages = Math.ceil(conceptos.length / ItemsPorPagina);
    paginationContainer.innerHTML = '';
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.className = 'pagination-btn' + (i === page ? ' active' : '');
      btn.addEventListener('click', () => {
        currentPage = i;
        renderTable(currentPage);
      });
      paginationContainer.appendChild(btn);
    }
  };

  const cargarConceptos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/conceptos');
      if (!response.ok) throw new Error(`Error HTTP! estado: ${response.status}`);
      conceptos = await response.json();
      currentPage = 1;
      renderTable(currentPage);
    } catch (error) {
      console.error('Error al cargar conceptos:', error);
      tablaBody.innerHTML = '<tr><td colspan="7">Error al cargar los datos :/ </td></tr>';
      paginationContainer.innerHTML = '';
    }
  };

  document.getElementById('btnAgregarConcepto').addEventListener('click', () => {
    document.getElementById('conceptForm').reset();
    document.getElementById('modalConcepto').style.display = 'block';
  });

  document.getElementById('btnCancelarModal').addEventListener('click', () => {
    document.getElementById('modalConcepto').style.display = 'none';
  });

  document.getElementById('conceptForm').addEventListener('submit', async (e) => {
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

      let result;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Respuesta inesperada: ${text.substring(0, 100)}...`);
      }

      if (!response.ok) throw new Error(result.error || 'Error al registrar concepto');
      
      alert(result.message || 'Concepto registrado exitosamente');
      document.getElementById('modalConcepto').style.display = 'none';
      cargarConceptos();
    } catch (error) {
      console.error('Error completo:', error);
      alert('Error: ' + error.message);
    }
  });

  cargarConceptos();
});