import os
import google.generativeai as genai
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import pyttsx3
from dotenv import load_dotenv
import speech_recognition as sr


load_dotenv()

genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel(model_name="gemini-1.5-flash")

xapp = Flask(__name__)
CORS(xapp)

UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
xapp.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

@xapp.route("/")
def home():
    print("Rota principal / acessada")
    return render_template("index_teste.html")

@xapp.route("/upload", methods=["POST"])
def upload_files():
    if 'image' not in request.files or 'audio' not in request.files:
        return jsonify({"error": "Nenhum arquivo de imagem ou áudio encontrado"})
    
    image_file = request.files['image']
    audio_file = request.files['audio']
    
    if image_file.filename == '' or audio_file.filename == '':
        return jsonify({"error": "Nenhum arquivo selecionado"})
    
    image_path = os.path.join(UPLOAD_FOLDER, image_file.filename)
    audio_path = os.path.join(UPLOAD_FOLDER, audio_file.filename)
    image_file.save(image_path)
    audio_file.save(audio_path)

    print(f"Imagem salva em: {image_path}")
    print(f"Áudio salvo em: {audio_path}")
    
    texto_audio = transcrever_audio(audio_path)
    
    if texto_audio is None:
        return jsonify({"error": "Falha na transcrição do áudio"})
    
    try:
        genai_image = genai.upload_file(path=image_path, display_name="imagem")
        
        response = model.generate_content([genai_image, texto_audio])
        print(f"IA respondeu: {response.text}")

        engine = pyttsx3.init()
        voices = engine.getProperty('voices')
        engine.setProperty('voice', voices[0].id)  
        engine.say(response.text)
        engine.save_to_file(response.text, 'descricao.mp3')  
        engine.runAndWait()

        print("Descrição salva como 'descricao.mp3'")

        return jsonify({
            "message": "Imagem e áudio carregados com sucesso", 
            "image_filename": image_file.filename, 
            "audio_filename": audio_file.filename,
            "descricao_audio": "descricao.mp3",
            "descricao_texto": response.text 
        })

    except Exception as e:
        print(f"Erro ao processar imagem ou áudio: {e}")
        return jsonify({"error": "Erro ao processar a imagem ou áudio"})

def transcrever_audio(audio_path):
    recognizer = sr.Recognizer()
    
    with sr.AudioFile(audio_path) as source:
        audio_data = recognizer.record(source)
    
    try:
        texto = recognizer.recognize_google(audio_data, language="pt-BR")
        print("Texto transcrito:", texto)
        return texto
    except sr.UnknownValueError:
        print("Não foi possível entender o áudio.")
        return None
    except sr.RequestError as e:
        print(f"Erro ao solicitar resultados do serviço de reconhecimento de fala: {e}")
        return None

if __name__ == "__main__":
    xapp.run(debug=True, host="0.0.0.0")
