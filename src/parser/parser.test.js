import { paramsFormatter } from "./parser";

test("no Consecutive whitespace characters out side quotes", () => {
  expect(paramsFormatter("hello  world")).toBe("hello world");
});

