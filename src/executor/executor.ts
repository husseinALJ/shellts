import path from "node:path";
import { rl } from "../main.js";
import fs from "fs";

import type { BuiltIns, CommandAST } from "../types/main.js";

const findCommandPath = (command: string) => {
  const Path = process.env.PATH;
  const pathArr = Path?.split(path.delimiter);
  const commandPath = pathArr?.find((dir) => {
    try {
      const itsHere = fs.readdirSync(dir).includes(command);
      if (itsHere) {
        fs.accessSync(path.join(dir, command), fs.constants.X_OK);
        return true;
      }
    } catch (err) {
      return false;
    }
  });
  if (commandPath) return commandPath;
  return;
};

export const builtinCommands: BuiltIns = {
  exit: (): void => {
    rl.close();
    process.exit(0);
  },
  pwd: (): void => {
    return console.log(process.cwd());
  },
  cd: (dir: string): void => {
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
  echo: (text: string): void => {
    console.log(text?.replaceAll("'", ""));
  },
  type: (params: string): string => {
    if (params.trim() === "") return "";

    if (params in builtinCommands) return "builtIn";

    const commandPath = findCommandPath(params) || "";
    return commandPath;
  },
};

export const executeProgram = (program: CommandAST): void => {
  if (program[0].type === "builtIn") {
    const results = builtinCommands[program[0].value as keyof BuiltIns](program[1]);
    if (typeof results === "string") return console.log(results);
    return;
  }
  console.log(`${program[0].value}: command not found`);
};
