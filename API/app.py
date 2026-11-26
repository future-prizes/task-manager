from flask import Flask, request, session, jsonify, send_from_directory, redirect
import sqlite3
from dotenv import load_dotenv
import os
import re
from db import db_connect, db_init_cli
from flask_bcrypt import Bcrypt
from datetime import timedelta

#start on waitress waitress-serve --listen=127.0.0.1:8000 app:app 

app = Flask(__name__, 
            instance_relative_config = True, 
            static_folder="./dist", 
            static_url_path="/",
            instance_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), "instance"),)
bcrypt = Bcrypt(app)

#config
os.makedirs(app.instance_path, exist_ok = True)
config_path = os.path.join(app.instance_path, "config.env")
load_dotenv(config_path)
db_name = os.environ.get("DB_NAME")
session_lifetime = os.environ.get("PERMANENT_SESSION_LIFETIME")
app.config["DB_PATH"] = os.path.join(app.instance_path, db_name)
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY") #generate with python -c "import secrets; print(secrets.token_hex(32)) and place in config.env file"
app.config["SESSION_PERMANENT"] = os.environ.get("SESSION_PERMANENT")
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(days = int(session_lifetime))



#-----------------routes--------------------------#
@app.before_request
def block_api_navigation():
    if request.path.startswith('/api/'):
        # 'navigate' means the user typed the URL or clicked a direct link to open it as a page
        if request.headers.get('Sec-Fetch-Mode') == 'navigate':
            return redirect('/')


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
                
                if user is None:
                    error = "user not found"
                else :
                    password_hash = user[3]
                    if not (bcrypt.check_password_hash(password_hash, password)):
                        error = "Wrong password"
                if error is None:
                    
                    session.clear()
                    session["user_id"] = user[0]
                    session["username"] = user[1]
                    session.permanent = True
                    
                    response = {
                        "ok": True, 
                        "message": f"Welcome {username}", 
                        "username": username, 
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
    conn = None
    try:
        username = request.form.get("username").strip()
        email = request.form.get("email").strip()
        password = request.form.get("password")

        if len(username) <3:
            error ="Username too short"
            raise ValueError(error)
        if not re.match(r"^\S+@\S+\.\S+$", email):
            error = "Email in incorrect format"
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
        if "users.username" in str(e) :
            e = "Already a user with that username"
        elif "users.email" in str(e):
            e = "Already a user with that email"
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
            priority: str
            tags: list
            ).
    
    If any error:
    
    Returns: 
            dict:
            (
            ok: bool
            message: str
            ).
    """
    conn= None
    if session.get("user_id") == user_id:
        
        try:
            user_id = session["user_id"]
            conn = db_connect()
            conn.row_factory = sqlite3.Row #returns object rather than tuple
            cursor = conn.cursor()
            
            sql = """SELECT t.id AS task_id,
                    t.title AS title,
                    t.description AS description,
                    t.due_date AS due_date,
                    t.status AS status,
                    t.priority AS priority,
                    g.tag AS tag
                FROM tasks t
                LEFT JOIN tags g ON g.task_tag_id = t.id
                WHERE t.user_id = ?
                ORDER BY t.due_date ASC;
                """
            cursor.execute(sql, (user_id, ))
            rows= cursor.fetchall()
            raw_tasks = {}
            tasks=[]
            
            for row in rows:
                task_id = row["task_id"]

                if task_id not in raw_tasks:
                    
                    raw_tasks[task_id] = {
                        "task_id":task_id,
                        "title": row["title"],
                        "description": row["description"],
                        "due_date": row["due_date"],
                        "status": row["status"],
                        "priority": row["priority"],
                        "tags": []
                    }
                
                if row["tag"] is not None:
                    raw_tasks[task_id]["tags"].append(row["tag"])

            for d in raw_tasks.values():
                tasks.append(d)
            
            return jsonify(tasks), 200
        
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
    conn = None
    if session.get("user_id"): 
        try:
            conn= db_connect()
            cursor = conn.cursor()
            cursor.execute("""
                SELECT 1 FROM tasks WHERE id = ?""", (task_id, ))
            result = cursor.fetchone()
            if result == None:
                return jsonify({"ok": False, "message": f"task {task_id} not found"})

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
        return jsonify({"ok": False, "message": "not logged in"})

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
        return jsonify({"ok": True, "message": "logged in", "user_id": session.get("user_id"), "username":session.get("username")})
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
        conn = None
        try:
            title = request.form.get("title")
            description = request.form.get("description")
            status = request.form.get("status")
            due_date = request.form.get("due_date").replace("T", " ")
            priority = request.form.get("priority")
            tags = request.form.getlist("tags")
            

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
            if not priority:
                error = "priority is empty"
                raise ValueError(error)
            if priority not in ["low", "medium", "urgent"]:
                error = "priority is not a correct input"
                raise ValueError(error)
            if tags:
                if not set(tags).issubset(["Work","Personal","Money","Relationships","Events","Travel","Leisure","Shopping"]):
                    error = "unrecognised tag"
                    raise ValueError(error)           
            
            if error is None:
                conn = db_connect()
                cursor = conn.cursor()

                cursor.execute("""
                SELECT 1 FROM tasks WHERE id = ?""", (task_id, ))
                result = cursor.fetchone()
                if result == None:
                    return jsonify({"ok": False, "message": f"task {task_id} not found"})

                sql = """UPDATE tasks 
                SET title = ?,
                description = ?,
                status = ?,
                due_date = ?,
                priority = ?
                WHERE id = ?"""
                cursor.execute(sql, (title, description, status, due_date, priority, task_id))
                
                if tags:
                    task_tag_id = task_id
                    cursor.execute(
                        """DELETE FROM tags 
                        WHERE task_tag_id = ?""",
                        (task_tag_id,)
                    )
                    cursor.executemany(
                        """INSERT INTO tags (task_tag_id, tag)
                        VALUES (?, ?)""",
                        [(task_tag_id, tag) for tag in tags]
                    )

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
        return jsonify({"ok": False, "message": "not logged in"})

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
    conn = None
    error = None
    try:
        title = request.form.get("title")
        description = request.form.get("description")
        due_date = request.form.get("due_date").replace("T", " ")
        priority = request.form.get("priority")
        status = request.form.get("status")
        tags = request.form.getlist("tags")
        
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
            error = "description too long (>500 chars)"
            raise ValueError(error)
        if not due_date:
            error = "due date is empty"
            raise ValueError(error)
        if not status:
            error = "status is empty"
            raise ValueError(error)
        if not priority:
            error = "priority is empty"
            raise ValueError(error)
        if priority not in ["low", "medium", "urgent"]:
            error = "priority is not a correct input"
            raise ValueError(error)
        if tags:
            if not set(tags).issubset(["Work","Personal","Money","Relationships","Events","Travel","Leisure","Shopping"]):
                error = "unrecognised tag"
                raise ValueError(error)

        if error is None:
            conn = db_connect()
            cursor = conn.cursor()

            sql = """INSERT INTO tasks (user_id, title, description, due_date, priority, status)
            VALUES (?, ?, ?, ?, ?, ?)"""

            cursor.execute(sql, (session.get("user_id"),title, description, due_date, priority, status))

            if tags:
                task_tag_id = cursor.lastrowid
                cursor.executemany(
                    """INSERT INTO tags (task_tag_id, tag) VALUES (?, ?)""",
                    [(task_tag_id, tag ) for tag in tags])

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

@app.route("/api/search", methods=["GET"])
def searchTasks():
    """
    Creates a new task in the database.
    Receives SearchFormData 
                    :category must be one of 'title', 'description', 'due_date', 'status'.
                    :query must not be empty.
    
    Route: '/api/search'.
    
    Methods:
            GET.     
    
    Returns:
            dict:
            (
            ok: bool
            message: str
            search_results: dict
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
        conn=None
        try:
            category = request.args.get("search", "").strip().lower()
            query = request.args.get("search_query", "").strip().lower()
            if category not in {"title", "description", "due_date", "status"}:
                return jsonify({"ok": False, "message": "category is empty or invalid"}), 400
            if not query:
                return jsonify({"ok": False, "message": "Enter a search query"}), 400
            
            escaped_query = "%" + query.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_") + "%"
            user_id = session["user_id"]
          
            conn = db_connect()
            conn.row_factory = sqlite3.Row #returns object rather than tuple
            cursor = conn.cursor()
    
            sql = f"""
            SELECT * FROM
                (SELECT t.id AS task_id, 
                t.title AS title,
                t.description AS description, 
                t.status AS status, 
                t.due_date AS due_date, 
                t.priority AS priority,
                g.tag AS tag 
                FROM tasks t 
            LEFT JOIN tags g ON g.task_tag_id = t.id 
            WHERE t.user_id = ? 
            ORDER BY due_date ASC) AS task_search
            WHERE {category} LIKE ?  
            """
            cursor.execute(sql, (user_id, escaped_query ))
            rows= cursor.fetchall()
            raw_tasks = {}
            tasks=[]
            
            for row in rows:
                task_id = row["task_id"]
            
                if task_id not in raw_tasks:
            
                    raw_tasks[task_id] = {
                        "task_id":task_id,
                        "title": row["title"],
                        "description": row["description"],
                        "due_date": row["due_date"],
                        "status": row["status"],
                        "priority": row["priority"],
                        "tags": []
                    }
            
                if row["tag"] is not None:
                    raw_tasks[task_id]["tags"].append(row["tag"])
            
            for d in raw_tasks.values():
                tasks.append(d)
            
            result_number = len(tasks)
            if result_number ==0:
                message = "No results found"
            elif result_number ==1 :
                message = "One result found"
            else:
                message = f"{result_number} results found"
            print(tasks)
            return jsonify({"ok": True, "message": message,"search_results" : tasks}), 200

        except sqlite3.Error as e:
            print(f"database error {e}")
            return jsonify({"ok":False, "message": str(e)}), 500
        except Exception as e:
            print(f"unexpected error {e}")
            return jsonify({"ok":False, "message": str(e)}), 500
        finally:
            if conn:
                conn.close()
    else:
        return jsonify({"ok": False, "message": "not logged in or wrong ID"}), 400

@app.route("/")
def serve():
    return send_from_directory(app.static_folder, "index.html")

app.cli.add_command(db_init_cli) #flask --app app db_init

if __name__ == "__main__":
    app.run()
