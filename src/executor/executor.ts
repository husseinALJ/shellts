import path from "node:path";
import fs from "fs";
import { execSync } from "node:child_process";

import { rl } from "../main.js";

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

export const getCommandType = (command: string): "builtin" | string => {
  if (command.trim() === "") return "";

  if (command in builtinCommands) return "builtin";

  const commandPath = findCommandPath(command);
  if (commandPath) return path.join(commandPath, command);

  return "";
};

const echoParamFormatter = (text: string): string => {
  const quotesChars = new Set(["'", '"']);
  let results = "";
  let activeQuote: string | null = null;
  let backlashWasLast = false;

  for (const char of text) {
    if (activeQuote) {
      if (char === activeQuote) {
        activeQuote = null;
        continue;
      }
      results += char;
      continue;
    }

    if (backlashWasLast) {
      results += char;
      backlashWasLast = false;
      continue;
    }

    if (/\\/.test(char)) {
      backlashWasLast = true;
      continue;
    }

    if (quotesChars.has(char)) {
      activeQuote = char;
      continue;
    }

    results += char;
  }

  if (activeQuote) {
    throw new Error(`Unterminated quote: ${activeQuote}`);
  }

  return results;
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
    if (dir === "~" || dir.trim() === "") {
      dir = process.env.HOME || "~";
    }
    try {
      return process.chdir(dir);
    } catch (err) {
      if (err) return console.log(`cd: ${dir}: No such file or directory`);
      return;
    }
  },
  echo: (text: string): void => {
    console.log(echoParamFormatter(text));
  },
  type: (params: string): void => {
    if (params.trim() === "") return;

    const commandType = getCommandType(params);

    if (commandType === "builtin")
      return console.log(`${params}: is a shell builtin`);

    if (commandType?.includes("/"))
      return console.log(`${params} is ${commandType}`);

    return console.log(`${params}: not found`);
  },
};

export const executeProgram = (program: CommandAST): void => {
  if (program[0].type === "builtin") {
    builtinCommands[program[0].value as keyof BuiltIns](program[1]);
    return;
  }

  if (program[0].type.includes("/")) {
    try {
      const output = execSync(`${program[0].value} ${program[1]}`, {
        encoding: "utf-8",
      });
      return console.log(output.trim());
    } catch (err) {
      return;
    }
  }

  console.log(`${program[0].value}: command not found`);
};
