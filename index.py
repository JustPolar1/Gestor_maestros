from flask import Flask, send_from_directory, jsonify, request
import mysql.connector
import mysql.connector.cursor
import mysql.connector.cursor_cext

app = Flask(__name__)


class Database:
    def __init__(self, host: str, user: str, password: str, database: str) -> None:
        self.host = host
        self.user = user
        self.password = password
        self.database = database
        self.connection = None
        self.user_id: int | None = None
        self.username: str | None = None

    def connect(self) -> None:
        try:
            self.connection = mysql.connector.connect(
                host=self.host,
                user=self.user,
                password=self.password,
                database=self.database
            )
            print("Conexión con la base de datos exitosa")
        except mysql.connector.ProgrammingError as e:
            print(f"Hubo un error al conectar con la base de datos, revisa tus credenciales {repr(e)}")
        except Exception as e:
            print(f"Hubo un error inesperado al conectar con la base de datos: {e}")

    def cursor(self) -> mysql.connector.cursor:
        return self.connection.cursor()

db = Database(
    host="localhost",
    user="root",
    password="12345",
    database="maestros"
)

@app.route("/")
def index():
    return send_from_directory(".", "index.html")

@app.route("/maestros")
def get_maestros():
    db.connect()
    cursor = db.cursor()

    if request.args.get("id"):
        cursor.execute("SELECT * FROM maestros WHERE maestro_id = %s", (request.args.get("id"),))
        datos = cursor.fetchone()
        print(datos)
        return jsonify(datos)
    
    cursor.execute("SELECT * FROM maestros")
    return jsonify(cursor.fetchall())

@app.route("/maestros", methods=["POST"])
def post_maestro():
    try:
        db.connect()
        cursor = db.cursor()
        data = request.get_json()

        if data.keys() != {"maestro_nombres", "maestro_apellido_paterno", "maestro_apellido_materno", "fecha_nacimiento"}:
            return jsonify({"message": "Faltan datos"}), 400
        
        print(data.values())

        if not all(data.values()):
            return jsonify({"message": "Los datos no pueden estar vacíos"}), 400

        cursor.execute("INSERT INTO maestros (maestro_nombres, maestro_apellido_paterno, maestro_apellido_materno, fecha_nacimiento) VALUES (%s, %s, %s, %s)", 
                       (data["maestro_nombres"], 
                        data["maestro_apellido_paterno"], 
                        data["maestro_apellido_materno"], 
                        data["fecha_nacimiento"]))
        db.connection.commit()
        db.connection.close()
        cursor.close()
        return jsonify({"message": "Maestro agregado exitosamente"}), 201
    except Exception as e:
        data = request.get_json()
        print(data)
        print(e)
        return jsonify({"message": str(e)}), 500

@app.route("/maestros", methods=["DELETE"])
def delete_maestro():
    id = request.args.get("id")
    try:
        db.connect()
        cursor = db.cursor()

        cursor.execute("DELETE FROM maestros WHERE maestro_id = %s", (id,))
        db.connection.commit()
        db.connection.close()

        if cursor.rowcount == 0:
            return jsonify({"message": "Maestro no encontrado"}), 404
        return jsonify({"message": "Maestro eliminado exitosamente"}), 200
    except Exception as e:
        print(e)
        return jsonify({"message": str(e)}), 500
    
@app.route("/buscar_maestro", methods=["GET"])
def buscar_maestro():
    nombre_completo = request.args.get("nombre_completo")
    if not nombre_completo:
        return jsonify({"message": "Nombre completo es requerido"}), 400

    db.connect()
    cursor = db.cursor()
    cursor.execute("""
        SELECT * FROM maestros 
        WHERE CONCAT(maestro_nombres, ' ', maestro_apellido_paterno, ' ', maestro_apellido_materno) LIKE %s
    """, ('%' + nombre_completo + '%',))
    maestros = cursor.fetchall()
    db.connection.close()
    print(maestros)
    return jsonify(maestros)


if __name__ == "__main__":
    app.run()
