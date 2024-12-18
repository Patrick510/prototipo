import speech_recognition as sr
import os

def transcrever_audio(audio_path):
    r = sr.Recognizer()
    with sr.AudioFile(audio_path) as source:
        audio = r.record(source)
        try:
            text = r.recognize_google(audio, language="pt-BR")
            with open("transcricao.txt", "w") as arq:
                arq.write(text)
            print(text)
            return text 
        except sr.UnknownValueError:
            print("Google Speech Recognition não conseguiu entender o áudio")
            return None

# Usando string "raw" para o caminho
audio_path = r'C:\estudos\4 PERIODO\extensao\prototipo\uploads\gravacao.wav'
texto_audio = transcrever_audio(audio_path)
