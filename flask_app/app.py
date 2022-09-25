from audioop import cross
from flask import Flask, render_template, request, jsonify
from flask_mysqldb import MySQL
import pymysql
import MySQLdb.cursors
import json
from flask_cors import cross_origin, CORS

app = Flask(__name__)
CORS(app)

app.config['MYSQL_HOST'] = 'dbcontainer'
app.config['MYSQL_USER'] = 'example_user'
app.config['MYSQL_PASSWORD'] = 'mysql'
app.config['MYSQL_DB'] = 'example'

mysql = MySQL(app)

def get_conexion():
    return pymysql.connect(host = 'dbcontainer',
                                user= 'example_user',
                                password='mysql',
                                db='example' )

@app.route('/', methods=['GET'])
def professor_list_json():
    conexion = get_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("SELECT FIRST_NAME FROM PROFESSOR")
        data = cursor.fetchall()
    conexion.close()
    return json.dumps(data)

@app.route('/professors', methods=['GET'])
def professor_list():
    conexion = get_conexion()
    data = []
    with conexion.cursor() as cursor:
        cursor.execute('SELECT * FROM PROFESSOR')
        data = cursor.fetchall()
    conexion.close()
    professors = []
    for x in data:
        professors.append({
            'id': str(x[0]),
            'first_name': x[1],
            'last_name': x[2],
            'city': x[3],
            'address': x[4],
            'salary': str(x[5])
        })
    return jsonify(professors)


@app.route('/professors/<id>', methods=['GET'])
def get_professor_id(id):
    conexion = get_conexion()
    data = []
    with conexion.cursor() as cursor:
        sql = "SELECT * FROM PROFESSOR WHERE ID = %s"
        val = (id)
        cursor.execute(sql, val)
        data = cursor.fetchall()
    conexion.close()
    professor = []
    for x in data:
        professor.append({
            'id': str(x[0]),
            'first_name': x[1],
            'last_name': x[2],
            'city': x[3],
            'address': x[4],
            'salary': str(x[5])
        })
    return jsonify(professor)

@app.route('/professors', methods=['POST'])
@cross_origin()
def createprofessor():
    conexion = get_conexion()
    with conexion.cursor() as cursor:
        name = request.json['first_name']
        last_name = request.json['last_name']
        city = request.json['city']
        address = request.json['address']
        salary = request.json['salary']
        sql = "INSERT INTO PROFESSOR (FIRST_NAME, LAST_NAME, CITY, ADDRESS, SALARY) VALUES (%s, %s, %s, %s, %s)"
        val = (name, last_name, city, address, salary)
        cursor.execute(sql, val)
    conexion.commit()
    conexion.close()
    return json.dumps(1)

@app.route('/professors/<id>', methods=['PUT'])
@cross_origin()
def updateprofessor(id):
    conexion = get_conexion()
    with conexion.cursor() as cursor:
        name = request.json['first_name']
        last_name = request.json['last_name']
        city = request.json['city']
        address = request.json['address']
        salary = request.json['salary']
        sql = "UPDATE  PROFESSOR SET FIRST_NAME = %s, LAST_NAME = %s, CITY = %s, ADDRESS = %s, SALARY = %s WHERE ID = %s"
        val = (name, last_name, city, address, salary, id)
        cursor.execute(sql, val)
    conexion.commit()
    conexion.close()
    return json.dumps(1)

@app.route('/professors/<id>', methods=['DELETE'])
@cross_origin()
def deleteprofessor(id):
    conexion = get_conexion()
    with conexion.cursor() as cursor:
        #id = request.args.get('id')
        sql = "DELETE FROM PROFESSOR WHERE ID = %s"
        val = (id)
        cursor.execute(sql, val)
    conexion.commit()
    conexion.close()
    return json.dumps(1)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=81, debug=True)
