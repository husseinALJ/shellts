import path from "node:path";
import fs from "fs";

import type { CommandAST, Token } from "../types/main.js";
import { builtinCommands } from "../executor/executor.js";

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
  if (commandPath) return commandPath
  return
};

const getCommandType = (command: string): { type: string; value: string } => {
  if (command in builtinCommands) return {type: "builtIn", value: command}
  const commandPath = findCommandPath(command)
  if (commandPath) return {type: commandPath, value: command}
  return {type: "", value: command}
};

const paramsFormatter = (params: string) => {
  return params.replaceAll(/\s+/g, " ")
}

export const parser = (token: Token): CommandAST => {
  const commandType = getCommandType(token[0]);
  const params = paramsFormatter(token[1])
  return [commandType, params];
};
