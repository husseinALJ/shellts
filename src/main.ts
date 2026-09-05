import { createInterface } from "readline";

import { tokenize } from "./lexer/tokenizer.js";
import { parser } from "./parser/parser.js";
import { executeProgram } from "./executor/executor.js";

export const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});

rl.prompt();

rl.on("line", (input) => {
  if (input.trim()) {
    const tokens = tokenize(input);
    const program = parser(tokens);
    executeProgram(program)
  }
  rl.prompt();
});
