
# OpenClaw Desktop Assistant (Local Build)

A conversational UI-first desktop assistant wrapper for **OpenClaw** browser automation.

## 🏗 Architecture Overview
- **Frontend**: React + TypeScript + Tailwind CSS.
- **Desktop Wrapper**: Tauri (Rust).
- **Automation Layer**: OpenClaw CLI Wrapper.
- **LLM Routing**: Automatically switches between **Gemini 3 Flash** (Cloud) and **Ollama Phi-3** (Local).
- **Persistence**: Local SQLite database for agent configs and execution logs.

## 🧠 LLM Model Switching
The `LLMService` class acts as a router:
1. It checks for a Gemini API Key in the environment.
2. If found, it routes complex reasoning and post synthesis to **Gemini 3 Flash**.
3. If missing (or on first run), it routes to a local **Ollama** server running **Phi-3** on `localhost:11434`.

## 🤖 Working Agents
### 1. Trending LinkedIn Agent (Agent 1)
- **Goal**: Synthesize AI and OpenClaw ecosystem news.
- **Safety**: Strict "No URL" policy for drafted posts.
- **Workflow**: Auto-scouts -> Drafts for Approval -> Human Post Confirmation.

### 2. Hashtag Discovery Agent (Agent 2)
- **Goal**: Monitor the `#openclaw` community.
- **Safety**: Discovery Only (Read-Only).
- **Logic**: Heartbeat pulse every 60 seconds captures a unique post ID and logs it for Amit.

## 🛠 Local Setup Instructions
1. **Prerequisites**: Install Node.js, Rust (rustup), and Ollama.
2. **Local Model**: Run `ollama run phi3`.
3. **Environment**: Add your Gemini API key to `.env` as `VITE_API_KEY`.
4. **Build**:
   ```bash
   npm install
   npm run tauri dev
   ```

## ✅ PDF Requirements Satisfied
- [x] Conversational Onboarding.
- [x] Local LLM Integration (Phi-3).
- [x] Sandbox Mode (Safe Testing).
- [x] Human Approval Flow.
- [x] SQLite Persistent Storage.
- [x] Execution Logs & Audit Trail.
