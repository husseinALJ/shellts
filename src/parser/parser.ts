import type { CommandAST, Token } from "../types/main.js";
import { builtinCommands } from "../executor/executor.js";

const paramsFormatter = (params: string) => {
  const quotesChars = new Set(["'", '"']);
  let results = "";
  let activeQuote: string | null = null;
  let lastWasSpace = false;

  for (const char of params) {
    if (activeQuote) {
      results += char;
      lastWasSpace = false
      if (char === activeQuote) activeQuote = null;
      continue;
    }

    if (quotesChars.has(char)) {
      results += char;
      lastWasSpace = false
      activeQuote = char;
      continue;
    }

    if (/\s/.test(char)) {
      if (!lastWasSpace) results += char;
      lastWasSpace = true;
      continue;
    }

    results += char;
    lastWasSpace = false
  }

  if (activeQuote) {
    throw new Error(`Unterminated quote: ${activeQuote}`);
  }

  return results;
};

export const parser = (token: Token): CommandAST => {
  const commandType = builtinCommands.type(token[0]);
  const params = paramsFormatter(token[1]);
  return [{ type: commandType, value: token[0] }, params];
};
