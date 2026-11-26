import pytest
from flask import session

@pytest.mark.parametrize(("username", "email", "password", "message"), (
    ("", "", "", "Username too short"),
    ("new_test", "", "", "Email in incorrect format"),
    ("new_test", "new_test@email.com", "", "Password must be at least 6 characters"),
    ("new_test", "new_test@email.com", "sillypass", "New user new_test registered"),
))
def test_register_validation(client, username, email, password, message):
    response = client.post("/api/register",
            data = {
            "username" : username,
            "email": email,
            "password" : password
            })
    assert message in response.json["message"]

def test_register(auths, client):
    client.post("/api/register",
        data= {
        "username": "new_test",
        "email": "new_test@email.com",
        "password": "sillypass"
        })
    with client:
        auths.login("new_test", "sillypass")
        assert session.get("user_id") == 3