from flask import Flask, render_template, request
from speechText import transcriber

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def start():
    record = ''  
    speech_text = 'Aqui aparecerá o texto transcrito' 

    if request.method == 'POST':
        selection = request.form['selection']

        if selection == 'record':
            record = 'Gravando'
            speech_text = transcriber() 

            if speech_text != '':
                record = 'Gravação finalizada'


        return render_template('transcriber.html', record=record, speech_text=speech_text)

    return render_template('transcriber.html', record=record, speech_text=speech_text)


@app.route('/new_index')
def index():

    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

