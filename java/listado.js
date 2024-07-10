const URL = "http://127.0.0.1:5000/"
//listado

fetch(URL + 'libros') //http://127.0.0.1:5000/libros
            .then(function (response) {
                if (response.ok) {
                    //Si la respuesta es exitosa (response.ok), convierte el cuerpo de la respuesta de formato JSON a un objeto JavaScript y pasa estos datos a la siguiente promesa then.
                    return response.json(); 
            } else {
                    // Si hubo un error, lanzar explícitamente una excepción para ser "catcheada" más adelante
                    throw new Error('Error al obtener los libros.');
                }
            })

            .then(function (datos) {
                let listalibros = document.getElementById('listalibros');

                for (let libro of datos) {
                    let lis = document.createElement('ol'); 
                    lis.innerHTML = '<li>' + libro.isbn + '</li>' +
                        '<li>' + libro.titulo+ '</li>' +
                        '<li>' + libro.paginas + '</li>' +
                        '<li>' + libro.precio + '</li>' +
                        '<li><img src=static/imagenes/' + libro.imagen_url +' alt="Imagen del libro" style="width: 300px;"></li>';
                
                        //Al subir al servidor, deberá utilizarse la siguiente ruta. USUARIO debe ser reemplazado por el nombre de usuario de Pythonanywhere
                        //'<td><img src=https://www.pythonanywhere.com/user/USUARIO/files/home/USUARIO/mysite/static/imagenes/' + libro.imagen_url +' alt="Imagen del libro" style="width: 100px;"></td>' + '<td align="right">' + libro.proveedor + '</td>';
                    listalibros.appendChild(lis);

                }
            })

            .catch(function (error) {
                // Código para manejar errores
                alert('Error al obtener los libros.');
            });

function eliminarlibro(isbn) {
            // Se muestra un diálogo de confirmación. Si el usuario confirma, se realiza una solicitud DELETE al servidor a través de fetch(URL + 'libros/${isbn}', {method: 'DELETE' }).
            if (confirm('¿Estás seguro de que quieres eliminar este libro?')) {
                fetch(URL + `libros/${isbn}`, { method: 'DELETE' })
                    .then(response => {
                        if (response.ok) {
                            // Si es exitosa (response.ok), elimina el libro y da mensaje de ok.
                            obtenerlibros(); // Vuelve a obtener la lista de libros para actualizar la tabla.
                            alert('libro eliminado correctamente.');
                        }
                    })
                    // En caso de error, mostramos una alerta con un mensaje de error.
                    .catch(error => {
                        alert(error.message);
                    });
            }
        }

        // Cuando la página se carga, llama a obtenerlibros para cargar la lista de libros.
        document.addEventListener('DOMContentLoaded', obtenerlibros);