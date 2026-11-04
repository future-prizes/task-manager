from flask import Flask, request, session, jsonify, redirect, render_template
import sqlite3
from dotenv import load_dotenv
from pathlib import Path
import os
from db import db_connect, db_init_cli
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from datetime import timedelta
import logging

app = Flask(__name__, instance_relative_config = True)
bcrypt = Bcrypt(app)
print("start")
#config

config_path = os.path.join(app.instance_path, "config.env")
load_dotenv(config_path)
db_name = os.environ.get("DB_NAME")
app.config["DB_PATH"] = os.path.join(app.instance_path, db_name)
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")
app.config["SESSION_PERMANENT"] = True
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(days = 1)



#-----------------routes--------------------------#

@app.route("/api/login", methods = ["GET", "POST"])
def login():
    error = None
    if request.method == "POST":
        try:

            username = request.form.get("username")
            if username and len(username)>0:
                username = username.strip()
            else:
                error ="username is empty"
            password = request.form.get("password")

            if error is None:
                conn = db_connect()
                cursor = conn.cursor()
                sql = """SELECT * FROM users WHERE username = ?"""
                cursor.execute(sql, (username, ))
                user = cursor.fetchone()
                conn.close()
                print(user)
                if user is None:
                    error = "user not found"
                else :
                    password_hash = user[3]
                    if not (bcrypt.check_password_hash(password_hash, password)):
                        error = "Wrong password"
                if error is None:
                    
                    session.clear()
                    session["user_id"] = user[0]
                    session.permanent = True
                    
                    response = {
                        "all_good": True, 
                        "message": f"Welcome {username}", 
                        "user": username, 
                        "go_to":"/dashboard"
                        }
                    
                    return jsonify(response), 200
                if error is not None:
                    return jsonify({"error": error}), 400 
            elif error is not None:
                    return jsonify({"error": error}), 400          
        except Exception as ex:
            print(ex)
            return jsonify("Internal error occured"), 500


@app.route("/api/register", methods = ["POST"])
def register():
    logging.error("the register route")
    
    error = None

    try:
        
        username = request.form.get("username").strip()
        email = request.form.get("email").strip()
        password = request.form.get("password")
        print("hello", flush=True)
        print(username)
        if len(username) <3:
            error ="Username too short"
        if len(password) <6:
            error = "Password must be at least 6 characters"
        if error is None:
            conn = db_connect()
            cursor = conn.cursor()

            sql = """INSERT INTO users (username, email, password_hash)
                    VALUES (?,?,?)"""
            cursor.execute(sql, (username, email, bcrypt.generate_password_hash(password).decode("utf-8")))

            conn.commit()
            conn.close()
            return jsonify({"ok": True, "message": f"New user {username} registered"}), 200
    except sqlite3.Error as e:
        print(f"database error {e}")
        return jsonify({"OK":False, "message": e})
    except Exception as e:
        print(f"unexpected error {e}")
        return jsonify({"OK":False, "message": str(e)})
    

@app.route("/api", methods = ["GET"])
def get_tasks():
    if not session.get("user"):
        return jsonify({"error": "not logged in"}), 401

@app.route("/api/show-all", methods = ["GET"])
def show_all():
    error = None
    
    try:
    
        conn = db_connect()
        cursor = conn.cursor()
        sql = """SELECT * FROM users
        """
        result = cursor.execute(sql)
        rows = result.fetchall()

        conn.commit()
        conn.close()
        print(rows)
        return jsonify(rows)
    except:
        error = "Could not connect to database"
        return jsonify(error)

@app.route("/api/new-post", methods = ["POST"])
def new_post():
    error = None

    try:
        title = request.form.get("title")
        description = request.form.get("description")
        due_date = request.form.get("due_date")
        status = request.form.get("status")

        if not title:
            error = "title is empty"
            raise ValueError(error)
        if not description:
            error = "description is empty"
            raise ValueError(error)
        if not due_date:
            error = "due date is empty"
            raise ValueError(error)
        if not status:
            error = "status is empty (will default to to-do)"
            raise ValueError(error)

        if error is None:
            conn = db_connect()
            cursor = conn.cursor()

            sql = """INSERT INTO tasks (user_id, title, description, due_date, status)
            VALUES (?, ?, ?, ?, ?)"""

            cursor.execute(sql, (session["user-id"],title, description, due_date, status))

            conn.commit()
            conn.close()
            return ("Task added")
    except Exception:
        return jsonify(error), 400
    except sqlite3.Error as e:
        return jsonify(e), 500
        




























app.cli.add_command(db_init_cli) #flask --app app db_init

if __name__ == "__main__":
    app.run()
