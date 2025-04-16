// Control del modal
const modal = document.getElementById('modalConcepto');
const btnAgregarConcepto = document.getElementById('btnAgregarConcepto');
const btnCancelarModal = document.getElementById('btnCancelarModal');

// Abrir modal para agregar nuevo concepto
btnAgregarConcepto.addEventListener('click', () => {
    document.getElementById('modalTitle').textContent = 'Nuevo Concepto';
    document.getElementById('conceptForm').reset();
    document.getElementById('id_concepto').value = '';
    modal.style.display = 'block';
});

// Cerrar modal
btnCancelarModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Cerrar modal al hacer clic fuera del contenido
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Manejar el envío del formulario
document.getElementById('conceptForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar el concepto
    console.log('Formulario enviado');
    
    // Cerrar el modal después de guardar
    modal.style.display = 'none';
});

// Nota: Aquí deberías agregar la lógica para:
// 1. Cargar los datos en la tabla
// 2. Manejar la edición de conceptos
// 3. Manejar la búsqueda/filtrado
// 4. Cargar las opciones de los select (secciones, cuentas contables)