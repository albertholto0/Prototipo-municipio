document.addEventListener('DOMContentLoaded', () => {
  const tablaBody = document.getElementById('conceptsTableBody');
  const paginationContainer = document.getElementById('pagination');
  const ItemsPorPagina = 5;
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
        <td class="hidden">${concepto.id}</td>
        <td>${concepto.clave_concepto}</td>
        <td>${concepto.clave_seccion}</td>
        <td>${concepto.nombre_conceptos}</td>
        <td>${concepto.descripcion}</td>
        <td>${concepto.tipo_servicio}</td>
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

  cargarConceptos();
});