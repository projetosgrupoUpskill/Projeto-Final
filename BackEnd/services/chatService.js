import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import {
  getAllTransactions,
  getTransactions,
  getTotals,
  getTrends,
} from "./transactionsService.js";

const SYSTEM_PROMPT = `You are a financial assistant in an expense tracker app.
Your main task is to understand the user's data and suggest actions related to managing their expenses.

# GENERAL RULES
- Always respond in the same language the user writes in.
- Always format dates as dd/mm/yyyy in messages.
- In JSON responses, always use plain numbers for monetary values (e.g. 16463.51, not "€16463.51"). Apply currency symbols only in the "message" field.
- Never create, update, or delete transactions. Your role is only to provide insights and suggestions.
- You must not respond to questions that are unrelated to the financial area.
- When user asks for investment advice, make it clear your job is only to analyze data and provide insghts and investment advice should be offered by a licensed professional.

# FUNCTION RULES
- Always call a function to get data before answering questions about amounts, dates, or transactions.
- Never calculate totals, averages, or trends yourself — always use the provided functions.
- When function results include "months_available", always mention it to the user if the data is incomplete relative to what was requested.

# DATA RULES
- Each transaction has two date fields:
    - "transaction_date": when the expense/income actually happened. Use this for all questions about recency ("last", "most recent", "this month", etc.)
    - "created_at": only when the row was saved in the system. Never use this for recency questions.
- The transactions list is sorted by "transaction_date" descending — the first item is the most recent.

# PDF RULES
- Never show the PDF download button unless the user explicitly confirms they want a PDF.
- When responding to a REPORT request, always end the "message" field with a question asking if the user wants a downloadable PDF version.
- Only include "offerPdf: true" in the JSON after the user explicitly confirms they want it.
- When offerPdf is true, make the "message" as short as possible, only indicating the report was generated successfully.

# AVAILABLE ACTIONS

## 1. REPORT
Use when the user asks for a summary, report, overview of expenses, category breakdowns, totals, or lists of transactions.
{
  "action": "REPORT",
  "report": {
    "totalBalance": 0,
    "totalIncome": 0,
    "totalExpenses": 0,
    "dateRange": {
      "start": "dd/mm/yyyy",
      "end": "dd/mm/yyyy"
    },
    "trends": {
      "daily": 0,
      "weekly": 0,
      "monthly": 0,
      "yearly": 0
    },
    "categoryBreakdown": {
      "category1": 0,
      "category2": 0
    },
    "items": ["Item 1", "Item 2"],
    "analysis": "Detailed financial insights for the PDF report, different from the chat message. 
    Include observations about earnings versus spending, spending patterns, category highlights, and actionable suggestions based on the data.",
    "offerPdf": false,
    "message": "Short message for the chat, ending with a question about PDF."
  }
}

Use "items" when the user asks for a list of transactions or any enumerable data that is better presented as a list.
Leave "items" as an empty array [] when not applicable.

## 2. SUGGESTION
Use when the user asks for tips, insights, or ways to save money.
{
  "action": "SUGGESTION",
  "suggestion": {
    "items": ["Tip 1", "Tip 2", "Tip 3"],
    "message": "Summary of suggestions in natural language"
  }
}

## 3. CHAT
Use for general finance-related questions and conversation that does NOT involve presenting transaction data directly.
If the topic is unrelated to finance, politely explain you can only help with financial topics.
{
  "action": "CHAT",
  "message": "Response in natural language"
}`;

const TOOLS = [
  {
    name: "get_totals",
    description:
      "Get income, expense totals, balance and category breakdown. Optionally filter by date range.",
    parameters: {
      type: "object",
      properties: {
        start_date: {
          type: "string",
          description: "Start date in YYYY-MM-DD format (optional)",
        },
        end_date: {
          type: "string",
          description: "End date in YYYY-MM-DD format (optional)",
        },
      },
    },
  },
  {
    name: "get_transactions",
    description: "Get a filtered list of transactions.",
    parameters: {
      type: "object",
      properties: {
        start_date: {
          type: "string",
          description: "Start date in YYYY-MM-DD format (optional)",
        },
        end_date: {
          type: "string",
          description: "End date in YYYY-MM-DD format (optional)",
        },
        type: {
          type: "string",
          enum: ["income", "expense"],
          description: "Filter by type (optional)",
        },
        category: {
          type: "string",
          description: "Filter by category name (optional)",
        },
        limit: {
          type: "number",
          description: "Max number of transactions to return (optional)",
        },
      },
    },
  },
  {
    name: "get_trends",
    description: "Get spending trends and optionally forecast future expenses.",
    parameters: {
      type: "object",
      properties: {
        start_date: {
          type: "string",
          description: "Start date in YYYY-MM-DD format (optional)",
        },
        end_date: {
          type: "string",
          description: "End date in YYYY-MM-DD format (optional)",
        },
        category: {
          type: "string",
          description: "Filter by category name (optional)",
        },
        months_back: {
          type: "number",
          description:
            "Number of past months to analyze (optional, alternative to start_date)",
        },
        months_ahead: {
          type: "number",
          description: "Number of future months to forecast (optional)",
        },
      },
    },
  },
];

function buildUserMessage(data, userMessage) {
  const today = new Date().toLocaleDateString("en-CA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return `
TODAY'S DATE: ${today}

USER DATA CONTEXT:
- Currency: ${data.currency}
- Total transactions available: ${data.transactions.length}

USER MESSAGE:
${userMessage}
  `.trim();
}

export async function sendMessage({ history, data, userMessage }) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const MAX_HISTORY = 5;

  const historyContents = history
    .slice(-MAX_HISTORY)
    .filter((msg) => msg.content?.trim())
    .map((msg) => ({
      role: msg.role === "model" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

  const messageWithContext = buildUserMessage(data, userMessage);

  const contents = [
    ...historyContents,
    { role: "user", parts: [{ text: messageWithContext }] },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.2,
      maxOutputTokens: 2000,
      tools: [{ functionDeclarations: TOOLS }],
    },

    contents,
  });

  // Verifica se a IA quer chamar alguma função
  const functionCalls = response.candidates?.[0]?.content?.parts?.filter(
    (p) => p.functionCall,
  );

  if (functionCalls?.length) {
    const functionResults = [];

    for (const part of functionCalls) {
      const { name, args } = part.functionCall;
      let result;

      if (name === "get_totals") {
        result = getTotals(data.transactions, args.start_date, args.end_date);
      } else if (name === "get_transactions") {
        result = getTransactions(data.transactions, args);
      } else if (name === "get_trends") {
        result = getTrends(data.transactions, args);
      }

      functionResults.push({
        role: "user",
        parts: [
          {
            functionResponse: {
              name,
              response: { output: result },
            },
          },
        ],
      });
    }

    // Segunda chamada — IA recebe os resultados e responde em JSON
    const secondResponse = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        temperature: 0.2,
        maxOutputTokens: 2000,
      },
      contents: [
        ...contents,
        response.candidates[0].content,
        ...functionResults,
      ],
    });

    return JSON.parse(secondResponse.text);
  }

  // Se a IA não chamou nenhuma função (ex: CHAT geral)
  // Neste caso a primeira chamada não tem responseMimeType: "application/json"
  // por isso fazemos uma segunda chamada forçando o JSON
  const fallbackResponse = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      temperature: 0.2,
      maxOutputTokens: 2000,
    },
    contents,
  });

  return JSON.parse(fallbackResponse.text);
}
