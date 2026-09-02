import { createInterface } from "readline";

import { tokenize } from "./lexer/tokenizer.js";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});

rl.prompt()

rl.on("line", (input) => {
  const tokens: string[] = tokenize(input);
  rl.prompt();
});
