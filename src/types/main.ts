export type Token = [command: string , params: string]

export type CommandAST = [ {type: string, value: string}, params: string ]

export type BuiltIns = {[commands: string]: (params?: string) => void}