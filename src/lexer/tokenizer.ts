import type { Token } from "../types/main.js";

const commandTokenizer = (text: string): string => {
  const quotesChars = new Set(["'", '"']);
  if (quotesChars.has(text?.charAt(0))) {
    const command = text.match(/(["'])(.*?)\1/);

    if (command) {
      return command[0];
    }
  }
  return text.split(" ")[0]!;
};

export const tokenize = (input: string): Token => {
  const trimmedInput = input.trim();
  const command = commandTokenizer(trimmedInput);
  const parameters = trimmedInput.replace(`${command}`, "").trim();
  const token: Token = [command, parameters];
  return token;
};
