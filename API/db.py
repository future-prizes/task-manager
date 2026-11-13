import sqlite3
import click
from flask import current_app

def get_db_path():
    """Returns database filepath from app object in app.py.
    """
    return current_app.config["DB_PATH"]

def db_init():
    """
    Reads db.sql.

    Creates database if not exists, else creates connection to it.

    Executes db.sql.
    """
    with open("db.sql", "r", encoding = "utf-8") as s:
        schema = s.read()

    with sqlite3.connect(get_db_path()) as con:
        con.executescript(schema)

def db_connect():
    """Returns connection to database"""
    return  sqlite3.connect(get_db_path(), detect_types=sqlite3.PARSE_DECLTYPES)


@click.command('db_init')
def db_init_cli():
    """Adds db_init to cli command in flask"""
    db_init()
    print("Database started")
