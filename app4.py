import google.generativeai as genai
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from dotenv import load_dotenv as ld
import pyttsx3
import os
from werkzeug.utils import secure_filename

xapp = Flask(__name__)
CORS(xapp)

ld()
genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel(model_name="gemini-1.5-flash")

UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
xapp.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

@xapp.route("/")
def home():
    return render_template("index_teste.html")

def processa_imagem(image, text):
    try:
        genai_image = genai.upload_file(path=image, display_name="imagem")
        response = model.generate_content([
            genai_image, 
            "Sou uma pessoa cega. Com base na imagem, explique de forma simples e objetiva, sem introdução, vá direto ao ponto e seja rápido:", text
        ])
        
        print(f"> {response.text}")

        engine = pyttsx3.init()

        voices = engine.getProperty('voices')
        engine.setProperty('voice', voices[0].id)  

        engine.say(response.text)
        engine.save_to_file(response.text, 'descricao.mp3')  
        engine.runAndWait()

        print("Descrição salva como 'descricao.mp3'")

    finally:
        print("resposta ja dada fi")


@xapp.route("/upload", methods=["POST"])
def upload_files():
    image = request.files.get('image')
    text = request.form.get('text')

    if not image or not text:
        return jsonify({"error": "Imagem ou texto ausente"}), 400

    image.save(os.path.join(UPLOAD_FOLDER, secure_filename(image.filename)))
    
    text_filename = "text_recognized.txt"
    with open(os.path.join(UPLOAD_FOLDER, text_filename), "w") as f:
        f.write(text)
    
    processa_imagem(os.path.join(UPLOAD_FOLDER, secure_filename(image.filename)), text)

    return jsonify({"message": "Imagem e texto enviados com sucesso!"}), 200

if __name__ == "__main__":
    xapp.run(debug=True, host="0.0.0.0")
