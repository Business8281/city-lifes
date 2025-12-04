import json

json_path = '/Users/praneeth/city-lifes-1/testsprite_tests/tmp/test_results.json'
tc014_path = '/Users/praneeth/city-lifes-1/testsprite_tests/TC014_Report_Listings_and_Users_with_Admin_Moderation_Workflow.py'

with open(tc014_path, 'r') as f:
    tc014_code = f.read()

with open(json_path, 'r') as f:
    data = json.load(f)

for test in data:
    if test['title'].startswith('TC014'):
        test['code'] = tc014_code
        print(f"Updated code for {test['title']}")
        break

with open(json_path, 'w') as f:
    json.dump(data, f, indent=2)
