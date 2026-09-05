import type { CommandAST, Token } from "../types/main.js";
import { builtinCommands } from "../executor/executor.js";

const quotesHandler = (quotedText: string) => {
  return quotedText.split("'").reduce((accumulator, e, index) => {
    if ((index + 1) % 2 === 0) return (accumulator += `'${e}'`);

    return (accumulator += e.replace(/\s+/g, " "));
  });
};

const paramsFormatter = (params: string) => {
  if (params.includes("'")) return quotesHandler(params);

  return params.replaceAll(/\s+/g, " ");
};

export const parser = (token: Token): CommandAST => {
  const commandType = builtinCommands.type(token[0]);
  const params = paramsFormatter(token[1]);
  return [{type: commandType, value: token[0]}, params];
};
