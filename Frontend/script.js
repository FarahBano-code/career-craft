// javascript
// ============================================================
// AI RESUME BUILDER - COMPLETE SCRIPT
// ============================================================

console.log("My JS Loaded");


// ============================================================
// DOM ELEMENTS
// ============================================================

const form = document.getElementById("resumeForm");
const output = document.getElementById("resumeOutput");
const button = document.getElementById("generateBtn");

const downloadPdfBtn = document.getElementById("downloadPdfBtn");

const improveResumeBtn = document.getElementById("improveResumeBtn");
const improveBox = document.getElementById("improveBox");
const applyImprovementBtn = document.getElementById("applyImprovementBtn");
const improvementRequest = document.getElementById("improvementRequest");

const templateCards = document.querySelectorAll(".template-card");


// ============================================================
// BACKEND URL
// ============================================================

const API_URL = "http://127.0.0.1:8000";


// ============================================================
// SELECTED TEMPLATE
// ============================================================

let selectedTemplate = "classic";


// ============================================================
// FORM SUBMIT
// ============================================================

form.addEventListener("submit", generateResume);


// ============================================================
// GENERATE RESUME
// ============================================================

async function generateResume(event) {

    event.preventDefault();

    const formData = getFormData();

    if (!validate(formData)) {
        return;
    }

    showLoading();

    button.classList.add("loading-btn");
    button.innerText = "Generating...";

    try {

        const response = await fetch(
            `${API_URL}/generate-resume`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(formData)
            }
        );

        if (!response.ok) {
            throw new Error("Failed to generate resume.");
        }

        const data = await response.json();

        if (!data.resume) {
            throw new Error("No resume was returned by the server.");
        }

        showResume(data.resume);

        // Apply currently selected template
        applySelectedTemplate();

    }

    catch (error) {

        console.error("Resume generation error:", error);

        showError(error.message);

    }

    finally {

        button.classList.remove("loading-btn");

        button.innerText = "Generate Resume";

    }

}


// ============================================================
// GET FORM DATA
// ============================================================

function getFormData() {

    return {

        fullName:
            document.getElementById("fullName").value.trim(),

        email:
            document.getElementById("email").value.trim(),

        phone:
            document.getElementById("phone").value.trim(),

        linkedin:
            document.getElementById("linkedin").value.trim(),

        education:
            document.getElementById("education").value.trim(),

        skills:
            document.getElementById("skills").value.trim(),

        experience:
            document.getElementById("experience").value.trim(),

        projects:
            document.getElementById("projects").value.trim(),

        achievements:
            document.getElementById("achievements").value.trim()

    };

}


// ============================================================
// VALIDATION
// ============================================================

function validate(data) {

    if (data.fullName === "") {

        alert("Please enter your name.");

        return false;

    }

    if (data.education === "") {

        alert("Education is required.");

        return false;

    }

    if (data.skills === "") {

        alert("Skills are required.");

        return false;

    }

    return true;

}


// ============================================================
// LOADING
// ============================================================

function showLoading() {

    output.innerHTML = `

        <div class="loading">

            <div class="spinner"></div>

            <h3>
                Generating your professional resume...
            </h3>

            <p>
                AI is preparing your resume.
            </p>

        </div>

    `;

}


// ============================================================
// SHOW GENERATED RESUME
// ============================================================

function showResume(resume) {

    output.innerHTML = `

        <div class="generated-resume fade-in">

            ${resume}

        </div>

    `;

}


// ============================================================
// ERROR
// ============================================================

function showError(message) {

    output.innerHTML = `

        <div class="alert alert-error">

            <h3>Something went wrong</h3>

            <p>
                ${message}
            </p>

        </div>

    `;

}


// ============================================================
// RESUME TEMPLATES
// ============================================================

templateCards.forEach(function (card) {

    card.addEventListener("click", function () {

        // Remove active state from all cards
        templateCards.forEach(function (item) {

            item.classList.remove("active");

        });


        // Activate clicked card
        card.classList.add("active");


        // Get selected template
        selectedTemplate = card.dataset.template;


        console.log(
            "Selected template:",
            selectedTemplate
        );


        // Apply template immediately
        applySelectedTemplate();

    });

});


// ============================================================
// APPLY SELECTED TEMPLATE
// ============================================================

function applySelectedTemplate() {

    /*
       The AI-generated resume is inside #resumeOutput.

       We look for the .resume element generated by the AI.
    */

    const resume = document.querySelector(
        "#resumeOutput .resume"
    );


    // If no resume exists yet
    if (!resume) {

        console.log(
            "No generated resume found yet."
        );

        return;

    }


    // Remove previous template classes

    resume.classList.remove(
        "template-classic",
        "template-modern",
        "template-minimal"
    );


    // Add currently selected template

    resume.classList.add(
        `template-${selectedTemplate}`
    );


    console.log(
        "Applied template:",
        selectedTemplate
    );

}


// ============================================================
// DOWNLOAD / PRINT RESUME
// ============================================================

downloadPdfBtn.addEventListener(
    "click",
    function () {

        const resume =
            document.querySelector(
                "#resumeOutput .resume"
            );


        if (!resume) {

            alert(
                "Please generate your resume first."
            );

            return;

        }


        window.print();

    }
);


// ============================================================
// IMPROVE RESUME - OPEN BOX
// ============================================================

improveResumeBtn.addEventListener(
    "click",
    function () {

        improveBox.classList.toggle("active");


        if (
            improveBox.classList.contains("active")
        ) {

            improvementRequest.focus();

        }

    }
);


// ============================================================
// IMPROVE RESUME - SEND REQUEST
// ============================================================

applyImprovementBtn.addEventListener(
    "click",
    async function () {

        const request =
            improvementRequest.value.trim();


        // Validate improvement request

        if (!request) {

            alert(
                "Please describe what you want to improve."
            );

            return;

        }


        // Find generated resume

        const resume =
            document.querySelector(
                "#resumeOutput .resume"
            );


        if (!resume) {

            alert(
                "Please generate a resume first."
            );

            return;

        }


        // Disable button while processing

        applyImprovementBtn.disabled = true;

        applyImprovementBtn.textContent =
            "Improving...";


        try {

            const response = await fetch(
                `${API_URL}/improve-resume`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        resume:
                            resume.innerHTML,

                        request:
                            request

                    })

                }
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to improve resume."
                );

            }


            const result =
                await response.json();


            if (!result.resume) {

                throw new Error(
                    "No improved resume was returned."
                );

            }


            // Replace resume content

            resume.innerHTML =
                result.resume;


            // Re-apply selected template

            applySelectedTemplate();


            // Clear improvement request

            improvementRequest.value = "";


        }

        catch (error) {

            console.error(
                "Resume improvement error:",
                error
            );

            alert(
                "Could not improve the resume. Please try again."
            );

        }

        finally {

            applyImprovementBtn.disabled =
                false;

            applyImprovementBtn.textContent =
                "Apply Improvement";

        }

    }
);
