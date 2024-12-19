from flask import Flask
from speechText import microphone

app = Flask(__name__)

@app.route('/')
def index():
    text = microphone()
    return


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

