import os
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
# 1. Load variables from the .env file
load_dotenv()

# 2. Initialize the client using your saved credentials
client = ElevenLabs(
    api_key=os.getenv("ELEVENLABS_API_KEY")
)

# 3. Generate the audio stream
print("Generating audio...")
audio_generator = client.text_to_speech.convert(
    text="One crisp, dry closed hi-hat cymbal hit", 
    duration_seconds=1.0,
)

# 4. Save the generated stream into a local MP3 file
output_filename = "output.mp3"
with open(output_filename, "wb") as file:
    for chunk in audio_generator:
        file.write(chunk)

print(file_name=f"Success! Audio saved to {output_filename}")
