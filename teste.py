import os
from pydub import AudioSegment
import speech_recognition as sr
import google.generativeai as genai

genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel(model_name="gemini-1.5-flash")

def transcrever_audio(audio_path):
    recognizer = sr.Recognizer()

    if not audio_path.endswith('.wav'):
        audio = AudioSegment.from_file(audio_path)
        audio_path = audio_path.rsplit('.', 1)[0] + '.wav'
        audio.export(audio_path, format='wav')

    with sr.AudioFile(audio_path) as source:
        audio = recognizer.record(source)
    try:
        texto = recognizer.recognize_google(audio, language="pt-BR")
        return texto
    except sr.UnknownValueError:
        return "Não foi possível entender o áudio"
    except sr.RequestError:
        return "Erro na solicitação ao serviço de reconhecimento"

def processar_com_gemini(texto):
    try:
        response = model.generate(text=texto)
        return response['text']
    except Exception as e:
        return f"Erro ao processar com Gemini: {str(e)}"

audio_path = 'C:/estudos/4 PERIODO/extensao/prototipo/uploads/gravacao.webm'

texto_transcrito = transcrever_audio(audio_path)
print(f"Texto Transcrito: {texto_transcrito}")

texto_processado = processar_com_gemini(texto_transcrito)
print(f"Texto Processado pelo Gemini: {texto_processado}")
