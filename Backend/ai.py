import os
from dotenv import load_dotenv
from groq import Groq

# Load variables from .env
load_dotenv()

# Get API key
api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise ValueError("GROQ_API_KEY is missing from .env")

# Create Groq client
client = Groq(api_key=api_key)

# Model
MODEL_NAME = os.getenv(
    "MODEL_NAME",
    "llama-3.3-70b-versatile"
)


def generate_with_ai(prompt: str) -> str:
    """
    Send a prompt to Groq and return the AI response.
    """

    response = client.chat.completions.create(
        model=MODEL_NAME,

        messages=[
            {
                "role": "system",
                "content": (
                    "You are a professional resume writer. "
                    "Follow the user's instructions exactly."
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ],

        temperature=0.4,
        max_tokens=2500
    )

    return response.choices[0].message.content