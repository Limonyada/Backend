    const URL = "https://sofiacuba.pythonanywhere.com/"


        function obtenerLibros() {
            fetch(URL + 'libros') 
                .then(response => {
                    if (response.ok) { return response.json(); }
                })
                .then(data => {
                    const librosTable = document.getElementById('libros-table').getElementsByTagName('tbody')[0];
                    librosTable.innerHTML = ''; 
                    data.forEach(libro => {
                        const row = librosTable.insertRow();
                        row.innerHTML = `
                            <td>${libro.isbn}</td>
                            <td>${libro.titulo}</td>
                            <td>${libro.paginas}</td>
                            <td align="right">${libro.precio}</td>
                            <td><button onclick="eliminarLibro('${libro.isbn}')">Eliminar</button></td>
                        `;
                    });
                })
                .catch(error => {
                    console.log('Error:', error);
                    alert('Error al obtener los libros.');
                });
        }

        function eliminarLibro(isbn) {
            if (confirm('¿Estás seguro de que quieres eliminar este libro?')) {
                fetch(URL + `libros/${isbn}`, { method: 'DELETE' })
                    .then(response => {
                        if (response.ok) {
                            obtenerLibros(); 
                            alert('Libro eliminado correctamente.');
                        }
                    })
                    .catch(error => {
                        alert(error.message);
                    });
            }
        }

        document.addEventListener('DOMContentLoaded', obtenerLibros);