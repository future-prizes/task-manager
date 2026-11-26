import sqlite3
import pytest
from db import db_connect

def test_open_db(app):
    with app.app_context():
        conn = db_connect()
        assert conn 

        conn.close()

    with pytest.raises(sqlite3.ProgrammingError) as er:
        conn.execute("SELECT 1")
        print(str(er.value))
        assert "closed" in str(er.value)

def test_db_init_command(runner, monkeypatch):
    class Recorder:
        called = False

    def caller():
        Recorder.called = True

    monkeypatch.setattr("db.db_init", caller) #replaces db_init() in API.db with the caller function
    result = runner.invoke(args = ["db-init"])
    assert "Database started" in result.output
    assert Recorder.called


        

    

