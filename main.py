import os
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
from pathlib import Path
# 1. Load variables from the .env file
load_dotenv()

# 2. Initialize the client using your saved credentials
client = ElevenLabs(
    api_key=os.getenv("ELEVENLABS_API_KEY")
)

# generates a hi-hat sound
closed_hi_hat = client.text_to_sound_effects.convert(
    text="One crisp, dry closed hi-hat cymbal hit", 
    duration_seconds=0.3,
)
kick = client.text_to_sound_effects.convert(
    text="A single punchy electronic kick drum hit with deep bass, a sharp attack, and a short decay. Clean, dry sound. No extra percussion.", 
    duration_seconds=0.3,
)
snare = client.text_to_sound_effects.convert(
    text="A single punchy snare drum hit with a sharp crack, crisp high-end, and a tight, short decay. Clean, dry sound. No extra percussion.", 
    duration_seconds=0.3,
)
low_tom = client.text_to_sound_effects.convert(
    text="A single deep, resonant low tom drum hit with a warm, hollow boom and a short decay. Clean, dry sound. No extra percussion.", 
    duration_seconds=0.3,
)
open_hi_hat = client.text_to_sound_effects.convert(
    text="A single deep, resonant low tom drum hit with a warm, hollow boom and a short decay. Clean, dry sound. No extra percussion.", 
    duration_seconds=0.3,
)
high_tom = client.text_to_sound_effects.convert(
    text="A single deep, resonant low tom drum hit with a warm, hollow boom and a short decay. Clean, dry sound. No extra percussion.", 
    duration_seconds=0.3,
)
bass = client.text_to_sound_effects.convert(
    text="A single deep, resonant low tom drum hit with a warm, hollow boom and a short decay. Clean, dry sound. No extra percussion.", 
    duration_seconds=0.3,
)
shaker = client.text_to_sound_effects.convert(
    text="A single deep, resonant low tom drum hit with a warm, hollow boom and a short decay. Clean, dry sound. No extra percussion.", 
    duration_seconds=0.3,
)
drums = [
    (closed_hi_hat, "closed_hi_hat"),
    (kick, "kick"),
    (snare, "snare"),
    (low_tom, "low_tom"),
    (open_hi_hat, "open_hi_hat"),
    (high_tom, "high_tom"),
    (bass, "bass"),
    (shaker, "shaker")
]
# Create the sounds folder if it doesn't exist
Path("sounds").mkdir(exist_ok=True)
# stores the hi-hat in a file named hi-hat.mp3
for drum, drum_name in drums:
    output_filename = "sounds/" + drum_name + ".mp3"
    with open(output_filename, "wb") as file:
        for chunk in drum:
            file.write(chunk)
    print(f"Success! Audio saved to {output_filename}")
