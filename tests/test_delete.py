
def test_delete(client, auths):
    with client:
        auths.login()
        response = client.delete("/api/delete-task/1")

        assert response.json["message"] == "task 1 deleted"

    with client:
            auths.login()
            response = client.delete("/api/delete-task/500")
    
            assert response.json["message"] == "task 500 not found"