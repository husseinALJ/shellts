import type { CommandAST, Token } from "../types/main.js";
import { getCommandType } from "../executor/executor.js";

export const paramsFormatter = (params: string) => {
  const quotesChars = new Set(["'", '"']);
  let results = "";
  let activeQuote: string | null = null;
  let backlashWasLast = false;
  let spaceWasLast = false;

  for (const char of params) {
    if (activeQuote) {
      results += char;
      if (char === activeQuote) activeQuote = null;
      continue;
    }

    if (backlashWasLast) {
      results += char;
      backlashWasLast = false
      continue;
    }

    if (/\\/.test(char)) {
      results += char
      backlashWasLast = true;
      continue;
    }

    if (quotesChars.has(char)) {
      results += char;
      spaceWasLast = false;
      activeQuote = char;
      continue;
    }

    if (/\s/.test(char)) {
      if (!spaceWasLast) results += char;
      spaceWasLast = true;
      continue;
    }

    results += char;
    spaceWasLast = false;
  }

  if (activeQuote) {
    throw new Error(`Unterminated quote: ${activeQuote}`);
  }

  return results;
};

export const parser = (token: Token): CommandAST => {
  const commandType = getCommandType(token[0]);
  const params = paramsFormatter(token[1]);
  return [{ type: commandType, value: token[0] }, params];
};
