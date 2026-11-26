import pytest
from flask import session

@pytest.mark.parametrize(("title", "description", "due_date", "status", "priority", "tags", "message"),(
    ("","","","","","", "title is empty"),
    ("test","","","","","", "description is empty"),
    ("test", "test_desc","","","","", "due date is empty"),
    ("test","test_desc","2000-01-01 00:00:00","","","", "status is empty"),
    ("test","test_desc","2000-01-01 00:00:00","completed","","", "priority is empty"),
    ("test","test_desc","2000-01-01 00:00:00","completed","urgent","Money", "task 1 updated"),
    ("test","test_desc","2000-01-01 00:00:00","completed","silly","Money", "priority is not a correct input"),
    ("test","test_desc","2000-01-01 00:00:00","completed","urgent","silly", "unrecognised tag"),
))
def test_update_post(auths, client, title, description, due_date, status, priority, tags, message):
    auths.login()

    with client:
        response = client.patch("/api/update-task/1",
        data = {
            "title": title,
            "description": description,
            "due_date": due_date,
            "status": status,
            "priority": priority,
            "tags": tags
         }
        )
        assert message in response.json["message"]

def test_update_nonexistent_post(client, auths):
    auths.login()

    with client:
        response = client.patch("/api/update-task/500", 
            data = {
                "title": "test",
                "description": "description",
                "due_date": "due_date",
                "status": "to do",
                "priority": "urgent"
            })
        assert response.json["message"] == "task 500 not found"