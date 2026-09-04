import type { Token } from "../types/main.js";

export const tokenize = (input: string): Token => {
  const trimmedInput = input.trim();
  const command = trimmedInput.split(" ")[0]!;
  const parameters = trimmedInput.replace(`${command}`, "").trim();
  const token: Token = [command, parameters];
  return token
};
