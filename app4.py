from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename

xapp = Flask(__name__)
CORS(xapp)

UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
xapp.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

@xapp.route("/")
def home():
    return render_template("index_teste.html")

@xapp.route("/upload", methods=["POST"])
def upload_files():
    image = request.files.get('image')
    audio = request.files.get('audio')
    if not image or not audio:
        return jsonify({"error": "Arquivos ausentes"}), 400

    image.save(os.path.join(UPLOAD_FOLDER, secure_filename(image.filename)))
    audio.save(os.path.join(UPLOAD_FOLDER, secure_filename(audio.filename)))
    return jsonify({"message": "Arquivos enviados com sucesso!"}), 200

if __name__ == "__main__":
    xapp.run(debug=True, host="0.0.0.0")
