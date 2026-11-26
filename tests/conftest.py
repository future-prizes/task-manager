import pytest
import tempfile
import os
from db import db_init, db_connect
from app import app as flask_app

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

class Authoriser(object):
    def __init__(self, client):
        self.client = client

    def login(self, username ="test1", password="test"):
        return self.client.post(
            "/api/login",
            data = {"username": username, "password": password}
        )

    def logout(self):
        return self.client.get(
            "/api/logout"
        )

@pytest.fixture
def auths(client):
    return Authoriser(client)