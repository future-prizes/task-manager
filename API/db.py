import sqlite3
import click
from flask import current_app, has_app_context
from pathlib import Path

def get_db_path():
    """Returns database filepath from app object in app.py.
    """
    if has_app_context() and "DATABASE" in current_app.config:
        return current_app.config["DATABASE"]
    return current_app.config["DB_PATH"]

def db_init():
    """
    Reads db.sql.

    Creates database if not exists, else creates connection to it.

    Executes db.sql.
    """
    schema_location = Path(__file__).with_name("db.sql")
    try:
        with schema_location.open("r", encoding = "utf-8") as s:
            schema = s.read()

        with sqlite3.connect(get_db_path()) as con:
            con.executescript(schema)
    finally:
        con.close()

def db_connect():
    """Returns connection to database"""
    return  sqlite3.connect(get_db_path(), detect_types=sqlite3.PARSE_DECLTYPES)


@click.command('db-init')
def db_init_cli():
    """Adds db_init to cli command in flask"""
    db_init()
    click.echo("Database started")
