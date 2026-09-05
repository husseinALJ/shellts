export type Token = [command: string, params: string];

export type CommandAST = [{ type: string; value: string }, params: string];

export type BuiltIns = {
  "exit": () => void,
  "pwd": () => void,
  "cd": (dir: string) => void,
  "echo": (text: string) => void,
  "type": (command: string) => string
};
