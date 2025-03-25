// Array para simular la "base de datos" de bases catastrales
let basesCatastrales = [
    {
      id: "1",  // id_base_catastral (no se utiliza en el formulario pero se puede asignar automáticamente)
      claveCatastral: "ABC123",
      nombrePropietario: "Juan Pérez",
      ubicacion: "Calle Falsa 123",
      baseCatastral: "500 m²",
      valorTerreno: 100000,
      valorConstruccion: 200000,
      impuestoCalculado: 5000,
      fechaAvaluo: "2023-01-15",
      historialAvaluos: "2020,2021",
      usoSuelo: "habitacional",
      contribuyente: "C001"
    }
  ];
  
  // Referencias a elementos del DOM para la tabla principal
  const catastralTableBody = document.querySelector("#catastralTable tbody");
  const searchInput = document.getElementById("searchInput");
  
  // Referencias a elementos del DOM del formulario
  const catastralForm = document.getElementById("catastralForm");
  const formTitle = document.getElementById("formTitle");
  const claveCatastralInput = document.getElementById("claveCatastral");
  const nombrePropietarioInput = document.getElementById("nombrePropietario");
  const ubicacionInput = document.getElementById("ubicacion");
  const baseCatastralInput = document.getElementById("baseCatastral");
  const valorTerrenoInput = document.getElementById("valorTerreno");
  const valorConstruccionInput = document.getElementById("valorConstruccion");
  const impuestoCalculadoInput = document.getElementById("impuestoCalculado");
  const fechaAvaluoInput = document.getElementById("fechaAvaluo");
  const historialAvaluosInput = document.getElementById("historialAvaluos");
  const usoSueloInput = document.getElementById("usoSuelo");
  const contribuyenteInput = document.getElementById("contribuyente");
  const btnAddOrUpdate = document.getElementById("btnAddOrUpdate");
  const btnCancel = document.getElementById("btnCancel");
  
  // Variables para controlar la edición
  let isEditing = false;
  let currentIndex = null;
  
  // Función para renderizar la tabla principal
  function renderTable(data) {
    catastralTableBody.innerHTML = "";
    data.forEach((base, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${base.claveCatastral}</td>
        <td>${base.nombrePropietario}</td>
        <td>${base.ubicacion}</td>
        <td>${base.usoSuelo}</td>
        <td>${base.contribuyente}</td>
        <td>${base.fechaAvaluo}</td>
        <td>
          <button class="action-btn edit" onclick="editBase(${index})">Editar</button>
          <button class="action-btn delete" onclick="deleteBase(${index})">Eliminar</button>
        </td>
      `;
      catastralTableBody.appendChild(row);
    });
  }
  
  // Función para buscar en la tabla principal por diversos criterios
  function searchBases() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const filtered = basesCatastrales.filter(base =>
      base.claveCatastral.toLowerCase().includes(searchTerm) ||
      base.contribuyente.toLowerCase().includes(searchTerm) ||
      base.usoSuelo.toLowerCase().includes(searchTerm) ||
      base.fechaAvaluo.includes(searchTerm)
    );
    renderTable(filtered);
  }
  
  // Función para agregar una nueva base catastral
  function addBase() {
    const newBase = {
      // Se podría generar automáticamente un id, aquí se asigna de forma simple
      id: (basesCatastrales.length + 1).toString(),
      claveCatastral: claveCatastralInput.value,
      nombrePropietario: nombrePropietarioInput.value,
      ubicacion: ubicacionInput.value,
      baseCatastral: baseCatastralInput.value,
      valorTerreno: Number(valorTerrenoInput.value),
      valorConstruccion: Number(valorConstruccionInput.value),
      impuestoCalculado: Number(impuestoCalculadoInput.value),
      fechaAvaluo: fechaAvaluoInput.value,
      historialAvaluos: historialAvaluosInput.value,
      usoSuelo: usoSueloInput.value,
      contribuyente: contribuyenteInput.value
    };
    basesCatastrales.push(newBase);
  }
  
  // Función para actualizar una base catastral existente
  function updateBase(index) {
    basesCatastrales[index].claveCatastral = claveCatastralInput.value;
    basesCatastrales[index].nombrePropietario = nombrePropietarioInput.value;
    basesCatastrales[index].ubicacion = ubicacionInput.value;
    basesCatastrales[index].baseCatastral = baseCatastralInput.value;
    basesCatastrales[index].valorTerreno = Number(valorTerrenoInput.value);
    basesCatastrales[index].valorConstruccion = Number(valorConstruccionInput.value);
    basesCatastrales[index].impuestoCalculado = Number(impuestoCalculadoInput.value);
    basesCatastrales[index].fechaAvaluo = fechaAvaluoInput.value;
    basesCatastrales[index].historialAvaluos = historialAvaluosInput.value;
    basesCatastrales[index].usoSuelo = usoSueloInput.value;
    basesCatastrales[index].contribuyente = contribuyenteInput.value;
  }
  
  // Función para editar (cargar datos en el formulario)
  window.editBase = function(index) {
    isEditing = true;
    currentIndex = index;
    const base = basesCatastrales[index];
  
    claveCatastralInput.value = base.claveCatastral;
    nombrePropietarioInput.value = base.nombrePropietario;
    ubicacionInput.value = base.ubicacion;
    baseCatastralInput.value = base.baseCatastral;
    valorTerrenoInput.value = base.valorTerreno;
    valorConstruccionInput.value = base.valorConstruccion;
    impuestoCalculadoInput.value = base.impuestoCalculado;
    fechaAvaluoInput.value = base.fechaAvaluo;
    historialAvaluosInput.value = base.historialAvaluos;
    usoSueloInput.value = base.usoSuelo;
    contribuyenteInput.value = base.contribuyente;
  
    formTitle.textContent = "Editar Base Catastral";
    btnAddOrUpdate.textContent = "Actualizar";
  };
  
  // Función para eliminar una base catastral
  window.deleteBase = function(index) {
    if (confirm("¿Desea eliminar esta base catastral?")) {
      basesCatastrales.splice(index, 1);
      renderTable(basesCatastrales);
    }
  };
  
  // Manejo del submit del formulario
  catastralForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (isEditing) {
      updateBase(currentIndex);
    } else {
      addBase();
    }
    resetForm();
    renderTable(basesCatastrales);
  });
  
  // Función para resetear el formulario y restablecer título y botón
  function resetForm() {
    catastralForm.reset();
    isEditing = false;
    currentIndex = null;
    formTitle.textContent = "Registrar Base Catastral";
    btnAddOrUpdate.textContent = "Agregar";
  }
  
  // Botón cancelar
  btnCancel.addEventListener("click", () => {
    resetForm();
  });
  
  // Búsqueda en tiempo real
  searchInput.addEventListener("input", searchBases);
  
  // Inicializar tabla principal
  renderTable(basesCatastrales);
  