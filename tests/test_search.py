import pytest

@pytest.mark.parametrize(("category", "query", "message"), (
    ("","", "category is empty or invalid"),
    ("title", "", "Enter a search query"),
    ("title", "test", "One result found"),
    ("description", "silly", "No results found"),
))
def test_search(client, auths, category, query, message):
    auths.login()

    response = client.get("/api/search", 
        query_string = {
            "search":category,
            "search_query": query,
            "message": message
        })

    assert message in response.json["message"]