document.addEventListener("DOMContentLoaded", function () {
    const modalOverlay = document.getElementById("modalOverlay");
    const btnCloseModal = document.getElementById("btnCloseModal");
    const btnCancel = document.getElementById("btnCancel");
    const accountForm = document.getElementById("accountForm");
    const btnAddOrUpdate = document.getElementById("btnAddOrUpdate");
    const btnOpenModal = document.getElementById("btnOpenModal");
    const accountsTableBody = document.querySelector("#accountsTable tbody");
    const searchInput = document.getElementById("searchInput"); // Campo de búsqueda

    // Función para abrir el modal
    function openModal() {
        modalOverlay.style.display = "flex";
    }

    // Función para cerrar el modal
    function closeModal() {
        modalOverlay.style.display = "none";
        resetForm();
    }

    // Función para limpiar los campos del formulario
    function resetForm() {
        accountForm.reset();
    }

    // Asignar eventos de clic a los botones de cerrar y cancelar
    btnCloseModal.addEventListener("click", closeModal);
    btnCancel.addEventListener("click", closeModal);
    btnOpenModal.addEventListener("click", openModal);

    // Evento para agregar datos a la tabla
    accountForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita el envío tradicional del formulario

        // Obtener valores del formulario
        const numeroAlquiler = document.getElementById("numeroAlquiler").value;
        const descripcion = document.getElementById("descripcion").value.toLowerCase();
        const ubicacion = document.getElementById("ubicacion").value;
        const fechaInicio = document.getElementById("fechaInicio").value;
        const fechaCierre = document.getElementById("fechaCierre").value;
        const montoFinal = document.getElementById("montoFinal").value;
        const estadoAlquiler = document.getElementById("estadoAlquiler").value.toLowerCase();
        const idContribuyente = document.getElementById("idContribuyente").value.toLowerCase();
        const conceptoContribuyente = document.getElementById("conceptoContribuyente").value.toLowerCase();

        // Crear una nueva fila en la tabla
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${numeroAlquiler}</td>
            <td>${descripcion}</td>
            <td>${ubicacion}</td>
            <td>${fechaInicio}</td>
            <td>${fechaCierre}</td>
            <td>${montoFinal}</td>
            <td>${estadoAlquiler}</td>
            <td>${idContribuyente}</td>
            <td>${conceptoContribuyente}</td>
        `;

        // Agregar la fila a la tabla
        accountsTableBody.appendChild(newRow);

        // Reiniciar formulario y cerrar modal
        resetForm();
        closeModal();
    });

    // FUNCIONALIDAD DE BÚSQUEDA
    searchInput.addEventListener("input", function () {
        const filter = searchInput.value.toLowerCase();
        const rows = accountsTableBody.getElementsByTagName("tr");

        for (let row of rows) {
            const cells = row.getElementsByTagName("td");
            const descripcion = cells[1].textContent.toLowerCase();
            const estadoAlquiler = cells[6].textContent.toLowerCase();
            const idContribuyente = cells[7].textContent.toLowerCase();
            const conceptoContribuyente = cells[8].textContent.toLowerCase();
            const fechaInicio = cells[3].textContent;
            const fechaCierre = cells[4].textContent;

            // Verificar si el filtro coincide con algún campo
            const matchesFilter =
                descripcion.includes(filter) ||
                estadoAlquiler.includes(filter) ||
                idContribuyente.includes(filter) ||
                conceptoContribuyente.includes(filter);

            // Filtrar por rango de fechas si el usuario ingresa una fecha en el formato YYYY-MM-DD
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (dateRegex.test(filter)) {
                matchesFilter =
                    (fechaInicio >= filter && fechaCierre >= filter) || matchesFilter;
            }

            // Mostrar u ocultar filas según la búsqueda
            row.style.display = matchesFilter ? "" : "none";
        }
    });
    
});
