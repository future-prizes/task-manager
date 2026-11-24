import pytest
import tempfile
import os
from API.db import db_init, db_connect
from API.app import app as flask_app

with open(os.path.join(os.path.dirname(__file__),"dummy.sql"), "r", encoding = "utf-8") as f:
    _data_sql = f.read()

@pytest.fixture
def app():
    db_fd, db_path = tempfile.mkstemp()

    flask_app.config.update({
        "TESTING": True,
        "DATABASE": db_path
    })

    with flask_app.app_context():
        db_init()
        con = db_connect()
        try:
            con.executescript(_data_sql)
        finally:
            con.close()

    yield flask_app

    os.close(db_fd)
    os.remove(db_path)

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def runner(app):
    return app.test_cli_runner()