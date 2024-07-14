const URL = "https://sofiacuba.pythonanywhere.com/"


let isbn = '';
let titulo = '';
let paginas = '';
let precio = '';
let imagen_url = '';
let imagenSeleccionada = null;
let imagenUrlTemp = null;
let mostrarDatosLibro = false;

document.getElementById('form-obtener-libro').addEventListener('submit', obtenerLibro);
document.getElementById('form-guardar-cambios').addEventListener('submit', guardarCambios);
document.getElementById('nuevaImagen').addEventListener('change', seleccionarImagen);

function obtenerLibro(event) {
    event.preventDefault();
    isbn = document.getElementById('isbn').value;
    fetch(URL + 'libros/' + isbn)
        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error('Error al obtener los datos del libro.')
            }
        })
        .then(data => {
            titulo = data.titulo;
            paginas = data.paginas;
            precio = data.precio;
            imagen_url = data.imagen_url;
            mostrarDatosLibro = true; 
            mostrarFormulario();
        })
        .catch(error => {
            alert('Código no encontrado.');
        });
}


function mostrarFormulario() {
    if (mostrarDatosLibro) {
        document.getElementById('tituloModificar').value = titulo;
        document.getElementById('paginasModificar').value = paginas;
        document.getElementById('precioModificar').value = precio;

        const imagenActual = document.getElementById('imagen-actual');
        if (imagen_url && !imagenSeleccionada) { 

            imagenActual.src = 'https://www.pythonanywhere.com/user/SofiaCuba/files/home/SofiaCuba/mysite/static/imagen/' + imagen_url;                    
            

            imagenActual.style.display = 'block'; 
        } else {
            imagenActual.style.display = 'none'; 
        }

        document.getElementById('datos-libro').style.display = 'block';
    } else {
        document.getElementById('datos-libro').style.display = 'none';
    }
}

function seleccionarImagen(event) {
    const file = event.target.files[0];
    imagenSeleccionada = file;
    imagenUrlTemp = URL.createObjectURL(file); 

    const imagenVistaPrevia = document.getElementById('imagen-vista-previa');
    imagenVistaPrevia.src = imagenUrlTemp;
    imagenVistaPrevia.style.display = 'block';
}


function guardarCambios(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('isbn', isbn);
    formData.append('titulo', document.getElementById('tituloModificar').value);
    formData.append('paginas', document.getElementById('paginasModificar').value);
    formData.append('precio', document.getElementById('precioModificar').value);

    if (imagenSeleccionada) {
        formData.append('imagen', imagenSeleccionada, imagenSeleccionada.name);
    }

    fetch(URL + 'libros/' + isbn, {
        method: 'PUT',
        body: formData,
    })
        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error('Error al guardar los cambios del libro.')
            }
        })
        .then(data => {
            alert('Libro actualizado correctamente.');
            limpiarFormulario();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al actualizar el libro.');
        });
}

function limpiarFormulario() {
    document.getElementById('isbn').value = '';
    document.getElementById('tituloModificar').value = '';
    document.getElementById('paginasModificar').value = '';
    document.getElementById('precioModificar').value = '';
    document.getElementById('nuevaImagen').value = '';

    const imagenActual = document.getElementById('imagen-actual');
    imagenActual.style.display = 'none';

    const imagenVistaPrevia = document.getElementById('imagen-vista-previa');
    imagenVistaPrevia.style.display = 'none';

    isbn = '';
    titulo = '';
    paginas = '';
    precio = '';
    imagen_url = '';
    imagenSeleccionada = null;
    imagenUrlTemp = null;
    mostrarDatoslibro = false;

    document.getElementById('datos-libro').style.display = 'none';
}




