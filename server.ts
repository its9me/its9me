import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import * as path from 'path';
import * as url from 'url';
import * as cheerio from 'cheerio';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON bodies
  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/analyze-writeup", async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
         return res.status(500).json({ error: "Gemini API key is missing on the server" });
      }
      const { text, targetUrl } = req.body;
      if (!text && !targetUrl) {
         return res.status(400).json({ error: "No text or URL provided" });
      }

      let contentToAnalyze = text;

      if (targetUrl) {
        try {
          const fetchRes = await fetch(`https://r.jina.ai/${targetUrl}`);
          if (!fetchRes.ok) {
             throw new Error(`HTTP ${fetchRes.status}`);
          }
          const textResponse = await fetchRes.text();
          contentToAnalyze = textResponse;
          
          if (!contentToAnalyze) {
             throw new Error("No readable text found on the page.");
          }
        } catch (err: any) {
          return res.status(400).json({ error: "Failed to fetch the URL using Jina: " + err.message });
        }
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the following bug bounty writeup and extract the core methodology, vulnerabilities found, tools used, and key takeaways for educational purposes. Respond in JSON.
        You MUST provide an accurate Arabic translation for every text field as requested in the schema.
        
Writeup text:
${contentToAnalyze}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "A catchy title for this writeup analysis" },
              titleAr: { type: Type.STRING, description: "Arabic translation of the title" },
              vulnerabilities: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of vulnerabilities found (e.g. XSS, SSRF, IDOR)"
              },
              vulnerabilitiesAr: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Arabic translation of the vulnerabilities"
              },
              tools: {
                 type: Type.ARRAY,
                 items: { type: Type.STRING },
                 description: "List of tools used in the writeup"
              },
              methodology: {
                 type: Type.ARRAY,
                 items: { type: Type.STRING },
                 description: "Step by step methodology used to find the bug"
              },
              methodologyAr: {
                 type: Type.ARRAY,
                 items: { type: Type.STRING },
                 description: "Arabic translation of the methodology steps"
              },
              keyTakeaways: {
                 type: Type.ARRAY,
                 items: { type: Type.STRING },
                 description: "The main lessons or tips learned from this writeup"
              },
              keyTakeawaysAr: {
                 type: Type.ARRAY,
                 items: { type: Type.STRING },
                 description: "Arabic translation of the key takeaways"
              }
            },
            required: ["title", "titleAr", "vulnerabilities", "vulnerabilitiesAr", "tools", "methodology", "methodologyAr", "keyTakeaways", "keyTakeawaysAr"]
          }
        }
      });
      
      const jsonStr = response.text?.trim() || "{}";
      const data = JSON.parse(jsonStr);
      
      res.json(data);
    } catch (error: any) {
      console.error("AI Analysis error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze writeup" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
