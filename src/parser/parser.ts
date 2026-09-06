import type { CommandAST, Token } from "../types/main.js";
import { builtinCommands } from "../executor/executor.js";

const quotesHandler = (quotedText: string): string => {
  const quotes = ["'", '"'];
  const textLength = quotedText.length;
  let formattedText = "";
  for (let i = 0; i < textLength; i++) {
    if (quotedText[i] === " ") {
      formattedText += " "
      while (quotedText[i] === " ") {
        i++;
      }
    }
    if (quotes.includes(quotedText[i]!)) {
      formattedText += quotedText[i];
      let j = i + 1;
      while (quotedText[j] !== quotedText[i]) {
        formattedText += quotedText[j];
        j++;
      }
      formattedText += quotedText[i];
      i = j;
    }

    if (quotedText[i] !== " " && !quotes.includes(quotedText[i]!)) {
      formattedText += quotedText[i];
    }
  }
  return formattedText;
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
