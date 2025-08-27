import { assertEquals } from "jsr:@std/assert";
import { postcssNestingWrapper } from "./main.ts";
import postcss from "npm:postcss";

Deno.test("should wrap selector", async () => {
  const input = `.parent { child { color: red; } }`;
  const expected = `#test {.parent { child { color: red; } } }`;

  const result = await postcss([
    postcssNestingWrapper({ parentSelector: "#test" }),
  ]).process(input, {
    from: undefined,
  });
  assertEquals(result.css, expected);
});

Deno.test("should wrap only parent selector", async () => {
  const input =
    `.parent { child { color: red; } } .other { &:hover { color: red; } }`;
  const expected =
    `#test {.parent { child { color: red; } } .other { &:hover { color: red; } } }`;

  const result = await postcss([
    postcssNestingWrapper({ parentSelector: "#test" }),
  ]).process(input, {
    from: undefined,
  });
  assertEquals(result.css, expected);
});

Deno.test("should not wrap selector identical to parentSelector", async () => {
  const input = `#test { color: blue; } .other { color: red; }`;

  const expected = `#test { color: blue; } .other { color: red; }`;

  const result = await postcss([
    postcssNestingWrapper({ parentSelector: "#test" }),
  ]).process(input, {
    from: undefined,
  });
  assertEquals(result.css, expected);
});
