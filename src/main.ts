import { createInterface } from "readline";

import { tokenize } from "./lexer/tokenizer.js";
import { parser } from "./parser/parser.js";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});

rl.prompt();

rl.on("line", (input) => {
  if (input.trim()) {
    const tokens = tokenize(input);
    const program = parser(tokens);
  }
  rl.prompt();
});
