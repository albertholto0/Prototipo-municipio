// Variables de estado globales
let allSecciones = [];
let secciones = []; // Variable global para almacenar las secciones
let currentPage = 1;
const rowsPerPage = 10;

// Mapeo de elementos del DOM
const elements = {
    tableBody: document.querySelector("#accountsTable tbody"),
    searchInput: document.getElementById("searchInput"),
    form: document.getElementById("accountForm"),
    btnAddOrUpdate: document.getElementById("btnAddOrUpdate"),
    btnCancel: document.getElementById("btnCancel"),
    formTitle: document.getElementById("formTitle"),
    paginationContainer: document.querySelector(".pagination"),
    modalOverlay: document.getElementById('modalOverlay'),
    btnOpenModal: document.getElementById('btnOpenModal'),
};

let editId = null;

// Cargar secciones y renderizar tabla
async function cargarSecciones() {
    try {
        const response = await fetch('http://localhost:5000/api/secciones');
        if (!response.ok) throw new Error(`Error HTTP! estado: ${response.status}`);
        allSecciones = await response.json(); // Guardar todas las secciones

        // Filtrar solo las secciones activas
        const seccionesActivas = allSecciones.filter(seccion => seccion.estado == 1);

        // Renderizar secciones activas
        renderizarSecciones(seccionesActivas);
    } catch (error) {
        console.error('Error al cargar secciones:', error);
        elements.tableBody.innerHTML = '<tr><td colspan="4">Error al cargar los datos :( </td></tr>';
    }
}

function renderizarSecciones(lista) {
    elements.tableBody.innerHTML = '';
    if (lista.length === 0) {
        elements.tableBody.innerHTML = '<tr><td colspan="4">No hay secciones registradas</td></tr>';
        return;
    }
    lista.forEach(seccion => {
        const fila = document.createElement('tr');
        if (seccion.estado == 1) {
            seccion.estado = 'Activo';
        }
        else if (seccion.estado == 0) {
            seccion.estado = 'Inactivo';
        }

        fila.innerHTML = `
            <td>${seccion.clave_subcuenta}</td>
            <td>${seccion.clave_seccion}</td>
            <td>${seccion.descripcion}</td>
            <td>${seccion.estado}</td>
            <td>
              <button class="action-btn edit" data-id="${seccion.clave_seccion}" title="Editar">
                  <img src="/public/Assets/editor.png" class="action-icon">
              </button>
              <button class="action-btn delete" data-id="${seccion.clave_seccion}" title="Eliminar">
                  <img src="/public/Assets/eliminar.png" class="action-icon">
              </button>
            </td>
        `;
        elements.tableBody.appendChild(fila);
    });

    // Listeners del botón editar
    document.querySelectorAll('.action-btn.edit').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            editId = btn.getAttribute('data-id');
            // Obtener datos de la sección
            const response = await fetch(`http://localhost:5000/api/secciones/${editId}`);
            const data = await response.json();

            // Llenar el select y luego asignar el valor
            await llenarSelectSubcuentasContables();
            document.getElementById('clave_subcuenta').value = data.clave_subcuenta;

            // Llena el resto del formulario
            document.getElementById('clave_seccion').value = data.clave_seccion;
            document.getElementById('clave_seccion').disabled = true; // Deshabilita el campo al editar
            document.getElementById('nombre_seccion').value = data.descripcion;
            elements.formTitle.textContent = "Editar Sección";
            elements.btnAddOrUpdate.textContent = "Actualizar";
            // Abre el modal
            elements.modalOverlay.style.display = 'flex';
        });
    });

    // Listener del botón de eliminar
    document.querySelectorAll('.action-btn.delete').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const claveSeccion = btn.getAttribute('data-id');
            if (confirm("¿Estás seguro de que deseas eliminar esta sección?")) {
                try {
                    const response = await fetch(`http://localhost:5000/api/secciones/${claveSeccion}`, {
                        method: 'DELETE' // No elimina, solo cambia el estado
                    });
                    if (!response.ok) throw new Error(`Error HTTP! estado: ${response.status}`);
                    // Recargar secciones
                    await cargarSecciones();
                } catch (error) {
                    console.error('Error al eliminar la sección:', error);
                    alert('Error al eliminar la subcuenta contable');
                }
            }
        });
    });
}

// Funciones del modal
function openModal() {
    elements.modalOverlay.style.display = 'flex';
    llenarSelectSubcuentasContables(); // Llenar el select cada vez que se abre el modal
    document.getElementById('clave_seccion').disabled = false; // Habilita el campo al crear
}

function closeModal() {
    elements.modalOverlay.style.display = 'none';
    resetForm();
    editId = null; // Limpia el editId al cerrar el modal
}

// Limpiar formulario
function resetForm() {
    elements.form.reset();
}

function normalizar(texto) {
    return (texto || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Quita acentos
        .trim();
}

async function llenarSelectSubcuentasContables() {
    const select = document.getElementById('clave_subcuenta');
    select.innerHTML = '<option value="">Seleccione una subcuenta</option>'; // Limpia el select
    try {
        const response = await fetch('http://localhost:5000/api/subcuentasContables');
        if (!response.ok) throw new Error('No se pudieron cargar las subcuentas contables');
        const subcuentas = await response.json();
        subcuentas.forEach(subcuenta => {
            const option = document.createElement('option');
            option.value = subcuenta.clave_subcuenta; // SOLO el id
            option.textContent = `${subcuenta.clave_subcuenta} - ${subcuenta.nombre_subcuentas}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar subcuentas contables:', error);
    }
}

/* === INICIALIZACIÓN === */
document.addEventListener("DOMContentLoaded", () => {
    cargarSecciones();

    elements.btnOpenModal.addEventListener('click', openModal);
    elements.btnCancel.addEventListener('click', closeModal);
    elements.searchInput.addEventListener('input', () => {
        const texto = normalizar(elements.searchInput.value);
        const seccionesFiltradas = allSecciones.filter(seccion => {
            // Normaliza y convierte a string todas las propiedades relevantes
            const claveSubcuenta = normalizar(String(seccion.clave_subcuenta));
            const claveSeccion = normalizar(String(seccion.clave_seccion));
            const nombreSeccion = normalizar(seccion.descripcion);
            const estadoSeccion = normalizar(String(seccion.estado));
            // Busca en todas las propiedades
            return (
                claveSubcuenta.includes(texto) ||
                claveSeccion.includes(texto) ||
                nombreSeccion.includes(texto) ||
                estadoSeccion.includes(texto)
            );
        });
        renderizarSecciones(seccionesFiltradas);
    });

    elements.form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            clave_seccion: document.getElementById('clave_seccion').value,
            clave_subcuenta: document.getElementById('clave_subcuenta').value,
            descripcion: document.getElementById('nombre_seccion').value
        };
        try {
            let response;
            if (editId) {
                // Actualizar sección existente
                response = await fetch(`http://localhost:5000/api/secciones/${editId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            } else {
                // Crear nueva sección
                response = await fetch('http://localhost:5000/api/secciones', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            }

            if (!response.ok) throw new Error(`Error HTTP! estado: ${response.status}`);

            // Recargar secciones
            await cargarSecciones();
            closeModal();
        } catch (error) {
            console.error('Error al guardar la sección:', error);
            alert('Error al guardar la sección');
        }
    });
});

