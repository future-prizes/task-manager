import pytest

@pytest.mark.parametrize(("title", "description", "due_date", "status", "priority", "tags", "message"),(
    ("","","","","","", "title is empty"),
    ("test","","","","","", "description is empty"),
    ("test", "test_desc","","","","", "due date is empty"),
    ("test","test_desc","2000-01-01 00:00:00","","","", "status is empty"),
    ("test","test_desc","2000-01-01 00:00:00","completed","","", "priority is empty"),
    ("test","test_desc","2000-01-01 00:00:00","completed","urgent","Money", "New task added"),
    ("test","test_desc","2000-01-01 00:00:00","completed","silly","Money", "priority is not a correct input"),
    ("test","test_desc","2000-01-01 00:00:00","completed","urgent","silly", "unrecognised tag"),
))
def test_new_post(auths, client, title, description, due_date, status, priority, tags, message):
    auths.login()

    response = client.post("/api/new-post",
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