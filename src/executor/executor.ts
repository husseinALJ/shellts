import type { BuiltIns, CommandAST } from "../types/main.js";

export const builtinCommands: BuiltIns = {};

export const executeProgram = (program: CommandAST): void => {
  if (program[0].type === "builtIn")
    return builtinCommands[program[0].value]?.(program[1]);
  console.log(`${program[0].value}: command not found`);
};
