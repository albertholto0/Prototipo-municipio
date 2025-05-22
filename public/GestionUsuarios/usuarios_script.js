const usersTableBody = document.getElementById('users-table-body');
const userModal = document.getElementById('userModal');
const deleteModal = document.getElementById('deleteModal');
const userForm = document.getElementById('userForm');
const deleteForm = document.getElementById('deleteForm');
const registerBtn = document.getElementById('registerBtn');
const modalTitle = document.getElementById('modalTitle');
const userIdInput = document.getElementById('userId');
const userNameInput = document.getElementById('userName');
const userLastNameInput = document.getElementById('userLastName');
const userUsernameInput = document.getElementById('userUsername');
const userPasswordInput = document.getElementById('userPassword');
const searchInput = document.getElementById("searchInput");
const userRoleInput = document.getElementById('userRole');
// const userPhotoInput = document.getElementById('userPhoto');
const deleteUserIdInput = document.getElementById('deleteUserId');
const deletePasswordInput = document.getElementById('deletePassword');

let users = [
    { id: 1, name: "Diana", lastName: "Luna", username: "dianaLuher", role: "Administrador", password: "1234", active: true, accessDate: generarFechaAleatoria(), accessTime: generarHoraAleatoria() },
    { id: 2 , name: "Juan", lastName: "Pérez", username: "juanperez", role: "Cajero", password: "1234", active: true, accessDate: generarFechaAleatoria(), accessTime: generarHoraAleatoria() },
    { id: 3, name: "María", lastName: "Gómez", username: "mariagomez", role: "Cajero", password: "1234", active: false, accessDate: generarFechaAleatoria(), accessTime: generarHoraAleatoria() },
    { id: 4, name: "Carlos", lastName: "López", username: "carloslopez", role: "Administrador", password: "1234", active: true, accessDate: generarFechaAleatoria(), accessTime: generarHoraAleatoria() },
    { id: 5, name: "Ana", lastName: "Martínez", username: "anamartinez", role: "Cajero", password: "1234", active: false, accessDate: generarFechaAleatoria(), accessTime: generarHoraAleatoria() },
];

function generarFechaAleatoria() {
    let dia = Math.floor(Math.random() * 28) + 1;
    let mes = Math.floor(Math.random() * 12) + 1;
    let anio = Math.floor(Math.random() * 3) + 2023;
    return `${anio}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
}

function generarHoraAleatoria() {
    let horas = Math.floor(Math.random() * 12) + 1; 
    let minutos = Math.floor(Math.random() * 60);  
    let periodo = Math.random() > 0.5 ? "AM" : "PM"; 
    return `${horas}:${minutos.toString().padStart(2, '0')} ${periodo}`;
}

function renderUsersTable() {
    usersTableBody.innerHTML = '';
    users.forEach(user => {
        const row = document.createElement('tr');
        row.dataset.id = user.id;
        row.innerHTML = `
            <td>${user.name} ${user.lastName}</td>
            <td>${user.username}</td>
            <td>${user.role}</td>
            <td>${user.accessDate}</td>
            <td>${user.accessTime}</td>
            <td>${user.active ? 'Activo' : 'Inactivo'}</td>
            <td>
                <button class="action-btn modify" onclick="openModifyModal(${user.id})">
                    <img src="/public/Assets/editor.png" alt="Modificar" class="action-icon">
                </button>
                <button class="action-btn delete" onclick="openDeleteModal(${user.id})">
                    <img src="/public/Assets/eliminar.png" alt="Eliminar" class="action-icon">
                </button>
            </td>
        `;
        usersTableBody.appendChild(row);
    });
}

// Función para filtrar y renderizar usuarios
function filterUsers(filterType) {
    let filteredUsers = [...users];

    if (filterType === 'active') {
        filteredUsers = users.filter(user => user.active);
    } else if (filterType === 'inactive') {
        filteredUsers = users.filter(user => !user.active);
    }

    renderFilteredUsersTable(filteredUsers);
}

// Renderizar tabla con usuarios filtrados
function renderFilteredUsersTable(filteredUsers) {
    usersTableBody.innerHTML = '';
    filteredUsers.forEach(user => {
        const row = document.createElement('tr');
        row.dataset.id = user.id;
        row.innerHTML = `
            <td>${user.name} ${user.lastName}</td>
            <td>${user.username}</td>
            <td>${user.role}</td>
            <td>${user.accessDate}</td>
            <td>${user.accessTime}</td>
            <td>${user.active ? 'Activo' : 'Inactivo'}</td>
            <td>
                <button class="action-btn modify" onclick="openModifyModal(${user.id})">
                    <img src="/Assets/editor.png" alt="Modificar" class="action-icon">
                </button>
                <button class="action-btn delete" onclick="openDeleteModal(${user.id})">
                    <img src="/Assets/eliminar.png" alt="Eliminar" class="action-icon">
                </button>
            </td>
        `;
        usersTableBody.appendChild(row);
    });
}

// Búsqueda en tiempo real
searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term) ||
        user.username.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term)
    );
    renderFilteredUsersTable(filteredUsers);
});

function openAddModal() {
    modalTitle.textContent = "Registrar Nuevo Usuario";
    userIdInput.value = '';
    userNameInput.value = '';
    userLastNameInput.value = '';
    userUsernameInput.value = '';
    userPasswordInput.value = '';
    userRoleInput.value = '';
    // userPhotoInput.value = '';
    userModal.style.display = 'block';
}

function openModifyModal(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    modalTitle.textContent = "Modificar Usuario";
    userIdInput.value = user.id;
    userNameInput.value = user.name;
    userLastNameInput.value = user.lastName;
    userPasswordInput.value = user.password;
    userRoleInput.value = user.role;
    userModal.style.display = 'block';
}

function openDeleteModal(userId) {
    deleteUserIdInput.value = userId;
    deleteModal.style.display = 'block';
}

function closeModal(modal) {
    modal.style.display = 'none';
}

userForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = userIdInput.value ? parseInt(userIdInput.value) : Date.now();
    const name = userNameInput.value;
    const lastName = userLastNameInput.value;
    const username = userUsernameInput.value;
    const password = userPasswordInput.value;
    const role = userRoleInput.value;
    const active = true;

    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex > -1) {
        users[userIndex] = { id, name, lastName, username, role, password, active, accessTime: users[userIndex].accessTime };
    } else {
        users.push({ id, name, lastName, username, role, password, active, accessTime: generarHoraAleatoria() });
    }

    renderUsersTable();
    closeModal(userModal);
});

deleteForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const userId = parseInt(deleteUserIdInput.value);
    const password = deletePasswordInput.value;
    if (password === "admin123") {
        users = users.filter(user => user.id !== userId);
        renderUsersTable();
        closeModal(deleteModal);
    } else {
        alert("Contraseña incorrecta");
    }
});

document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        closeModal(userModal);
        closeModal(deleteModal);
    });
});

registerBtn.addEventListener('click', openAddModal);
const cancelBtn = document.querySelector('.cancel-btn');
cancelBtn.addEventListener('click', () => {
    userModal.style.display = 'none'; // Ocultar el modal
});

const cancelDeleteBtn = document.querySelector('.cancel-btn-delete');
cancelDeleteBtn.addEventListener('click', () => {
    deleteModal.style.display = 'none'; // Ocultar el modal de eliminación
});

window.addEventListener('click', (event) => {
    if (event.target === userModal) {
        userModal.style.display = 'none';
    }
    if (event.target === deleteModal) {
        deleteModal.style.display = 'none';
    }
});

renderUsersTable();