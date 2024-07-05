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
            password=password,
            database=database
        )
        self.conector = self.conn.cursor(dictionary=True)
        self.conector.execute('''CREATE TABLE IF NOT EXISTS libros (
            isbn INT AUTO_INCREMENT PRIMARY KEY,
            titulo VARCHAR(255) NOT NULL,
            paginas INT NOT NULL,
            precio DECIMAL(10, 2) NOT NULL,
            imagen_url VARCHAR(255))''')
        self.conn.commit()





    def agregar_libro(self, isbn, titulo, paginas, precio, imagen):
        self.conector.execute(f"SELECT * FROM libros WHERE isbn = {isbn}")
        libro_existe = self.conector.fetchone()
        if libro_existe:
            return False
        sql = f"INSERT INTO libros \
               (isbn, titulo, paginas, precio, imagen_url) \
               VALUES \
               ({isbn}, '{titulo}', {paginas}, {precio}, '{imagen}')"
        self.conector.execute(sql)
        self.conn.commit()
        return True
    def consultar_libro(self, isbn):
        self.conector.execute(f"SELECT * FROM libros WHERE isbn = {isbn}")
        return self.conector.fetchone()
    def cambiar_libro(self, isbn, ntitulo, npaginas, nprecio, nimagen):
        sql = f"UPDATE libros SET \
                    titulo = '{ntitulo}', \
                    paginas = {npaginas}, \
                    precio = {nprecio}, \
                    imagen_url = '{nimagen}', \
                WHERE isbn = {isbn}"
        self.conector.execute(sql)
        self.conn.commit()
        return self.conector.rowcount > 0
    def eliminar_libro(self, isbn):
        self.conector.execute(f"DELETE FROM libros WHERE isbn = {isbn}")
        self.conn.commit()
        return self.conector.rowcount > 0
    def lista_delibros(self, isbn):
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

biblioteca = libreria(host='localhost', user='root', password='', database='miapp')


#biblioteca.agregar_libro()
#biblioteca.lista_delibros(1)
#biblioteca.consultar_libro(1)
#biblioteca.eliminar_libro(1)
