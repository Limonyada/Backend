
const URL = "https://lucasacosta.pythonanywhere.com/"
//Agregar libro
//Al subir al servidor, deberá utilizarse la siguiente ruta. USUARIO debe ser reemplazado por el nombre de usuario de Pythonanywhere
//const URL = "https://USUARIO.pythonanywhere.com/"

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
            alert('El libro se agrego correctamente.');
        })

        
    .catch(function (error) {
            alert('Error al agregar el libro.');
        })

        .finally(function () {
            document.getElementById('titulo').value = "";
            document.getElementById('paginas').value = "";
            document.getElementById('precio').value = "";
            document.getElementById('imagenProducto').value = "";
        });
})