from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
cors = CORS(app, origins='*')

FACEIT_API_KEY = "f7f1bb20-0641-462b-96ab-def0baf31f6b"
@app.route("/api/users", methods=['GET'])
def users():
    return jsonify(
        {
            "users": [
                'arpan',
                'zach',
                'jesse'
            ]
        }
    )
def merge_two_dicts(x, y):
    z = x.copy()   # start with keys and values of x
    z.update(y)    # modifies z with keys and values of y
    return z

@app.route("/api/faceit/<path:path>", methods=['GET'])
def proxy_faceit(path):
    path = request.path.replace('/api/faceit/', '')

    url = f'http://faceit.com/api/{path}'
    print('path: ', path)
    endpoint = f'{url}/{path}'
    print('args: ', request.args)
    print('Proxying to: ', endpoint)
    print('working')
    print(url)
    if (request.args.get("championshipIdPlayoffs") and request.args.get("championshipIdRegular")):
        url = f'{url}?participantId={request.args.get("participantId")}&participantType={request.args.get("participantType")}&championshipId={request.args.get("championshipIdPlayoffs")}&championshipId={request.args.get("championshipIdRegular")}'
    
    try:
        response = requests.get(url, params=request.args)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route("/api/faceit/championships/v1/matches", methods=['GET'])
def get_championship_matches():
    print('request.args: ', request.args)

    if (request.args.get("championshipIdPlayoffs") and request.args.get("championshipIdRegular")):
        url = f'http://faceit.com/api/championships/v1/matches?participantId={request.args.get("participantId")}&participantType={request.args.get("participantType")}&championshipId={request.args.get("championshipIdPlayoffs")}&championshipId={request.args.get("championshipIdRegular")}&limit={request.args.get("limit")}&offset={request.args.get("offset")}&sort={request.args.get("sort")}'
        url2 = f'http://faceit.com/api/championships/v1/matches?participantId={request.args.get("participantId")}&participantType={request.args.get("participantType")}&championshipId={request.args.get("championshipIdPlayoffs")}&championshipId={request.args.get("championshipIdRegular")}&limit={request.args.get("limit")}&offset=20&sort={request.args.get("sort")}'
        print('APIurl: ', url)
        try:
            response = requests.get(url)
            response2 = requests.get(url2)

            print('response2: ', response2.json())

            return jsonify([response.json(), response2.json()]), response.status_code
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    else:
        url = f'http://faceit.com/api/championships/v1/matches?participantId={request.args.get("participantId")}&participantType={request.args.get("participantType")}&championshipId={request.args.get("championshipId")}&limit={request.args.get("limit")}&offset={request.args.get("offset")}&sort={request.args.get("sort")}'
        print('APIurl: ', url)
        try:
            response = requests.get(url)
            return jsonify(response.json()), response.status_code
        except Exception as e:
            return jsonify({'error': str(e)}), 500
if __name__ == '__main__':
    app.run(debug=True, port=8080)