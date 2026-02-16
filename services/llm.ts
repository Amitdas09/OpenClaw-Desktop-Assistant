
import { GoogleGenAI } from "@google/genai";
import { LLMType } from "../types";

const SYSTEM_INSTRUCTION = `
You are Personaliz Desktop Assistant, the command center for OpenClaw browser automation.
Your identity: A helpful, high-performance automation orchestrator for Amit Das.

USER CONTEXT:
Name: Amit Das
Target Profile: C:\\Users\\Amitd\\AppData\\Local\\AVG\\Browser\\User Data\\Profile 2
LinkedIn: https://www.linkedin.com/in/amit-das-13001137b/

AGENT OPERATING PROCEDURES:
1. Agent 1 (Trending Hunter): Scouts AI news + OpenClaw ecosystem trends. Drafts posts WITHOUT any external links or URLs. 
   - Every post you generate must be unique, using different professional angles (efficiency, security, technical depth, community).
2. Agent 2 (Discovery): Monitors #openclaw on LinkedIn. Identifies exactly one unique post every 60 seconds.

MODE:
If Gemini quota is exceeded or manually deselected, fallback to local Ollama Phi-3 (http://localhost:11434).
`;

export class LLMService {
  private modelType: LLMType = LLMType.LOCAL;
  private manualPreference: LLMType | null = null;
  private quotaExceeded: boolean = false;

  constructor() {
    if (process.env.API_KEY) {
      this.modelType = LLMType.EXTERNAL;
    }
  }

  setPreference(type: LLMType) {
    this.manualPreference = type;
  }

  async generateResponse(
    prompt: string, 
    history: { role: string, content: string }[], 
    attachment?: { data: string, mimeType: string }
  ) {
    const activeType = this.manualPreference || (this.quotaExceeded ? LLMType.LOCAL : this.modelType);

    if (activeType === LLMType.EXTERNAL && process.env.API_KEY && !this.quotaExceeded) {
      return this.generateCloudResponse(prompt, history, attachment);
    }
    return this.generateLocalResponse(prompt, history);
  }

  private async generateCloudResponse(prompt: string, history: any[], attachment: any) {
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API Key missing");
      const ai = new GoogleGenAI({ apiKey });
      
      const parts: any[] = [{ text: prompt }];
      if (attachment) {
        parts.push({ inlineData: { data: attachment.data, mimeType: attachment.mimeType } });
      }
      const contents = [
        ...history.map(h => ({ 
          role: h.role === 'assistant' ? 'model' as const : 'user' as const, 
          parts: [{ text: h.content }] 
        })),
        { role: 'user', parts }
      ];
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: contents as any,
        config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 1.0 }, 
      });
      return response.text || "Insight processed.";
    } catch (e: any) {
      const errorMsg = e?.message || String(e);
      if (errorMsg.toLowerCase().includes("quota") || errorMsg.includes("429")) {
        console.warn("Gemini Quota Exceeded. Switching to Safe Mode (Local).");
        this.quotaExceeded = true;
      }
      return this.generateLocalResponse(prompt, history);
    }
  }

  private async generateLocalResponse(prompt: string, history: any[]) {
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'phi3',
          prompt: `System: ${SYSTEM_INSTRUCTION}\n\nUser: ${prompt}`,
          stream: false
        })
      });
      if (response.ok) {
        const data = await response.json();
        return data.response;
      }
    } catch (e) {
      if (prompt.includes("LinkedIn post")) {
        const fallbackOptions = [
          "Local-first automation is the key to browser security. OpenClaw handles the heavy lifting while I focus on strategy. #AI #OpenClaw",
          "Efficiency unlocked. Driving browser sessions locally with SQLite persistence ensures my workflows are always synced. #Automation #Desktop",
          "Why rely on cloud latency when your local machine can handle complex networking tasks? OpenClaw is the engine for modern LinkedIn strategy. #TechTrends"
        ];
        return fallbackOptions[Math.floor(Math.random() * fallbackOptions.length)];
      }
      return "[Local Mode] Processed locally. Ollama status: Disconnected.";
    }
    return "Initializing local synthesis...";
  }

  async parseIntent(input: string): Promise<{ action: string; params: any }> {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes("agent 1") || lowerInput.includes("trending")) return { action: "CREATE_DEMO_1", params: { query: input } };
    if (lowerInput.includes("agent 2") || lowerInput.includes("hashtag")) return { action: "CREATE_DEMO_2", params: { query: input } };
    return { action: "CHAT", params: { query: input } };
  }

  getModelType() { 
    if (this.manualPreference) return `${this.manualPreference}`;
    return this.quotaExceeded ? `${LLMType.LOCAL} (Quota Fallback)` : this.modelType; 
  }
}
