// script.js

// Función para abrir el formulario
function openForm() {
    document.getElementById("addForm").style.display = "block";
}

// Función para cerrar el formulario
function closeForm() {
    document.getElementById("addForm").style.display = "none";
}

// Función para agregar un contribuyente
function addContribuyente() {
    const nombre = document.getElementById("nombre").value;
    const rfc = document.getElementById("rfc").value;
    const cuenta = document.getElementById("cuenta").value;

    if (nombre && rfc && cuenta) {
        const table = document.getElementById("contribuyentesTable").getElementsByTagName("tbody")[0];
        const newRow = table.insertRow();

        newRow.innerHTML = `
            <td>${nombre}</td>
            <td>${rfc}</td>
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