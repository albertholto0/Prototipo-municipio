function generarHoraAleatoria() {
    let horas = Math.floor(Math.random() * 12) + 1; // Genera de 1 a 12
    let minutos = Math.floor(Math.random() * 60);  // Genera de 0 a 59
    let periodo = Math.random() > 0.5 ? "AM" : "PM"; // Decide AM o PM aleatoriamente
    return `${horas}:${minutos.toString().padStart(2, '0')} ${periodo}`;
}

const usersTableBody = document.getElementById('users-table-body');
let users = [
    { id: 1, name: "Admin", role: "Administrador", accessTime: generarHoraAleatoria() },
    { id: 2, name: "Cajero", role: "Cajero", accessTime: generarHoraAleatoria() }
];

function renderUsersTable() {
    usersTableBody.innerHTML = '';
    users.forEach(user => {
        const row = document.createElement('tr');
        row.dataset.id = user.id;
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.role}</td>
            <td>${user.accessTime}</td>
            <td>
                <button class="modify" onclick="modifyUser(${user.id})">Modificar</button>
                <button class="delete" onclick="deleteUser(${user.id})">Eliminar</button>
            </td>
        `;
        usersTableBody.appendChild(row);
    });
}

function modifyUser(userId) {
    alert(`Modificar usuario con ID ${userId}`);
}

function deleteUser(userId) {
    users = users.filter(user => user.id !== userId);
    renderUsersTable();
}

renderUsersTable();