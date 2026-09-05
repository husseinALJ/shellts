import { rl } from "../main.js";

import type { BuiltIns, CommandAST } from "../types/main.js";

export const builtinCommands: BuiltIns = {
  exit: () => {
    rl.close();
    process.exit(0);
  },
  pwd: () => {
    return console.log(process.cwd());
  },
  cd: (dir?: string) => {
    if (dir === "~" || dir?.trim() === "") {
      dir = process.env.HOME!;
    }
    try {
      return process.chdir(dir!);
    } catch (err) {
      if (err) return console.log(`cd: ${dir}: No such file or directory`);
      return;
    }
  },

  echo: (text?: string) => {
    console.log(text?.replaceAll("'", ""));
  },
};

export const executeProgram = (program: CommandAST): void => {
  if (program[0].type === "builtIn")
    return builtinCommands[program[0].value]?.(program[1]);
  console.log(`${program[0].value}: command not found`);
};
