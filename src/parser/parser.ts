import type { CommandAST, Token } from "../types/main.js";
import { builtinCommands } from "../executor/executor.js";

const quotesHandler = (text: string): string => {
  const quotesChars = new Set(["'", '"']);
  let results = "";
  let activeQuote: string | null = null;
  let lastWasSpace = false;

  for (const char of text) {
    const isSpace = /\s/.test(char);

    if (!isSpace) lastWasSpace = false;

    if (activeQuote) {
      results += char;
      if (char === activeQuote) activeQuote = null;
      continue;
    }

    if (quotesChars.has(char)) {
      results += char;
      activeQuote = char;
      continue;
    }

    if (isSpace) {
      if (!lastWasSpace) results += char;
      lastWasSpace = true;
      continue;
    }

    results += char;
  }

  if (activeQuote) {
    throw new Error(`Unterminated quote: ${activeQuote}`);
  }

  return results;
};

const paramsFormatter = (params: string) => {
  if (params.includes("'") || params.includes('"'))
    return quotesHandler(params);

  return params.replaceAll(/\s+/g, " ");
};

export const parser = (token: Token): CommandAST => {
  const commandType = builtinCommands.type(token[0]);
  const params = paramsFormatter(token[1]);
  return [{ type: commandType, value: token[0] }, params];
};
