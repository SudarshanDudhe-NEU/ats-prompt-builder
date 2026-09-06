import { useEffect, useMemo, useRef, useState } from "react";

export default function ResumeTailoringPromptBuilder() {
  const [location, setLocation] = useState("");
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [copyState, setCopyState] = useState("idle");
  const copyTimer = useRef(null);

  const tailoringPrompt = useMemo(() => {
    return `
You are an expert resume strategist, ATS optimization specialist, and technical recruiter.

Your task is to tailor the candidate's resume for the supplied job description while remaining strictly truthful to the candidate's actual experience.

TARGET LOCATION:
${location || "[TARGET LOCATION]"}

============================================================
CORE RULES
============================================================

1. Treat the BASE RESUME as the only source of truth.

2. NEVER invent:
- Employers
- Projects
- Technologies
- Tools
- Certifications
- Leadership experience
- Production experience
- Metrics
- Responsibilities
- Years of experience
- Domain experience

3. You may:
- Reframe existing experience
- Reorder skills
- Reword bullets
- Emphasize relevant technologies
- Surface existing keywords more prominently
- Combine closely related concepts already supported by the resume

4. Do NOT add a JD keyword merely to improve ATS score unless the resume supports it.

5. If an important JD requirement is unsupported, list it separately as a GAP instead of inserting it into the resume.

6. Preserve:
- Employer names
- Job titles
- Employment dates
- Education
- Chronological order

7. Preserve approximately the existing number of bullets for each employer.
Only reduce bullet count if necessary to keep the resume to one page.

8. Do not mirror the job description word-for-word.

9. Write naturally and professionally. Avoid generic AI-generated filler.

10. Avoid excessive keyword stuffing.

============================================================
TARGET RESUME
============================================================

Create a ONE-PAGE ATS-FRIENDLY resume.

Use this structure:

[CANDIDATE NAME]

[Target Location] | Phone | Email | LinkedIn | GitHub

PROFESSIONAL SUMMARY

TECHNICAL SKILLS

WORK EXPERIENCE

EDUCATION

============================================================
PROFESSIONAL SUMMARY RULES
============================================================

Write approximately 3-5 lines.

Prioritize the most important qualifications from the JD that are genuinely supported by the candidate's experience.

Include:
- Years of experience from the base resume
- Primary programming languages
- Core frameworks
- Architecture experience
- Cloud/DevOps experience
- Production/support experience
- Relevant AI experience if the JD asks for it

Do not mention the target employer by name.

============================================================
TECHNICAL SKILLS RULES
============================================================

Include only:
A. Skills explicitly present in the base resume
OR
B. Skills clearly supported by experience bullets.

Prioritize JD-relevant skills.

Recommended ordering:

Languages
Frameworks
Architecture/API
Frontend
Cloud
Containers
Databases
DevOps/CI-CD
Testing
Security
Observability
AI-assisted Engineering

Remove low-value skills when space is limited.

============================================================
EXPERIENCE BULLET RULES
============================================================

For every bullet:

- Start with a strong action verb.
- Explain what was built, designed, deployed, improved, supported, or solved.
- Include technologies naturally.
- Highlight scalability, reliability, security, testing, or operational impact when supported.
- Prefer concrete results already present in the resume.
- Keep bullets concise enough for a one-page resume.

Prioritize experience matching the JD.

For backend/software engineering roles prioritize:
Java
Spring Boot
Microservices
REST APIs
Distributed Systems
SQL/NoSQL
AWS
Docker
Kubernetes
CI/CD
Testing
Production Support
Observability
Security
System Design

For full-stack roles additionally prioritize:
React
Angular
JavaScript
TypeScript

For AI-heavy roles additionally prioritize:
AI-assisted development
OpenAI APIs
Claude
Amazon Q
GitHub Copilot
AI output validation
AI-assisted testing
AI-assisted troubleshooting

Only include these if actually supported by the base resume.

============================================================
ATS ANALYSIS
============================================================

Before generating the resume, privately compare the JD against the base resume.

Identify:

1. Strong Matches
2. Partial Matches
3. Missing/Unsupported Requirements
4. Highest-value ATS Keywords
5. Keywords that should NOT be added because they are unsupported

Then tailor accordingly.

============================================================
OUTPUT
============================================================

Return exactly these sections:

1. MATCH SCORE
Give an estimated 0-100% match score.

2. STRONG MATCHES
Briefly identify major areas of alignment.

3. GAPS
List important JD requirements not supported by the resume.

4. TAILORED RESUME
Return the complete one-page resume.

5. KEYWORDS ADDED/EMPHASIZED
List the JD keywords you legitimately surfaced from the candidate's existing experience.

6. DO NOT CLAIM
List important JD technologies or responsibilities that should not be claimed without real experience.

============================================================
BASE RESUME
============================================================

${resume || "[PASTE BASE RESUME HERE]"}

============================================================
JOB DESCRIPTION
============================================================

${jobDescription || "[PASTE JOB DESCRIPTION HERE]"}
`.trim();
  }, [location, resume, jobDescription]);

  const flashCopyState = (state) => {
    clearTimeout(copyTimer.current);
    setCopyState(state);
    copyTimer.current = setTimeout(() => setCopyState("idle"), 1500);
  };

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(tailoringPrompt);
      flashCopyState("copied");
    } catch {
      // Clipboard API is unavailable in insecure contexts (e.g. http://<lan-ip>)
      // and can be blocked by permissions.
      flashCopyState("error");
    }
  };

  const clearAll = () => {
    setLocation("");
    setResume("");
    setJobDescription("");
    clearTimeout(copyTimer.current);
    setCopyState("idle");
  };

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Resume Tailoring Prompt Builder</h1>

      <p>
        Paste your base resume and target job description. The generated prompt
        will optimize the resume for ATS while preventing unsupported experience
        from being added.
      </p>

      <div style={{ marginBottom: "18px" }}>
        <label htmlFor="target-location">
          <strong>Target Location</strong>
        </label>

        <input
          id="target-location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Jersey City, NJ"
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "6px",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ marginBottom: "18px" }}>
        <label htmlFor="base-resume">
          <strong>Base Resume</strong>
        </label>

        <textarea
          id="base-resume"
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          placeholder="Paste your complete base resume here..."
          rows={18}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "6px",
            boxSizing: "border-box",
            fontFamily: "monospace",
          }}
        />
      </div>

      <div style={{ marginBottom: "18px" }}>
        <label htmlFor="job-description">
          <strong>Job Description</strong>
        </label>

        <textarea
          id="job-description"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the target job description here..."
          rows={18}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "6px",
            boxSizing: "border-box",
            fontFamily: "monospace",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "18px",
        }}
      >
        <button
          onClick={copyPrompt}
          style={{
            padding: "10px 18px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {copyState === "copied"
            ? "Copied!"
            : copyState === "error"
              ? "Copy failed — select the text below"
              : "Copy Tailoring Prompt"}
        </button>

        <button
          onClick={clearAll}
          style={{
            padding: "10px 18px",
            cursor: "pointer",
          }}
        >
          Clear
        </button>
      </div>

      <div>
        <h2>Generated Prompt</h2>

        <textarea
          id="generated-prompt"
          aria-label="Generated prompt"
          value={tailoringPrompt}
          readOnly
          rows={35}
          style={{
            width: "100%",
            padding: "12px",
            boxSizing: "border-box",
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
          }}
        />
      </div>
    </div>
  );
}
