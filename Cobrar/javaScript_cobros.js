// Folio (temporal, lo ideal es jalar de la bd)
document.addEventListener('DOMContentLoaded', function() {
    let folio = sessionStorage.getItem('ultimoFolio');
    if (!folio) {
        folio = 1;
    } else {
        folio = parseInt(folio) + 1;
    }
    sessionStorage.setItem('ultimoFolio', folio);
    document.getElementById('folio').value = `REC-${folio.toString().padStart(4, '0')}`;
});

// Obtener la fecha actual en el campo fecha del recibo
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0'); // Meses son 0-11
const dd = String(today.getDate()).padStart(2, '0');

document.getElementById('fecha').value = `${yyyy}-${mm}-${dd}`; // Agrega la fecha
document.getElementById('ejercicioFiscal').value = `${yyyy}`; // Agrega el año al ejercicio fiscal

// Convertir subtotal a letras
document.getElementById('subtotal').addEventListener('input', function() {
    const numero = parseFloat(this.value.replace(/,/g, '')) || 0;
    const cantidadEnLetras = numeroALetras(numero);
    // Capitalizar la primera letra de toda la cadena
    document.getElementById('cantidadLetra').value = capitalizarTodasPalabras(numeroALetras(numero));
});

// Función para capitalizar la primera letra de una cadena
function capitalizarTodasPalabras(str) {
    return str.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Función para convertir números a letras (soporta hasta millones)
function numeroALetras(numero) {
    const unidades = ['', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
    const decenas = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 
                    'diecisiete', 'dieciocho', 'diecinueve', 'veinte', 'treinta', 'cuarenta', 
                    'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
    const centenas = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 
                    'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
    
    if (numero === 0) return 'cero pesos mexicanos';
    
    let resultado = '';
    const entero = Math.floor(numero);
    const decimal = Math.round((numero - entero) * 100);
    
    if (entero > 0) {
        if (entero >= 1000000) {
            const millones = Math.floor(entero / 1000000);
            resultado += (millones === 1 ? 'un millón ' : numeroALetras(millones) + ' millones ');
        }
        
        const miles = entero % 1000000;
        if (miles >= 1000) {
            const mil = Math.floor(miles / 1000);
            resultado += (mil === 1 ? 'mil ' : numeroALetras(mil) + ' mil ');
        }
        
        const resto = miles % 1000;
        if (resto > 0) {
            const c = Math.floor(resto / 100);
            if (c > 0) resultado += centenas[c] + ' ';
            
            const d = resto % 100;
            if (d >= 10 && d <= 20) {
                resultado += decenas[d - 10] + ' ';
            } else if (d > 20) {
                const di = Math.floor(d / 10);
                resultado += decenas[di + 8] + ' ';
                const u = d % 10;
                if (u > 0) resultado += 'y ' + unidades[u] + ' ';
            } else if (d > 0) {
                resultado += unidades[d] + ' ';
            }
        }
    }
    
    if (decimal > 0) {
        resultado += 'con ' + (decimal < 10 ? '0' + decimal : decimal) + '/100';
    }
    
    return resultado.trim() + (numero === 1 ? ' peso mexicano' : ' pesos mexicanos');
}

// Lógica para el iniciar la caja
document.addEventListener("DOMContentLoaded", () => {
  const modalApertura = document.getElementById("modalAperturaCaja");
  const btnConfirmar = document.getElementById("btnConfirmarApertura");

  // Verificar si ya hay apertura (ejemplo con localStorage)
  if (!localStorage.getItem("cajaAbierta")) {
    modalApertura.style.display = "flex"; // Mostrar modal
    document.getElementById("receiptForm").style.opacity = "0.5"; // Bloquear formulario
  }

  // Confirmar apertura
  btnConfirmar.addEventListener("click", () => {
    const monto = parseFloat(document.getElementById("montoInicialCaja").value);
    if (monto >= 0) {
      localStorage.setItem("cajaAbierta", true);
      localStorage.setItem("montoInicial", monto);
      modalApertura.style.display = "none";
      document.getElementById("receiptForm").style.opacity = "1"; // Habilitar formulario
    } else {
      alert("Ingrese una cantidad correcta por favor");
    }
  });
});