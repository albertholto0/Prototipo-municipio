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
const userPasswordInput = document.getElementById('userPassword');
const userRoleInput = document.getElementById('userRole');
// const userPhotoInput = document.getElementById('userPhoto');
const deleteUserIdInput = document.getElementById('deleteUserId');
const deletePasswordInput = document.getElementById('deletePassword');

let users = [
    { id: 1, name: "Diana", lastName: "Luna", role: "Administrador", password: "1234", active: true, accessTime: generarHoraAleatoria() },
    { id: 2, name: "Alberto", lastName: "Contreras", role: "Cajero", password: "1234", active: true, accessTime: generarHoraAleatoria() }
];

function generarHoraAleatoria() {
    let horas = Math.floor(Math.random() * 12) + 1; // Genera de 1 a 12
    let minutos = Math.floor(Math.random() * 60);  // Genera de 0 a 59
    let periodo = Math.random() > 0.5 ? "AM" : "PM"; // Decide AM o PM aleatoriamente
    return `${horas}:${minutos.toString().padStart(2, '0')} ${periodo}`;
}

function renderUsersTable() {
    usersTableBody.innerHTML = '';
    users.forEach(user => {
        const row = document.createElement('tr');
        row.dataset.id = user.id;
        row.innerHTML = `
            <td>${user.name} ${user.lastName}</td>
            <td>${user.role}</td>
            <td>${user.accessTime}</td>
            <td>
                <button class="modify" onclick="openModifyModal(${user.id})">Modificar</button>
                <button class="delete" onclick="openDeleteModal(${user.id})">Eliminar</button>
            </td>
        `;
        usersTableBody.appendChild(row);
    });
}

function openAddModal() {
    modalTitle.textContent = "Registrar Nuevo Usuario";
    userIdInput.value = '';
    userNameInput.value = '';
    userLastNameInput.value = '';
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
    const password = userPasswordInput.value;
    const role = userRoleInput.value;
    const active = true;

    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex > -1) {
        users[userIndex] = { id, name, lastName, role, password, active, accessTime: users[userIndex].accessTime };
    } else {
        users.push({ id, name, lastName, role, password, active, accessTime: generarHoraAleatoria() });
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
renderUsersTable();