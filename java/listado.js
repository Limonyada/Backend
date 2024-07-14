const URL = "https://lucasacosta.pythonanywhere.com/"
//listado de libros

fetch(URL + 'libros') //http://127.0.0.1:5000/libros
            .then(function (response) {
                if (response.ok) {
            
                    return response.json(); 
            } else {
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
                        '<td><https://www.pythonanywhere.com/user/lucasacosta/files/home/lucasacosta/mysite/imgenesG/' + libro.imagen_url +' alt="Imagen del libro" style="width: 300px;"></td>';
                        //Al subir al servidor, deberá utilizarse la siguiente ruta. USUARIO debe ser reemplazado por el nombre de usuario de Pythonanywhere
                        //'<td><img src=https://www.pythonanywhere.com/user/USUARIO/files/home/USUARIO/mysite/static/imagenes/'
                    listalibros.appendChild(lis);

                }
            })
            .catch(function (error) {
            
                alert('Error al obtener los libros.');
            });