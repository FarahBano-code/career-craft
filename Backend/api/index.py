from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from ai import generate_with_ai
from prompt import build_resume_prompt


app = FastAPI(
    title="AI Resume Builder API",
    version="1.0.0",
    description="Backend API for the AI Resume Builder"
)


class ResumeRequest(BaseModel):
    fullName: str
    email: str
    phone: str
    linkedin: str
    education: str
    skills: str
    experience: str
    projects: str
    achievements: str


@app.get("/")
def home():
    return {
        "status": "success",
        "message": "AI Resume Builder Backend Running 🚀"
    }


@app.post("/generate-resume")
def generate_resume(data: ResumeRequest):

    try:

        prompt = build_resume_prompt(data)

        resume_html = generate_with_ai(prompt)

        return {
            "success": True,
            "resume": resume_html
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate resume: {str(e)}"
        )
