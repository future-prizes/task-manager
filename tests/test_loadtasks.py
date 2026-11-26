
def test_loadtasks_notloggedin(auths, client):
    with client:
        response = client.get("/api/load-tasks/1")
        assert response.json.get("message") == "not logged in or wrong ID"

def test_loadtasks(auths, client):
    auths.login()

    response = client.get("/api/load-tasks/1")
    assert len(response.json) == 2