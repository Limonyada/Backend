import mysql.connector
from flask import Flask, request, jsonify
from flask import request
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import time

app= Flask(__name__)
CORS(app)

class libreria:
    
    def __init__(self, host, user, password, database):
    
        self.conn = mysql.connector.connect(
            host=host,
            user=user,
            password=password
        )
        self.cursor = self.conn.cursor()
        
        try:
            self.cursor.execute(f"USE {database}")
        except mysql.connector.Error as err:
            if err.errno == mysql.connector.errorcode.ER_BAD_DB_ERROR:
                self.cursor.execute(f"CREATE DATABASE {database}")
                self.conn.database = database
            else:
                raise err
        self.cursor.execute('''CREATE TABLE IF NOT EXISTS libros (
            isbn INT AUTO_INCREMENT PRIMARY KEY,
            titulo VARCHAR(255) NOT NULL,
            paginas INT NOT NULL,
            precio DECIMAL(10, 2) NOT NULL,
            imagen_url VARCHAR(255))''')
        self.conn.commit()

        self.cursor.close()
        self.cursor = self.conn.cursor(dictionary=True)

    def agregar_libro(self, titulo, paginas, precio, imagen):
        
        sql = """INSERT INTO libros (titulo, paginas, precio, imagen_url)
          VALUES (%s, %s, %s, %s)"""
        valores = (titulo, paginas, precio, imagen)

        self.cursor.execute(sql,valores)        
        self.conn.commit()
        return self.cursor.lastrowid
    def consultar_libro(self, isbn):
        self.cursor.execute(f"SELECT * FROM libros WHERE isbn = {isbn}")
        return self.cursor.fetchone()
   
    def cambiar_libro(self, isbn, ntitulo, npaginas, nprecio, nimagen):
        sql = "UPDATE libros SET titulo = %s, paginas = %s, precio = %s, imagen_url = %s WHERE isbn = %s"
        valores = (ntitulo, npaginas, nprecio, nimagen, isbn)
        self.cursor.execute(sql, valores)
        self.conn.commit()
        return self.cursor.rowcount > 0

    def eliminar_libro(self, isbn):
        self.cursor.execute(f"DELETE FROM libros WHERE isbn = {isbn}")
        self.conn.commit()
        return self.cursor.rowcount > 0
    def ver_delibros(self, isbn):
        libro = self.consultar_libro(isbn)
        if libro:
            print("-" * 40)
            print(f"Isbn.....: {libro['isbn']}")
            print(f"Titulo: {libro['titulo']}")
            print(f"Paginas...: {libro['paginas']}")
            print(f"Precio.....: {libro['precio']}")
            print(f"Imagen.....: {libro['imagen_url']}")
            print("-" * 25)
        else:
            print("El libro no se encontro.")
    def listar_libros(self):
        self.cursor.execute("SELECT * FROM libros")
        libros = self.cursor.fetchall()
        return libros

biblioteca = libreria(host='localhost', user='root', password='', database='miapp')

ruta_img = 'img/'

@app.route("/libros", methods=["GET"])
def listar_libros():
    libros = biblioteca.listar_libros()
    return jsonify(libros)

@app.route("/libros/<int:isbn>", methods=["GET"])
def mostrar_libro(isbn):
    biblioteca.mostrar_libro(isbn)
    libro = biblioteca.consultar_libro(isbn)
    if libro:
        return jsonify(libro)
    else:
        return "El libro no se encuentra", 404

@app.route("/libros", methods=["POST"])
def agregar_libro():

    titulo = request.form['titulo']
    paginas = request.form['paginas']
    precio = request.form['precio'] 
    imagen = request.files['imagen']
    
    nombre_imagen = secure_filename(imagen.filename)
    nombre_base, extension = os.path.splitext(nombre_imagen)
    nombre_imagen = f"{nombre_base}_{int(time.time())}{extension}"
    imagen.save(os.path.join(ruta_img, nombre_imagen))


    if biblioteca.agregar_libro(titulo, paginas, precio, nombre_imagen):
        return jsonify({"mensaje": "Se agrego el libro"}), 201
    else:
        return jsonify({"mensaje": "El libro ya existe"}), 400
    
@app.route("/libros/<int:isbn>", methods=["DELETE"])

def eliminar_libro(isbn):
    libro = biblioteca.consultar_libro(isbn)
    if libro:
        imagen_vieja = libro["imagen_url"]
        ruta_imagen = os.path.join(ruta_img, imagen_vieja)

        if os.path.exists(ruta_imagen):
            os.remove(ruta_imagen)

        if biblioteca.eliminar_libro(isbn):
            return jsonify({"mensaje": "El libro fue eliminado"}), 200
        else:
            return jsonify({"mensaje": "Error al eliminar el libro"}), 500
    else:
       
        return jsonify({"mensaje": "libro no encontrado"}), 404


@app.route("/libros/<int:isbn>", methods=["PUT"])

def cambiar_libro(isbn):
    ntitulo = request.form.get("titulo")
    npaginas = request.form.get("paginas")
    nprecio = request.form.get("precio")
    
    
    # Verifica si se proporcionó una nueva imagen
    if 'imagen' in request.files:
        imagen = request.files['imagen']
        # Procesamiento de la imagen
        nombre_imagen = secure_filename(imagen.filename) #Chequea el nombre del archivo de la imagen, asegurándose de que sea seguro para guardar en el sistema de archivos
        nombre_base, extension = os.path.splitext(nombre_imagen) #Separa el nombre del archivo de su extensión.
        nombre_imagen = f"{nombre_base}_{int(time.time())}{extension}" #Genera un nuevo nombre para la imagen usando un timestamp, para evitar sobreescrituras y conflictos de nombres.

        # Guardar la imagen en el servidor
        imagen.save(os.path.join(ruta_img, nombre_imagen))
        
        # Busco el libro guardado
        libro = biblioteca.consultar_libro(isbn)
        if libro: # Si existe el libro...
            imagen_vieja = libro["imagen_url"]
            # Armo la ruta a la imagen
            ruta_imagen = os.path.join(ruta_img, imagen_vieja)

            # Y si existe la borro.
            if os.path.exists(ruta_imagen):
                os.remove(ruta_imagen)
    
    else:
        # Si no se proporciona una nueva imagen, simplemente usa la imagen existente del libro
        libro = biblioteca.consultar_libro(isbn)
        if libro:
            nimagen = libro["imagen_url"]


    # Se llama al método cambiar_libro pasando el isbn del libro y los nuevos datos.
    if biblioteca.cambiar_libro(isbn, ntitulo, npaginas, nprecio, nimagen):
        
        #Si la actualización es exitosa, se devuelve una respuesta JSON con un mensaje de éxito y un código de estado HTTP 200 (OK).
        return jsonify({"mensaje": "libro modificado"}), 200
    else:
        #Si el libro no se encuentra (por ejemplo, si no hay ningún libro con el código dado), se devuelve un mensaje de error con un código de estado HTTP 404 (No Encontrado).
        return jsonify({"mensaje": "libro no encontrado"}), 404

#biblioteca.agregar_libro("harry poter",716,3500,"rayito")
#biblioteca.lista_delibros(1)
#biblioteca.consultar_libro(1)
#biblioteca.eliminar_libro(1)

if __name__ == "__main__":
    app.run(debug=True)