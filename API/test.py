input_dict = {3: 
              {'task_id': 3, 
               'title': 'jgkg', 
               'description': 'fd', 
               'due_date': 
               '2026-11-15 22:09', 
               'status': 'to do', 
               'priority': 'low', 
               'tags': ['Shopping', 'Money']
               }}

def unzipper(dic=dict):
    out = [] 
    for data in dic.values():
        out.append(data)
    return out

result = unzipper(input_dict)

print(result)