import { tokenize } from "./tokenizer";

test("token is an array of command at index 0, and the properties at index 1", () => {
  expect(tokenize("echo hello world")).toEqual(["echo", "hello world"]);
});

test("no whitespace in any element", () => {
  expect(tokenize(" echo  hello world")).toEqual(["echo", "hello world"]);
});
