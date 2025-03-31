// Elementos del DOM
const registerBtn = document.getElementById('registerBtn');
const usersContainer = document.getElementById('users-container');
const userModal = document.getElementById('userModal');
const deleteModal = document.getElementById('deleteModal');
const modalTitle = document.getElementById('modalTitle');
const userForm = document.getElementById('userForm');
const userNameInput = document.getElementById('userName');
const userPasswordInput = document.getElementById('userPassword');
const userRoleSelect = document.getElementById('userRole');
const userIdInput = document.getElementById('userId');
const photoInput = document.getElementById('userPhoto');
const closeModal = document.querySelectorAll('.close');
const deleteForm = document.getElementById('deleteForm');
const deletePassword = document.getElementById('deletePassword');
const deleteUserId = document.getElementById('deleteUserId');

// Datos de usuarios
let users = [
    { id: 1, name: "Administrador", role: "Administrador", photo: "fotos_perfil/foto_perfil.jpg" }
];
let currentUserId = 1;

// Event Listeners
registerBtn.addEventListener('click', openRegisterModal);

closeModal.forEach(btn => {
    btn.addEventListener('click', () => {
        userModal.style.display = 'none';
        deleteModal.style.display = 'none';
    });
});

window.addEventListener('click', (event) => {
    if (event.target === userModal) {
        userModal.style.display = 'none';
    }
    if (event.target === deleteModal) {
        deleteModal.style.display = 'none';
    }
});

userForm.addEventListener('submit', handleFormSubmit);
deleteForm.addEventListener('submit', handleDeleteSubmit);

// Delegación de eventos para botones dinámicos
usersContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete')) {
        openDeleteModal(e.target.closest('.user-card').dataset.id);
    } else if (e.target.classList.contains('modify')) {
        openEditModal(e.target.closest('.user-card').dataset.id);
    }
});

// Funciones
function openRegisterModal() {
    modalTitle.textContent = 'Registrar Nuevo Usuario';
    userForm.reset();
    userIdInput.value = '';
    userModal.style.display = 'block';
}

function openEditModal(userId) {
    const user = users.find(u => u.id == userId);
    if (user) {
        modalTitle.textContent = 'Modificar Usuario';
        userNameInput.value = user.name;
        userRoleSelect.value = user.role;
        userIdInput.value = user.id;
        userModal.style.display = 'block';
    }
}

function openDeleteModal(userId) {
    deleteUserId.value = userId;
    deleteModal.style.display = 'block';
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const userData = {
        name: userNameInput.value.trim(),
        role: userRoleSelect.value,
        photo: 'fotos_perfil/foto_perfil.jpg' // Foto por defecto
    };

    if (!userIdInput.value) {
        // Nuevo usuario
        currentUserId++;
        const newUser = {
            id: currentUserId,
            ...userData
        };
        users.push(newUser);
        renderUserCard(newUser);
    } else {
        // Editar usuario existente
        const userId = parseInt(userIdInput.value);
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            users[userIndex] = { id: userId, ...userData };
            updateUserCard(userId, userData);
        }
    }

    userModal.style.display = 'none';
}

function handleDeleteSubmit(e) {
    e.preventDefault();
    const userId = deleteUserId.value;
    
    users = users.filter(u => u.id != userId);
    document.querySelector(`.user-card[data-id="${userId}"]`)?.remove();
    deleteModal.style.display = 'none';
    deletePassword.value = '';
}

function renderUserCard(user) {
    const userCard = document.createElement('div');
    userCard.className = 'user-card';
    userCard.dataset.id = user.id;
    userCard.innerHTML = `
        <img src="${user.photo}" alt="Foto de perfil">
        <h2>${user.name}</h2>
        <p>${user.role}</p>
        <button class="modify">Modificar</button>
        <button class="delete">Eliminar</button>
    `;
    usersContainer.appendChild(userCard);
}

function updateUserCard(userId, userData) {
    const userCard = document.querySelector(`.user-card[data-id="${userId}"]`);
    if (userCard) {
        userCard.querySelector('h2').textContent = userData.name;
        userCard.querySelector('p').textContent = userData.role;
    }
}

// Renderizar usuarios iniciales
function renderInitialUsers() {
    usersContainer.innerHTML = '';
    users.forEach(user => {
        renderUserCard(user);
    });
}

// Inicializar
renderInitialUsers();