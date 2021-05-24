import psycopg2
import psycopg2.errors
import logging as logger
import json

class DbOperations:
    def __init__(self, creds):
        self.creds = creds
        logger.debug("Initialized DbOperations Class")

    def create_conn(self):
        print("inside create connection")
        # dsn = 'postgresql://postgres:KKkV50sHPS@172.21.182.92:5432/records?sslmode=disable'
        try:
            credentials = {}
            credentials = self.creds
            # with open("static/credentials.json", "r") as cred:
            #     credentials = json.loads(cred.read())
            dsn = """{0}://{1}:{2}@{3}:{4}/{5}?sslmode=disable""".format(
                credentials.get('db'),
                credentials.get('username'),
                credentials.get('password'),
                credentials.get('hostname'),
                credentials.get('port'),
                credentials.get('dbName')
            )
            print(dsn)
            conn = psycopg2.connect(dsn)
            return conn
        except:
            return 1
        

    def create_employees(self,values):
        print(values)
        conn = self.create_conn()
        if conn == 1:
            return {'flag':False, 'error': "Could not connect to Database"}
        cur = conn.cursor()
        sql = "insert into employees(name,email,phoneno,address) values({});".format(values)
        print(sql)
        try:
            cur.execute(sql)
            response = {'flag': True, 'message': "Employee Details ADDED to Database!"}
        except Exception as e:
            print("Something Went wrong: "+e)
            response = {'flag': False, 'error': "Error: "+e}
        conn.commit()
        conn.close()
        return response
        
    def read_employees(self, condition="1=1"):
        conn = self.create_conn()
        if conn == 1:
            return {'flag':False, 'error': "Could not connect to Database"}
        cur = conn.cursor()
        sql = "select * from employees where {};".format(condition)
        print(sql)
        try:
            cur.execute(sql)
        except:
            print("Something Went wrong")
        rows = cur.fetchall()
        data_dictionary = []
        
        for row in rows:
            data_dictionary.append(
                {
                    "id": row[0],
                    "name": row[1],
                    "email": row[2],
                    "phoneno": row[3],
                    "address": row[4]
                }
            )
        conn.commit()
        conn.close()
        return data_dictionary
        

    def update_employees(self, values, condition="1=1"):
        conn = self.create_conn()
        if conn == 1:
            return {'flag':False, 'error': "Could not connect to Database"}
        cur = conn.cursor()
        sql = "update employees set {} where {};".format(values, condition)
        print(sql)
        try:
            cur.execute(sql)
            response = {'flag': True, 'message': "Employee Details EDITED in Database!"}
        except Exception as e:
            print("Something Went wrong")
            response = {'flag': False, 'error': "Error: "+e}
        conn.commit()
        conn.close()
        return response
        

    def delete_employees(self, condition="1=1"):
        conn = self.create_conn()
        if conn == 1:
            return {'flag':False, 'error': "Could not connect to Database"}
        cur = conn.cursor()
        sql = "delete from  employees  where {};".format(condition)
        print(sql)
        try:
            cur.execute(sql)
            response = {'flag': True, 'message': "Employee Details DELETED from Database!"}
        except Exception as e:
            print("Something Went wrong")
            response = {'flag': False, 'error': "Error: "+e}
        conn.commit()
        conn.close()
        return response

    def create_table(self):
        conn = self.create_conn()
        if conn == 1:
            return {'flag':False, 'error': "Could not connect to Database"}
        cur = conn.cursor()
        sql = "CREATE TABLE IF NOT EXISTS employees (id SERIAL NOT NULL, name VARCHAR(255), email VARCHAR(255), phoneno VARCHAR(255), address VARCHAR(255), PRIMARY KEY(id));"
        print(sql)
        try:
            cur.execute(sql)
            response = {'flag': True, 'message': "Employees TABLE Created in Database!"}
        except Exception as e:
            print("Something Went wrong: "+e)
            response = {'flag': False, 'error': "Error: "+e}
        conn.commit()
        conn.close()
        return response