// Cargar CSS dinámicamente
const injectStyles = () => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/Componentes/Nav.css'; // Ajusta la ruta según tu estructura
    document.head.appendChild(link);
};

// Cargar HTML dinámicamente
const injectHTML = async () => {
    try {
        const response = await fetch('/Componentes/Nav.html'); // Ajusta la ruta
        const html = await response.text();
        const placeholder = document.getElementById('nav-placeholder');
        if (placeholder) placeholder.innerHTML = html;
    } catch (error) {
        console.error('Error cargando el nav:', error);
    }
};

// Inicializar todo
document.addEventListener('DOMContentLoaded', () => {
    injectStyles();
    injectHTML();
});