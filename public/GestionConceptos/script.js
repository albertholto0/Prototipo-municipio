document.addEventListener('DOMContentLoaded', () => {
  const tablaBody = document.getElementById('conceptsTableBody');
  const paginationContainer = document.getElementById('pagination');
  const searchInput = document.getElementById('searchInput');
  const ItemsPorPagina = 10;
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
    renderPagination(page, data);
  };

  const renderPagination = (page, data = conceptosFiltrados) => {
    const totalPages = Math.ceil(data.length / ItemsPorPagina);
    paginationContainer.innerHTML = '';
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.className = 'pagination-btn' + (i === page ? ' active' : '');
      btn.addEventListener('click', () => {
        currentPage = i;
        renderTable(currentPage, data);
      });
      paginationContainer.appendChild(btn);
    }
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
      nombre_conceptos: document.getElementById('nombre_conceptos').value,
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

  // Llenar select de clave_seccion desde la base de datos
  async function cargarSecciones() {
    try {
      const response = await fetch('http://localhost:5000/api/secciones');
      if (!response.ok) throw new Error('No se pudieron cargar las secciones');
      const secciones = await response.json();
      const select = document.getElementById('clave_seccion');
      select.innerHTML = '<option value="">Selecciona una sección</option>';
      secciones.forEach(sec => {
        const option = document.createElement('option');
        option.value = sec.clave_seccion;
        option.textContent = sec.clave_seccion + (sec.nombre_seccion ? ' - ' + sec.nombre_seccion : '');
        select.appendChild(option);
      });
    } catch (error) {
      console.error('Error al cargar secciones:', error);
    }
  }

  cargarSecciones();
  cargarConceptos();
});