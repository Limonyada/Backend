const URL = "https://sofiacuba.pythonanywhere.com/"


fetch(URL + 'libros') 
    .then(function (response) {
        if (response.ok) {
            return response.json(); 
    } else {
            throw new Error('Error al obtener los libros.');
        }
    })

    .then(function (data) {
        let tablaLibros = document.getElementById('tablaLibros'); //Selecciona el elemento del DOM donde se mostrarán los libros.

        for (let libro of data) {
            let fila = document.createElement('tr'); //Crea una nueva fila de  (<tr>) para cada libro.
            fila.innerHTML = '<td>' + libro.isbn + '</td>' +
                '<td>' + libro.titulo + '</td>' +
                '<td align="center">' + libro.paginas + '</td>' +
                '<td align="right">' + libro.precio + '</td>' +
                '<td><img src= https://www.pythonanywhere.com/user/SofiaCuba/files/home/SofiaCuba/mysite/static/imagen/' + libro.imagen_url +' alt="Imagen del libro" style="width: 100px;"></td>' + '<td align="right">'  + '</td>';
                
            
            tablaLibros.appendChild(fila);
        }
    })

    .catch(function (error) {
        alert('Error al obtener los libros.');
    });