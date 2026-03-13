import fs from "fs";
import path from "path";

export interface Question {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: string;
}

let cachedQuestions: Question[] | null = null;

export function getQuestions(): Question[] {
  if (cachedQuestions) return cachedQuestions;

  const csvPath = path.join(process.cwd(), "questions.csv");
  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const lines = csvContent.split("\n").filter((line) => line.trim());

  // Skip header
  const questions: Question[] = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = parseCSVLine(lines[i]);
    if (parts.length < 7) continue;

    questions.push({
      id: i,
      question: parts[1],
      optionA: parts[2],
      optionB: parts[3],
      optionC: parts[4],
      optionD: parts[5],
      answer: parts[6], // e.g. "optionB"
    });
  }

  cachedQuestions = questions;
  return questions;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Get questions without answers (for client)
export function getQuestionsForClient(): Omit<Question, "answer">[] {
  return getQuestions().map(({ answer, ...q }) => q);
}
