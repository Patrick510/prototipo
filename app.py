import google.generativeai as genai
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from dotenv import load_dotenv as ld
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
    return render_template("index.html")


def processa_imagem(image, text):
    try:
        genai_image = genai.upload_file(path=image, display_name="imagem")
        print(text)
        response = model.generate_content(
            [
                genai_image,
                f"""Descreva a imagem de forma extremamente objetiva e sucinta, 
            respondendo exclusivamente ao contexto solicitado, prefiro que não fale do ambiente diretamente, 
            tente apenas responder a minha pergunta, não se esqueça que sou deficiente visual: {text}""",
            ]
        )

        print(f"> {response.text}")

        return response.text

    finally:
        print("resposta já dada fi")


@xapp.route("/upload", methods=["POST"])
def upload_files():
    image = request.files.get("image")
    text = request.form.get("text")

    if not image or not text:
        return jsonify({"error": "Imagem ou texto ausente"}), 400

    image_path = os.path.join(UPLOAD_FOLDER, secure_filename(image.filename))
    image.save(image_path)

    mensagem_gerada = processa_imagem(image_path, text)

    return jsonify({"message": mensagem_gerada}), 200


if __name__ == "__main__":
    xapp.run(debug=True, host="0.0.0.0", port=5000)
