// File: public/GestionConexion/java_gestionConexion.js
//Sergio Elias Robles Ignacio 
document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = '/api/conexion'; // Ajusta si tu ruta base es diferente
    const tableBody = document.querySelector('#accountsTable tbody');
    const modalOverlay = document.getElementById('modalOverlay');
    const btnOpenModal = document.getElementById('btnOpenModal');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const btnCancel = document.getElementById('btnCancel');
    const form = document.getElementById('accountForm');
    const formTitle = document.getElementById('formTitle');
    const btnAddOrUpdate = document.getElementById('btnAddOrUpdate');
    const searchInput = document.getElementById('searchInput');

    let editingId = null;
    let conexiones = [];

    // Mostrar el modal
    btnOpenModal.addEventListener('click', () => {
        form.reset();
        editingId = null;
        formTitle.textContent = 'Agregar Conexión';
        btnAddOrUpdate.textContent = 'Agregar';
        modalOverlay.style.display = 'flex';
    });

    // Cerrar el modal
    btnCloseModal.addEventListener('click', () => {
        modalOverlay.style.display = 'none';
    });
    btnCancel.addEventListener('click', () => {
        modalOverlay.style.display = 'none';
    });

    // Obtener todas las conexiones
    async function fetchConexiones() {
        try {
            const res = await fetch(apiUrl);
            conexiones = await res.json();
            renderTable(conexiones);
        } catch (err) {
            alert('Error al obtener conexiones');
        }
    }

    // Renderizar la tabla
    function renderTable(data) {
        tableBody.innerHTML = '';
        data.forEach(conexion => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${conexion.fecha_conexion ? conexion.fecha_conexion.replace('T', ' ').substring(0, 16) : ''}</td>
                <td>${conexion.id_contribuyente}</td>
                <td>${conexion.cuenta}</td>
                <td>${conexion.tipo}</td>
                <td>
                    <button class="btn-editar" data-id="${conexion.id_conexion}">Editar</button>
                    <button class="btn-eliminar" data-id="${conexion.id_conexion}">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // Buscar conexiones
    searchInput.addEventListener('input', () => {
        const value = searchInput.value.toLowerCase();
        const filtered = conexiones.filter(c =>
            (c.cuenta && c.cuenta.toLowerCase().includes(value)) ||
            (c.tipo && c.tipo.toLowerCase().includes(value)) ||
            (c.uso && c.uso.toLowerCase().includes(value)) ||
            (c.ubicacion && c.ubicacion.toLowerCase().includes(value)) ||
            (c.barrio && c.barrio.toLowerCase().includes(value)) ||
            (c.id_contribuyente && c.id_contribuyente.toString().includes(value))
        );
        renderTable(filtered);
    });

    // Enviar formulario (Agregar o Editar)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Ajustar formato de fecha para MySQL DATETIME
        if (data.fecha_conexion && data.fecha_conexion.length === 16) {
            data.fecha_conexion = data.fecha_conexion.replace('T', ' ') + ':00';
        }

        try {
            if (editingId) {
                // Editar
                const res = await fetch(`${apiUrl}/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (!res.ok) throw new Error('Error al actualizar');
            } else {
                // Agregar
                const res = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (!res.ok) throw new Error('Error al agregar');
            }
            modalOverlay.style.display = 'none';
            fetchConexiones();
        } catch (err) {
            alert('Error al guardar la conexión');
        }
    });

    // Delegación para editar y eliminar
    tableBody.addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn-editar')) {
            const id = e.target.dataset.id;
            try {
                const res = await fetch(`${apiUrl}/${id}`);
                if (!res.ok) throw new Error('No encontrado');
                const conexion = await res.json();
                // Llenar el formulario
                form.fecha_conexion.value = conexion.fecha_conexion ? conexion.fecha_conexion.substring(0, 16).replace(' ', 'T') : '';
                form.id_contribuyente.value = conexion.id_contribuyente;
                form.cuenta.value = conexion.cuenta;
                form.tipo.value = conexion.tipo;
                form.uso.value = conexion.uso;
                form.ubicacion.value = conexion.ubicacion;
                form.barrio.value = conexion.barrio;
                editingId = id;
                formTitle.textContent = 'Editar Conexión';
                btnAddOrUpdate.textContent = 'Actualizar';
                modalOverlay.style.display = 'flex';
            } catch (err) {
                alert('Error al cargar la conexión');
            }
        }
        if (e.target.classList.contains('btn-eliminar')) {
            const id = e.target.dataset.id;
            if (confirm('¿Seguro que deseas eliminar esta conexión?')) {
                try {
                    const res = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
                    if (!res.ok) throw new Error('Error al eliminar');
                    fetchConexiones();
                } catch (err) {
                    alert('Error al eliminar la conexión');
                }
            }
        }
    });

    // Inicializar
    fetchConexiones();
});