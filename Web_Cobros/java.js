// script.js

// Función para abrir el formulario
function openForm() {
    document.getElementById("addForm").style.display = "block";
    document.getElementById("overlay").style.display = "block";
    // Para evitar scroll en el fondo
    document.body.style.overflow = "hidden";
}

function closeForm() {
    document.getElementById("addForm").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    // Restaurar el scroll del body
    document.body.style.overflow = "auto";
}

// Función para agregar un contribuyente
function addContribuyente() {
    const nombre = document.getElementById("nombre").value;
    const apellido_paterno = document.getElementById("apellido_paterno").value;
    const apellido_materno = document.getElementById("apellido_materno").value;
    const rfc = document.getElementById("rfc").value;
    const calle = document.getElementById("calle").value;
    const numero_calle = document.getElementById("numero_calle").value;
    const colonia = document.getElementById("colonia").value;
    const telefono = document.getElementById("telefono").value;
    const cuenta = document.getElementById("cuenta").value;

    if (nombre && apellido_paterno && apellido_materno && rfc && calle && numero_calle && colonia && telefono && cuenta) {
        const table = document.getElementById("contribuyentesTable").getElementsByTagName("tbody")[0];
        const newRow = table.insertRow();

        newRow.innerHTML = `
            <td>${nombre} ${apellido_paterno} ${apellido_materno}</td>
            <td>${rfc}</td>
            <td>${calle} ${numero_calle} ${colonia}</td>
            <td>${telefono}</td>
            <td>${cuenta}</td>
            <td class="action-buttons-table">
                <button onclick="editRow(this)">Editar</button>
                <button onclick="deleteRow(this)">Eliminar</button>
            </td>
        `;

        closeForm();
    } else {
        alert("Por favor, complete todos los campos.");
    }
}

// Función para eliminar una fila
function deleteRow(button) {
    const row = button.parentElement.parentElement;
    row.remove();
}

// Función para editar una fila
function editRow(button) {
    const row = button.parentElement.parentElement;
    const cells = row.getElementsByTagName("td");

    const nombre = cells[0].innerText;
    const rfc = cells[1].innerText;
    const cuenta = cells[2].innerText;

    document.getElementById("nombre").value = nombre;
    document.getElementById("rfc").value = rfc;
    document.getElementById("cuenta").value = cuenta;

    openForm();
    deleteRow(button); // Elimina la fila actual para reemplazarla con los nuevos datos
}