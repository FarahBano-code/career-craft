def build_resume_prompt(data):

    return f"""
You are a professional resume writer.

Create a clean, modern, ATS-friendly professional resume
using the information provided below.

IMPORTANT RULES:

1. Return ONLY HTML.
2. Do NOT use markdown.
3. Do NOT include ```html.
4. Do NOT write explanations.
5. Do NOT invent information.
6. If a field is empty, omit that section.
7. Keep the resume concise and professional.

Use EXACTLY this structure:

<div class="resume">

    <header class="resume-header">

        <h1>{data.fullName}</h1>

        <div class="contact-info">
            <span>{data.email}</span>
            <span>{data.phone}</span>
            <span>{data.linkedin}</span>
        </div>

    </header>

    <section class="resume-section">
        <h2>Professional Summary</h2>
        <p>...</p>
    </section>

    <section class="resume-section">
        <h2>Experience</h2>
        <p>...</p>
    </section>

    <section class="resume-section">
        <h2>Education</h2>
        <p>...</p>
    </section>

    <section class="resume-section">
        <h2>Skills</h2>
        <p>...</p>
    </section>

    <section class="resume-section">
        <h2>Projects</h2>
        <p>...</p>
    </section>

    <section class="resume-section">
        <h2>Achievements</h2>
        <p>...</p>
    </section>

</div>

USER INFORMATION:

Name:
{data.fullName}

Email:
{data.email}

Phone:
{data.phone}

LinkedIn:
{data.linkedin}

Education:
{data.education}

Skills:
{data.skills}

Experience:
{data.experience}

Projects:
{data.projects}

Achievements:
{data.achievements}
"""