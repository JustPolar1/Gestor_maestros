from flask import Flask, send_from_directory
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
db.connect()
cursor = db.cursor()

@app.route("/")
def index():
    return send_from_directory(".", "index.html")

@app.route("/maestros")
def get_maestros():
    cursor.execute("SELECT * FROM maestros")

if __name__ == "__main__":
    app.run()
