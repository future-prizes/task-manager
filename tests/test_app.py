from app import app

def test_con(app):
    assert app.testing

def test_api(client):
    response = client.get("/api/") 
    assert response.json["message"] =="not logged in"