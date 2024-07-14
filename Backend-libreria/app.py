
from flask import Flask, request, jsonify, render_template
from flask import request


from flask_cors import CORS


import mysql.connector


from werkzeug.utils import secure_filename

import os
import time



app = Flask(__name__)
CORS(app)  

class Catalogo:
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

        self.cursor.execute(sql, valores)        
        self.conn.commit()
        return self.cursor.lastrowid

    def consultar_libro(self, isbn):
        self.cursor.execute(f"SELECT * FROM libros WHERE isbn = {isbn}")
        return self.cursor.fetchone() 

    def modificar_libro(self, isbn, ntitulo, npaginas, nprecio, nimagen):
        sql = "UPDATE libros SET titulo = %s, paginas = %s, precio = %s, imagen_url = %s WHERE isbn = %s"
        valores = (ntitulo, npaginas, nprecio, nimagen, isbn)
        self.cursor.execute(sql, valores)
        self.conn.commit()
        return self.cursor.rowcount > 0

    def agregar_libros(self):
        self.cursor.execute("SELECT * FROM libros")
        libros = self.cursor.fetchall()
        return libros

    def eliminar_libro(self, isbn):
        self.cursor.execute(f"DELETE FROM libros WHERE isbn = {isbn}")
        self.conn.commit()
        return self.cursor.rowcount > 0

    def ver_libro(self, isbn):
        libro = self.consultar_libro(isbn)
        if libro:
            print("-" * 40)
            print(f"ISBN.....: {libro['isbn']}")
            print(f"Título: {libro['titulo']}")
            print(f"Páginas...: {libro['paginas']}")
            print(f"Precio.....: {libro['precio']}")
            print(f"Imagen.....: {libro['imagen_url']}")
            print("-" * 40)
        else:
            print("Libro no encontrado.")


catalogo = Catalogo(host='SofiaCuba.mysql.pythonanywhere-services.com', user='SofiaCuba', password='Nicole12345', database='SofiaCuba$miapp')


RUTA_DESTINO = '/home/SofiaCuba/mysite/static/imagen/'


@app.route("/libros", methods=["GET"])
def agregar_libroos():
    libros = catalogo.agregar_libros()
    return jsonify(libros)



@app.route("/libros/<int:isbn>", methods=["GET"])
def ver_libro(isbn):
    libro = catalogo.consultar_libro(isbn)
    if libro:
        return jsonify(libro), 201
    else:
        return "libro no encontrado", 404


@app.route("/libros", methods=["POST"])
def agregar_libro():
    titulo = request.form['titulo']
    paginas = request.form['paginas']
    precio = request.form['precio']
    imagen = request.files['imagen']
    nombre_imagen=""

    
    nombre_imagen = secure_filename(imagen.filename) 
    nombre_base, extension = os.path.splitext(nombre_imagen) 
    nombre_imagen = f"{nombre_base}_{int(time.time())}{extension}" 

    nisbn = catalogo.agregar_libro(titulo, paginas, precio, nombre_imagen)
    if nisbn:    
        imagen.save(os.path.join(RUTA_DESTINO, nombre_imagen))
        print("Se guardo!")
        return jsonify({"mensaje": "libro agregado correctamente.", "isbn": nisbn, "imagen": nombre_imagen}), 201
    else:
        return jsonify({"mensaje": "Error al agregar el libro."}), 500
    

@app.route("/libros/<int:isbn>", methods=["PUT"])
def modificar_libro(isbn):
    ntitulo = request.form.get("titulo")
    npaginas = request.form.get("paginas")
    nprecio = request.form.get("precio")
    
    
    if 'imagen' in request.files:
        imagen = request.files['imagen']
        nombre_imagen = secure_filename(imagen.filename) 
        nombre_base, extension = os.path.splitext(nombre_imagen) 
        nombre_imagen = f"{nombre_base}_{int(time.time())}{extension}" 

        imagen.save(os.path.join(RUTA_DESTINO, nombre_imagen))
        
        libro = catalogo.consultar_libro(isbn)
        if libro:
            imagen_vieja = libro["imagen_url"]
            ruta_imagen = os.path.join(RUTA_DESTINO, imagen_vieja)

            if os.path.exists(ruta_imagen):
                os.remove(ruta_imagen)
    
    else:
        libro = catalogo.consultar_libro(isbn)
        if libro:
            nombre_imagen = libro["imagen_url"]


    if catalogo.modificar_libro(isbn, ntitulo, npaginas, nprecio, nombre_imagen):
        
        return jsonify({"mensaje": "libro modificado"}), 200
    else:
        return jsonify({"mensaje": "libro no encontrado"}), 404



@app.route("/libros/<int:isbn>", methods=["DELETE"])
def eliminar_libro(isbn):
    libro = catalogo.consultar_libro(isbn)
    if libro: 
        imagen_vieja = libro["imagen_url"]
        ruta_imagen = os.path.join(RUTA_DESTINO, imagen_vieja)

        if os.path.exists(ruta_imagen):
            os.remove(ruta_imagen)

        if catalogo.eliminar_libro(isbn):
            return jsonify({"mensaje": "libro eliminado"}), 200
        else:
            return jsonify({"mensaje": "Error al eliminar el libro"}), 500
    else:
        return jsonify({"mensaje": "libro no encontrado"}), 404

if __name__ == "__main__":
    app.run(debug=True)