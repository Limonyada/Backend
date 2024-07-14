const URL = "http://127.0.0.1:5000/"
//listado de libros

fetch(URL + 'libros') //http://127.0.0.1:5000/libros
            .then(function (response) {
                if (response.ok) {
                    //Si la respuesta es exitosa (response.ok), convierte el cuerpo de la respuesta de formato JSON a un objeto JavaScript y pasa estos datos a la siguiente promesa then.
                    return response.json(); 
            } else {
                    // Si hubo un error, lanzar explícitamente una excepción para ser "catcheada" más adelante
                    throw new Error('Error al obtener los os.');
                }
            })

            .then(function (datos) {
                let listalibros = document.getElementById('listalibros');

                for (let libro of datos) {
                    let lis = document.createElement('tr'); 
                    lis.innerHTML = '<td>' + libro.isbn + '</td>' +
                        '<td>' + libro.titulo+ '</td>' +
                        '<td>' + libro.paginas + '</td>' +
                        '<td>' + libro.precio + '</td>' +
                        '<td><img src=static/imagenes/' + libro.imagen_url +' alt="Imagen del libro" style="width: 300px;"></td>';
                
                        //Al subir al servidor, deberá utilizarse la siguiente ruta. USUARIO debe ser reemplazado por el nombre de usuario de Pythonanywhere
                        //'<td><img src=https://www.pythonanywhere.com/user/USUARIO/files/home/USUARIO/mysite/static/imagenes/' + libro.imagen_url +' alt="Imagen del libro" style="width: 100px;"></td>' + '<td align="right">' + libro.proveedor + '</td>';
                    listalibros.appendChild(lis);

                }
            })
            .catch(function (error) {
                // Código para manejar errores
                alert('Error al obtener los libros.');
            });