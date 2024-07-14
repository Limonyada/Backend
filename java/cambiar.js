const URL = "http://127.0.0.1:5000/"

let isbn = '';
let descripcion = '';
let cantidad = '';
let precio = '';
let imagen_url = '';
let imagenSeleccionada = null;
let imagenUrlTemp = null;
let mostrarDatoslibro = false;

document.getElementById('form-obtener-libro').addEventListener('submit', obtenerlibro);
document.getElementById('form-guardar-cambios').addEventListener('submit', guardarCambios);
document.getElementById('nuevaImagen').addEventListener('change', seleccionarImagen);

        // Se ejecuta cuando se envía el formulario de consulta. Realiza una solicitud GET a la API y obtiene los datos del libro correspondiente al código ingresado.
function obtenerlibro(event) {
    event.preventDefault();
    isbn = document.getElementById('isbn');
    fetch(URL + `libros/` +isbn) //http://127.0.0.1:5000/libros
            .then(function (response) {
                if (response.ok) {
                    //Si la respuesta es exitosa (response.ok), convierte el cuerpo de la respuesta de formato JSON a un objeto JavaScript y pasa estos datos a la siguiente promesa then.
                    return response.json(); 
            } else {
                    // Si hubo un error, lanzar explícitamente una excepción para ser "catcheada" más adelante
                    throw new Error('Error al obtener los libros.');
                }
            })
            .then(data => {
            titulo = data.titulo;
            paginas = data.paginas;
            precio = data.precio;
            imagen_url = data.imagen_url;
            mostrarDatoslibro = true; //Activa la vista del segundo formulario
            mostrarFormulario();
            })
            .catch(error => {
                alert('Código no  encontrado.');
            });
    }

        // Muestra el formulario con los datos del libro
        function mostrarFormulario() {
            if (mostrarDatoslibro) {
                document.getElementById('tituloModificar').value = titulo;
                document.getElementById('paginasModificar').value = paginas;
                document.getElementById('precioModificar').value = precio;

                const imagenActual = document.getElementById('imagen-actual');
                if (imagen_url && !imagenSeleccionada) { // Verifica si imagen_url no está vacía y no se ha seleccionado una imagen

                    imagenActual.src = './static/imagenes/' + imagen_url;                    
                    
                    //Al subir al servidor, deberá utilizarse la siguiente ruta. USUARIO debe ser reemplazado por el nombre de usuario de Pythonanywhere
                    //imagenActual.src = 'https://www.pythonanywhere.com/user/USUARIO/files/home/USUARIO/mysite/static/imagenes/' + imagen_url;

                    imagenActual.style.display = 'block'; // Muestra la imagen actual
                } else {
                    imagenActual.style.display = 'none'; // Oculta la imagen si no hay URL
                }

                document.getElementById('datos-libro').style.display = 'block';
            } else {
                document.getElementById('datos-libro').style.display = 'none';
            }
        }

        // Se activa cuando el usuario selecciona una imagen para cargar.
        function seleccionarImagen(event) {
            const file = event.target.files[0];
            imagenSeleccionada = file;
            imagenUrlTemp = URL.createObjectURL(file); // Crea una URL temporal para la vista previa

            const imagenVistaPrevia = document.getElementById('imagen-vista-previa');
            imagenVistaPrevia.src = imagenUrlTemp;
            imagenVistaPrevia.style.display = 'block';
        }

        // Se usa para enviar los datos modificados del libro al servidor.
        function guardarCambios(event) {
            event.preventDefault();

            const formData = new FormData();
            formData.append('isbn', isbn);
            formData.append('titulo', document.getElementById('tituloModificar').value);
            formData.append('paginas', document.getElementById('paginasModificar').value);
            formData.append('precio', document.getElementById('precioModificar').value);

            // Si se ha seleccionado una imagen nueva, la añade al formData. 
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
                    alert('libro actualizado correctamente.');
                    limpiarFormulario();
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error al actualizar el libro.');
                });
        }

        // Restablece todas las variables relacionadas con el formulario a sus valores iniciales, lo que efectivamente "limpia" el formulario.
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
            descripcion = '';
            cantidad = '';
            precio = '';
            imagen_url = '';
            imagenSeleccionada = null;
            imagenUrlTemp = null;
            mostrarDatoslibro = false;

            document.getElementById('datos-libro').style.display = 'none';
        }