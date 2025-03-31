// Elementos del DOM
const registerBtn = document.getElementById('registerBtn');
const userModal = document.getElementById('userModal');
const deleteModal = document.getElementById('deleteModal');
const closeModal = document.querySelectorAll('.close');

// Event Listeners
registerBtn.addEventListener('click', () => {
    userModal.style.display = 'block';
});

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