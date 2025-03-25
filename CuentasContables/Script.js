// Array para simular la base de datos de cuentas contables
let cuentasContables = [
    {
        numeroCuenta: "1000-01",
        descripcion: "Caja General",
        seccion: "1",
        ejercicio: "2023"
    }
];

// Referencias a elementos del DOM
const accountsTableBody = document.querySelector("#accountsTable tbody");
const searchInput = document.getElementById("searchInput");
const accountForm = document.getElementById("accountForm");
const idCuentaContableInput = document.getElementById("idCuentaContable");
const numeroCuentaInput = document.getElementById("numeroCuenta");
const descripcionInput = document.getElementById("descripcion");
const seccionInput = document.getElementById("seccion");
const ejercicioInput = document.getElementById("ejercicio");
const btnAddOrUpdate = document.getElementById("btnAddOrUpdate");
const btnCancel = document.getElementById("btnCancel");

// Variables para controlar la edición
let isEditing = false;
let currentIndex = null;

// Renderizar la tabla
function renderTable(data) {
    accountsTableBody.innerHTML = "";
    data.forEach((cuenta, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${cuenta.numeroCuenta}</td>
            <td>${cuenta.descripcion}</td>
            <td>${cuenta.seccion}</td>
            <td>${cuenta.ejercicio}</td>
            <td>
                <button class="action-btn edit" onclick="editAccount(${index})">Editar</button>
                <button class="action-btn delete" onclick="deleteAccount(${index})">Eliminar</button>
            </td>
        `;
        accountsTableBody.appendChild(row);
    });
}

// Búsqueda por número de cuenta o descripción
function searchAccounts() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const filtered = cuentasContables.filter(cuenta =>
        cuenta.numeroCuenta.toLowerCase().includes(searchTerm) ||
        cuenta.descripcion.toLowerCase().includes(searchTerm)
    );
    renderTable(filtered);
}

// Crear cuenta nueva
function addAccount() {
    const newAccount = {
        numeroCuenta: numeroCuentaInput.value,
        descripcion: descripcionInput.value,
        seccion: seccionInput.value,
        ejercicio: ejercicioInput.value
    };
    cuentasContables.push(newAccount);
}

// Actualizar cuenta existente
function updateAccount(index) {
    cuentasContables[index].numeroCuenta = numeroCuentaInput.value;
    cuentasContables[index].descripcion = descripcionInput.value;
    cuentasContables[index].seccion = seccionInput.value;
    cuentasContables[index].ejercicio = ejercicioInput.value;
}

// Función para editar (carga los datos en el formulario)
window.editAccount = function (index) {
    isEditing = true;
    currentIndex = index;
    const cuenta = cuentasContables[index];

    numeroCuentaInput.value = cuenta.numeroCuenta;
    descripcionInput.value = cuenta.descripcion;
    seccionInput.value = cuenta.seccion;
    ejercicioInput.value = cuenta.ejercicio;

    // Actualizar título del formulario y texto del botón
    formTitle.textContent = "Editar Cuenta Contable";
    btnAddOrUpdate.textContent = "Actualizar";
};

// Función para eliminar
window.deleteAccount = function (index) {
    // RF-16: Eliminar solo si no tiene llaves foráneas.
    // Para el ejemplo, asumimos que no hay llaves foráneas asociadas.
    if (confirm("¿Desea eliminar esta cuenta contable?")) {
        cuentasContables.splice(index, 1);
        renderTable(cuentasContables);
    }
};

// Manejo del submit del formulario
accountForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (isEditing) {
        updateAccount(currentIndex);
    } else {
        addAccount();
    }
    resetForm();
    renderTable(cuentasContables);
});

// Función para resetear el formulario y restablecer título y botón
function resetForm() {
    accountForm.reset();
    isEditing = false;
    currentIndex = null;
    formTitle.textContent = "Registrar Cuenta Contable";
    btnAddOrUpdate.textContent = "Agregar";
}

// Botón cancelar
btnCancel.addEventListener("click", () => {
    resetForm();
});

// Búsqueda en tiempo real
searchInput.addEventListener("input", searchAccounts);

// Inicializar tabla
renderTable(cuentasContables);
