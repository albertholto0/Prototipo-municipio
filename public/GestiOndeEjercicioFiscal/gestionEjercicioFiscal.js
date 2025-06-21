document.addEventListener('DOMContentLoaded', () => {
  const tablaBody = document.querySelector('#fiscalTable tbody');

  const cargarEjercicioFiscal = async () => {
    try {
        const response = await fetch('/api/EjercicioFiscal', {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error del servidor:', errorData);
            throw new Error(`Error ${response.status}: ${errorData.message || 'Error desconocido'}`);
        }

        const ejercicios = await response.json();
        console.log('Datos recibidos:', ejercicios);
        
        // Resto del código...
    } catch (error) {
        console.error('Error completo:', error);
        tablaBody.innerHTML = '<tr><td colspan="8">Error al cargar los datos: ' + error.message + '</td></tr>';
    }
};
  cargarEjercicioFiscal();
});
