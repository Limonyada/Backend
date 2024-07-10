const URL = "http://127.0.0.1:5000/"

        
function obtenerlibros() {
    fetch(URL + 'libros')
        .then(resp => {
            if (resp.ok) { 
                return resp.json(); }
        })
        
        .then(data => {                       //modificar segun id y elemento name
            const librosTable = document.getElementById('libros-table').getElementsByTagName('tbody')[0];
            librosTable.innerHTML = '';
            data.forEach(libro => {
                const row = librosTable.insertRow();
                row.innerHTML = `
                    <td>${libro.isbn}</td>
                    <td>${libro.titulo}</td>
                    <td>${libro.paginas}</td>
                    <td align="right">${libro.precio}</td>
                    <td><button onclick="eliminarlibro('${libro.isbn}')">Eliminar</button></td>
                `;
            });
        })
        .catch(error => {
            console.log('Error:', error);
            alert('Error al obtener los libros.');
        });
}
function eliminarlibro(isbn) {
    if (confirm('¿Estás seguro de que quieres eliminar este libro?')) {
        fetch(URL + `libros/${isbn}`, { method: 'DELETE' })
            .then(resp => {
                if (resp.ok) {
                    obtenerlibros(); 
                    alert('libro eliminado correctamente.');
                }
            })
            .catch(function (error) {
                        // Código para manejar errores
                alert('Error al obtener los libros.');
            });
    }
}
        document.addEventListener('DOMContentLoaded', obtenerlibros);