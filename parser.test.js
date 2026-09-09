import { parser } from "./src/parser/parser";

test("parser", () => {
  expect(parser(["echo", "test  test"])).toStrictEqual([{type: "builtIn", value: "echo"}, "test test"])
})