import speech_recognition as sr

recognizer = sr.Recognizer()

text = ''

def microphone():
    with sr.Microphone() as source:
        print("Ajustando para o ruído ambiente... Aguarde um momento.")
        recognizer.adjust_for_ambient_noise(source)
        print("Pronto! Pode falar.")

        # Captura o áudio do microfone
        audio = recognizer.listen(source)

        try:
            print("Reconhecendo...")
            global text
            text = recognizer.recognize_google(audio, language='pt-BR')
            print(f"Você disse: {text}")

        except sr.UnknownValueError:
            print("Desculpe, não entendi o que você disse.")
        except sr.RequestError as e:
            print(
                f"Erro ao solicitar resultados do serviço de reconhecimento de fala; {e}")
            
    return text


def transcriber():
    global text
    text = microphone()
    return text

# x = transcriber()
# print(x)