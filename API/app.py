from flask import Flask, request, session, jsonify
import sqlite3
from dotenv import load_dotenv
import os
import re
from db import db_connect, db_init_cli
from flask_bcrypt import Bcrypt
from datetime import timedelta


app = Flask(__name__, instance_relative_config = True)
bcrypt = Bcrypt(app)
print("start")
#config

config_path = os.path.join(app.instance_path, "config.env")
load_dotenv(config_path)
db_name = os.environ.get("DB_NAME")
session_lifetime = os.environ.get("PERMANENT_SESSION_LIFETIME")
app.config["DB_PATH"] = os.path.join(app.instance_path, db_name)
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")
app.config["SESSION_PERMANENT"] = os.environ.get("SESSION_PERMANENT")
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(days = int(session_lifetime))



#-----------------routes--------------------------#

@app.route("/api/login", methods = ["POST"])
def login():
    """
    Logs in a registered user.
    
    Route: '/api/login'.

    Methods:
            Post.

    Returns:
            dict: 
            (  
            ok: bool
            message: str
            user: str 
            go_to: str
            id: str
            ).
    
    If any error:
    
    Returns: 
            dict:
            (
            ok: bool
            message: str
            ).
    """
    print("login")
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
                        "ok": True, 
                        "message": f"Welcome {username}", 
                        "user": username, 
                        "go_to":"/dashboard",
                        "id": user[0]
                        }
                    
                    return jsonify(response), 200
                if error is not None:
                    return jsonify({"ok": False, "message": error}), 400 
            elif error is not None:
                    return jsonify({"ok": False, "message": error}), 400 
        except sqlite3.Error as e:
            print(f"database error {e}")
            return jsonify({"OK":False, "message": str(e)}), 400         
        except Exception as e:
            print(f"unexpected error {e}")
            return jsonify({"OK":False, "message": str(e)}), 400
    elif session.get("user_id"):
        return jsonify({
                        "ok": True,  
                        "go_to":"/dashboard",
                        })

@app.route("/api/register", methods = ["POST"])
def register():
    """
    Registers a new user.

    Receives FormData.

    Email and username must be unique, password 
    at least 6 characters.

    Route: '/api/register'.

    Methods:
            Post.
    
    Returns:
            dict: 
            (  
            ok: bool
            message: str
            user: str 
            go_to: str
            id: str
            ).
    
    If any error:
    
    Returns: 
            dict:
            (
            ok: bool
            message: str
            ).
    """
    error = None
    try:
        username = request.form.get("username").strip()
        email = request.form.get("email").strip()
        password = request.form.get("password")

        if len(username) <3:
            error ="Username too short"
            raise ValueError(error)
        if not re.match(r"^\S+@\S+\.\S+$"):
            error = "Username in incorrect format"
            raise ValueError(error)
        if len(password) <6:
            error = "Password must be at least 6 characters"
            raise ValueError(error)
        if error is None:
            conn = db_connect()
            cursor = conn.cursor()

            sql = """INSERT INTO users (username, email, password_hash)
                    VALUES (?,?,?)"""
            cursor.execute(sql, (username, email, bcrypt.generate_password_hash(password).decode("utf-8")))
            conn.commit()
            return jsonify({"ok": True, "message": f"New user {username} registered"}), 200
    except sqlite3.Error as e:
        print(f"database error {e}")
        return jsonify({"OK":False, "message": str(e)}), 400
    except Exception as e:
        print(f"unexpected error {e}")
        return jsonify({"OK":False, "message": str(e)}), 400
    finally:
        if conn:
            conn.close()

@app.route("/api/logout", methods = ["GET"])
def logout():
    """
    Logs out a logged-in user if session[user_id] is not None.

    Route: '/api/logout'.

    Returns: 
            dict:
            (
            ok: bool
            message: str
            ).
    """
    if session.get("user_id"):
        session.clear()
        return jsonify({"ok":True, "message": "logged-out"}), 200
    else:
        return jsonify({"ok":False, "message": "not logged-in"})

@app.route("/api/load-tasks/<int:user_id>", methods = ["GET"])
def load_tasks(user_id):
    """
    Loads all tasks associated with a given user_id

    Route: '/api/load-tasks/<int:user_id>'.

    Methods:
            GET.
    
    Parameters:
            user_id (int): id in database for a user.      

    Returns:
            dict: 
            (  
            id: str
            title: str
            description: str 
            status: str
            due_date: str
            ).
    
    If any error:
    
    Returns: 
            dict:
            (
            ok: bool
            message: str
            ).
    """
    if session["user_id"] == user_id:
        try:
            user_id = session["user_id"]
            conn = db_connect()
            conn.row_factory = sqlite3.Row #returns object rather than tuple
            cursor = conn.cursor()

            sql = """SELECT t.id, title, description, status, due_date FROM tasks t 
            JOIN users u ON t.user_id = u.id WHERE u.id = ? ORDER BY due_date ASC
            """
            cursor.execute(sql, (user_id, ))
            tasks = cursor.fetchall()
            task_dict = [{col: task[col] for col in task.keys()} for task in tasks]
            return jsonify(task_dict), 200
        
        except sqlite3.Error as e:
            print(f"database error {e}")
            return jsonify({"OK":False, "message": str(e)})
        except Exception as e:
            print(f"unexpected error {e}")
            return jsonify({"OK":False, "message": str(e)})
        finally:
            if conn:
                conn.close()
    else:
        return jsonify({"ok": False, "message": "not logged in or wrong ID"})

@app.route("/api/delete-task/<int:task_id>", methods = ["DELETE"])
def delete_task(task_id):
    """
    Deletes a task with a given task_id.

    Route: Route: '/api/delete-task/<int:user_id>'.
    
    Methods:
            DELETE.
    
    Parameters:
            task_id (int): id in database for a task.      
    
    Returns:
            dict:
            (
            ok: bool
            message: str
            ).
    
    If any error:
    
    Returns: 
            dict:
            (
            ok: bool
            message: str
            ).
    """
    if session.get("user_id"): 
        try:
            conn= db_connect()
            cursor = conn.cursor()

            sql = """DELETE FROM tasks WHERE id = ?"""
            cursor.execute(sql, (task_id, ))
            conn.commit()
            
            return jsonify({"ok": True, "message": f"task {task_id} deleted"})
        except sqlite3.Error as e:
            print(f"database error {e}")
            return jsonify({"OK":False, "message": str(e)})
        except Exception as e:
            print(f"unexpected error {e}")
            return jsonify({"OK":False, "message": str(e)})

        finally:
            conn.close()
    else:
        return jsonify({"ok": False, "message": "not logged in or task not found"})

@app.route("/api/", methods = ["GET"])
def api():
    """
    Checks if a valid session exists on the client.
    Called the first time client page mounts or is reloaded

    Route: '/api/'.
    
    Methods:
            GET.
 
    Returns:
            dict:
            (
            ok: bool
            message: str
            user_id: str
            ).
    
    If session[user_id] is None:
    
    Returns: 
            dict:
            (
            ok: bool
            message: str
            ).
    """
    
    if session.get("user_id"):
        return jsonify({"ok": True, "message": "logged in", "user_id": session.get("user_id")})
    else:
        return jsonify({"ok": False, "message": "not logged in"})

@app.route("/api/update-task/<int:task_id>", methods = ["PATCH"])
def updateTask(task_id):
    """
    Updates a task's database entry for a given task_id.
    Receives FormData 
                :title must be <100 characters
                :description must be <500 characters

    Route: '/api/update-task/<int:user_id>'.
    
    Methods:
            PATCH.
    
    Parameters:
            task_id (int): id in database for a task.      
    
    Returns:
            dict:
            (
            ok: bool
            message: str
            ).
    
    If any error:
    
    Returns: 
            dict:
            (
            ok: bool
            message: str
            ).
    """
    error = None
    if session.get("user_id"):
        try:
            title = request.form.get("title")
            description = request.form.get("description")
            status = request.form.get("status")
            due_date = request.form.get("due_date")
            cleaned_date = due_date.replace("T", " ")

            if not title:
                error = "title is empty"
                raise ValueError(error)
            if len(title) >100:
                error = "title too long (>100 chars)"
                raise ValueError(error)
            if not description:
                error = "description is empty"
                raise ValueError(error)
            if len(description) >500:
                error = "title too long (>500 chars)"
                raise ValueError(error)
            if not due_date:
                error = "due date is empty"
                raise ValueError(error)
            if not status:
                error = "status is empty"
                raise ValueError(error)
            

            if error is None:
                conn = db_connect()
                cursor = conn.cursor()

                sql = """UPDATE tasks 
                SET title = ?,
                description = ?,
                status = ?,
                due_date = ?
                WHERE id = ?"""
                cursor.execute(sql, (title, description, status, cleaned_date, task_id))

                conn.commit()
                return jsonify({"ok": True, "message": f"task {task_id} updated"})
        except sqlite3.Error as e:
            print(f"database error {e}")
            return jsonify({"ok":False, "message": str(e)})
        except Exception as e:
            print(f"unexpected error {e}")
            return jsonify({"ok":False, "message": str(e)})
        finally:
            if conn:
                conn.close()
    else:
        return jsonify({"ok": False, "message": "not logged in or task not found"})

@app.route("/api/new-post", methods = ["POST"])
def new_post():
    """
    Creates a new task in the database.
    Receives FormData 
                    :title must be <100 characters
                    :description must be <500 characters

    Route: '/api/new-post'.
    
    Methods:
            POST.     
    
    Returns:
            dict:
            (
            ok: bool
            message: str
            ).
    
    If any error:
    
    Returns: 
            dict:
            (
            ok: bool
            message: str
            ).
    """
    error = None
    try:
        title = request.form.get("title")
        description = request.form.get("description")
        due_date = request.form.get("due_date")
        cleaned_date = due_date.replace("T", " ")
        status = request.form.get("status") if request.form.get("status") else ""

        if not title:
            error = "title is empty"
            raise ValueError(error)
        if len(title) >100:
            error = "title too long (>100 chars)"
            raise ValueError(error)
        if not description:
            error = "description is empty"
            raise ValueError(error)
        if len(description) >500:
            error = "title too long (>500 chars)"
            raise ValueError(error)
        if not due_date:
            error = "due date is empty"
            raise ValueError(error)
        if not status:
            error = "status is empty"
            raise ValueError(error)
        
        if error is None:
            conn = db_connect()
            cursor = conn.cursor()

            sql = """INSERT INTO tasks (user_id, title, description, due_date, status)
            VALUES (?, ?, ?, ?, ?)"""

            cursor.execute(sql, (session.get("user_id"),title, description, cleaned_date, status))

            conn.commit()
            
            return jsonify({"ok": True, "message": "New task added"})
    except sqlite3.Error as e:
                print(f"database error {e}")
                return jsonify({"ok":False, "message": str(e)}), 400
    except Exception as e:
                print(f"unexpected error {e}")
                return jsonify({"ok":False, "message": str(e)}), 400
    finally:
        if conn:
            conn.close()

app.cli.add_command(db_init_cli) #flask --app app db_init

if __name__ == "__main__":
    app.run()
