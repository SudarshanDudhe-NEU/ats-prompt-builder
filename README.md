# ATS Prompt Builder

A single-page React app that assembles a **resume tailoring prompt** from your base resume and a target job description. Paste both in, and it generates a ready-to-copy prompt you can hand to an LLM (Claude, ChatGPT, etc.) to produce a one-page, ATS-friendly tailored resume.

The generated prompt is deliberately strict about honesty: it instructs the model to treat your base resume as the only source of truth, and to report unsupported job requirements as **gaps** rather than quietly inserting keywords you can't back up.

## What it does

Fill in three fields:

| Field | Purpose | Persisted |
| --- | --- | --- |
| **Target Location** | Injected into the resume header line | Yes |
| **Base Resume** | The source of truth — nothing outside this may be claimed | Yes |
| **Job Description** | What the resume gets tailored toward | No |

The prompt updates live as you type. **Copy Tailoring Prompt** puts it on your clipboard; **Clear** resets every field.

Your base resume and target location are saved to the browser's `localStorage`, so they are still there after a reload — paste the resume once and reuse it across applications. They persist until you edit them or press **Clear**. The job description is deliberately not saved, since it changes for every role.

The prompt asks the model to return six sections: match score, strong matches, gaps, the tailored resume, keywords surfaced, and a "do not claim" list.

Everything runs in the browser. No resume or job description data leaves your machine — there is no backend and no API call. The saved resume stays in that browser's local storage on that device, so avoid using the app on a shared machine, or press **Clear** when you are done.

## Getting started

Requires Node.js 20.19+ or 22.12+ (Vite 8).

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default http://localhost:5173).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server with HMR |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Project structure

```
src/
  main.jsx     React entry point
  App.jsx      The whole app: form state + prompt template
  App.css      Component styles
  index.css    Global styles
public/        Static assets served as-is
```

The prompt template itself lives in the `tailoringPrompt` memo in [src/App.jsx](src/App.jsx) — edit it there to change the rules, resume structure, or output sections.

## Notes

Clipboard copy uses the async Clipboard API, which browsers only expose in secure contexts. Over plain `http://` on a LAN IP the copy button will report a failure — select the text in the generated prompt box instead, or use `localhost` / HTTPS.

## Tech stack

React 19 · Vite 8 · ESLint 10
