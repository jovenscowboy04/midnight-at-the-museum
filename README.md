# Midnight at the Museum — AI Mystery Detective Game

A complete, playable interactive detective web application built with **JavaScript**, **Node.js**, and a dependency-free HTTP server. Investigate locations, collect clues, question three suspects, request adaptive hints, and accuse the thief.

## Start locally

1. Install Node.js 18 or newer.
2. Download/extract the project ZIP, then open a terminal in the `midnight_at_the_museum` folder.
3. Run `npm start`.
4. Visit **http://localhost:3000**.

No `npm install` is required: this project has **no third-party npm dependencies**.

## AI agent modes

**Built-in mode (default, free, no API key):** A deterministic dialogue engine responds to common questions about alibis, access, evidence, and cameras. The game runs fully without an external service. This is a scripted agent simulation, **not a generative LLM**.

**Generative AI mode (optional):** Set the `OPENAI_API_KEY` environment variable on the **server**. The app calls the OpenAI Chat Completions API to produce in-character suspect dialogue. It uses case facts, a bounded recent conversation history, and collected evidence as context. If the API is unavailable, it automatically falls back to the built-in dialogue engine. Model defaults to `gpt-4o-mini`; set `OPENAI_MODEL` to a compatible model if necessary. This feature makes billable API calls and requires a valid account/key.

On macOS/Linux: `OPENAI_API_KEY='your_key_here' npm start`.

On PowerShell: `$env:OPENAI_API_KEY='your_key_here'; npm start`.

**Never paste a key into frontend code or commit it to GitHub.** `.env.example` is a template; this server reads environment variables from the deployment platform or shell (it does not load `.env` automatically).

## How to play

1. Inspect the **East Gallery**, **Security Office**, and **Restoration Studio** to uncover six clues.
2. Select Mara, Theo, or Iris and ask questions about the theft.
3. Use **Get a hint** when needed.
4. Collect at least three clues, then select a suspect and choose **Submit Verdict**.
5. The correct answer closes the case and gives a score based on evidence completeness and wrong accusations.

## Agent architecture

- `public/index.html`, `styles.css`, `app.js`: responsive user interface, conversation panel, clue board, progress, and verdict UI.
- `server.js`: Node HTTP server, session IDs, API endpoints, secure server-side AI invocation, API error fallback.
- `game.js`: case facts, state transitions, location investigations, evidence rules, hint planner, and built-in suspect dialogue.
- `tests/game.test.js`: automated game-logic tests.

### API endpoints

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/start` | Start a new case and receive a session ID |
| GET | `/api/state` | Retrieve saved state for current session |
| POST | `/api/inspect` | Inspect location and unlock evidence |
| POST | `/api/ask` | Question a suspect (AI or built-in dialogue) |
| POST | `/api/hint` | Generate a context-sensitive hint |
| POST | `/api/accuse` | Submit accusation and calculate score |

Session ID is held in a sessionStorage browser value and sent as an `x-case-session` header. Sessions are temporarily stored in server memory, so a server restart or redeployment resets game progress. This project does not store accounts or personal data in a database.

## Run tests

`npm test`

## Deploy on Render

1. Create a **new GitHub repository** and push this entire project (except `.env` and secrets).
2. In Render, create **New → Web Service** and connect the repository.
3. Choose **Node** runtime, **Build command:** `npm install`, **Start command:** `npm start`.
4. If using the LLM, add `OPENAI_API_KEY` in **Environment** (and optional `OPENAI_MODEL`).
5. Deploy and visit the Render URL. You may use the built-in mode without any API key.

Render plans and availability may change. A free instance may sleep between visits. If you deploy to Vercel, the Node server would need to be adapted to serverless functions; this project is directly configured for **Render or another persistent Node server**.

## GitHub upload

```sh
git init
git add .
git commit -m "Build Midnight at the Museum detective game"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Replace the placeholder with your real repository address. Never commit a real API key.

## Report and presentation

The `report/` directory includes `project_report.tex` (LaTeX source) and `project_report.pdf` (compiled). **Before submitting**, replace the placeholders for student name, course, live app URL, and GitHub URL; then recompile with `pdflatex project_report.tex` (run twice if desired). Screenshots from your actual running app can be added to the report. A PDF is not evidence of an actual live deployment: deploy the project and update both links.

Suggested presentation: show case intro (30 seconds), inspect two rooms (45 seconds), question Iris and Theo (1 minute), show hints and evidence board (30 seconds), accuse Iris and explain score (45 seconds), then explain AI mode and secure server-side key storage (1 minute).

## Notes

The story, names, design, and clues are original and fictional. No real museum or actual crime is implied.
