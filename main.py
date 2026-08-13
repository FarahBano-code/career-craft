from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from prompt import build_resume_prompt
from ai import generate_with_ai


# ==========================================
# FastAPI Application
# ==========================================

app = FastAPI(
    title="AI Resume Builder API",
    version="1.0.0",
    description="Backend API for the AI Resume Builder"
)


# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# Resume Request Model
# ==========================================

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

class ImproveResumeRequest(BaseModel):
    resume: str
    request: str


# ==========================================
# Home Route
# ==========================================

@app.get("/")
def home():
    return {
        "status": "success",
        "message": "AI Resume Builder Backend Running 🚀"
    }


# ==========================================
# Generate Resume
# ==========================================

@app.post("/generate-resume")
def generate_resume(data: ResumeRequest):

    try:
        # Build the AI prompt
        prompt = build_resume_prompt(data)

        # Send prompt to Groq
        resume_html = generate_with_ai(prompt)

        # Return generated resume
        return {
            "success": True,
            "resume": resume_html
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate resume: {str(e)}"
        )

# ==========================================
# Improve Resume
# ==========================================

@app.post("/improve-resume")
def improve_resume(data: ImproveResumeRequest):

    try:

        prompt = f"""
You are an expert professional resume editor.

You are editing an EXISTING resume.

CURRENT RESUME:
{data.resume}

USER'S REQUEST:
{data.request}

Your job is to improve the EXISTING resume according to the user's request.

STRICT RULES:

1. Return ONLY the complete updated resume HTML.
2. Do NOT return Markdown.
3. Do NOT use ```html or ``` anywhere.
4. Do NOT include <html>, <head>, or <body>.
5. Preserve all real information already present in the resume.
6. NEVER replace real information with phrases such as:
   "not provided"
   "not available"
   "please include"
   "add your experience"
   "add your skills"
   or similar placeholders.
7. NEVER invent jobs, degrees, companies, skills, achievements, dates, awards, or other facts.
8. If a section contains real information, preserve that information while improving it.
9. If the user's request only concerns one section, do not unnecessarily rewrite unrelated sections.
10. Keep the resume professional and concise.
11. Keep the existing HTML structure and styling classes.
12. The output must contain the complete resume, not just the changed section.
13. Do not explain what you changed.
14. Do not add advice or instructions to the user.
15. Return valid HTML only.

IMPORTANT:
The resume may contain limited information. That is acceptable.
Do NOT complain about missing information and do NOT create placeholder text.
Only improve information that actually exists.

REQUIRED ROOT STRUCTURE:

<div class="resume">
    ...
</div>
"""

        improved_resume = generate_with_ai(prompt)

        return {
            "success": True,
            "resume": improved_resume
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to improve resume: {str(e)}"
        )

    