const URL = "https://sofiacuba.pythonanywhere.com/"


document.getElementById('formulario').addEventListener('submit', function (event) {
    event.preventDefault(); 
    var formData = new FormData(this);

    fetch(URL + 'libros', {
        method: 'POST',
        body: formData 
    })

    .then(function (response) {
            if (response.ok) { 
                return response.json(); 
            } else {
                throw new Error('Error al agregar el libro.');
            }
    })

        .then(function (data) {
            alert('Libro agregado correctamente.');
        })

        .catch(function (error) {
            alert('Error al agregar el libro.');
        })

        .finally(function () {
            document.getElementById('titulo').value = "";
            document.getElementById('paginas').value = "";
            document.getElementById('precio').value = "";
            document.getElementById('imagenLibro').value = "";
        });
})