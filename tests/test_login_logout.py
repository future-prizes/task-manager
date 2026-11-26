from flask import session

import pytest

def test_login(client, auths):
    response = auths.login()
    assert response.json["ok"] #asserts that response is ok and correct username is returned
    assert response.json["username"] == "test1"

    with client:
        client.get("/api/")
        assert session.get("user_id") ==1 #asserts session is set to the user id of the logged in user

@pytest.mark.parametrize(("username","password", "message"),(
    ("wrong", "test", "user not found"),
    ("test1", "wrong", "Wrong password"),))
def test_wrong_login(auths, username, password, message):
    response = auths.login(username, password)
    assert message in response.json["message"] #asserts error message returned matches the cases where a wrong password or username is given

def test_alreadyloggedout(auths):
    response = auths.logout()
    assert not response.json["ok"]

def test_logout(auths,client):
    login_response = auths.login()
    assert login_response.json["ok"]

    logout_response = auths.logout()
    assert "logged-out" in logout_response.json["message"]

    with client:
        client.get("/api/")
        assert not session.get("user_id")

    


