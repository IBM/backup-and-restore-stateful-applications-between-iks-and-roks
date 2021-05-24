from flask import Flask, render_template, request, redirect, jsonify, url_for
import os
import time
import logging as logger
import random
import json
from Database.dbOperations import DbOperations

''' Initialize Flask Variables '''

app = Flask(__name__)
app.config["CREDENTIALS"] = "static/credentials.json"

creds = {}

'''Initialize connection to DB'''

@app.route('/createTable')
def createTable():
    dbObject = DbOperations(creds)
    resp = dbObject.create_table()
    if resp.get('flag') == True:
        return jsonify({'flag': True})
    else:
        return jsonify({'flag': False})

@app.route('/getCurrentConnection')
def currentConnection():
    credentials = {}
    if creds == {}:
        return jsonify({'flag':False})
    return jsonify(creds)
    # try:
    #     # with open(app.config["CREDENTIALS"], "r") as cred:
    #     #     credentials = json.loads(cred.read())
    #         return jsonify(creds)
    # except:
    #     return jsonify({'flag':False})
    

@app.route('/')
def index():
   return render_template('index.html')

@app.route('/addRecords', methods=['POST'])
def add():
    response = json.loads(request.data)
    
    sql = """'{0}','{1}','{2}','{3}'""".format(
        response.get("name"),
        response.get("email"),
        response.get("phoneno"),
        response.get("address")
    )
    
    dbObject = DbOperations(creds)
    resp = dbObject.create_employees(sql)

    return jsonify(resp)

@app.route('/editRecords/<int:ID>', methods=['POST'])
def edit(ID):
    response = json.loads(request.data)
    
    set_ = """name='{0}',email='{1}',phoneno='{2}',address='{3}'""".format(
        response.get("name"),
        response.get("email"),
        response.get("phoneno"),
        response.get("address")
    )

    where = """id='{0}'""".format(ID)
    
    dbObject = DbOperations(creds)
    resp = dbObject.update_employees(set_, where)

    return jsonify(resp)

@app.route('/getRecords')
def read():
    dbObject = DbOperations(creds)
    resp = dbObject.read_employees()
    return jsonify(resp)

@app.route('/deleteRecords/<int:ID>')
def delete(ID):
    sql = """id='{0}'""".format(ID)
    dbObject = DbOperations(creds)
    resp = dbObject.delete_employees(sql)
    return jsonify(resp)

@app.route('/conn', methods=['POST'])
def connection():
    global creds
    response = json.loads(request.data)
    print(response)
    
    creds = {
        "db": response.get('db'),
        "dbName": response.get('dbName'),
        "username": response.get('username'),
        "password": response.get('password'),
        "hostname": response.get('hostname'),
        "port": response.get('port')
    }
    
    # with open(app.config["CREDENTIALS"], 'w') as fs:
    #     json.dump(creds, fs, indent=2)

    return jsonify(
        {
            "flag": True, 
            "message": "{0} DB configured on http://{1}:{2}".format(
                response.get('db'),
                response.get('hostname'),
                response.get('port')
                )
        }
        )

port = os.getenv('VCAP_APP_PORT', '8080')
if __name__ == "__main__":
    logger.debug("Starting the Application")
    app.secret_key = os.urandom(12)
    app.run(host='0.0.0.0', port=port, debug=True, use_reloader=True)